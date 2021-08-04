import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'bignumber.js';
import cosmos from 'cosmos-lib';
import { ethers } from 'ethers';

import BridgeSwapMobile from './BridgeSwapMobile';
import BridgeSwapModal from './BridgeSwapModal';
import { useChain } from 'context/chain/ChainContext';
import { GravityCont, NOMCont } from 'context/chain/contracts';
import { format18, parse18 } from 'utils/math';
import { contAddrs } from '../../../context/chain/contracts';
import { ERROR_MESSAGES } from '../../../constants/ErrorMessages';

export default function BridgeSwapMain({ closeModalHandler }) {
  const [onomyWalletValue, setOnomyWalletValue] = useState('');
  const [onomyWalletError, setOnomyWalletError] = useState('');
  const [amountInputValue, setAmountInputValue] = useState('');
  const [amountError, setAmountError] = useState('');
  const [formattedWeakBalance, setFormattedWeakBalance] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isMaxButtonClicked, setIsMaxButtonClicked] = useState(false);
  const [isMediaMinTablet, setIsMediaMinTablet] = useState(undefined);
  const [allowanceAmountGravity, setAllowanceAmountGravity] = useState(0);
  const [showBridgeExchangeModal, setShowBridgeExchangeModal] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showTransactionCompleted, setShowTransactionCompleted] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const { account, library } = useWeb3React();
  const { weakBalance } = useChain();

  const GravityContract = GravityCont(library);
  const NOMContract = NOMCont(library);

  const mediaQuery = window.matchMedia('(min-width: 768px)');

  const handleTabletChange = useCallback(event => {
    if (event.matches) {
      setIsMediaMinTablet(true);
    } else {
      setIsMediaMinTablet(false);
    }
  }, []);

  useEffect(() => {
    mediaQuery.addListener(handleTabletChange);
    mediaQuery.matches ? setIsMediaMinTablet(true) : setIsMediaMinTablet(false);
    return () => {
      mediaQuery.removeListener(handleTabletChange);
    };
  }, [handleTabletChange, mediaQuery]);

  useEffect(() => {
    setFormattedWeakBalance(format18(weakBalance));
  }, [weakBalance]);

  const updateAllowanceAmount = useCallback(async () => {
    const allowanceGravity = await NOMContract.allowance(account, contAddrs.Gravity);
    setAllowanceAmountGravity(allowanceGravity);
    return allowanceGravity;
  }, [NOMContract, account]);

  useEffect(() => {
    if (NOMContract && account && !allowanceAmountGravity) {
      updateAllowanceAmount();
    }
  }, [NOMContract, account, allowanceAmountGravity, updateAllowanceAmount]);

  useEffect(() => {
    mediaQuery.addListener(handleTabletChange);
    mediaQuery.matches ? setIsMediaMinTablet(true) : setIsMediaMinTablet(false);
    return () => {
      mediaQuery.removeListener(handleTabletChange);
    };
  }, [handleTabletChange, mediaQuery]);

  const handleWalletInputChange = event => {
    setOnomyWalletValue(event.target.value);
    setIsMaxButtonClicked(false);
  };

  const handleAmountInputChange = event => {
    const value = event.target.value;
    const floatRegExp = new RegExp(/(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$)|(^\d+?\.$)|(^\+?(?!0\d+)$|(^$)|(^\.$))/);
    if (floatRegExp.test(value)) {
      setAmountInputValue(value);
      value > formattedWeakBalance.toNumber() ? setAmountError(ERROR_MESSAGES.insufficientFunds) : setAmountError('');
    }
    setIsMaxButtonClicked(false);
  };

  const maxBtnHandler = event => {
    event.preventDefault();
    if (weakBalance.toNumber()) {
      setAmountInputValue(formattedWeakBalance.toNumber());
      setIsButtonDisabled(false);
      setIsMaxButtonClicked(true);
    }
  };

  const onCancelHandler = () => {
    setShowApproveModal(false);
    setShowBridgeExchangeModal(true);
    setIsButtonDisabled(false);
    updateAllowanceAmount();
  };

  const submitTrans = useCallback(
    async event => {
      event.preventDefault();
      setAmountError('');
      setOnomyWalletError('');
      if (amountInputValue === '.' || amountInputValue === '') {
        setAmountError(ERROR_MESSAGES.incorrectAmountFormat);
        return;
      }

      const amountInputValueUpdated = isMaxButtonClicked
        ? weakBalance.toString(10)
        : parse18(new BigNumber(amountInputValue)).toNumber().toString();
      setIsButtonDisabled(true);

      try {
        var bytes = cosmos.address.getBytes(onomyWalletValue);
        const ZEROS = Buffer.alloc(12);
        var cosmosAddressBytes32 = Buffer.concat([ZEROS, bytes]);
      } catch (error) {
        setOnomyWalletError(ERROR_MESSAGES.incorrectOnomyAddressFormat);
        setIsButtonDisabled(false);
        return;
      }

      let tx;
      if (allowanceAmountGravity.gte(ethers.BigNumber.from(amountInputValueUpdated))) {
        try {
          setShowLoader(true);
          tx = await GravityContract.sendToCosmos(contAddrs.NOMERC20, cosmosAddressBytes32, amountInputValueUpdated, {
            gasLimit: 100000,
          });

          tx.wait().then(() => {
            setIsButtonDisabled(false);
            setShowBridgeExchangeModal(false);
            setShowTransactionCompleted(true);
            setShowLoader(false);
            return;
          });
        } catch (error) {
          setShowLoader(false);
          setIsButtonDisabled(false);
          return;
        }
      } else {
        setShowBridgeExchangeModal(false);
        setShowApproveModal(true);
      }
    },
    [onomyWalletValue, amountInputValue, GravityContract, isMaxButtonClicked, weakBalance, allowanceAmountGravity],
  );

  const Props = {
    onomyWalletValue,
    setOnomyWalletValue,
    onomyWalletError,
    setOnomyWalletError,
    amountInputValue,
    setAmountInputValue,
    amountError,
    setAmountError,
    isMaxButtonClicked,
    setIsMaxButtonClicked,
    formattedWeakBalance,
    setFormattedWeakBalance,
    isButtonDisabled,
    setIsButtonDisabled,
    handleWalletInputChange,
    handleAmountInputChange,
    maxBtnHandler,
    submitTrans,
    closeModalHandler,
    showBridgeExchangeModal,
    showApproveModal,
    showTransactionCompleted,
    onCancelHandler,
    allowanceAmountGravity,
    weakBalance,
    showLoader,
  };

  return (
    <>
      {isMediaMinTablet === true && <BridgeSwapModal {...Props} />}
      {isMediaMinTablet === false && <BridgeSwapMobile {...Props} />}
    </>
  );
}
