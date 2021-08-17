import React, { useState, useEffect } from 'react';
import { BigNumber } from 'bignumber.js';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { responsive } from 'theme/constants';
import ExchangeQuote from './ExchangeQuote';
import { useChain } from 'context/chain/ChainContext';
import { format18 } from '../../utils/math';

const BuyModal = styled.div`
  width: 100%;
  height: 100%;

  background-color: ${props => props.theme.colors.bgDarkest};

  header {
    padding: 20px 20px 0;

    background-color: ${props => props.theme.colors.bgNormal};
  }
`;

const ModalHeader = styled.header`
  display: flex;
  align-items: center;

  h6 {
    margin: 0 auto;

    font-size: 16px;
  }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  padding: 20px;
`;

const HeaderInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: ${props => (props.align ? props.align : 'normal')};
  @media screen and (max-width: ${responsive.laptop}) {
    gap: 5px;
  }

  > strong {
    color: ${props => props.theme.colors.textThirdly};
    font-weight: 400;

    @media screen and (max-width: ${responsive.smartphoneLarge}) {
      font-size: 10px;
    }
  }
`;

const HeaderInfoItemValue = styled.div`
  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: flex;
    flex-direction: column;

    gap: 5px;
  }

  > strong {
    margin-right: 12px;

    color: ${props => props.theme.colors.textPrimary};
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;

    @media screen and (max-width: ${responsive.smartphoneLarge}) {
      font-size: 18px;
    }
  }
`;

const ModalInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  row-gap: 10px;

  padding: 32px 20px;

  background-color: ${props => props.theme.colors.bgNormal};
`;

const ModalBtn = styled.button`
  width: 44px;
  height: 44px;

  border-radius: 8px;
  border: none;
  background-color: ${props => props.theme.colors.bgHighlightBorder};

  color: #84809a;

  cursor: pointer;
`;

const modalOverride = {
  content: {
    padding: 0,
    border: 'none',
    borderRadius: 0,

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

export default function BuywNomMobile({ closeModalClickHandler }) {
  const [formattedWeakBalance, setFormattedWeakBalance] = useState(0);
  const [formattedStrongBalance, setFormattedStrongBalance] = useState(0);
  const [nomUSDT, setNomUSDT] = useState(0);

  const { currentETHPrice, strongBalance, weakBalance } = useChain();

  useEffect(() => {
    setFormattedWeakBalance(weakBalance.shiftedBy(-18));
  }, [weakBalance]);

  useEffect(() => {
    setFormattedStrongBalance(strongBalance.shiftedBy(-18));
  }, [strongBalance]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      if (res.ok) {
        let price = await res.json();
        setNomUSDT(price.ethereum.usd / format18(currentETHPrice).toNumber());
      }
    }

    fetchData();
  }, [currentETHPrice]);

  const values = {
    formattedStrongBalance,
    formattedWeakBalance,
    nomUSDT,
  };

  const handlers = {
    closeModalClickHandler,
  };

  return (
    <ReactModal
      isOpen={true}
      style={modalOverride}
      data-testid="buy-wnom-modal"
      onRequestClose={() => handlers.closeModalClickHandler()}
    >
      <BuyModal>
        <ModalHeader>
          <ModalBtn onClick={() => handlers.closeModalClickHandler()} data-testid="buy-wnom-header-button">
            <FontAwesomeIcon icon={faChevronLeft} />
          </ModalBtn>
          <h6>Buy NOM</h6>
        </ModalHeader>

        <ModalInfo>
          <HeaderInfoItem>
            <strong>ETH Balance</strong>
            <HeaderInfoItemValue>
              <strong>{`${values.formattedStrongBalance.toFixed(6)}`}</strong>
            </HeaderInfoItemValue>
          </HeaderInfoItem>
          <HeaderInfoItem>
            <strong>wNom Balance</strong>
            <HeaderInfoItemValue>
              <strong>{`${values.formattedWeakBalance.toFixed(6)}`}</strong>
            </HeaderInfoItemValue>
          </HeaderInfoItem>
          <HeaderInfoItem>
            <strong>NOM/USDT</strong>
            <HeaderInfoItemValue>
              <strong>{`${values.nomUSDT.toFixed(6)}`}</strong>
            </HeaderInfoItemValue>
          </HeaderInfoItem>
          <HeaderInfoItem>
            <strong>NOM/ETH</strong>
            <HeaderInfoItemValue>
              <strong>
                {BigNumber.isBigNumber(currentETHPrice)
                  ? `${(1 / Math.round(format18(currentETHPrice).toNumber())).toFixed(6)}`
                  : 'Loading'}
              </strong>
            </HeaderInfoItemValue>
          </HeaderInfoItem>
        </ModalInfo>

        <FormWrapper>
          <ExchangeQuote strength="strong" mobile={true} />
        </FormWrapper>
      </BuyModal>
    </ReactModal>
  );
}
