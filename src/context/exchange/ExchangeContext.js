import React, { createContext, useContext, useReducer } from 'react'
import { exchStringReducer, exchObjReducer } from 'context/exchange/ExchangeReducer'

import { BigNumber } from 'bignumber.js'

export const ExchangeContext = createContext()
export const useExchange = () => useContext(ExchangeContext)

export const UpdateExchangeContext = createContext()
export const useUpdateExchange = () => useContext(UpdateExchangeContext)

function ExchangeProvider({ children }) {
    const [objState, objDispatch] = useReducer(
        exchObjReducer,
        {   
            askAmount: new BigNumber(0),
            bidAmount: new BigNumber(0),
            inputPending: false,
            pendingTx: null,
            slippage: new BigNumber(0),
            txPending: false
        }
    )

    const [strState, strDispatch] = useReducer(
        exchStringReducer,
        {   
            bidDenom: 'strong',
            input: '',
            output: '',
            status: '',
            strong: 'ETH',
            weak: 'wNOM'
        }
    )
    
    const contextValue = {
        ...objState,
        ...strState
    }

    const updateValue = {
        objDispatch,
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