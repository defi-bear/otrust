import React, { useCallback, useState, useEffect } from "react";
import { useAsyncFn } from "lib/use-async-fn";
import { BigNumber } from 'bignumber.js'
import { format18, isNumber, parse18 } from 'utils/math'

import {
  ExchangeWrapper,
  ExchangeItem,
  Sending,
  Receiving,
  ExchangeInput,
  MaxBtn,
  ReceivingValue,
  SellBtn,
  ExchangeButton,
} from "./exchangeStyles";

import ConfirmTransactionModal from 'components/Modals/components/ConfirmTransactionModal';

import { useModal } from 'context/modal/ModalContext'
import { useExchange, useUpdateExchange } from "context/ExchangeContext";
import { useChain, useUpdateChain } from "context/chain/ChainContext";

import TransactionCompletedModal from "components/Modals/components/TransactionCompletedModal";
import OnomyConfirmationModal from "components/Modals/components/OnomyConfirmationModal";
import TransactionFailedModal from "components/Modals/components/TransactionFailedModal";
import PendingModal from "components/Modals/components/PendingModal";

export default function Exchange() {
  let { handleModal } = useModal()

  const { 
    bidAmount,
    askAmount,
    input,
    display,
    bidDenom,
    pair
  } = useExchange();
  
  const { 
    setBidAmount,
    setAskAmount,
    setInput,
    setDisplay,
    setBidDenom,
    setPair
  } = useUpdateExchange();

  const { 
    bondContract, 
    NOMallowance, 
    NOMcontract, 
    ETHbalance, 
    NOMbalance, 
    pendingTx 
  } = useChain();
  
  const { setPendingTx } = useUpdateChain();
  
  const [completedAmount, setCompletedAmount] = useState(null);
  const [completedResult, setCompletedResult] = useState(null);
  const [slippage, setSlippage] = useState(1);
  const [previousTx, setPreviousTx] = useState(null);
 
  const onStrongBidTextChange = useCallback(
    (evt) => {
      evt.preventDefault()
      setInput(evt.target.value)
      setDenom("strong")

      if (isNumber(parseFloat(evt.target.value))) {
        try {
          const bidAmountUpdate = parse18(
            new BigNumber(
              parseFloat(evt.target.value).toString()
            )
          )
          
          if (bidAmountUpdate !== bidAmount) {
            setBidAmount(
              bidAmount
            ) 
          }   
        } catch (e) {
          if (bidAmount !== '') {
            setDisplay("Invalid Input")
            setBidAmount('')
          }  
        }
    },
    [
      setSwapBuyAmount,
      setSwapBuyResult,
      setSwapBuyValue,
      setSwapDenom, 
      setSwapSellAmount,
      setSwapSellResult,
      setSwapSellValue
    ]
  );
  
  const onStrongTextChange = useCallback(
    (evt) => {
      evt.preventDefault()
      setSwapSellValue(evt.target.value)
      setSwapBuyAmount('')
      setSwapBuyResult('')
      setSwapDenom('NOM')

      if (isNumber(parseFloat(evt.target.value))) {
        try {
          console.log(evt.target.value)
          setSwapSellAmount(
            parse18(
              new BigNumber(
                parseFloat(evt.target.value).toString()
              )
            )
          )
                  
        } catch {
          setSwapSellAmount(new BigNumber(0))
        }
      } else {
        setSwapSellAmount('')
        setSwapSellResult('')
      }
    },
    [
      setSwapBuyAmount, 
      setSwapBuyResult,
      setSwapDenom,
      setSwapSellAmount,
      setSwapSellResult,
      setSwapSellValue
    ]
  );

  const submitTrans = useCallback(
    async (denom) => {
      if (!swapBuyAmount && !swapSellAmount) return;
      try {
        let tx;
        if (bidDenom === "strong") {
          switch (pair[1]) {
            case 'ETH':

          tx = await bondContract.buyNOM(
            swapBuyResult.toFixed(0),
            slippage * 100,
            { value: swapBuyAmount.toFixed(0) }
          );
        } else {
          tx = await bondContract.sellNOM(
            swapSellAmount.toFixed(0),
            swapSellResult.toFixed(0),
            slippage * 100,
          );
        }
        setPendingTx(tx);
        setCompletedAmount(denom === 'strong' ? swapBuyAmount : swapSellAmount);
        setCompletedResult(denom === 'weak' ? swapBuyResult : swapSellResult);
        handleModal(
          <PendingModal />
        )
        bidAmount("");
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e.code, e.message.message);
        // alert(e.message)
        handleModal(
          <TransactionFailedModal
            closeModal={() => handleModal()}
            error={e.code + '\n' + e.message.slice(0,80) + '...'}
          />
        )
      }
    },
    [
      bondContract,
      handleModal,
      setCompletedAmount,
      setCompletedResult,
      setPendingTx,
      setSwapSellAmount,
      setSwapBuyAmount,
      slippage,
      swapBuyAmount,
      swapBuyResult,
      swapSellAmount,
      swapSellResult
    ]
  );

  useEffect(() => {
    if (pendingTx) {
      pendingTx.wait().then(() => {
        setPreviousTx(pendingTx);
        setPendingTx(null);
        handleModal(
          <TransactionCompletedModal
            closeModal={() => handleModal()}
            type={swapDenom}
            amount={completedAmount}
            result={completedResult}
            previousTx={previousTx}
          />
        )
      })
    }
  }, [
    completedAmount,
    completedResult,
    handleModal,
    pendingTx,
    previousTx,
    setPendingTx,
    swapBuyAmount,
    swapBuyResult,
    swapDenom,
    swapSellAmount,
    swapSellResult,
  ])

  const onBuy = () => {
    setSwapDenom('ETH');
    handleModal(
        <ConfirmTransactionModal
          closeModal={() => handleModal()}
          type='ETH'
          amount={swapBuyAmount}
          result={swapBuyResult}
          onConfirm={() => 
            onSubmit('ETH')
          }
          setSlippage={setSlippage}
          slippage={slippage}
        />
    )
  }

  const onSell = () => {
    setSwapDenom('NOM');
    handleModal(
        <ConfirmTransactionModal
          closeModal={() => handleModal()}
          type='NOM'
          amount={swapSellAmount}
          result={swapSellResult}
          onConfirm={() => 
            onSubmit('NOM')
          }
          setSlippage={setSlippage}
          slippage={slippage}
        />
    )
  }
  
  const onApprove = async (value) => {
    if(value <= NOMbalance) {
      try {
        handleModal(
          <PendingModal />
        );
        setSwapDenom('APPROVE')
        let tx = await NOMcontract.increaseAllowance(
          bondContract.address,
          value.toFixed(0)
        );
        setPendingTx(tx);
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
              error={'NOM Balance too low'}
            />
      )
    }
  } 
  
  

  const [onSubmit, error] = useAsyncFn(submitTrans);

  const onEthMax = () => {
    setSwapBuyAmount(ETHbalance)
  }

  const onNOMMax = () => {
    setSwapSellAmount(NOMbalance)
  }
  return (
    <ExchangeWrapper>
      <ExchangeItem>
        <strong>Buy NOM</strong>
        <Sending>
          <strong>I'm sending</strong>
          <ExchangeInput
            type="text"
            onChange={onBuyNOMTextChange}
            value={swapBuyValue}
          />
          ETH
          <MaxBtn onClick={onEthMax}>Max</MaxBtn>
        </Sending>
        <Receiving>
          <strong>I'm receiving</strong>
          <ReceivingValue>
            {
              BigNumber.isBigNumber(swapBuyResult) ? 
              format18(swapBuyResult).toFixed(4) : 
              ''
            } NOM
          </ReceivingValue>
        </Receiving>
        <div>
          <ExchangeButton onClick={onBuy}>Buy NOM</ExchangeButton>
        </div>
      </ExchangeItem>

      <ExchangeItem>
        <strong>Sell NOM</strong>
        <Sending>
          <strong>I'm sending</strong>
          <ExchangeInput
            type="text"
            onChange={onSellNOMTextChange}
            value={swapSellValue}
          />
          NOM
          <MaxBtn onClick={onNOMMax}>Max</MaxBtn>
        </Sending>
        <Receiving>
          <strong>I'm receiving</strong>
          <ReceivingValue>
            {
              BigNumber.isBigNumber(swapSellResult) ? 
              format18(swapSellResult).toFixed(4) : 
              ''
            } ETH
          </ReceivingValue>
        </Receiving>
        <div>
          {
            NOMallowance > swapSellAmount && NOMbalance > swapSellAmount ? (
              <SellBtn onClick={onSell}>Sell NOM</SellBtn>) : 
                  NOMbalance > swapSellAmount ? (
                    <SellBtn onClick={() => handleModal(
                        <OnomyConfirmationModal
                          closeModal={() => handleModal()}
                          onConfirm={() => onApprove(swapSellAmount)}
                        />
                    )}>Approve</SellBtn>
                  ) : <SellBtn>Not enough NOM</SellBtn>
          }
        </div>
      </ExchangeItem>

      {error && <div>{error}</div>}
    </ExchangeWrapper>
  );
}