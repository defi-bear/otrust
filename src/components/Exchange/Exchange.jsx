import React, { useCallback, useState, useEffect } from "react";
import { useAsyncFn } from "lib/use-async-fn";

import {
  ExchangeWrapper,
} from "./exchangeStyles";

import { useModal } from 'context/modal/ModalContext'
import { useExchange, useUpdateExchange } from "context/ExchangeContext";
import { useChain, useUpdateChain } from "context/chain/ChainContext";

import TransactionCompletedModal from "components/Modals/components/TransactionCompletedModal";
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
    setBidDenom,
  } = useUpdateExchange();

  const { 
    bondContract,  
    NOMcontract, 
    weakBalance, 
    pendingTx 
  } = useChain();
  
  const { setPendingTx } = useUpdateChain();
  
  const [completedAmount, setCompletedAmount] = useState(null);
  const [completedResult, setCompletedResult] = useState(null);
  
  const [previousTx, setPreviousTx] = useState(null);

  const submitTrans = useCallback(
    async () => {
      if (!bidAmount || !askAmount) return;
      try {
        let tx;
        switch (bidDenom) {
          case 'strong':
            // Preparing for many tokens / coins
            switch (pair[0]) {
              case 'ETH':
                {
                  tx = await bondContract.buyNOM(
                    askAmount.toFixed(0),
                    slippage * 100,
                    { value: bidAmount.toFixed(0) }
                  )
                }
              break

              default:
                {}
            }
            break
          
          case 'weak':
            switch (pair[1]) {
              case 'wNOM':
                {
                  tx = await bondContract.sellNOM(
                    bidAmount.toFixed(0),
                    askAmount.toFixed(0),
                    slippage * 100,
                  )
                }
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
  );

  useEffect(() => {
    if (pendingTx) {
      pendingTx.wait().then(() => {
        setPreviousTx(pendingTx);
        setPendingTx(null);
        handleModal(
          <TransactionCompletedModal
            closeModal={() => handleModal()}
            type={bidDenom}
            amount={completedAmount}
            result={completedResult}
            previousTx={previousTx}
          />
        )
      })
    }
  }, [
    bidDenom,
    completedAmount,
    completedResult,
    handleModal,
    pendingTx,
    previousTx,
    setPendingTx,
  ])
  
  
  
  const [onSubmit, error] = useAsyncFn(submitTrans);

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