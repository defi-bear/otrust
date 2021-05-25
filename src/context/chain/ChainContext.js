import React, { useReducer, useEffect, createContext, useContext, useCallback } from 'react'
import { useWeb3React } from "@web3-react/core"
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from '@apollo/client'

function reducer(state, action) {
    switch (action.type) {
        case 'blockNumber':
            return {blockNumber: action.blockNumber}
        default:
            throw new Error();
    }
}

export const ChainContext = createContext()
export const useChain = () => useContext(ChainContext)

export const UpdateChainContext = createContext()
export const useUpdateChain = () => useContext(UpdateChainContext)

function ChainProvider({ theme, children }) {
    const { account, library } = useWeb3React()
    const initialState = { blockNumber: 0 }

    const [state, dispatch] = useReducer(reducer, initialState)

    // const [blockNumber, setBlockNumber] = useState()
    
    if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
        throw new Error('REACT_APP_GRAPHQL_ENDPOINT environment variable not defined')
    }

    const client = new ApolloClient({
        uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
        cache: new InMemoryCache(),
    })

    const postBlockNumber = useCallback(
        (number) => { 
            if (number) {
                if (state.blockNumber === 0) {
                    dispatch({type: 'blockNumber', blockNumber: number})
                } else {
                    if (number.toString() !== state.blockNumber.toString()) {
                            dispatch({type: 'blockNumber', blockNumber: number})
                        } 
                    }
                }
        },[state, dispatch]
    )
    
    useEffect(() => {
            library.on('block', (number) => {
                postBlockNumber(number)
            })
            return () => {
                library.removeAllListeners('block')
            }
    },[library, postBlockNumber])

    const contextValue = {
        account,
        library,
        ...state
    }

    return (
        <ApolloProvider client={client}>
            <UpdateChainContext.Provider value={dispatch}>
                <ChainContext.Provider value={contextValue} >
                    {children}
                </ChainContext.Provider>
            </UpdateChainContext.Provider>
        </ApolloProvider>
    )
}

export default ChainProvider
