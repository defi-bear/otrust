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

    useEffect(() => {
        async function swapAmount() {
            if (BigNumber.isBigNumber(swapBuyAmount) && swapDenom === 'ETH') {
                console.log("Buy NOM")
                try {
                    const amountNOM = await bondContract.buyQuoteETH(swapBuyAmount.toFixed(0))
                    
                    const supplyTop = supplyNOM.plus(new BigNumber(amountNOM.toString()))
                    
                    console.log("SupplyNOM: ", format18(supplyNOM).toString())
                    console.log("Supply Top: ",format18(supplyTop).toString())

                    setSwapBuyResult(new BigNumber(amountNOM.toString()))
                    setSwapSupply([
                        supplyNOM, 
                        supplyTop
                    ])
                } catch (err) {
                    console.log("Error: ", err)
                    setSwapSupply([
                        supplyNOM, 
                        supplyNOM
                    ])    
                }
            } else {
                setSwapSupply([
                    supplyNOM, 
                    supplyNOM
                ])
            }
        }              
        if (supplyNOM) {
            swapAmount()
        }
    }, [
        bondContract,
        swapDenom, 
        supplyNOM,
        swapBuyAmount
    ])
    
    useEffect(() => {
        async function swapAmount() {
            if (BigNumber.isBigNumber(swapSellAmount) && swapDenom === 'NOM') {
                console.log("Sell NOM")
                if (swapSellAmount.lte(supplyNOM)) {
                    try {
                        const amountETH = await bondContract.sellQuoteNOM(
                            swapSellAmount.toFixed(0)
                        )
                        const supplyBot = supplyNOM.minus(
                            new BigNumber(swapSellAmount.toString())
                        )
                        
                        console.log("Supply Bot: ",format18(supplyBot).toString())
                        console.log("Supply NOM: ", format18(supplyNOM).toString())

                        setSwapSellResult(new BigNumber(amountETH.toString()))
                        setSwapSupply([
                            supplyBot, 
                            supplyNOM
                        ])
                    } catch (err) {
                        console.log("Error: ", err)
                        setSwapSupply([
                            supplyNOM, 
                            supplyNOM
                        ])
                    }
                } else {
                    setSwapSupply([
                        supplyNOM, 
                        supplyNOM
                    ])
                }
            }
        }
        if(supplyNOM) {
            swapAmount()
        } 
    },[
        bondContract, 
        supplyNOM,
        swapDenom, 
        swapSellAmount
    ])

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

    return (
        <UpdateSwapContext.Provider value={updateValue}>
            <SwapContext.Provider value={contextValue} >
                {children}
            </SwapContext.Provider>
        </UpdateSwapContext.Provider>
    )
}

export default SwapProvider