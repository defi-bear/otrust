import React, { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { useWeb3React } from "@web3-react/core"
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from '@apollo/client'

import { NOMCont, BondingCont } from './contracts'
import addrs from 'context/chain/NOMAddrs.json';
import { BigNumber } from 'bignumber.js';

export const ChainContext = createContext()
export const useChain = () => useContext(ChainContext)

export const UpdateChainContext = createContext()
export const useUpdateChain = () => useContext(UpdateChainContext)

function ChainProvider({ theme, children }) {
    const { account, library } = useWeb3React()
    const [blockNumber, setBlockNumber] = useState()
    const [ETHbalance, setETHBalance] = useState(new BigNumber(0))
    const [NOMbalance, setNOMBalance] = useState(new BigNumber(0))
    const [NOMallowance, setNOMAllowance] = useState(new BigNumber(0))
    const [supplyNOM, setSupplyNOM] = useState(new BigNumber(0))
    const [pendingTx, setPendingTx] = useState()
    const [currentETHPrice, setCurrentETHPrice] = useState(new BigNumber(0))
    const [currentNOMPrice, setCurrentNOMPrice] = useState(new BigNumber(0))

    const bondContract = BondingCont(library)
    const NOMcontract = NOMCont(library)
    
    if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
        throw new Error('REACT_APP_GRAPHQL_ENDPOINT environment variable not defined')
    }

    const client = new ApolloClient({
        uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
        cache: new InMemoryCache(),
    })

    const getChainData = useCallback(
        async () => {
            var values = await Promise.all(
                [
                        library.getBalance(account),
                        NOMcontract.balanceOf(account),
                        NOMcontract.allowance(account, addrs.BondingNOM),
                        bondContract.getSupplyNOM(),
                        bondContract.buyQuoteETH((10**18).toString()),
                        // UniSwapCont.getReserves(),
                ]
            ).catch((err) => ( console.log(err)))
            console.log("Pull promise")
            return values
       },[blockNumber, bondContract]
    )

    useEffect(() => {
        async function blocker() {
            // listen for changes on an Ethereum address
            library.on('block', async (number) => {
                setBlockNumber(number)
                console.log("Block Number: ", number)
                await getChainData()
                .then((values) => {
                    if(ETHbalance.toString() !== values[0].toString()) {
                        setETHBalance(new BigNumber(values[0].toString()))
                    }
                    
                    if(NOMbalance.toString() !== values[1].toString()) {
                        setNOMBalance(new BigNumber(values[1].toString()))
                    }

                    if(NOMallowance.toString() !== values[2].toString()) {
                        setNOMAllowance(new BigNumber(values[2].toString()))
                    }

                    if(supplyNOM.toString() !== values[3].toString()) {
                        setSupplyNOM(new BigNumber(values[3].toString()))
                    }

                    if(currentETHPrice.toString() !== values[4].toString()) {
                        setCurrentETHPrice(new BigNumber(values[4].toString()))
                    }
                    
                    if(currentNOMPrice.toString() !== 
                        (new BigNumber('1')).div(new BigNumber(values[4].toString()))) {
                            setCurrentNOMPrice(
                                (new BigNumber('1')).div(new BigNumber(values[4].toString()))
                            )
                    }

                    // setETHUSD(new BigNumber(values[6]))

                }).catch((err) => { console.log(err) })
            })

            // remove listener when the component is unmounted
            return () => {
                library.removeAllListeners('block')
            }
            // trigger the effect only on component mount
        }
        blocker()
    }, [library])

    const contextValue = {
        blockNumber,
        bondContract,
        currentETHPrice,
        currentNOMPrice,
        ETHbalance,
    //    ETHUSD,
        NOMallowance,
        NOMbalance,
        NOMcontract,
        supplyNOM,
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
