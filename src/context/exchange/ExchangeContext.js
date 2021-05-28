import React, { createContext, useContext, useReducer } from 'react'
import { exchStringReducer, exchBnReducer } from 'context/exchange/ExchangeReducer'

import { BigNumber } from 'bignumber.js'

export const ExchangeContext = createContext()
export const useExchange = () => useContext(ExchangeContext)

export const UpdateExchangeContext = createContext()
export const useUpdateExchange = () => useContext(UpdateExchangeContext)

function ExchangeProvider({ children }) {
    
    const [bnState, bnDispatch] = useReducer(
        exchBnReducer,
        {   
            askAmount: new BigNumber(0),
            bidAmount: new BigNumber(0),
            slippage: new BigNumber(0)}
        )

    const [strState, strDispatch] = useReducer(
        exchStringReducer,
        {   
            bidDenom: 'strong',
            input: '',
            output: '',
            strong: 'ETH',
            weak: 'wNOM'
        }
    )

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