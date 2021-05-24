import React, { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { useWeb3React } from "@web3-react/core"
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from '@apollo/client'

export const ChainContext = createContext()
export const useChain = () => useContext(ChainContext)

export const UpdateChainContext = createContext()
export const useUpdateChain = () => useContext(UpdateChainContext)

function ChainProvider({ theme, children }) {
    const { account, library } = useWeb3React()
    const [blockNumber, setBlockNumber] = useState()
    
    if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
        throw new Error('REACT_APP_GRAPHQL_ENDPOINT environment variable not defined')
    }

    const client = new ApolloClient({
        uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
        cache: new InMemoryCache(),
    })

    const postBlockNumber = useCallback(
        (number) => {
            if (blockNumber) {
                if (number.toString() !== blockNumber.toString()) {
                    setBlockNumber(number)
                } 
            } else {
                setBlockNumber(number) 
            }
        },
    [blockNumber, setBlockNumber, library])
    
    useEffect(() => {
            library.on('block', (number) => {
                if (number !== blockNumber)
                postBlockNumber(number)
            })

            return () => {
                library.removeAllListeners('block')
            }
    },[library, postBlockNumber])
    

    const contextValue = {
        account,
        blockNumber,
    //    ETHUSD,
        library,
        theme
    }

    const updateValue = {
        
    }

    return (
        <ApolloProvider client={client}>
            <UpdateChainContext.Provider value={updateValue}>
                <ChainContext.Provider value={contextValue} >
                    {children}
                </ChainContext.Provider>
            </UpdateChainContext.Provider>
        </ApolloProvider>
    )
}

export default ChainProvider
