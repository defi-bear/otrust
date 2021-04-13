import React from "react";
import styled from "styled-components";

import { Dimmer } from "components/UI/Dimmer";
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

export default function OnomyConfirmationModal() {
  return (
    <>
      <Dimmer />
      <Modal.Wrapper>
        <Modal.CloseIcon>
          <Close />
        </Modal.CloseIcon>

        <main>
          <Caption>Step1. Onomy confirmation</Caption>

          <Message>
            Onomy blockchain requires access for selling{" "}
            <strong>1 239 NOM</strong>. Please confirm you want to do it
          </Message>
        </main>
        <footer>
          <Modal.FooterControls>
            <Modal.SecondaryButton>Cancel</Modal.SecondaryButton>
            <Modal.PrimaryButton>Confirm (59)</Modal.PrimaryButton>
          </Modal.FooterControls>
        </footer>
      </Modal.Wrapper>
    </>
  );
}
