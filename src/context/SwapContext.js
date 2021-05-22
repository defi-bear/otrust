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
    const [bidAmount, setBidAmount] = useState('')
    const [askAmount, setAskAmount] = useState('')
    const [input, setInput] = useState('')
    const [display, setDisplay] = useState('')
    const [bidDenom, setBidDenom] = useState('ETH')
    
    // Weaker (left): pair[0]
    // Stronger (right): pair[1]
    // const [pair, setPair] = useState(['NOM', 'ETH'])
    const [swapSupply, setSwapSupply] = useState([supplyNOM, supplyNOM])

    useEffect(() => {
        async function swapAmount() {
            if (supplyNOM && BigNumber.isBigNumber(bidAmount) {
                try {
                    var askAmountUpdate
                    var supplyBot = supplyNOM
                    var supplyTop = supplyNOM

                    switch (bidDenom) {
                        case 'strong':
                            {
                                askAmountUpdate = await bondContract.buyQuoteETH(
                                    bidAmount.toFixed(0)
                                )
                                supplyTop = supplyNOM.plus(
                                    new BigNumber(askAmountUpdate.toString())
                                )
                            }
                        case 'weak':
                            {
                                askAmountUpdate = await bondContract.sellQuoteNOM(
                                    bidAmount.toFixed(0)
                                )
                                supplyBot = supplyNOM.minus(
                                    new BigNumber(bidAmount.toString())
                                )
                            }
                        default:
                            {
                                error("denom not set")
                            }
                    }
                        
                    setAskAmount(new BigNumber(askAmountUpdate.toString()))
                    setSwapSupply([
                        supplyBot, 
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
                setDisplay("Invalid Input")
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