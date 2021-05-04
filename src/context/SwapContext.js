import React, { useEffect, useState, createContext, useContext } from 'react'
import { parseEther, formatEther } from "@ethersproject/units";
import { chopFloat } from 'utils/math'

import { useChain } from 'context/chain/ChainContext'


export const SwapContext = createContext()
export const useSwap = () => useContext(SwapContext)

export const UpdateSwapContext = createContext()
export const useUpdateSwap = () => useContext(UpdateSwapContext)

function SwapProvider({ children }) {
    const { supplyNOM, supplyNOMRaw } = useChain()
    const { bondContract, ETHbalance, NOMbalance } = useChain()
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
        setSwapBuyResult,
        setSwapDenom,
        setSwapSellAmount,
        setSwapSellResult,
        setSwapSupply
    }

    useEffect(() => {
        async function swapAmount() {
            switch (true) {
                case swapBuyAmount && parseFloat(swapBuyAmount) && parseFloat(swapBuyAmount).toString() === swapBuyAmount:
                        
                    console.log("ETH", ETHbalance.toString())
                    console.log("SwapBuyamount: ", swapBuyAmount)
                    try {
                        const amountNOMRaw = await bondContract.buyQuoteETH(parseEther(swapBuyAmount))
                        const amountNOM = parseFloat(formatEther(amountNOMRaw))
                        const supplyTop = supplyNOM + amountNOM
                    
                        setSwapBuyResult(amountNOM)
                        setSwapSupply([supplyNOM, supplyTop])
                    } catch (err) {
                        setSwapBuyAmount(chopFloat(ETHbalance, 5))
                        setSwapSupply([supplyNOM, supplyNOM])
                    }
                            
                    break
                case swapSellAmount && parseFloat(swapSellAmount) && parseFloat(swapSellAmount).toString() === swapSellAmount:
                    
                    if (swapSellAmount <= supplyNOM) {
                        console.log("NOM", NOMbalance.toString())
                        console.log("Swapsellamount: ", swapSellAmount)
                        const amountETHRaw = await bondContract.sellQuoteNOM(parseEther(swapSellAmount));
                        const amountETH = parseFloat(formatEther(amountETHRaw))
                        const supplyBot = supplyNOM - swapSellAmount

                        setSwapSellResult(amountETH)
                        setSwapSupply([supplyBot, supplyNOM])
                    } else {
                        setSwapSellAmount(chopFloat(NOMbalance, 5))
                        setSwapSupply([supplyNOM, supplyNOM])
                    }
                    
                    break
                default:
                    {
                        setSwapBuyResult('')
                        setSwapSellResult('')
                        setSwapSupply([supplyNOM, supplyNOM])
                    }
            }
        }  
        swapAmount()
    }, [bondContract, ETHbalance, NOMbalance, supplyNOM, supplyNOMRaw, swapBuyAmount, swapSellAmount])

    return (
        <UpdateSwapContext.Provider value={updateValue}>
            <SwapContext.Provider value={contextValue} >
                {children}
            </SwapContext.Provider>
        </UpdateSwapContext.Provider>
    )
}

export default SwapProvider