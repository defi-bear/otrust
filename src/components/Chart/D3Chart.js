import React, { useState } from "react";
import ZoomableLineChart from "./D3LineChart";
import { Panel } from "components/UI"
import styled from 'styled-components'
import {borderWidth, borderRadius} from 'context/responsive/cssSizes'

const ChartWrapper = styled.div`
    height: 100%;
    min-width: 30rem;
    max-width: 50rem;
    flex-basis: auto; /* default value */
    flex-grow: 1;
`

const a = 100000000

function SupplyToEth(supply) {
    return (supply/a)**2
}

function supplyToArray(supBegin, supEnd) {
    var dataArray = []
    const dif = supEnd - supBegin
    const n = 100
    for (var i = 0; i < n; i++) {
        dataArray.push(
            { 
                x: supBegin + dif*i/n,
                y: SupplyToEth(supBegin + dif*i/n)
            }
        );
    }
    return dataArray
}

const ChartHeader = styled.header`
  font-size: 1.4rem;
  color: #fff;
  margin-bottom: 1rem;
  height: 3rem;
  line-height: 3rem;
  background: ${props => props.theme.colors.headerBackground};
  text-align: center;
  vertical-align: middle;
  border-radius: ${borderRadius};
`

export default function D3Chart() {
    const [data, setData] = useState(
        supplyToArray(0, 100000000)
    )
    
    return (
        <ChartWrapper>
            <Panel>
                <ChartHeader>
                    Bonding Curve
                </ChartHeader>
                <ZoomableLineChart data={data} />
                <button
                    onClick={() => setData(supplyToArray(0, 10000000))}
                >
                    Zoom
                </button>
            </Panel>
        </ChartWrapper>
    )
}