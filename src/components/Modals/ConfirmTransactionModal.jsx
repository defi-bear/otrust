import React, { useState } from "react";
import styled from "styled-components";
import { lighten } from "polished";

import { Close, Metamask } from "./Icons";
import * as Modal from "./styles";

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
    value: 0,
  },
  {
    id: 1,
    text: "1%",
    value: 1,
  },
  {
    id: 2,
    text: "2.5%",
    value: 2.5,
  },
  {
    id: 3,
    text: "5%",
    value: 5,
  },
];

export default function ConfirmTransactionModal() {
  const [limit, setLimit] = useState(0);

  return (
    <Modal.Wrapper>
      <Modal.CloseIcon>
        <Close />
      </Modal.CloseIcon>

      <main>
        <Modal.Caption>Confirm Transaction</Modal.Caption>

        <Modal.ExchangeResult>
          ~ 1239 <sup>NOM</sup>
        </Modal.ExchangeResult>

        <TransactionDetailsRow>
          <span>Current Exchange Rate</span>

          <strong>1 NOM = 0.07102 ETH</strong>
        </TransactionDetailsRow>
        <TransactionDetailsRow>
          <span>You're Sending</span>

          <strong>0.15 ETH</strong>
        </TransactionDetailsRow>
        <TransactionDetailsRow>
          <div>
            <span>Wallet</span>

            <div>
              <strong>0x293s92dsd3h4gh9bvn61...931</strong>
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
              active={l.value === limit}
              key={l.id}
              onClick={() => setLimit(l.value)}
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
          <Modal.SecondaryButton>Cancel</Modal.SecondaryButton>
          <Modal.PrimaryButton>Confirm (59)</Modal.PrimaryButton>
        </Modal.FooterControls>
      </footer>
    </Modal.Wrapper>
  );
}
