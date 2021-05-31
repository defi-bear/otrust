import React, { useState } from "react";
import styled from "styled-components";
import useInterval from '@use-it/interval';

import { Close } from "../Icons"
import * as Modal from "../styles"
import { responsive } from "theme/constants"
import { useChain } from 'context/chain/ChainContext'
import { useExchange, useUpdateExchange } from 'context/exchange/ExchangeContext'
import { useModal } from 'context/modal/ModalContext'
import { useWeb3React } from "@web3-react/core";
import { BondingCont, NOMCont } from 'context/chain/contracts'

import RequestFailedModal from 'components/Modals/components/RequestFailedModal'
import PendingModal from 'components/Modals/components/PendingModal'
import TransactionFailedModal from 'components/Modals/components/TransactionFailedModal'

const Message = styled.div`
  margin: 32px 0 0;

  color: ${(props) => props.theme.colors.textSecondary};

  @media screen and (max-width: ${responsive.smartphone}) {
    font-size: 14px;
  }
`;

const Caption = styled(Modal.Caption)`
  text-align: left;
`;

export default function ApproveModal() {
  const [count, setCount] = useState(60)
  const [delay, setDelay] = useState(1000)
  const { handleModal } = useModal()

  const {
    weakBalance
  } = useChain()

  const {
    bidAmount,
    bidDenom,
    strength,
    weak
  } = useExchange()

  const {
    strDispatch
  } = useUpdateExchange()

  const { library } = useWeb3React()
  
  const bondContract = BondingCont(library)
  const NOMcontract = NOMCont(library)

  const increaseCount = () => {
    if(count === 0) {
      setDelay(null);
      handleModal();
    } else {
      setCount(count - 1);
    }
  }

  useInterval(increaseCount, delay);

  const onApprove = async (value) => {
      
    if (bidDenom !== strength) {
      <RequestFailedModal
        error = "Please enter amount"
      />
    }
    
    if(value <= weakBalance) {
      try {
        handleModal(
          <PendingModal />
        );
        strDispatch({
          type: 'status', 
          value: 'APPROVE'
        })
        let tx = await NOMcontract.increaseAllowance(
          bondContract.address,
          value.toFixed(0)
        );
        handleModal()
      } catch (e) {
        // eslint-disable-next-line no-console
        // console.error(e.code, e.message.message);
        // alert(e.message)
        handleModal(
          <TransactionFailedModal
            closeModal={() => handleModal()}
            error={e.code + '\n' + e.message.slice(0,80) + '...'}
          />
        )
      }    
    } else {
      handleModal(
            <TransactionFailedModal
              closeModal={() => handleModal()}
              error={`${weak} Balance too low`}
            />
      )
    }
  }

  return (
    <Modal.Wrapper>
      <Modal.CloseIcon onClick={() => handleModal()}>
        <Close />
      </Modal.CloseIcon>

      <main>
        <Caption>Step1. Onomy confirmation</Caption>

        <Message>
          Onomy blockchain requires access for selling. Please confirm you want to do it
        </Message>
      </main>
      <footer>
        <Modal.FooterControls>
          <Modal.SecondaryButton onClick={() => handleModal()}>Cancel</Modal.SecondaryButton>
          <Modal.PrimaryButton onClick={() => onApprove(bidAmount)}>Approve ({count})</Modal.PrimaryButton>
        </Modal.FooterControls>
      </footer>
    </Modal.Wrapper>
  );
}
