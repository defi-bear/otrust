import React, { useState, useEffect, createContext, useContext } from 'react'
import { useWeb3React } from "@web3-react/core"
import { NOMCont, BondingCont } from './contracts'

export const ChainContext = createContext()
export const useChain = () => useContext(ChainContext)

export const UpdateChainContext = createContext()
export const useUpdateChain = () => useContext(UpdateChainContext)

function ChainProvider ({children}) {
    const { account, library } = useWeb3React()
    const [blockNumber, setBlockNumber] = useState()
    const [ETHbalance, setETHBalance] = useState()
    const [NOMbalance, setNOMBalance] = useState()
    const [supplyNOM, setSupplyNOM] = useState()
    const bondContract = BondingCont(library)
    const NOMContract = NOMCont(library)
    const [currSupply, setCurrSupply] = useState(1000)

    useEffect(() => {
        // listen for changes on an Ethereum address
        library.on('block', (number) => {
            setBlockNumber(number)
            library
                .getBalance(account)
                .then((ETHbalance) => {
                    setETHBalance(ETHbalance)
                })
            NOMContract
                .balanceOf(account)
                .then((NOMbalance) => {
                    setNOMBalance(NOMbalance)
                })
            bondContract
                .getSupplyNOM()
                .then((supNOM) => {
                    setSupplyNOM(supNOM)
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
        currSupply,
        ETHbalance,
        NOMbalance,
        supplyNOM
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
