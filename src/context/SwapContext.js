import React, { useEffect, useState, createContext, useContext } from 'react'
import { BigNumber } from "@ethersproject/bignumber"

import { useChain } from 'context/chain/ChainContext'

export const SwapContext = createContext()
export const useSwap = () => useContext(SwapContext)

export const UpdateSwapContext = createContext()
export const useUpdateSwap = () => useContext(UpdateSwapContext)

function SwapProvider({ children }) {
    const { supplyNOM } = useChain()
    const { bondContract, ETHbalance, NOMbalance } = useChain()
    const [swapBuyAmount, setSwapBuyAmount] = useState(BigNumber.from(0))
    const [swapBuyResult, setSwapBuyResult] = useState(BigNumber.from(0))
    const [swapBuyValue, setSwapBuyValue] = useState(0)
    const [swapDenom, setSwapDenom] = useState('ETH')
    const [swapSellAmount, setSwapSellAmount] = useState(BigNumber.from(0))
    const [swapSellResult, setSwapSellResult] = useState(BigNumber.from(0))
    const [swapSellValue, setSwapSellValue] = useState(0)
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
            switch (true) {
                case swapBuyAmount && parseFloat(swapBuyAmount) && parseFloat(swapBuyAmount).toString() === swapBuyAmount.toString():
                    try {
                        const amountNOM = await bondContract.buyQuoteETH(swapBuyAmount)
                        const supplyTop = supplyNOM.add(amountNOM)
                    
                        setSwapBuyResult(amountNOM)
                        setSwapSupply([supplyNOM, supplyTop])
                    } catch (err) {
                        setSwapBuyAmount(ETHbalance)
                        setSwapSupply([supplyNOM, supplyNOM])
                    }
                    break;
                case swapSellAmount && parseFloat(swapSellAmount) && parseFloat(swapSellAmount).toString() === swapSellAmount.toString():
                    
                    if (swapSellAmount <= supplyNOM) {
                        try {
                            const amountETH = await bondContract.sellQuoteNOM(swapSellAmount);
                            const supplyBot = supplyNOM.sub(swapSellAmount)

                            setSwapSellResult(amountETH)
                            setSwapSupply([supplyBot, supplyNOM])
                        } catch {
                            setSwapSellAmount(NOMbalance)
                            setSwapSupply([supplyNOM, supplyNOM])
                        }
                    } else {
                        setSwapSellAmount(NOMbalance)
                        setSwapSupply([supplyNOM, supplyNOM])
                    }
                    
                    break
                default:
                    {
                        setSwapBuyResult(BigNumber.from(0))
                        setSwapSellResult(BigNumber.from(0))
                        setSwapSupply([supplyNOM, supplyNOM])
                    }
            }
        }  
        swapAmount()
    }, [bondContract, ETHbalance, NOMbalance, supplyNOM, swapBuyAmount, swapSellAmount])

    return (
        <UpdateSwapContext.Provider value={updateValue}>
            <SwapContext.Provider value={contextValue} >
                {children}
            </SwapContext.Provider>
        </UpdateSwapContext.Provider>
    )
}

export default SwapProvider