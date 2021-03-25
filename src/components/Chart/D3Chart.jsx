import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import { useQuery } from "@apollo/client";
// import { gql } from "apollo-boost";

import { NOMsupplyETH, priceAtSupply, supplyAtPrice } from "utils/bonding";
import { useSwap } from "context/SwapContext";
import {
  historicalHeaderDefault,
  candelHeaderDefault,
} from "./defaultChartData";

import { Panel } from "components/UI";
import Swap from "components/Swap";
import LineChart from "./D3LineChart";
import HistoricalChart from "./D3HistoricalChart";
import CandelChart from "./D3CandelChart";

const ContentLayout = styled.div`
  display: grid;
  grid-template-rows: 550px auto;
`;

const ChartWrapper = styled.div`
  padding: 20px;

  background-color: ${(props) => props.theme.colors.bgDarken};
  border-radius: 4px;
`;

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

export default function D3Chart() {
  const [chartType, setChartType] = useState("bondingCurve");
  const { swapSupply } = useSwap();

  const [data, setData] = useState(supplyToArray(0, 100000000));
  const [areaData, setAreaData] = useState(supplyToArray(0, 100000000));
  const [labelData, setLabelData] = useState("");

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

  const [historicalHeaderId] = useState("1");
  const [historicalHeader] = useState(historicalHeaderDefault);

  const [candelHeaderId] = useState("1");
  const [candelHeader] = useState(candelHeaderDefault);
  // const [historicalHeaderId, setHistoricalHeaderId] = useState("1");
  // const [historicalHeader, setHistoricalHeader] = useState(
  //   historicalHeaderDefault
  // );

  // const [candelHeaderId, setCandelHeaderId] = useState("1");
  // const [candelHeader, setCandelHeader] = useState(candelHeaderDefault);

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

  return (
    <Panel>
      <ContentLayout>
        <ChartWrapper>
          <header>
            <ChartTypeBtn onClick={() => setChartType("bondingCurve")}>
              Bonding Curve Chart
            </ChartTypeBtn>
            <ChartTypeBtn onClick={() => setChartType("historicalChart")}>
              Historical Chart
            </ChartTypeBtn>
            <ChartTypeBtn onClick={() => setChartType("candleView")}>
              Candle View
            </ChartTypeBtn>
          </header>
          {renderChart(chartType)}
        </ChartWrapper>
        <Swap />
      </ContentLayout>
    </Panel>
  );
}
