import React, { useEffect, useState, createContext, useContext } from 'react'
import { BigNumber } from "@ethersproject/bignumber"
import { parseEther } from '@ethersproject/units'

import { useChain } from 'context/chain/ChainContext'

export const SwapContext = createContext()
export const useSwap = () => useContext(SwapContext)

export const UpdateSwapContext = createContext()
export const useUpdateSwap = () => useContext(UpdateSwapContext)

function SwapProvider({ children }) {
    const { supplyNOM } = useChain()
    const { bondContract, ETHbalance, NOMbalance } = useChain()
    const [swapBuyAmount, setSwapBuyAmount] = useState('')
    const [swapBuyResult, setSwapBuyResult] = useState('')
    const [swapBuyValue, setSwapBuyValue] = useState('')
    const [swapDenom, setSwapDenom] = useState('ETH')
    const [swapSellAmount, setSwapSellAmount] = useState(BigNumber.from(0))
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
            console.log("Before: ", swapBuyValue)
            switch (true) {
                case swapBuyAmount && parseFloat(swapBuyAmount) && parseFloat(swapBuyAmount).toString() === swapBuyAmount:
                    try {
                        console.log("Try: ", swapBuyValue)
                        setSwapBuyResult('Loading')
                        const amountNOM = await bondContract.buyQuoteETH(parseEther(swapBuyAmount))
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
                            setSwapSellResult('Loading')
                            const amountETH = await bondContract.sellQuoteNOM(parseEther(swapSellAmount));
                            const supplyBot = supplyNOM.sub(swapSellAmount)

                            setSwapSellResult(amountETH)
                            setSwapSupply([supplyBot, supplyNOM])
                        } catch (err) {
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
                        setSwapBuyResult('')
                        setSwapBuyValue('')
                        setSwapSellResult('')
                        setSwapSellValue('')
                        setSwapSupply([supplyNOM, supplyNOM])
                    }
            }
        }  
        swapAmount()
    }, [
        bondContract, 
        ETHbalance, 
        NOMbalance,
        supplyNOM, 
        swapBuyAmount,
        swapBuyValue,
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