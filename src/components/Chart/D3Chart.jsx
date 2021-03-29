import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { useQuery } from "@apollo/client";
import { gql } from "apollo-boost";

import { NOMsupplyETH, priceAtSupply, supplyAtPrice } from "utils/bonding";
import { useSwap } from "context/SwapContext";
import { ChainContext } from 'context/chain/ChainContext';
import {
  leftHeaderDefault,
  historicalHeaderDefault,
  candelHeaderDefault,
} from "./defaultChartData";

import { Panel } from "components/UI";
import Swap from "components/Swap";
import LineChart from "./D3LineChart";
import HistoricalChart from "./D3HistoricalChart";
import CandelChart from "./D3CandelChart";
import MenuButtons from '../MenuButtons';
import { ChartPanel } from "./Style";


const ContentLayout = styled.div`
  display: grid;
  grid-template-rows: 550px auto;
`;

const ChartWrapper = styled.div`
  padding: 20px;

  background-color: ${(props) => props.theme.colors.bgDarken};
  border-radius: 4px;
`;

const BuySellWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
`

const HeaderWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`


const ChartTypeBtn = styled.button`
  height: 50px;
  padding: 16px 24px;

  background-color: ${(props) => props.theme.colors.bgHighlightBorder};
  border-radius: 6px;
  border: none;

  color: ${(props) => props.theme.colors.textPrimary};
  font-size: 14px;

  cursor: pointer;

  & + & {
    margin-left: 1em;
  }
`;

function supplyToArray(supBegin, supEnd) {
  var dataArray = [];
  const dif = supEnd - supBegin;
  const n = 100;
  for (var i = 0; i < n; i++) {
    dataArray.push({
      x: supBegin + (dif * i) / n,
      y: priceAtSupply(supBegin + (dif * i) / n),
    });
  }

  return dataArray;
}

function labelArray(supBegin, supEnd) {
  const paymentETH = NOMsupplyETH(supEnd, supBegin);
  const priceAvg = paymentETH / (supEnd - supBegin);
  const supAvg = supplyAtPrice(priceAvg);
  return { paymentETH, supAvg, priceAvg };
}


const TRANSACTIONS_QUERY = gql`
    query transactions {
        transactionRecords {
            id
            senderAddress
            amountNOM
            amountETH
            price
            supply
            buyOrSell
            timestamp
        }
    }
`


export default function D3Chart(onButtonChange) {
 
  const [chartType, setChartType] = useState("bondingCurve");
  
  const { swapSupply } = useSwap();

  const [data, setData] = useState(supplyToArray(0, 100000000));
  const [areaData, setAreaData] = useState(supplyToArray(0, 100000000));
  const [labelData, setLabelData] = useState("");


  //menu header buttons
   // eslint-disable-next-line
   const [leftHeaderId, setLeftHeaderId] = useState('1')
   const [leftHeader, setLeftHeader] = useState(leftHeaderDefault)
 
   const [historicalHeaderId, setHistoricalHeaderId] = useState('1')
   const [historicalHeader, setHistoricalHeader] = useState(historicalHeaderDefault)
 
   const [candelHeaderId, setCandelHeaderId] = useState('1')
   const [candelHeader, setCandelHeader] = useState(candelHeaderDefault)

   //When clicking Header buttons
   const handleLeftHeaderChange = (leftHeader, clickedLeftId) => {
    setLeftHeaderId(clickedLeftId)
    setLeftHeader(leftHeader)
  }

  const handleHistoricalHeaderChange = (headerbuttons, clickedId) => {
    console.log('historical', clickedId, headerbuttons)
    setHistoricalHeaderId(clickedId)
    setHistoricalHeader(headerbuttons)
  }

  const handleCandelHeaderChange = (headerbuttons, clickedId) => {
    console.log('candel', clickedId, headerbuttons)
    setCandelHeaderId(clickedId)
    setCandelHeader(headerbuttons)
  }



  //BuySellComponents
  const [isBuyButton, setIsBuyButton] = useState(true)

   // useQuery Apollo Client Hook to get data from TheGraph
   const txQuery = useQuery(TRANSACTIONS_QUERY)

  useEffect(() => {
    if (swapSupply[1]) {
      var digitsUpper = Math.floor(Math.log10(swapSupply[1]));
      // upperBound = 10**(digitsUpper + 1)
      const upperBound =
        (Math.round(swapSupply[1] / 10 ** digitsUpper) + 1) * 10 ** digitsUpper;
      const lowerBound = 0;
      setData(supplyToArray(lowerBound, upperBound));
      setAreaData(supplyToArray(swapSupply[0], swapSupply[1]));
      setLabelData(labelArray(swapSupply[0], swapSupply[1]));
    }
  }, [swapSupply]);


  // Here is console.log of the historical tx data
  useEffect(() => {
    console.log("Data: ", txQuery.data)
  }, [txQuery.data])




  const renderChart = (type) => {
    switch (type) {
      case "historicalChart":
        return (
          <HistoricalChart
            historicalHeader={historicalHeader}
            historicalHeaderId={historicalHeaderId}
          />
        );
      case "candleView":
        return (
          <CandelChart
            candelHeader={candelHeader}
            candelHeaderId={candelHeaderId}
          />
        );
      case "bondingCurve":
      default:
        return (
          <LineChart data={data} areaData={areaData} labelData={labelData} />
        );
    }
  };
  const { theme } = useContext(ChainContext);
  //BuySellButtons 
  const btnBuyGradient = `linear-gradient(to right, ${theme.colors.btnBuyLight}, ${theme.colors.btnBuyNormal})`

  const btnSellGradient = `linear-gradient(to right, ${theme.colors.btnSellLight}, ${theme.colors.btnSellNormal})`

  const handleBtnClick = (value) => {
    value === 'ETH' ? setIsBuyButton(true) : setIsBuyButton(false)
  }

  return (
    <Panel>
      <ContentLayout>
      <ChartPanel>
        <HeaderWrapper>
          <MenuButtons onButtonChange={handleLeftHeaderChange} menuButtons={leftHeader} />

          {leftHeader[1] && leftHeader[1].status && <MenuButtons onButtonChange={handleHistoricalHeaderChange} menuButtons={historicalHeader} />}

          {leftHeader[2] && leftHeader[2].status && <MenuButtons onButtonChange={handleCandelHeaderChange} menuButtons={candelHeader} />}
        </HeaderWrapper>

        {leftHeader[0] && leftHeader[0].status &&
          <LineChart data={data} areaData={areaData} labelData={labelData} />}

        {leftHeader[1] && leftHeader[1].status && <HistoricalChart historicalHeader={historicalHeader} historicalHeaderId={historicalHeaderId} />}

        {leftHeader[2] && leftHeader[2].status &&
          <CandelChart candelHeader={candelHeader} candelHeaderId={candelHeaderId} />}
      </ChartPanel>
        <BuySellWrapper >
          <Swap colorGradient={btnBuyGradient} text='Buy NOM' isBuyButton={isBuyButton} onInputChange={handleBtnClick} />
          <Swap colorGradient={btnSellGradient} text='Sell NOM' isBuyButton={!isBuyButton} onInputChange={handleBtnClick} />
      </BuySellWrapper>
      </ContentLayout>
    </Panel>
  );
}
