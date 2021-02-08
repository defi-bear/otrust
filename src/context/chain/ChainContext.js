import React, { useState, useEffect, createContext, useContext } from 'react'
import { useWeb3React } from "@web3-react/core"

export const ChainContext = createContext()
export const useChain = () => useContext(ChainContext)

export const UpdateChainContext = createContext()
export const useUpdateChain = () => useContext(UpdateChainContext)

const fetcher = (library) => (...args) => {
    const [method, ...params] = args
    return library[method](...params)
}

function ChainProvider ({children}) {
    const { account, library } = useWeb3React()
    const [blockNumber, setBlockNumber] = useState()
    const [ETHbalance, setETHBalance] = useState()

    const [currSupply, setCurrSupply] = useState(1000)

    useEffect(() => {
        // listen for changes on an Ethereum address
        library.on('block', (number) => {
            setBlockNumber(number)
            library
                .getBalance(account)
                .then((balance) => {
                    setETHBalance(balance)
                })
        })
        // remove listener when the component is unmounted
        return () => {
          library.removeAllListeners('block')
        }
        // trigger the effect only on component mount
    }, [])

    const contextValue = {
        blockNumber,
        currSupply
    }

    const updateValue = {
        setCurrSupply
    }

    return (
        <UpdateChainContext.Provider value = { updateValue }>
            <ChainContext.Provider value = { contextValue } >
                {children}
            </ChainContext.Provider>
        </UpdateChainContext.Provider>
    )
}

export default ChainProvider
