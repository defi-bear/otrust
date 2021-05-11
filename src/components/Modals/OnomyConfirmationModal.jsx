import React, { useState } from "react";
import styled from "styled-components";
import useInterval from '@use-it/interval';

import { Close } from "./Icons";
import * as Modal from "./styles";
import { responsive } from "theme/constants";

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

export default function OnomyConfirmationModal({ closeModal, onConfirm }) {
  const [count, setCount] = useState(60);
  const [delay, setDelay] = useState(1000);

  const increaseCount = () => {
    if(count === 0) {
      setDelay(null);
      closeModal();
    } else {
      setCount(count - 1);
    }
  }

  useInterval(increaseCount, delay);
  return (
    <Modal.Wrapper>
      <Modal.CloseIcon onClick={() => closeModal()}>
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
          <Modal.SecondaryButton onClick={() => closeModal()}>Cancel</Modal.SecondaryButton>
          <Modal.PrimaryButton onClick={() => onConfirm()}>Approve ({count})</Modal.PrimaryButton>
        </Modal.FooterControls>
      </footer>
    </Modal.Wrapper>
  );
}
