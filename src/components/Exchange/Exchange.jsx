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
    async () => {}
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