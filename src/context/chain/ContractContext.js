import React, { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { ApolloProvider } from '@apollo/client'

import { NOMCont, BondingCont } from './contracts'
import addrs from 'context/chain/NOMAddrs.json';
import { BigNumber } from 'bignumber.js';

import { useChain } from 'context/chain/ChainContext'

export const ContractContext = createContext()
export const useContract = () => useContext(ContractContext)

export const UpdateContractContext = createContext()
export const useUpdateContract = () => useContext(UpdateContractContext)

function ContractProvider({ theme, children }) {
    const {
        account,
        blockNumber,
    //    ETHUSD,
        library,
    } = useChain()

    const [strongBalance, setStrongBalance] = useState(new BigNumber(0))
    const [weakBalance, setWeakBalance] = useState(new BigNumber(0))
    const [NOMallowance, setNOMAllowance] = useState(new BigNumber(0))
    const [supplyNOM, setSupplyNOM] = useState(new BigNumber(0))
    const [currentETHPrice, setCurrentETHPrice] = useState(new BigNumber(0))
    const [currentNOMPrice, setCurrentNOMPrice] = useState(new BigNumber(0))
    
    const bondContract = BondingCont(library)
    const NOMcontract = NOMCont(library)
    
    const getContractData = useCallback(
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
       },[account, bondContract, library, NOMcontract]
    )

    const updateContractData = useCallback((values) => {
            if(strongBalance.toString() !== values[0].toString()) {
                console.log("Old Strong Balance: ", strongBalance.toString())
                console.log("Set Strong Balance: ", values[0].toString())
                console.log("New Strong Balance: ", (new BigNumber(values[0].toString())).toString())
                setStrongBalance(new BigNumber(values[0].toString()))
            }
            
            if(weakBalance.toString() !== values[1].toString()) {
                setWeakBalance(new BigNumber(values[1].toString()))
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
    }, [
        currentETHPrice, 
        currentNOMPrice, 
        NOMallowance, 
        strongBalance, 
        supplyNOM, 
        weakBalance,
        setCurrentETHPrice, 
        setCurrentNOMPrice, 
        setNOMAllowance, 
        setStrongBalance, 
        setSupplyNOM, 
        setWeakBalance
    ])

    useEffect(() => {
        async function blocker() {
            console.log("Blocknumber: ", blockNumber)
            // listen for changes on an Ethereum address
            try {
                await getContractData()
                    .then((values) => {
                        updateContractData(values)
                }).catch((err) => { 
                    console.log(err)
                })
            } catch (e) {
                console.log(e)
            }
        }

        blocker()
    },[
        blockNumber
    ])

    const contextValue = {
        bondContract,
        currentETHPrice,
        currentNOMPrice,
    //    ETHUSD,
        NOMallowance,
        weakBalance,
        strongBalance,
        NOMcontract,
        supplyNOM,
        theme
    }

    const updateValue = {

    }

    return (
        <UpdateContractContext.Provider value={updateValue}>
            <ContractContext.Provider value={contextValue} >
                {children}
            </ContractContext.Provider>
        </UpdateContractContext.Provider>
    )
}

export default ContractProvider
