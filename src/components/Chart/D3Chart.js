import React, { useState } from "react";
import ZoomableLineChart from "./D3LineChart";
import { Panel } from "components/UI"
import styled from 'styled-components'

const a = 100000000

const ChartContainer = styled.div`
    width: 600px;
`

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
        <ChartContainer>
            <Panel>
                <ZoomableLineChart data={data} />
                <button
                    onClick={() => setData(supplyToArray(0, 10000000))}
                >
                    Zoom
                </button>
            </Panel>
        </ChartContainer>
    )
}