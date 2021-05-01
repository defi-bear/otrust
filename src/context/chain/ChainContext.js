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
    const [supplyNOMRaw, setSupplyNOMRaw] = useState()
    const bondContract = BondingCont(library)
    const NOMcontract = NOMCont(library)
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
        async function blocker() {
            // listen for changes on an Ethereum address
            library.on('block', async (number) => {
                setBlockNumber(number)
                await getCurrentPrice();
                await library
                    .getBalance(account)
                    .then((ETHbalance) => {
                        setETHBalance(ETHbalance)
                    }).catch((err) => { })
                await NOMcontract
                    .balanceOf(account)
                    .then((NOMbalance) => {
                        setNOMBalance(NOMbalance)
                    }).catch((err) => { })
                await bondContract
                    .getSupplyNOM()
                    .then((supNOM) => {
                        setSupplyNOM(new BigNumber(formatEther(supNOM)).toFixed(5))
                        setSupplyNOMRaw(supNOM)
                    }).catch((err) => { })
            })
            // remove listener when the component is unmounted
            return () => {
                library.removeAllListeners('block')
            }
            // trigger the effect only on component mount
        }
        blocker()
    }, [NOMcontract, account, bondContract, library, getCurrentPrice])

    const contextValue = {
        blockNumber,
        bondContract,
        currentETHPrice,
        currentNOMPrice,
        ETHbalance,
        NOMbalance,
        NOMcontract,
        supplyNOM,
        supplyNOMRaw,
        theme,
        pendingTx
    }

    const updateValue = {
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
