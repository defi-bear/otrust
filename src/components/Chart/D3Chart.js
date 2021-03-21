import React, { useState, useEffect } from "react";
import styled from 'styled-components';

import LineChart from "./D3LineChart";
import HistoricalChart from "./D3HistoricalChart";
import CandelChart from "./D3CandelChart";
import MenuButtons from '../MenuButtons';
import { ChartPanel } from "./Style";
import { useSwap } from 'context/SwapContext';
import { NOMsupplyETH, priceAtSupply, supplyAtPrice } from 'utils/bonding';
import Swap from 'components/Swap';

const ChartWrapper = styled.div`
    height: 100%;
    min-width: 30rem;
    max-width: 60%;
    flex-basis: auto; /* default value */
    flex-grow: 1;
    background-color: ${props => props.theme.colors.bgNormal};
`
const HeaderWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`

const BuySellWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
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


export default function D3Chart() {
    //buttons on the topLeft header
   const leftHeaderDefault = [
       {
            id: 'BondingCurve',
            text: 'Bonding Curve Chart',
            status: true,
        },{
            id: 'HistoricalChart',
            text: 'Historical Chart',
            status: false,
        },{
            id: 'CandelView',
            text:'Candel View',
            status: false
        }
    ] 

 
    const { swapSupply } = useSwap()
    
    const [data, setData] = useState(supplyToArray(0, 100000000))
    const [areaData, setAreaData] = useState(supplyToArray(0, 100000000))
    const [labelData, setLabelData] = useState('') 
    const [leftHeaderId, setLeftHeaderId] = useState('1')
    const [leftHeader, setLeftHeader] = useState(leftHeaderDefault)


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
    
   const handleLeftHeaderChange = (leftHeader, clickedLeftId) => {
        setLeftHeaderId(clickedLeftId)    
        setLeftHeader(leftHeader)
    }

  
    return (
        <ChartWrapper>
            <ChartPanel>
                <HeaderWrapper>
                    <MenuButtons onButtonChange={handleLeftHeaderChange} menuButtons={leftHeader} />  
                </HeaderWrapper>
               
                {leftHeader &&leftHeader[0]&& leftHeader[0].status && 
                <LineChart data={data} areaData={areaData} labelData={labelData}/>}

                {leftHeader && leftHeader[1]&& leftHeader[1].status && <HistoricalChart />}

                {leftHeader && leftHeader[1]&& leftHeader[2].status && 
                <CandelChart />}
            </ChartPanel>
            <BuySellWrapper>
                <Swap />  
                <Swap />
            </BuySellWrapper>
            
        </ChartWrapper>
    )
}