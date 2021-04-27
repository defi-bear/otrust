import React, { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { formatEther, parseEther } from '@ethersproject/units'
import { useWeb3React } from "@web3-react/core"
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from '@apollo/client'

import { NOMCont, BondingCont } from './contracts'
import BigNumber from 'bignumber.js';

export const ChainContext = createContext()
export const useChain = () => useContext(ChainContext)

export const UpdateChainContext = createContext()
export const useUpdateChain = () => useContext(UpdateChainContext)

function ChainProvider({ theme, children }) {
    const { account, active, library } = useWeb3React()
    const [blockNumber, setBlockNumber] = useState()
    const [ETHbalance, setETHBalance] = useState()
    const [NOMbalance, setNOMBalance] = useState()
    const [supplyNOM, setSupplyNOM] = useState()
    const bondContract = BondingCont(library)
    const NOMcontract = NOMCont(library)
    const [currSupply, setCurrSupply] = useState(1000)
    const [pendingTx, setPendingTx] = useState()
    // const [waitModal, setWaitModal] = useState(false)
    const [currentETHPrice, setCurrentETHPrice] = useState(new BigNumber(0))
    const [currentNOMPrice, setCurrentNOMPrice] = useState(new BigNumber(0))

    if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
        throw new Error('REACT_APP_GRAPHQL_ENDPOINT environment variable not defined')
    }

    const client = new ApolloClient({
        uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
        cache: new InMemoryCache(),
    })

    useEffect(() => {
        console.log("Account: ", account)
        console.log("Active: ", active)
        console.log("Library: ", library)
    }, [account, active, library])

    const getCurrentPrice = useCallback(async () => {
        let amount;
        amount = await bondContract.buyQuoteETH(parseEther('1'));
        setCurrentETHPrice(new BigNumber(formatEther(amount)).toFixed(5));
        amount = await bondContract.sellQuoteNOM(parseEther('1'));
        setCurrentNOMPrice(new BigNumber(formatEther(amount)).toFixed(5));
    },[bondContract])

    useEffect(() => {
        // listen for changes on an Ethereum address
        library.on('block', (number) => {
            setBlockNumber(number)
            getCurrentPrice();
            library
                .getBalance(account)
                .then((ETHbalance) => {
                    setETHBalance(ETHbalance)
                }).catch((err) => { })
            NOMcontract
                .balanceOf(account)
                .then((NOMbalance) => {
                    setNOMBalance(NOMbalance)
                }).catch((err) => { })
            bondContract
                .getSupplyNOM()
                .then((supNOM) => {
                    setSupplyNOM(formatEther(supNOM))
                }).catch((err) => { })
        })
        // remove listener when the component is unmounted
        return () => {
            library.removeAllListeners('block')
        }
        // trigger the effect only on component mount
    }, [NOMcontract, account, bondContract, library, getCurrentPrice])

    const contextValue = {
        blockNumber,
        bondContract,
        currSupply,
        ETHbalance,
        NOMbalance,
        NOMcontract,
        supplyNOM,
        theme,
        currentETHPrice,
        currentNOMPrice,
        pendingTx
    }

    const updateValue = {
        setCurrSupply,
        setPendingTx
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
