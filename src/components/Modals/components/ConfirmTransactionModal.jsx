import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { lighten } from "polished";
import useInterval from '@use-it/interval';
import LoadingBar from 'components/Modals/LoadingBar'
import { BigNumber } from 'bignumber.js'
import { format18 } from 'utils/math'

import { useAsyncFn } from 'hooks/use-async-fn'
import { useModal } from 'context/modal/ModalContext'
import { Close, Metamask } from "components/Modals/Icons"
import * as Modal from "components/Modals/styles"
import 'components/Modals/loadingBar.css'
import { useWeb3React } from "@web3-react/core"
import { useExchange, useUpdateExchange } from 'context/exchange/ExchangeContext'

import { BondingCont } from 'context/chain/contracts'

import TransactionFailedModal from "components/Modals/components/TransactionFailedModal";
import PendingModal from "components/Modals/components/PendingModal";
import TransactionCompletedModal from "./TransactionCompletedModal";

const TransactionDetailsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & + & {
    margin-top: 16px;
  }

  span {
    font-weight: 400;
    color: ${(props) => props.theme.colors.textThirdly};
  }

  strong {
    font-weight: 500;
  }
`;

const SlippageWrapper = styled.section`
  padding: 32px 32px;

  border-top: 1px solid ${(props) => props.theme.colors.bgHighlightBorder};
`;

const SlippageCaption = styled.p`
  margin: 0 0 12px;
  color: ${(props) => props.theme.colors.textThirdly};
`;

const SlippageDesc = styled.p`
  margin: 16px 0 0;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const SlippageValues = styled.div`
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

  background-color: ${(props) => props.theme.colors.bgDarken};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const LimitBtn = styled.button`
  padding: 12px 16px;

  background-color: ${(props) =>
    props.active ? props.theme.colors.bgHighlightBorder : "transparent"};
  border: 1px solid ${(props) => props.theme.colors.bgHighlightBorder};
  border-radius: 22px;

  font-size: 14px;
  font-weight: 500;
  color: ${(props) =>
    props.active
      ? props.theme.colors.textPrimary
      : props.theme.colors.textSecondary};

  &:hover {
    background-color: ${(props) =>
      lighten(0.1, props.theme.colors.bgHighlightBorder)};
  }
