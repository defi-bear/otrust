import React, { useEffect, useState, createContext, useContext } from 'react'
import { BigNumber } from 'bignumber.js'
import { format18 } from 'utils/math'

import { useChain } from 'context/chain/ChainContext'

export const ExchangeContext = createContext()
export const useExchange = () => useContext(ExchangeContext)

export const UpdateExchangeContext = createContext()
export const useUpdateExchange = () => useContext(UpdateExchangeContext)

function ExchangeProvider({ children }) {
    const { supplyNOM } = useChain()
    const { bondContract } = useChain()
    const [bidDenom, setBidDenom] = useState('ETH')
    const [bidAmount, setBidAmount] = useState('')
    const [askAmount, setAskAmount] = useState('')
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    
    
    // Strong (left): pair[0]
    // Weak (right): pair[1]
    const [pair, setPair] = useState(['ETH', 'NOM'])
    

    useEffect(() => {
        async function swapAmount() {
            if (supplyNOM && BigNumber.isBigNumber(bidAmount)) {
                try {
                    var askAmountUpdate
                    switch (bidDenom) {
                        case 'strong':
                            {
                                askAmountUpdate = await bondContract.buyQuoteETH(
                                    bidAmount.toFixed(0)
                                )
                                
                            }
                        case 'weak':
                            {
                                askAmountUpdate = await bondContract.sellQuoteNOM(
                                    bidAmount.toFixed(0)
                                )
                                
                            }
                        default:
                            {
                                error("denom not set")
                            }
                    }
                        
                    setAskAmount(new BigNumber(askAmountUpdate.toString()))
                    setExchangeSupply([
                        supplyBot, 
                        supplyTop
                    ])
                } catch (err) {
                    console.log("Error: ", err)
                    setExchangeSupply([
                        supplyNOM, 
                        supplyNOM
                    ])    
                }
            } else {
                setOutput("Invalid Input")
            }
        }              
        if (supplyNOM) {
            swapAmount()
        }
        console.log("Exchange Supply 0: ", format18(swapSupply[0]).toFixed(5))
        console.log("Exchange Supply 1: ", format18(swapSupply[1]).toFixed(5))
    }, [
        bidAmount,
        bidDenom, 
        supplyNOM,
    ])
    
    useEffect(() => {
        async function swapAmount() {
            if (BigNumber.isBigNumber(swapSellAmount) && swapDenom === 'NOM') {
                if (swapSellAmount.lte(supplyNOM)) {
                    try {
                        
                        
                        console.log("Supply Bot: ",format18(supplyBot).toString())
                        console.log("Supply NOM: ", format18(supplyNOM).toString())

                        setExchangeSellResult(new BigNumber(amountETH.toString()))
                        setExchangeSupply([
                            supplyBot, 
                            supplyNOM
                        ])
                    } catch (err) {
                        console.log("Error: ", err)
                        setExchangeSupply([
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
        bidAmount,
        askAmount,
        input,
        display,
        bidDenom,
        pair
    }

    const updateValue = {
        setBidAmount,
        setAskAmount,
        setInput,
        setDisplay,
        setBidDenom,
        setPair
    }

    return (
        <UpdateExchangeContext.Provider value={updateValue}>
            <ExchangeContext.Provider value={contextValue} >
                {children}
            </ExchangeContext.Provider>
        </UpdateExchangeContext.Provider>
    )
}

export default ExchangeProvider