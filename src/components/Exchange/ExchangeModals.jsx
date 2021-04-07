import React, { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";

import { responsive } from "theme/constants";
import { SellBtn, ExchangeButton } from "./exchangeStyles";

const ModalTrigger = styled.div`
  display: none;

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`;

const ExchangeModalWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;

  background-color: ${(props) => props.theme.colors.bgNormal};
`;

const modalOverride = {
  content: {
    padding: 0,
    border: "none",
    borderRadius: 0,

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

export default function ExchangeModals() {
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);

  return (
    <ModalTrigger>
      <ExchangeButton onClick={() => setBuyModalOpen(true)}>
        Buy NOM
      </ExchangeButton>

      <SellBtn onClick={() => setSellModalOpen(true)}>Sell NOM</SellBtn>

      <Modal
        isOpen={buyModalOpen}
        style={modalOverride}
        onRequestClose={() => setBuyModalOpen(false)}
      >
        <ExchangeModalWrapper>
          <header>
            <button onClick={() => setBuyModalOpen(false)}>Back</button>
            buy NOM
            <button
              onClick={() => {
                setSellModalOpen(!sellModalOpen);
                setBuyModalOpen(!buyModalOpen);
              }}
            >
              swap
            </button>
          </header>

          <div>balances and rates info</div>

          <div>inputs</div>
        </ExchangeModalWrapper>
      </Modal>

      <Modal
        isOpen={sellModalOpen}
        style={modalOverride}
        onRequestClose={() => setSellModalOpen(false)}
      >
        <ExchangeModalWrapper>
          <header>
            <button onClick={() => setSellModalOpen(false)}>Back</button>
            sell NOM
            <button
              onClick={() => {
                setBuyModalOpen(!buyModalOpen);
                setSellModalOpen(!sellModalOpen);
              }}
            >
              swap
            </button>
          </header>
        </ExchangeModalWrapper>
      </Modal>
    </ModalTrigger>
  );
}
