import React, { useState } from "react";
import styled from "styled-components";

import { useChain } from 'context/chain/ChainContext'
import { useExchange } from 'context/exchange/ExchangeContext'
import { Caret, Close, Success } from "../Icons";
import * as Modal from "../styles";

export const ExplorerButton = styled(Modal.SecondaryButton)`
  width: 100%;
  margin-top: 32px;
`;

const networks = {1: '', 4: 'rinkeby.'}

export default function TransactionCompletedModal({ amount, result, closeModal, previousTx }) {
  const [detailsActive, setDetailsActive] = useState(false);
  const { currentETHPrice, currentNOMPrice } = useChain()
  const { bidDenom, status } = useExchange()

  const shortten = addr => {
    return addr.slice(0,15) + '...' + addr.slice(addr.length - 3)
  }

  const onExplore = () => {
    window.open('https://' + networks[previousTx.chainId] + 'etherscan.io/tx/' + previousTx.hash, '_blank')
  }

  return (
    <Modal.Wrapper>
      <Modal.CloseIcon onClick={() => closeModal()}>
        <Close />
      </Modal.CloseIcon>

      <main>
        <Modal.ModalIconWrapper>
          <Success />
        </Modal.ModalIconWrapper>
        <Modal.Caption>Transaction Completed!</Modal.Caption>
        {
          status !== 'APPROVE' ? (
            <>
      
              {/* BUY */}
              {/* <Modal.ExchangeResult>
                + 1239 <sup>NOM</sup>
              </Modal.ExchangeResult> */}
      
              {/* SELL */}
              <Modal.ExchangeResult>
                + {parseFloat(result).toFixed(8)} <sup>{bidDenom === 'weak' ? weak : strong}</sup>
                <Modal.Spent>
                  - {parseFloat(amount).toFixed(8)} <sup>{bidDenom}</sup>
                </Modal.Spent>
              </Modal.ExchangeResult>
      
              <Modal.ExchangeRateWrapper>
                <span>Exchange Rate</span>
      
                <strong>1 {bidDenom === strong ? weak : strong} = {bidDenom === 'strong' ? parseFloat(currentNOMPrice).toFixed(8) : parseFloat(currentETHPrice).toFixed(8)} {bidDenom}</strong>
              </Modal.ExchangeRateWrapper>
            </>
          ) : (
            <Modal.ExchangeApproveText>
              Onomy blockchain confirmed access for selling.
            </Modal.ExchangeApproveText>
          )
        }
      </main>
      <footer>
        <Modal.FooterControls>
          <Modal.DetailsButton
            active={detailsActive}
            onClick={() => setDetailsActive(!detailsActive)}
          >
            View Details <Caret />
          </Modal.DetailsButton>
          <Modal.PrimaryButton onClick={() => closeModal()}>Done</Modal.PrimaryButton>
        </Modal.FooterControls>

        {detailsActive && (
          <Modal.FooterDetails>
            <Modal.FooterDetailsRow>
              <span>From</span> <strong>{shortten(previousTx.from)}</strong>
            </Modal.FooterDetailsRow>
            <Modal.FooterDetailsRow>
              <span>To</span> <strong>{shortten(previousTx.to)}</strong>
            </Modal.FooterDetailsRow>
            <Modal.FooterDetailsRow>
              <span>TxID</span> <strong>{shortten(previousTx.hash)}</strong>
            </Modal.FooterDetailsRow>
            <Modal.FooterDetailsRow>
              <span>Network Confirmations</span> <strong>{previousTx.confirmations}</strong>
            </Modal.FooterDetailsRow>

            <ExplorerButton onClick={() => onExplore()}>View in Explorer</ExplorerButton>
          </Modal.FooterDetails>
        )}
      </footer>
    </Modal.Wrapper>
  );
}
