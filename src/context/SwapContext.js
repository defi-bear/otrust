import React, { useEffect, useState, createContext, useContext } from 'react'
import { BigNumber } from 'bignumber.js'
import { format18 } from 'utils/math'

import { useChain } from 'context/chain/ChainContext'

export const SwapContext = createContext()
export const useSwap = () => useContext(SwapContext)

export const UpdateSwapContext = createContext()
export const useUpdateSwap = () => useContext(UpdateSwapContext)

function SwapProvider({ children }) {
    const { supplyNOM } = useChain()
    const { bondContract } = useChain()

    const [swapBuyAmount, setSwapBuyAmount] = useState('')
    const [swapBuyResult, setSwapBuyResult] = useState('')
    const [swapBuyValue, setSwapBuyValue] = useState('')
    const [swapDenom, setSwapDenom] = useState('ETH')
    const [swapSellAmount, setSwapSellAmount] = useState(new BigNumber(0))
    const [swapSellResult, setSwapSellResult] = useState('')
    const [swapSellValue, setSwapSellValue] = useState('')
    
    const [swapSupply, setSwapSupply] = useState([supplyNOM, supplyNOM])
    
    const contextValue = {
        swapBuyAmount,
        swapBuyResult,
        swapBuyValue,
        swapDenom,
        swapSellAmount,
        swapSellResult,
        swapSellValue,
        swapSupply
    }

    const updateValue = {
        setSwapBuyAmount,
        setSwapBuyResult,
        setSwapBuyValue,
        setSwapDenom,
        setSwapSellAmount,
        setSwapSellResult,
        setSwapSellValue,
        setSwapSupply
    }

    useEffect(() => {
        async function swapAmount() {  
            if (BigNumber.isBigNumber(swapBuyAmount)) {
                try {
                    const amountNOM = await bondContract.buyQuoteETH(swapBuyAmount.toFixed(0))
                    const supplyTop = supplyNOM.plus(amountNOM)
            
                    setSwapBuyResult(new BigNumber(amountNOM.toString()))
                    setSwapSupply([
                        format18(supplyNOM).toNumber(), 
                        format18(supplyTop).toNumber()
                    ])
                } catch (err) {
                    console.log("Error: ", err)
                    setSwapSupply([
                        format18(supplyNOM).toNumber(), 
                        format18(supplyNOM).toNumber()
                    ])    
                }
            } else {
                setSwapSupply([
                    format18(supplyNOM).toNumber(), 
                    format18(supplyNOM).toNumber()
                ])
            }
        }              
        swapAmount()
    }, [
        bondContract, 
        supplyNOM, 
        swapBuyAmount
    ])
    
    useEffect(() => {
        async function swapAmount() {
            if (BigNumber.isBigNumber(swapSellAmount)) {
                if (swapSellAmount.lte(supplyNOM)) {
                    try {
                        const amountETH = await bondContract.sellQuoteNOM(swapSellAmount.toFixed(0));
                        const supplyBot = supplyNOM.minus(swapSellAmount)

                        setSwapSellResult(new BigNumber(amountETH.toString()))
                        setSwapSupply([
                            format18(supplyBot).toNumber(), 
                            format18(supplyNOM).toNumber()
                        ])
                    } catch (err) {
                        console.log("Error: ", err)
                        setSwapSupply([
                            format18(supplyNOM).toNumber(), 
                            format18(supplyNOM).toNumber()
                        ])
                    }
                } else {
                    setSwapSupply([
                        format18(supplyNOM).toNumber(), 
                        format18(supplyNOM).toNumber()
                    ])
                }
            }
        }
        swapAmount()
    },[
        bondContract, 
        supplyNOM, 
        swapSellAmount
    ])

    return (
        <UpdateSwapContext.Provider value={updateValue}>
            <SwapContext.Provider value={contextValue} >
                {children}
            </SwapContext.Provider>
        </UpdateSwapContext.Provider>
    )
}

export default SwapProvider