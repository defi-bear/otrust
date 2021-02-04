import React, { useState } from "react";
import ZoomableLineChart from "./D3LineChart";
import { Panel } from "components/UI"
import styled from 'styled-components'

const ChartWrapper = styled.div`
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

export default function D3Chart() {
    const [data, setData] = useState(
        supplyToArray(0, 100000000)
    )
    
    return (
        <ChartWrapper>
            <Panel>
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