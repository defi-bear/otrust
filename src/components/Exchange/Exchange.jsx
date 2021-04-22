import React, { useCallback, useState } from "react";
import { formatEther } from '@ethersproject/units'
import { MaxUint256 } from "@ethersproject/constants";
import BigNumber from 'bignumber.js';
import { parseEther } from "@ethersproject/units";
import { useAsyncFn } from "lib/use-async-fn";

import ExchangeModals from "./ExchangeModals";
import {
  ExchangeWrapper,
  ExchangeItem,
  Sending,
  Receiving,
  ExchangeInput,
  MaxBtn,
  ReceivingValue,
  SellBtn,
  ExchangeButton,
} from "./exchangeStyles";
import ConfirmTransactionModal from '../Modals/ConfirmTransactionModal';
import { Dimmer } from "components/UI/Dimmer";

import { useSwap, useUpdateSwap } from "context/SwapContext";
import { useChain, useUpdateChain } from "context/chain/ChainContext";
import { useAllowance } from "context/useAllowance";
import TransactionCompletedModal from "components/Modals/TransactionCompletedModal";
import OnomyConfirmationModal from "components/Modals/OnomyConfirmationModal";

export default function Exchange({ text, onInputChange, isBuyButton }) {
  const { swapBuyAmount, swapBuyResult, swapSellAmount, swapSellResult } = useSwap();
  const { setSwapBuyAmount, setSwapSellAmount, setSwapDenom } = useUpdateSwap();
  const allowance = useAllowance();
  const [confirmModal, setConfirmModal] = useState('');
  const [approveModal, setApproveModal] = useState(false);
  const [slippage, setSlippage] = useState(0);

  const onTextChange = useCallback(
    (evt) => setSwapBuyAmount(evt.target.value),
    [setSwapBuyAmount]
  );
  const onSwapTextChange = useCallback(
    (evt) => setSwapSellAmount(evt.target.value),
    [setSwapSellAmount]
  );
  const { bondContract, NOMcontract, ETHbalance, NOMbalance } = useChain();
  const { setPendingTx } = useUpdateChain();

  const submitTrans = useCallback(
    async (denom) => {
      if (!swapBuyAmount && !swapSellAmount) return;
      try {
        if (denom === "ETH") {
          try {
            const tx = await bondContract.buyNOM(
              parseEther(swapBuyResult),
              slippage * 100,
              { value: parseEther(swapBuyAmount.toString())}
            );
            setPendingTx(tx);
            setSwapBuyAmount("");
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e.stack || e);
            // setSwapBuyAmount(swapBuyAmount);
          }
        } else {
          const tx = await bondContract.sellNOM(
            parseEther(swapSellAmount),
            parseEther(swapSellResult),
            slippage * 100,
          );
          setPendingTx(tx);
          setSwapBuyAmount("");
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e.stack || e);
        // setSwapBuyAmount(swapBuyAmount);
      }
    },
    [
      swapBuyAmount,
      swapBuyResult,
      swapSellAmount,
      swapSellResult,
      bondContract,
      setSwapBuyAmount,
      setPendingTx,
    ]
  );

  const onBuy = () => {
    setSwapDenom('ETH');
    setConfirmModal('ETH');
    // onSubmit('ETH');
  }

  const onSell = () => {
    setSwapDenom('NOM');
    setConfirmModal('NOM');
    // onSubmit('NOM');
  }

  const onApprove = async () => {
    let tx = await NOMcontract.approve(
      bondContract.address,
      MaxUint256
    );
    setPendingTx(tx);
  }

  const [onSubmit, error] = useAsyncFn(submitTrans);

  const onEthMax = () => {
    setSwapBuyAmount(new BigNumber(formatEther(ETHbalance)).toFixed(3))
  }

  const onNOMMax = () => {
    setSwapSellAmount(new BigNumber(formatEther(NOMbalance)).toFixed(3))
  }

  return (
    <ExchangeWrapper>
      <ExchangeModals />
      {confirmModal && 
        <Dimmer>
          <ConfirmTransactionModal
            closeModal={() => setConfirmModal('')}
            type={confirmModal}
            amount={confirmModal === 'ETH' ? swapBuyAmount : swapSellAmount}
            result={confirmModal === 'ETH' ? swapBuyResult : swapSellResult}
            onConfirm={() => onSubmit(confirmModal)}
            setSlippage={setSlippage}
            slippage={slippage}
          />
        </Dimmer>
      }
        {/* <TransactionCompletedModal /> */}
      {
        approveModal && 
          <Dimmer>
            <OnomyConfirmationModal
              closeModal={() => setApproveModal(false)}
              onConfirm={onApprove}
            />
          </Dimmer>
      }
      <ExchangeItem>
        <strong>Buy NOM</strong>
        <Sending>
          <strong>I'm sending</strong>
          <ExchangeInput
            type="text"
            onChange={onTextChange}
            value={swapBuyAmount}
          />
          ETH
          <MaxBtn onClick={onEthMax}>Max</MaxBtn>
        </Sending>
        <Receiving>
          <strong>I'm receiving</strong>
          <ReceivingValue>
            {swapBuyResult} NOM
          </ReceivingValue>
        </Receiving>
        <div>
          <ExchangeButton onClick={onBuy}>Buy NOM</ExchangeButton>
        </div>
      </ExchangeItem>

      <ExchangeItem>
        <strong>Sell NOM</strong>
        <Sending>
          <strong>I'm sending</strong>
          <ExchangeInput
            type="text"
            onChange={onSwapTextChange}
            value={swapSellAmount}
          />
          NOM
          <MaxBtn onClick={onNOMMax}>Max</MaxBtn>
        </Sending>
        <Receiving>
          <strong>I'm receiving</strong>
          <ReceivingValue>
            {swapSellResult} ETH
          </ReceivingValue>
        </Receiving>
        <div>
          {
            allowance && !allowance.eq(0) ? (
              <SellBtn onClick={onSell}>Sell NOM</SellBtn>
            ) : (
              <SellBtn onClick={() => setApproveModal(true)}>Approve</SellBtn>
            )
          }
        </div>
      </ExchangeItem>

      {error && <div>{error}</div>}
    </ExchangeWrapper>
  );
}

/* <form onSubmit={onSubmit}>
  <SwapHeader>Swap</SwapHeader>
  <GridWrapper>
    <LeftComponentWrapper>From:</LeftComponentWrapper>
    {error ? error : null}
    <StyledInput
      type="text"
      value={swapBuyAmount}
      onChange={onTextChange}
      onTextAreaKeyDown={onTextAreaKeyDown}
      placeholder={isWorking ? "Confirming" : "Enter amount"}
    />
    <Dropdown denom={swapDenom} setDenom={setSwapDenom} />
    <LeftComponentWrapper>To:</LeftComponentWrapper>
    <MiddleComponentWrapper>
      {swapSellAmount
        ? parseFloat(swapSellAmount).toPrecision(10)
        : null}
    </MiddleComponentWrapper>
    <RightComponentWrapper>
      {swapDenom === "NOM" ? "ETH" : "NOM"}
    </RightComponentWrapper>
  </GridWrapper>

  <RowWrapper>
    <Button type="submit">Execute</Button>
  </RowWrapper>
</form> */
