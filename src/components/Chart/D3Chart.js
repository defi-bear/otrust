import React, { useState, useEffect } from "react";
import LineChart from "./D3LineChart";
import { ChartPanel } from "./Style"
import styled from 'styled-components'
import { borderRadius } from 'context/responsive/cssSizes'
import { useSwap } from 'context/SwapContext'
import { NOMsupplyETH, priceAtSupply, supplyAtPrice } from 'utils/bonding'
import Swap from 'components/Swap'

const ChartWrapper = styled.div`
    height: 100%;
    min-width: 30rem;
    max-width: 63%;
    flex-basis: auto; /* default value */
    flex-grow: 1;
    background-color: ${props => props.theme.colors.bgNormal};
`

function supplyToArray(supBegin, supEnd) {
    var dataArray = []
    const dif = supEnd - supBegin
    const n = 100
    for (var i = 0; i < n; i++) {
        dataArray.push(
            { 
                x: supBegin + dif*i/n,
                y: priceAtSupply(supBegin + dif*i/n)
            }
        );
    }

    return dataArray
}

function labelArray(supBegin, supEnd) {
    const paymentETH = NOMsupplyETH(supEnd, supBegin)
    const priceAvg = paymentETH/(supEnd - supBegin)
    const supAvg = supplyAtPrice(priceAvg)
    return { paymentETH, supAvg, priceAvg }
}

//according each box's size on design 194/1167 = 17%

const HeaderWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.01rem;
    align-items: center;
    justify-content: left;
`
const BuySellWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
`
const adjustedRadius = `${parseFloat(borderRadius.slice(0,-3))/2}rem`;

const ChartHeader = styled.header`
  font-size: 0.75rem;
  color: ${props => props.isClicked ? props.theme.colors.textPrimary : props.theme.colors.textSecondary} ;
  height: 2.2rem;
  line-height: 2.2rem;
  background: ${props => props.isClicked? props.theme.colors.bgHighlight : props.theme.colors.bgDarken};
  text-align: center;
  vertical-align: middle;
  border-radius: ${adjustedRadius};
  width: 17%
`

export default function D3Chart() {
    const { swapSupply } = useSwap()
    
    const [data, setData] = useState(supplyToArray(0, 100000000))
    const [areaData, setAreaData] = useState(supplyToArray(0, 100000000))
    const [labelData, setLabelData] = useState('')

    useEffect(() => {
        if (swapSupply[1]) {
            var digitsUpper = Math.floor(Math.log10(swapSupply[1]))
            // upperBound = 10**(digitsUpper + 1)
            const upperBound = (Math.round(swapSupply[1]/10**digitsUpper) + 1)*10**digitsUpper
            const lowerBound = 0
            setData(
                supplyToArray(
                    lowerBound, 
                    upperBound
                )
            )
            setAreaData(supplyToArray(swapSupply[0], swapSupply[1]))
            setLabelData(labelArray(swapSupply[0], swapSupply[1]))
        }
    },[swapSupply])
    
    
    
    return (
        <ChartWrapper>
            <ChartPanel>
                <HeaderWrapper>
                    <ChartHeader isClicked={true}>
                        Bonding Curve Chart
                    </ChartHeader>
                    <ChartHeader isClicked={false}>
                        Historical Chart
                    </ChartHeader>
                </HeaderWrapper>               
                <LineChart data={data} areaData={areaData} labelData={labelData}/>
            </ChartPanel>
            <BuySellWrapper>
                <Swap />  
                <Swap />
            </BuySellWrapper>
            
        </ChartWrapper>
    )
}