import React, { useEffect, useState, createContext, useContext } from 'react'
import { parseEther, formatEther } from "@ethersproject/units";

import { useChain } from 'context/chain/ChainContext'
import BigNumber from 'bignumber.js';

export const SwapContext = createContext()
export const useSwap = () => useContext(SwapContext)

export const UpdateSwapContext = createContext()
export const useUpdateSwap = () => useContext(UpdateSwapContext)

function SwapProvider({ children }) {
    const { bondContract } = useChain()
    const [swapBuyAmount, setSwapBuyAmount] = useState('')
    const [swapBuyResult, setSwapBuyResult] = useState('')
    const [swapDenom, setSwapDenom] = useState('ETH')
    const [swapSellAmount, setSwapSellAmount] = useState(0)
    const [swapSellResult, setSwapSellResult] = useState('')
    const [swapSupply, setSwapSupply] = useState([])
    const { supplyNOM, supplyNOMRaw } = useChain()


    const contextValue = {
        swapBuyAmount,
        swapBuyResult,
        swapDenom,
        swapSellAmount,
        swapSupply,
        swapSellResult
    }

    const updateValue = {
        setSwapBuyAmount,
        setSwapDenom,
        setSwapSellAmount,
        setSwapSupply
    }

    useEffect(() => {
        async function swapAmount() {
            switch (true) {
                case swapBuyAmount && parseFloat(swapBuyAmount) && parseFloat(swapBuyAmount).toString() === swapBuyAmount:
                    {
                        const buyAmountRaw = await bondContract.buyQuoteETH(parseEther(swapBuyAmount));
                        const supplyNOMFormatted = new BigNumber(formatEther(supplyNOMRaw))  
                        const buyAmount = new BigNumber(formatEther(buyAmountRaw))
                        const supplyTop = supplyNOMFormatted.plus(buyAmount)
                        // const supplyTop = formatEther(supplyTopRaw)
                        setSwapBuyResult(buyAmount.toFixed(5));
                        console.log("Supply NOM: ", supplyNOM)
                        // console.log("Supply Buy Raw: ", supplyTopRaw)
                        console.log("Buy Amount Formatted", buyAmount)
                        console.log("SupplyTop: ", supplyTop)
                        setSwapSupply([supplyNOM, supplyTop])
                    }
                    break
                case swapSellAmount && parseFloat(swapSellAmount) && parseFloat(swapSellAmount).toString() === swapSellAmount:
                    {
                        const sellAmount = await bondContract.sellQuoteNOM(parseEther(swapSellAmount));
                        const sellAmountFormatted = new BigNumber(formatEther(sellAmount)).toFixed(3)
                        setSwapSellResult(new BigNumber(formatEther(sellAmountFormatted)).toFixed(3));
                        setSwapSupply([supplyNOM - sellAmountFormatted, supplyNOM])
                    }
                    break
                default:
                    {
                        console.log("Defaulting")
                        setSwapBuyResult(0)
                        setSwapSellResult(0)
                        setSwapSupply([supplyNOM, supplyNOM])
                    }
            }
        }
        swapAmount()
        console.log("Updated Swaps")
    }, [bondContract, supplyNOM, supplyNOMRaw, swapBuyAmount, swapSellAmount])

    return (
        <UpdateSwapContext.Provider value={updateValue}>
            <SwapContext.Provider value={contextValue} >
                {children}
            </SwapContext.Provider>
        </UpdateSwapContext.Provider>
    )
}

export default SwapProvider