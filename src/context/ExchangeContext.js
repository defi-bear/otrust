import React, { useState, createContext, useContext } from 'react'

export const ExchangeContext = createContext()
export const useExchange = () => useContext(ExchangeContext)

export const UpdateExchangeContext = createContext()
export const useUpdateExchange = () => useContext(UpdateExchangeContext)

function ExchangeProvider({ children }) {

    const [bidDenom, setBidDenom] = useState('strong')
    const [bidAmount, setBidAmount] = useState('')
    const [askAmount, setAskAmount] = useState('')
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [slippage, setSlippage] = useState(1);
    
    // This would be set by user, but for Bonding Curve is static
    // Strong (left): pair[0]
    // Weak (right): pair[1]
    const [pair, setPair] = useState(['ETH', 'wNOM'])

    const contextValue = {
        bidAmount,
        askAmount,
        input,
        output,
        bidDenom,
        pair,
        slippage
    }

    const updateValue = {
        setBidAmount,
        setAskAmount,
        setInput,
        setOutput,
        setBidDenom,
        setPair,
        setSlippage
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