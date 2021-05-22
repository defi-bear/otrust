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
    const [bidDenom, setBidDenom] = useState('strong')
    const [bidAmount, setBidAmount] = useState('')
    const [askAmount, setAskAmount] = useState('')
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    
    // This would be set by user, but for Bonding Curve is static
    // Strong (left): pair[0]
    // Weak (right): pair[1]
    const [pair, setPair] = useState(['ETH', 'wNOM'])
    

    useEffect(() => {
        async function exchAmount() {
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
                    
                } catch (err) {
                    console.log("Error: ", err)    
                }
            } else {
                setOutput("Invalid Input")
            }
        }              
        if (supplyNOM) {
            exchAmount()
        }
    }, [
        bidAmount,
        bidDenom, 
        supplyNOM,
    ])

    const contextValue = {
        bidAmount,
        askAmount,
        input,
        output,
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