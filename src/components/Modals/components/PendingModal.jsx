import React, { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'bignumber.js';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import LoadingSpinner from 'components/UI/LoadingSpinner';
import { Metamask } from 'components/Modals/Icons';

import { format18, parse18 } from 'utils/math';
import { useExchange } from 'context/exchange/ExchangeContext';
import { BondingCont } from 'context/chain/contracts';
import * as Modal from '../styles';

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

export default function PendingModal({ type = 'selling' }) {
  const { account, library } = useWeb3React();
  const { askAmount, bidAmount, bidDenom, strong, weak } = useExchange();
  const bondContract = BondingCont(library);
  const [unitprice, setUnitPrice] = useState(0);

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

  useEffect(() => {
    async function fetchData() {
      let bidAmountUpdate = parse18(new BigNumber(parseFloat('1').toString()));
      let askAmountUpdate = await getAskAmount(askAmount, bidAmountUpdate, bidDenom);
      setUnitPrice(format18(new BigNumber(askAmountUpdate.toString())).toFixed(8));
    }

    fetchData();
  }, [getAskAmount, askAmount, bidDenom]);

  return (
    <Modal.Wrapper>
      <main>
        <Modal.PendingCaption>Transaction pending...</Modal.PendingCaption>

        <Modal.ExchangeResult>
          <Modal.ExchangeResultDescription>You're {type}</Modal.ExchangeResultDescription>
          {format18(bidAmount).toFixed(6)} <sup>{bidDenom === 'strong' ? strong : weak}</sup>
        </Modal.ExchangeResult>

        <TransactionDetailsRow>
          <span>Current Exchange Rate</span>
          <strong>
            1 {bidDenom === 'strong' ? strong : weak} = {unitprice} {bidDenom === 'strong' ? weak : strong}
          </strong>
        </TransactionDetailsRow>
        <TransactionDetailsRow>
          <span>You're Sending</span>
          <strong>
            {format18(askAmount).toFixed(6)} <sup>{bidDenom === 'strong' ? weak : strong}</sup>
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
      <footer>
        <Modal.LoadingWrapper>
          <LoadingSpinner />
        </Modal.LoadingWrapper>
      </footer>
    </Modal.Wrapper>
  );
}
