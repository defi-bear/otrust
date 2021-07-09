import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import useInterval from '@use-it/interval';
import { BigNumber } from 'bignumber.js';

import { Close } from '../Icons';
import * as Modal from '../styles';
import { responsive } from 'theme/constants';
import { useModal } from 'context/modal/ModalContext';
import { MaxBtn } from 'components/Exchange/exchangeStyles';
import { useChain } from 'context/chain/ChainContext';
import { useExchange, useUpdateExchange } from 'context/exchange/ExchangeContext';
import { format18 } from 'utils/math';
import RequestFailedModal from './RequestFailedModal';

const Message = styled.div`
  margin: 32px 0 0;

  color: ${props => props.theme.colors.textSecondary};

  @media screen and (max-width: ${responsive.smartphone}) {
    font-size: 14px;
  }
`;

const Caption = styled(Modal.Caption)`
  text-align: left;
`;

const ApproveTokensWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px;
  margin-top: 24px;

  background-color: ${props => props.theme.colors.bgHighlightBorder};
  border-radius: 8px;

  > div {
    margin-left: 8px;

    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 6px;

    color: ${props => props.theme.colors.textThirdly};
    font-size: 12px;
  }

  input {
    display: block;

    background: none;
    border: none;

    color: ${props => props.theme.colors.textPrimary};
    font-size: 18px;

    &:focus {
      outline: none;
    }
  }
`;

export default function ApproveTokensModal({ getAskAmount, onConfirmApprove }) {
  const [count, setCount] = useState(60);
  const [delay, setDelay] = useState(1000);
  const { handleModal } = useModal();
  const { NOMallowance } = useChain();
  const { askAmount, bidAmount, weak } = useExchange();

  const { objDispatch, strDispatch } = useUpdateExchange();

  const [approveAmount, setApproveAmount] = useState(bidAmount.minus(NOMallowance));

  useEffect(() => {
    setApproveAmount(bidAmount.minus(NOMallowance));
  }, [bidAmount, NOMallowance]);

  const increaseCount = () => {
    if (count === 0) {
      setDelay(null);
      handleModal();
    } else {
      setCount(count - 1);
    }
  };

  useInterval(increaseCount, delay);

  const onTextChange = useCallback(async event => {
    event.preventDefault();
    console.log('Text Change: ', event.target.value);

    const floatRegExp = new RegExp(/(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$)|(^\d\.$)/);

    if (floatRegExp.test(event.target.value.toString())) {
      console.log('Text Change: ', 'regex passed');
      const approvalAmount = new BigNumber(parseFloat(event.target.value).toString());
      const bidAmountUpdate = bidAmount.plus(approvalAmount);
      const inputUpdate = parseFloat(format18(bidAmountUpdate).toFixed(8)).toString();

      console.log(
        'Text Change: ',
        approvalAmount.toFixed(8).toString(),
        bidAmountUpdate.toFixed(8).toString(),
        inputUpdate,
      );

      var askAmountUpdate;

      try {
        askAmountUpdate = await getAskAmount(askAmount, bidAmountUpdate, weak);
      } catch (e) {
        if (e) {
          handleModal(<RequestFailedModal error={e.error.message} />);
        }
      }

      let objUpdate = new Map();
      let strUpdate = new Map();

      objUpdate = objUpdate.set('askAmount', new BigNumber(askAmountUpdate.toString()));

      objUpdate = objUpdate.set('bidAmount', bidAmountUpdate);

      objDispatch({
        type: 'update',
        value: objUpdate,
      });

      strUpdate = strUpdate.set('input', inputUpdate);

      strUpdate = strUpdate.set('output', format18(new BigNumber(askAmountUpdate.toString())).toFixed(8));

      strDispatch({
        type: 'update',
        value: strUpdate,
      });
    } else {
      console.log('Text Change: ', 'regex failed');
      handleModal(<RequestFailedModal error="Please enter numbers only. Thank you!" />);
    }
  });

  const onMax = useCallback(() => {});

  return (
    <Modal.Wrapper>
      <Modal.CloseIcon onClick={() => handleModal()} data-testid="approve-tokens-modal-close-icon">
        <Close />
      </Modal.CloseIcon>

      <main>
        <Caption>Approve Tokens</Caption>

        <Message>
          You want to sell <strong>{parseFloat(format18(bidAmount).toFixed(8)).toString()} wNOM</strong>, but you
          approved for sale only {parseFloat(format18(NOMallowance).toFixed(8)).toString()} wNOM. Would you like to
          approve the rest <strong>{parseFloat(format18(approveAmount).toFixed(8)).toString()} (or more) wNOM</strong>{' '}
          and complete selling?
        </Message>

        <ApproveTokensWrapper>
          <div>
            <label htmlFor="">Approve tokens (wNOM)</label>
            <input
              type="text"
              placeholder="0.00"
              value={parseFloat(format18(approveAmount).toFixed(8)).toString()}
              onChange={onTextChange}
            />
          </div>
          <MaxBtn onClick={onMax}>MAX</MaxBtn>
        </ApproveTokensWrapper>
      </main>
      <footer>
        <Modal.FooterControls>
          <Modal.SecondaryButton onClick={() => handleModal()} data-testid="approve-tokens-modal-secondary-button">
            Cancel
          </Modal.SecondaryButton>
          <Modal.PrimaryButton onClick={onConfirmApprove} data-testid="approve-tokens-modal-primary-button">
            Approve ({count})
          </Modal.PrimaryButton>
        </Modal.FooterControls>
      </footer>
    </Modal.Wrapper>
  );
}
