import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import useInterval from '@use-it/interval';
// import LoadingBar from 'components/Modals/LoadingBar'
import { BigNumber } from 'bignumber.js';
import { Close, Metamask } from 'components/Modals/Icons';
import { useWeb3React } from '@web3-react/core';

import { format18 } from 'utils/math';
import { useModal } from 'context/modal/ModalContext';
import * as Modal from 'components/Modals/styles';
import 'components/Modals/loadingBar.css';
import { useExchange } from 'context/exchange/ExchangeContext';
import { useChain } from 'context/chain/ChainContext';
import { BondingCont } from 'context/chain/contracts';

const TransactionDetailsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & + & {
    margin-top: 16px;
  }

  span {
    font-weight: 400;
    color: ${props => props.theme.colors.textThirdly};
  }

  strong {
    font-weight: 500;
  }
`;

const OptionsWrapper = styled.section`
  padding: 32px 32px;

  border-top: 1px solid ${props => props.theme.colors.bgHighlightBorder};
`;

const OptionCaption = styled.p`
  margin: 0 0 12px;
  color: ${props => props.theme.colors.textThirdly};
`;

const SlippageDesc = styled.p`
  margin: 16px 0 0;
  color: ${props => props.theme.colors.textSecondary};
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  margin: 12px 0 16px;
`;

const WalletIcon = styled.div`
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${props => props.theme.colors.bgDarken};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const OptionBtn = styled.button`
  padding: 12px 16px;

  background-color: ${props => (props.active ? props.theme.colors.bgHighlightBorder : 'transparent')};
  border: 1px solid ${props => props.theme.colors.bgHighlightBorder};
  border-radius: 22px;

  font-size: 14px;
  font-weight: 500;
  color: ${props => (props.active ? props.theme.colors.textPrimary : props.theme.colors.textSecondary)};

  &:hover {
    background-color: ${props => lighten(0.1, props.theme.colors.bgHighlightBorder)};
  }

  &:active {
    background-color: ${props => lighten(0.1, props.theme.colors.bgHighlightBorder)};
  }
`;

const FeeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 16px;

  color: ${props => props.theme.colors.textThirdly};

  strong {
    color: ${props => props.theme.colors.textPrimary};
  }