`;

const limitOptions = [
  {
    id: 0,
    text: "No limit",
    value: new BigNumber(0)
  },
  {
    id: 1,
    text: "1%",
    value: new BigNumber(100)
  },
  {
    id: 2,
    text: "2.5%",
    value: new BigNumber(250)
  },
  {
    id: 3,
    text: "5%",
    value: new BigNumber(500),
  },
];

export default function ConfirmTransactionModal({ onConfirm }) {
  const { account, library } = useWeb3React()
  const bondContract = BondingCont(library)

  const { 
    askAmount, 
    bidAmount, 
    bidDenom,
    slippage,
    strong, 
    weak 
  } = useExchange()

  const {
    objDispatch,
    setPendingTx
  } = useUpdateExchange()
  
  const [count, setCount] = useState(60);
  const [delay, setDelay] = useState(1000);
  const { handleModal } = useModal()

  const increaseCount = () => {
    if(count === 0) {
      setDelay(null);
      handleModal();
    } else {
      setCount(count - 1);
    }
  }

  useInterval(increaseCount, delay);
  
  const submitTrans = useCallback(
    async () => {
      handleModal(
        <PendingModal />
      )
      if (!bidAmount || !askAmount) return;
      try {
        let tx;
        switch (bidDenom) {
          case 'strong':
            // Preparing for many tokens / coins
            switch (strong) {
              case 'ETH':
                tx = await bondContract.buyNOM(
                  askAmount.toFixed(0),
                  slippage.toNumber() * 100,
                  { 
                    value: bidAmount.toFixed(0) }
                  )
              break

              default:
                {}
            }
            break
          
          case 'weak':
            switch (weak) {
              case 'wNOM':
                tx = await bondContract.sellNOM(
                  bidAmount.toFixed(0),
                  askAmount.toFixed(0),
                  slippage * 100,
                )
                break
              default:
                {}
            }
            break
          
          default:
            console.log()
        }
        handleModal(
          <TransactionCompletedModal tx = {tx} />
        )
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e.code, e.message.message);
        // alert(e.message)
        handleModal(
          <TransactionFailedModal
            closeModal={() => handleModal()}
            error={e.code + '\n' + e.message.slice(0,80) + '...'}
          />
        )
      }
    },[
      askAmount,
      bidAmount,
      bidDenom,
      bondContract,
      handleModal,
      strong,
      slippage,
      weak
    ]
  )
  
  
  const [onSubmit, error] = useAsyncFn(submitTrans);

  return (
    <Modal.Wrapper>
      <LoadingBar progress={(60 - count) / 60 * 100} color='#dddae8' className="loadingBar" />
      <Modal.CloseIcon onClick={() => handleModal()}>
        <Close />
      </Modal.CloseIcon>

      <main>
        <Modal.Caption>Confirm Transaction</Modal.Caption>

        <Modal.ExchangeResult>
          <Modal.ExchangeResultDescription>You're receiving</Modal.ExchangeResultDescription>
          ~ {
              BigNumber.isBigNumber(askAmount) ?
              format18(askAmount).toFixed(6) : 
              ""
            } 
            <sup>
              {bidDenom === 'ETH' ? 'NOM' : 'ETH'}
            </sup>
        </Modal.ExchangeResult>

        <TransactionDetailsRow>
          <span>Current Exchange Rate</span>
          <strong>
            {
              (bidDenom) ?
              <>1 {bidDenom === 'strong' ? strong : weak} = {
                (BigNumber.isBigNumber(bidAmount)) ? 
                format18(askAmount.div(bidAmount)).toFixed(6) : 
                "Loading"
              }</> : (<></>)
            }
            {' '} {bidDenom === 'strong' ? weak : strong}
          </strong>
        </TransactionDetailsRow>
        <TransactionDetailsRow>
          <span>You're Sending</span>
          <strong>{format18(bidAmount).toFixed(6)}{' '}{bidDenom}</strong>
        </TransactionDetailsRow>
        <TransactionDetailsRow>
          <div>
            <span>Wallet</span>

            <div>
              <strong>
                {account === null
                  ? "-"
                  : account
                  ? `${account.substring(0, 10)}...${account.substring(
                      account.length - 4
                    )}`
                  : ""}
              </strong>
            </div>
          </div>

          <WalletIcon>
            <Metamask />
          </WalletIcon>
        </TransactionDetailsRow>
      </main>
      <SlippageWrapper>
        <SlippageCaption>Slippage Limit</SlippageCaption>
        <SlippageValues>
          {limitOptions.map((l) => (
            <LimitBtn
              active={
                new BigNumber(l.value.toString()).times(100) === 
                slippage
              }
              key={l.id}
              onClick={() => objDispatch({
                type: 'slippage', 
                value: new BigNumber(l.value.toString()).times(
                  new BigNumber(100)
                )
              })}
            >
              {l.text}
            </LimitBtn>
          ))}
        </SlippageValues>
        <SlippageDesc>
          Slippage is likely in times of high demand. Quote is based on most
          recent block and does not reflect transactions ahead of you in the
          mempool
        </SlippageDesc>
      </SlippageWrapper>
      <footer>
        <Modal.FooterControls>
          <Modal.SecondaryButton onClick={() => handleModal()}>Cancel</Modal.SecondaryButton>
          <Modal.PrimaryButton onClick={() => onSubmit()}>Confirm ({count})</Modal.PrimaryButton>
        </Modal.FooterControls>
      </footer>
    </Modal.Wrapper>
  );
}
