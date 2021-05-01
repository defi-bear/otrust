import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { responsive } from "theme/constants";

import LineChart from "components/Chart/D3LineChart";
import HistoricalChart from "components/Chart/D3HistoricalChart";
import CandelChart from "components/Chart/D3CandelChart";

// import { useQuery } from "@apollo/client";
// import { gql } from "apollo-boost";

import { useSwap } from "context/SwapContext";

import {
  historicalHeaderDefault,
  candelHeaderDefault,
} from "components/Chart/defaultChartData";

import { NOMsupplyETH, priceAtSupply, supplyAtPrice } from "utils/bonding";

const ChartWrapper = styled.div`
  padding: 20px;

  background-color: ${(props) => props.theme.colors.bgDarken};
  border-radius: 4px;
`;

const ChartHeader = styled.header`
  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: none;
  }
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

  @media screen and (max-width: ${responsive.laptop}) {
    height: 44px;
    padding: 12px 20px;
  }

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

export default function Chart() {
    const [chartType, setChartType] = useState("bondingCurve");

    const [historicalHeaderId] = useState("1");
    const [historicalHeader] = useState(historicalHeaderDefault);

    const [candelHeaderId] = useState("1");
    const [candelHeader] = useState(candelHeaderDefault);

    const [data, setData] = useState(supplyToArray(0, 100000000))
    const [areaData, setAreaData] = useState(supplyToArray(0, 100000000))

    const [labelData, setLabelData] = useState('') 

    const { swapSupply } = useSwap();

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

    return (
        <ChartWrapper>
          <ChartHeader>
            <ChartTypeBtn onClick={() => setChartType("bondingCurve")}>
              Bonding Curve Chart
            </ChartTypeBtn>
            <ChartTypeBtn onClick={() => setChartType("historicalChart")}>
              Historical Chart
            </ChartTypeBtn>
            <ChartTypeBtn onClick={() => setChartType("candleView")}>
              Candle View
            </ChartTypeBtn>
          </ChartHeader>
          {renderChart(chartType)}
        </ChartWrapper>
    )
}