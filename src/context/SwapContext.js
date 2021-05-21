import React, { useCallback, useEffect, useState, createContext, useContext } from 'react'
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

    const [swapBuyAmount, setSwapBuyAmount] = useState(new BigNumber(0))
    const [swapBuyResult, setSwapBuyResult] = useState('')
    const [swapBuyValue, setSwapBuyValue] = useState('')
    const [swapDenom, setSwapDenom] = useState('ETH')
    const [swapSellAmount, setSwapSellAmount] = useState('')
    const [swapSellResult, setSwapSellResult] = useState('')
    const [swapSellValue, setSwapSellValue] = useState('')
    
    const [swapSupply, setSwapSupply] = useState([supplyNOM, supplyNOM])

    useEffect(() => {
        
        console.log("Swap Denom: ", swapDenom)
        console.log("Supply NOM: ", supplyNOM)
        console.log("Swap Buy Amount: ", swapBuyAmount.toString())

        async function swapAmount() {
            if (supplyNOM && BigNumber.isBigNumber(swapBuyAmount) && swapDenom === 'ETH') {
                try {
                    const amountNOM = await bondContract.buyQuoteETH(swapBuyAmount.toString())
                    console.log("Swap Buy Amount: ", amountNOM.toString())
                    console.log("Amount NOM: ", format18(new BigNumber(amountNOM.toString())).toFixed(4))
                    const supplyTop = supplyNOM.plus(new BigNumber(amountNOM.toString()))
                    
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
            }
        }              
        if (supplyNOM) {
            swapAmount()
        }
        console.log("Swap Supply 0: ", format18(swapSupply[0]).toFixed(5))
        console.log("Swap Supply 1: ", format18(swapSupply[1]).toFixed(5))
    }, [
        swapDenom, 
        supplyNOM,
        swapBuyAmount
    ])
    
    useEffect(() => {
        async function swapAmount() {
            if (BigNumber.isBigNumber(swapSellAmount) && swapDenom === 'NOM') {
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