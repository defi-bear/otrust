import React, { useCallback, useState, useEffect } from "react";
import { useAsyncFn } from "lib/use-async-fn";

import {
  ExchangeWrapper,
} from "./exchangeStyles";

import { useModal } from 'context/modal/ModalContext'
import { useExchange } from "context/exchange/ExchangeContext";
import { useChain } from "context/chain/ChainContext";

import TransactionFailedModal from "components/Modals/components/TransactionFailedModal";
import PendingModal from "components/Modals/components/PendingModal";
import ExchangeQuote from "./ExchangeQuote";

export default function Exchange() {
  let { handleModal } = useModal()

  const { 
    bidAmount,
    askAmount,
    bidDenom,
    pair,
    slippage
  } = useExchange();
  
  const { 
    bondContract
  } = useChain();
  
  const [pendingTx, setPendingTx] = useState();
  
  const [setCompletedAmount] = useState(null);
  const [setCompletedResult] = useState(null);
  
  const submitTrans = useCallback(
    async () => {
      if (!bidAmount || !askAmount) return;
      try {
        let tx;
        switch (bidDenom) {
          case 'strong':
            // Preparing for many tokens / coins
            switch (strong) {
              case 'ETH':
                tx = await bondContract.buyNOM(
                  askAmount.toFixed(0),
                  slippage * 100,
                  { 
                    value: bidAmount.toFixed(0) }
                  )
              break

              default:
                {}
            }
            break
          
          case 'weak':
            switch (weak) {
              case 'wNOM':
                tx = await bondContract.sellNOM(
                  bidAmount.toFixed(0),
                  askAmount.toFixed(0),
                  slippage * 100,
                )
                break
              default:
                {}
            }
            break
          
          default:
            console.log()
        }
      
        setPendingTx(tx);
        setCompletedAmount(bidAmount);
        setCompletedResult(askAmount);
        handleModal(
          <PendingModal tx = {tx} setPendingTx = {() => setPendingTx}/>
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
    },[
      askAmount,
      bidAmount,
      bidDenom,
      bondContract,
      handleModal,
      pair,
      setPendingTx,
      setCompletedAmount,
      setCompletedResult,
      slippage
    ]
  )
  
  
  const [onSubmit, error] = useAsyncFn(submitTrans);
  
  useEffect(() => {
    console.log("Exchange Error: ", error)
  },[error])

  return (
    <ExchangeWrapper>
      <ExchangeQuote
        strength='strong'
        onSubmit={onSubmit}
      />
      <ExchangeQuote
        strength='weak'
        onSubmit={onSubmit}
      />
      {error && <div>{error}</div>}
    </ExchangeWrapper>
  );
}