import React, { useEffect, useState, createContext, useContext } from 'react'
import { BigNumber } from "@ethersproject/bignumber"
import { parseEther, formatEther } from '@ethersproject/units'

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
            switch (true) {
                case swapBuyAmount && parseFloat(swapBuyAmount) && parseFloat(swapBuyAmount).toString() === swapBuyAmount:
                    try {
                        setSwapBuyResult('Loading')
                        const amountNOM = await bondContract.buyQuoteETH(parseEther(swapBuyAmount))
                        const supplyTop = supplyNOM.add(amountNOM)
                    
                        setSwapBuyResult(amountNOM)
                        setSwapSupply([
                            parseFloat(formatEther(supplyNOM.toString())), 
                            parseFloat(formatEther(supplyTop.toString()))
                        ])
                    } catch (err) {
                        setSwapBuyAmount(parseFloat(formatEther(ETHbalance)))
                        setSwapSupply([
                            parseFloat(formatEther(supplyNOM.toString())), 
                            parseFloat(formatEther(supplyNOM.toString()))
                        ])
                    }
                    break;
                case swapSellAmount && parseFloat(swapSellAmount) && parseFloat(swapSellAmount).toString() === swapSellAmount.toString():
                    if (swapSellAmount <= supplyNOM) {
                        try {
                            setSwapSellResult('Loading')
                            const amountETH = await bondContract.sellQuoteNOM(parseEther(swapSellAmount));
                            const supplyBot = supplyNOM.sub(swapSellAmount)

                            setSwapSellResult(amountETH)
                            setSwapSupply([
                                parseFloat(formatEther(supplyBot.toString())), 
                                parseFloat(formatEther(supplyNOM.toString()))
                            ])
                        } catch (err) {
                            setSwapSellAmount(NOMbalance)
                            setSwapSupply([
                                parseFloat(formatEther(supplyNOM.toString())), 
                                parseFloat(formatEther(supplyNOM.toString()))
                            ])
                        }
                    } else {
                        setSwapSellAmount(NOMbalance)
                        setSwapSupply([
                            parseFloat(formatEther(supplyNOM.toString())), 
                            parseFloat(formatEther(supplyNOM.toString()))
                        ])
                    }
                    
                    break
                default:
                    {
                        setSwapBuyResult('')
                        setSwapBuyValue('')
                        setSwapSellResult('')
                        setSwapSellValue('')
                        setSwapSupply([
                            parseFloat(formatEther(supplyNOM.toString())), 
                            parseFloat(formatEther(supplyNOM.toString()))
                        ])
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