import React, { useCallback } from "react";

import ExchangeModals from "./ExchangeModals";
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

import { parseEther } from "@ethersproject/units";

import { useAsyncFn } from "lib/use-async-fn";
import { useSwap, useUpdateSwap } from "context/SwapContext";
import { useChain, useUpdateChain } from "context/chain/ChainContext";

export default function Exchange({ text, onInputChange, isBuyButton }) {
  const { swapDenom, swapBuyAmount, swapSellAmount } = useSwap();
  const { setSwapBuyAmount, setSwapDenom } = useUpdateSwap();
  const onTextChange = useCallback(
    (evt) => setSwapBuyAmount(evt.target.value),
    [setSwapBuyAmount]
  );
  const { bondContract, NOMcontract } = useChain();
  const { setPendingTx } = useUpdateChain();

  const submitTrans = useCallback(
    async (evt) => {
      if (evt) evt.preventDefault();
      if (!swapBuyAmount) return;
      try {
        if (swapDenom === "ETH") {
          try {
            const tx = await bondContract.buyNOM({
              value: parseEther(swapBuyAmount.toString()).toString(),
            });
            setPendingTx(tx);
            setSwapBuyAmount("");
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e.stack || e);
            setSwapBuyAmount(swapBuyAmount);
          }
        } else {
          let tx = await NOMcontract.increaseAllowance(
            bondContract.address,
            parseEther(swapBuyAmount.toString())
          );
          setPendingTx(tx);
          tx = await bondContract.sellNOM(parseEther(swapBuyAmount.toString()));
          setPendingTx(tx);
          setSwapBuyAmount("");
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e.stack || e);
        setSwapBuyAmount(swapBuyAmount);
      }
    },
    [
      swapBuyAmount,
      swapDenom,
      bondContract,
      NOMcontract,
      setSwapBuyAmount,
      setPendingTx,
    ]
  );

  const [onSubmit, isWorking, error] = useAsyncFn(submitTrans);

  const onTextAreaKeyDown = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
    }
    setSwapBuyAmount(e);
  };

  return (
    <ExchangeWrapper>
      <ExchangeModals />

      <ExchangeItem onSubmit={onSubmit}>
        <strong>Buy NOM</strong>
        <Sending>
          <strong>I'm sending</strong>
          <ExchangeInput
            type="text"
            onChange={onTextChange}
            value={swapBuyAmount}
          />
          ETH
          <MaxBtn>Max</MaxBtn>
        </Sending>
        <Receiving>
          <strong>I'm receiving</strong>
          <ReceivingValue>
            {parseFloat(swapBuyAmount).toPrecision(10)} NOM
          </ReceivingValue>
        </Receiving>
        <div>
          <ExchangeButton type="submit">Buy NOM</ExchangeButton>
        </div>
      </ExchangeItem>

      <ExchangeItem>
        <strong>Sell NOM</strong>
        <Sending>
          <strong>I'm sending</strong>
          <ExchangeInput
            type="text"
            onChange={onTextChange}
            value={swapSellAmount}
          />
          NOM
          <MaxBtn>Max</MaxBtn>
        </Sending>
        <Receiving>
          <strong>I'm receiving</strong>
          <ReceivingValue>
            {parseFloat(swapSellAmount).toPrecision(10)} ETH
          </ReceivingValue>
        </Receiving>
        <div>
          <SellBtn>Sell NOM</SellBtn>
        </div>
      </ExchangeItem>

      {error && <div>{error}</div>}
    </ExchangeWrapper>
  );
}

/* <form onSubmit={onSubmit}>
  <SwapHeader>Swap</SwapHeader>
  <GridWrapper>
    <LeftComponentWrapper>From:</LeftComponentWrapper>
    {error ? error : null}
    <StyledInput
      type="text"
      value={swapBuyAmount}
      onChange={onTextChange}
      onTextAreaKeyDown={onTextAreaKeyDown}
      placeholder={isWorking ? "Confirming" : "Enter amount"}
    />
    <Dropdown denom={swapDenom} setDenom={setSwapDenom} />
    <LeftComponentWrapper>To:</LeftComponentWrapper>
    <MiddleComponentWrapper>
      {swapSellAmount
        ? parseFloat(swapSellAmount).toPrecision(10)
        : null}
    </MiddleComponentWrapper>
    <RightComponentWrapper>
      {swapDenom === "NOM" ? "ETH" : "NOM"}
    </RightComponentWrapper>
  </GridWrapper>

  <RowWrapper>
    <Button type="submit">Execute</Button>
  </RowWrapper>
</form> */
