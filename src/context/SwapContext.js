import React, { useEffect, useState, createContext, useContext } from 'react'
import { parseEther, formatEther } from "@ethersproject/units";

import { useChain } from 'context/chain/ChainContext'


export const SwapContext = createContext()
export const useSwap = () => useContext(SwapContext)

export const UpdateSwapContext = createContext()
export const useUpdateSwap = () => useContext(UpdateSwapContext)

function SwapProvider({ children }) {
    const { supplyNOM, supplyNOMRaw } = useChain()
    const { bondContract } = useChain()
    const [swapBuyAmount, setSwapBuyAmount] = useState('')
    const [swapBuyResult, setSwapBuyResult] = useState('')
    const [swapDenom, setSwapDenom] = useState('ETH')
    const [swapSellAmount, setSwapSellAmount] = useState('')
    const [swapSellResult, setSwapSellResult] = useState('')
    const [swapSupply, setSwapSupply] = useState([supplyNOM, supplyNOM])
    
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
                        const buyAmountRaw = await bondContract.buyQuoteETH(parseEther(swapBuyAmount)) 
                        const buyAmount = parseFloat(formatEther(buyAmountRaw))
                        const supplyTop = supplyNOM + buyAmount
                        
                        setSwapBuyResult(buyAmount)

                        console.log("Supply NOM: ", supplyNOM)
                        console.log("Buy Amount: ", buyAmount)
                        console.log("SupplyTop: ", supplyTop)
                        setSwapSupply([supplyNOM, supplyTop])
                    }
                    break
                case swapSellAmount && parseFloat(swapSellAmount) && parseFloat(swapSellAmount).toString() === swapSellAmount:
                    {
                        const sellAmountRaw = await bondContract.sellQuoteNOM(parseEther(swapSellAmount));
                        const sellAmount = parseFloat(formatEther(sellAmountRaw))
                        const supplyBot = supplyNOM - sellAmount

                        setSwapSellResult(sellAmount)
                        
                        console.log("Supply NOM: ", supplyNOM)
                        console.log("Sell Amount: ", sellAmount)
                        console.log("SupplyBot: ", supplyBot)
                        setSwapSupply([supplyBot, supplyNOM])
                    }
                    break
                default:
                    {
                        console.log("Defaulting")
                        setSwapBuyResult('')
                        setSwapSellResult('')
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