import React, { useState, createContext, useContext } from 'react'

export const ChainContext = createContext()
export const useChain = () => useContext(ChainContext)

export const UpdateChainContext = createContext()
export const useUpdateChain = () => useContext(UpdateChainContext)

function ChainProvider ({children}) {
    const [currSupply, setCurrSupply] = useState(1000000)

    const contextValue = {
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
