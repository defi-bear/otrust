import React, { useState, createContext, useContext } from 'react'

export const ExchangeContext = createContext()
export const useExchange = () => useContext(ExchangeContext)

export const UpdateExchangeContext = createContext()
export const useUpdateExchange = () => useContext(UpdateExchangeContext)

function ExchangeProvider({ children }) {
    
    const [bnState, bnDispatch] = useReducer({
        bidAmount = new BigNumber(0),
        askAmount = new BigNumber(0),
        slippage = new BigNumber(0)
    })

    const [strState, strDispatch] = useReducer({
        input = '',
        output = '',
        strong = 'ETH',
        weak = 'wNOM'
    })

    const contextValue = {
        ...bnState,
        ...strState
    }

    const updateValue = {
        bnDispatch,
        strDispatch
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