`;

const limitOptions = [
  {
    id: 0,
    text: 'No limit',
    value: new BigNumber(1000),
  },
  {
    id: 1,
    text: '1%',
    value: new BigNumber(100),
  },
  {
    id: 2,
    text: '2.5%',
    value: new BigNumber(250),
  },
  {
    id: 3,
    text: '5%',
    value: new BigNumber(500),
  },
];

const gasOptions = [
  {
    id: 0,
    text: '0 (Standard)',
  },
  {
    id: 1,
    text: '0 (Fast)',
  },
  {
    id: 2,
    text: '0 (Instant)',
  },
];

export default function ConfirmTransactionModal({ submitTrans }) {
  const [slippage, setSlippage] = useState(0);
  const [gasPriceChoice, setGasPriceChoice] = useState(2);
  const [gasPrice, setGasPrice] = useState(0);
  const { handleModal } = useModal();
  const { account, library } = useWeb3React();
  const { askAmount, bidAmount, bidDenom, strong, weak } = useExchange();
  const { strongBalance } = useChain();
  const bondContract = BondingCont(library);
  const [showAskAmount, setShowAskAmount] = useState(askAmount);

  const [count, setCount] = useState(60);
  const [delay, setDelay] = useState(1000);

  const increaseCount = () => {
    if (count === 0) {
      setDelay(null);
      handleModal();
    } else {
      setCount(count - 1);
    }
  };

  const getAskAmount = useCallback(
    async (askAmountState, bidAmountUpdate, textStrength) => {
      var askAmountUpdate = askAmountState;

      switch (textStrength) {
        case 'strong':
          console.log('Strong: ', bidAmountUpdate.toFixed(0));
          askAmountUpdate = await bondContract.buyQuoteETH(bidAmountUpdate.toFixed(0));
          console.log('Pull Strong Ask Amount', askAmountUpdate);
          break;

        case 'weak':
          askAmountUpdate = await bondContract.sellQuoteNOM(bidAmountUpdate.toFixed(0));
          console.log('Pull Weak Ask Amount', askAmountUpdate);
          break;

        default:
          console.error('Denom not set');
      }
      return new BigNumber(askAmountUpdate.toString());
    },
    [bondContract],
  );

  const getGasPrices = useCallback(async () => {
    const prices = await fetch('https://www.gasnow.org/api/v3/gas/price?utm_source=onomy');
    const result = await prices.json();
    gasOptions[0].text = (result.data.standard / 1e9).toPrecision(4) + ' (Standard)';
    gasOptions[1].text = (result.data.fast / 1e9).toPrecision(4) + ' (Fast)';
    gasOptions[2].text = (result.data.rapid / 1e9).toPrecision(4) + ' (Instant)';
    gasOptions[0].gas = new BigNumber(result.data.standard.toString());
    gasOptions[1].gas = new BigNumber(result.data.fast.toString());
    gasOptions[2].gas = new BigNumber(result.data.rapid.toString());
    setGasPrice(gasOptions[gasPriceChoice].gas);
    setShowAskAmount(askAmount);

    let bidMaxValue;
    if (bidDenom === 'strong') {
      bidMaxValue = strongBalance;
      if (bidAmount.plus(gasOptions[gasPriceChoice].gas) >= bidMaxValue) {
        const newgas = bidAmount.plus(gasOptions[gasPriceChoice].gas).minus(bidMaxValue);
        const newBidAmount = bidAmount.minus(newgas);
        const askAmountUpdate1 = await getAskAmount(askAmount, newBidAmount, bidDenom);
        setShowAskAmount(askAmountUpdate1);
      }
    }
  }, [gasPriceChoice, askAmount, bidAmount, bidDenom, getAskAmount, strongBalance]);

  useEffect(() => {
    async function getUpdated() {
      await getGasPrices();
    }
    getUpdated();
  }, [getGasPrices]);

  useInterval(increaseCount, delay);

  return (
    <Modal.Wrapper>
      <Modal.CloseIcon onClick={() => handleModal()}>
        <Close />
      </Modal.CloseIcon>

      <main>
        <Modal.Caption>Confirm Transaction</Modal.Caption>

        <Modal.ExchangeResult>
          <Modal.ExchangeResultDescription>You're receiving</Modal.ExchangeResultDescription>~{' '}
          {BigNumber.isBigNumber(showAskAmount) ? format18(showAskAmount).toFixed(6) : ''}
          <sup>{bidDenom === 'strong' ? 'NOM' : 'ETH'}</sup>
        </Modal.ExchangeResult>

        <TransactionDetailsRow>
          <span>Current Exchange Rate</span>
          <strong>
            {bidDenom ? (
              <>
                1 {bidDenom === 'strong' ? strong : weak} ={' '}
                {BigNumber.isBigNumber(bidAmount)
                  ? format18(askAmount.div(format18(bidAmount).toFixed(6))).toFixed(6)
                  : 'Loading'}
              </>
            ) : (
              <></>
            )}{' '}
            {bidDenom === 'strong' ? weak : strong}
          </strong>
        </TransactionDetailsRow>
        <TransactionDetailsRow>
          <span>You're Sending</span>
          <strong>
            {format18(bidAmount).toFixed(6)} {bidDenom === 'strong' ? strong : weak}
          </strong>
        </TransactionDetailsRow>
        <TransactionDetailsRow>
          <div>
            <span>Wallet</span>

            <div>
              <strong>
                {account === null
                  ? '-'
                  : account
                  ? `${account.substring(0, 10)}...${account.substring(account.length - 4)}`
                  : ''}
              </strong>
            </div>
          </div>

          <WalletIcon>
            <Metamask />
          </WalletIcon>
        </TransactionDetailsRow>

        <FeeWrapper>
          <span>Transaction fee</span>
          <span>
            <strong>$5.4</strong> (0.00032 ETH)
          </span>
        </FeeWrapper>
      </main>
      <OptionsWrapper>
        <OptionCaption>Gas Fee</OptionCaption>
        <Options>
          {gasOptions.map(gasPriceOption => (
            <OptionBtn
              active={gasPrice === gasPriceOption.gas}
              key={gasPriceOption.gas}
              onClick={() => {
                setGasPrice(gasPriceOption.gas);
                setGasPriceChoice(gasPriceOption.id);
              }}
            >
              {gasPriceOption.text}
            </OptionBtn>
          ))}
        </Options>
        <OptionCaption>Slippage Limit</OptionCaption>
        <Options>
          {limitOptions.map(slippageOption => (
            <OptionBtn
              active={slippage === slippageOption.id}
              key={slippageOption.id}
              onClick={() => setSlippage(slippageOption.id)}
            >
              {slippageOption.text}
            </OptionBtn>
          ))}
        </Options>
        <SlippageDesc>
          Slippage is likely in times of high demand. Quote is based on most recent block and does not reflect
          transactions ahead of you in the mempool
        </SlippageDesc>
      </OptionsWrapper>
      <footer>
        <Modal.FooterControls>
          <Modal.SecondaryButton onClick={() => handleModal()}>Cancel</Modal.SecondaryButton>
          <Modal.PrimaryButton onClick={() => submitTrans(slippage, gasPrice)}>Confirm ({count})</Modal.PrimaryButton>
        </Modal.FooterControls>
      </footer>
    </Modal.Wrapper>
  );
}
