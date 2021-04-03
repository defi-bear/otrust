// import React, { useCallback } from "react";
import React from "react";
import styled from "styled-components";
import { responsive } from "theme/constants";
// import { parseEther } from "@ethersproject/units";

// import { useAsyncFn } from "lib/use-async-fn";
// import { useSwap, useUpdateSwap } from "context/SwapContext";
// import { useChain, useUpdateChain } from "context/chain/ChainContext";

// import { Panel } from "components";
// import Dropdown from "components/Dropdown";
// import { AccentButton } from "components/UI/Button";

const ExchangeWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  height: 100%;
  padding: 24px 0;

  font-size: 14px;

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    grid-template-columns: 1fr;
    background-color: ${(props) => props.theme.colors.bgDarken};

    padding: 24px 20px;
  }
`;

const PopupTriggers = styled.div`
  display: none;

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`;

const ExchangeItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  height: 100%;
  padding: 0 40px;

  @media screen and (max-width: ${responsive.laptop}) {
    padding: 0 24px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: none;
  }

  > strong {
    margin-bottom: 12px;

    font-size: 16px;

    @media screen and (max-width: ${responsive.laptop}) {
      font-size: 14px;
    }
  }

  & + & {
    border-left: 2px solid ${(props) => props.theme.colors.bgHighlightBorder};
  }
`;

const Sending = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  width: 100%;
  height: 50px;
  padding: 16px;

  border: 1px solid ${(props) => props.theme.colors.bgHighlightBorder};
  border-radius: 6px;

  strong {
    color: ${(props) => props.theme.colors.textSecondary};
    margin-right: auto;
    font-weight: 500;
    white-space: nowrap;

    @media screen and (max-width: ${responsive.tabletSmall}) {
      font-size: 12px;
    }
  }
`;

const Receiving = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  width: 100%;
  height: 50px;
  padding: 16px;

  background-color: ${(props) => props.theme.colors.bgDarken};
  border: 1px solid ${(props) => props.theme.colors.bgDarken};
  border-radius: 6px;

  strong {
    color: ${(props) => props.theme.colors.textSecondary};
    margin-right: auto;
    font-weight: 500;

    @media screen and (max-width: ${responsive.tabletSmall}) {
      font-size: 12px;
    }
  }
`;

const MaxBtn = styled.button`
  padding: 5px;

  border: none;
  background: none;

  color: ${(props) => props.theme.colors.highlightYellow};
  font-weight: 500;
  text-transform: uppercase;
  cursor: pointer;
`;

const ExchangeInput = styled.input`
  width: 120px;

  background: none;
  border: none;

  color: ${(props) => props.theme.colors.textPrimary};
  font-weight: 500;
  text-align: right;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    width: 100px;

    font-size: 12px;
  }

  &:focus {
    outline: none;
  }
`;

const ReceivingValue = styled.span`
  margin-left: auto;

  font-weight: 500;
  color: ${(props) => props.theme.colors.textPrimary};

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 12px;
  }
`;

const ExchangeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 50px;
  width: 100%;

  background: linear-gradient(90deg, #5ac790, #1c7e4c);
  border: none;
  border-radius: 6px;

  color: ${(props) => props.theme.colors.textPrimary};
  text-shadow: 0 6px 3px rgba(0, 0, 0, 0.03);
  font-weight: 600;

  cursor: pointer;
`;

const SellBtn = styled(ExchangeButton)`
  background: linear-gradient(90deg, #c75a5a, #7e1c1c);
`;

export default function Swap() {
  // const { swapDenom, swapBuyAmount, swapSellAmount } = useSwap();
  // const { setSwapBuyAmount, setSwapDenom } = useUpdateSwap();
  // const onTextChange = useCallback(
  //   (evt) => setSwapBuyAmount(evt.target.value),
  //   [setSwapBuyAmount]
  // );
  // const { bondContract, NOMcontract } = useChain();
  // const { setPendingTx } = useUpdateChain();

  // const submitTrans = useCallback(
  //   async (evt) => {
  //     if (evt) evt.preventDefault();
  //     if (!swapBuyAmount) return;
  //     try {
  //       if (swapDenom === "ETH") {
  //         try {
  //           const tx = await bondContract.buyNOM({
  //             value: parseEther(swapBuyAmount.toString()).toString(),
  //           });
  //           setPendingTx(tx);
  //           setSwapBuyAmount("");
  //         } catch (e) {
  //           // eslint-disable-next-line no-console
  //           console.error(e.stack || e);
  //           setSwapBuyAmount(swapBuyAmount);
  //         }
  //       } else {
  //         let tx = await NOMcontract.increaseAllowance(
  //           bondContract.address,
  //           parseEther(swapBuyAmount.toString())
  //         );
  //         setPendingTx(tx);
  //         tx = await bondContract.sellNOM(parseEther(swapBuyAmount.toString()));
  //         setPendingTx(tx);
  //         setSwapBuyAmount("");
  //       }
  //     } catch (e) {
  //       // eslint-disable-next-line no-console
  //       console.error(e.stack || e);
  //       setSwapBuyAmount(swapBuyAmount);
  //     }
  //   },
  //   [
  //     swapBuyAmount,
  //     swapDenom,
  //     bondContract,
  //     NOMcontract,
  //     setSwapBuyAmount,
  //     setPendingTx,
  //   ]
  // );

  // const [onSubmit, isWorking, error] = useAsyncFn(submitTrans);

  // const onTextAreaKeyDown = (e) => {
  //   if (e.keyCode === 13 && e.shiftKey === false) {
  //     e.preventDefault();
  //   }
  //   setSwapBuyAmount(e);
  // };

  return (
    <ExchangeWrapper>
      <PopupTriggers>
        <ExchangeButton>Buy NOM</ExchangeButton>
        <SellBtn>Sell NOM</SellBtn>
      </PopupTriggers>
      <ExchangeItem>
        <strong>Buy NOM</strong>
        <Sending>
          <strong>I'm sending</strong>
          <ExchangeInput type="text" value="0.15 ETH" />
          <MaxBtn>Max</MaxBtn>
        </Sending>
        <Receiving>
          <strong>I'm receiving</strong>
          <ReceivingValue>123 NOM</ReceivingValue>
        </Receiving>
        <div>
          <ExchangeButton>Buy NOM</ExchangeButton>
        </div>
      </ExchangeItem>

      <ExchangeItem>
        <strong>Sell NOM</strong>
        <Sending>
          <strong>I'm sending</strong>
          <ExchangeInput type="text" value="2529 NOM" />
          <MaxBtn>Max</MaxBtn>
        </Sending>
        <Receiving>
          <strong>I'm receiving</strong>
          <ReceivingValue>123 ETH</ReceivingValue>
        </Receiving>
        <div>
          <SellBtn>Sell NOM</SellBtn>
        </div>
      </ExchangeItem>
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
