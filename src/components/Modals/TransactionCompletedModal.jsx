import React, { useState } from "react";
import styled from "styled-components";

import { Dimmer } from "components/UI/Dimmer";
import { Caret, Close, Success } from "./Icons";
import * as Modal from "./styles";

export const ExplorerButton = styled(Modal.SecondaryButton)`
  width: 100%;
  margin-top: 32px;
`;

export default function TransactionCompletedModal() {
  const [detailsActive, setDetailsActive] = useState(false);

  return (
    <>
      <Dimmer />
      <Modal.Wrapper>
        <Modal.CloseIcon>
          <Close />
        </Modal.CloseIcon>

        <main>
          <Modal.ModalIconWrapper>
            <Success />
          </Modal.ModalIconWrapper>
          <Modal.Caption>Transaction Completed!</Modal.Caption>

          {/* BUY */}
          {/* <ExchangeResult>
            + 1239 <sup>NOM</sup>
          </ExchangeResult> */}

          {/* SELL */}
          <Modal.ExchangeResult>
            + 0.15 <sup>ETH</sup>
            <Modal.DetailsSeparator>/</Modal.DetailsSeparator>
            <Modal.Spent>
              - 1239 <sup>NOM</sup>
            </Modal.Spent>
          </Modal.ExchangeResult>

          <Modal.ExchangeRateWrapper>
            <span>Exchange Rate</span>

            <strong>1 NOM = 0.07102 ETH</strong>
          </Modal.ExchangeRateWrapper>
        </main>
        <footer>
          <Modal.FooterControls>
            <Modal.DetailsButton
              active={detailsActive}
              onClick={() => setDetailsActive(!detailsActive)}
            >
              View Details <Caret />
            </Modal.DetailsButton>
            <Modal.PrimaryButton>Done</Modal.PrimaryButton>
          </Modal.FooterControls>

          {detailsActive && (
            <Modal.FooterDetails>
              <Modal.FooterDetailsRow>
                <span>From</span> <strong>0x293s92dsd3h4gh9bvn61...931</strong>
              </Modal.FooterDetailsRow>
              <Modal.FooterDetailsRow>
                <span>To</span> <strong>0xd0323d312o31203201s05...455</strong>
              </Modal.FooterDetailsRow>
              <Modal.FooterDetailsRow>
                <span>TxID</span> <strong>021392231282</strong>
              </Modal.FooterDetailsRow>
              <Modal.FooterDetailsRow>
                <span>Network Confirmations</span> <strong>24</strong>
              </Modal.FooterDetailsRow>

              <ExplorerButton>View in Explorer</ExplorerButton>
            </Modal.FooterDetails>
          )}
        </footer>
      </Modal.Wrapper>
    </>
  );
}
