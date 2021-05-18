import React, { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { parseEther } from '@ethersproject/units'
import { useWeb3React } from "@web3-react/core"
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from '@apollo/client'

import { NOMCont, BondingCont } from './contracts'
import addrs from 'context/chain/NOMAddrs.json';
import { BigNumber } from '@ethersproject/bignumber';

export const ChainContext = createContext()
export const useChain = () => useContext(ChainContext)

export const UpdateChainContext = createContext()
export const useUpdateChain = () => useContext(UpdateChainContext)

function ChainProvider({ theme, children }) {
    const { account, library } = useWeb3React()
    const [blockNumber, setBlockNumber] = useState()
    const [ETHbalance, setETHBalance] = useState(BigNumber.from(0))
    const [NOMbalance, setNOMBalance] = useState(BigNumber.from(0))
    const [NOMallowance, setNOMAllowance] = useState(BigNumber.from(0))
    const [supplyNOM, setSupplyNOM] = useState(BigNumber.from(0))
    const [pendingTx, setPendingTx] = useState()
    const [currentETHPrice, setCurrentETHPrice] = useState(BigNumber.from(0))
    const [currentNOMPrice, setCurrentNOMPrice] = useState(BigNumber.from(0))

    const bondContract = BondingCont(library)
    const NOMcontract = NOMCont(library)
    
    if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
        throw new Error('REACT_APP_GRAPHQL_ENDPOINT environment variable not defined')
    }

    const client = new ApolloClient({
        uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
        cache: new InMemoryCache(),
    })

    const getCurrentPrice = useCallback(async () => {
        let amount;
        amount = await bondContract.buyQuoteETH(parseEther('1'));
        setCurrentETHPrice(amount);
        amount = await bondContract.sellQuoteNOM(parseEther('1'));
        setCurrentNOMPrice(amount);
    },[bondContract])

    useEffect(() => {
        async function blocker() {
            // listen for changes on an Ethereum address
            library.on('block', async (number) => {
                setBlockNumber(number)
                Promise.all(
                    [
                        library.getBalance(account),
                        NOMcontract.balanceOf(account),
                        NOMcontract.allowance(account, addrs.BondingNOM),
                        bondContract.getSupplyNOM(),
                        
                        // UniSwapCont.getReserves(),
                        getCurrentPrice()  
                    ]
                ).then((values) => {
                    setETHBalance(values[0])
                    setNOMBalance(values[1])
                    setNOMAllowance(values[2])
                    setSupplyNOM(values[3])
                    
                    // setETHUSD(values[4])
                }).catch((err) => { console.log(err) })
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
