import React, { useReducer, useEffect, createContext, useContext, useCallback } from 'react'
// import { ApolloProvider } from '@apollo/client'

import { NOMCont, BondingCont } from './contracts'
import addrs from 'context/chain/NOMAddrs.json';
import { BigNumber } from 'bignumber.js';

import { useChain } from 'context/chain/ChainContext'

const initialState = {
    currentETHPrice: '',
    currentNOMPrice: '',
    NOMallowance: '',
    pending: false,
    strongBalance: '',
    supplyNOM: '',
    weakBalance: '',
}

function reducer(state, action) {
    switch (action.type) {
        case 'pending': return {
                block: action.value
            }
        case 'updateAll':
            var update
            for (let i = 0; i < action.value.length; i++) {
                switch (i) {
                    case 0:
                        const NOMprice = (new BigNumber('1')).div((state.currentNOMPrice))
                        switch (true) {
                            case (!state.currentETHPrice):
                                update = {
                                    currentETHPrice: new BigNumber(action.value[i].toString()),
                                    currentNOMPrice: NOMprice,
                                    ...update
                                }
                                break
                            case (action.value[i].toString() === state.currentETHPrice.toString()) &&
                                (NOMprice === state.currentNOMPrice): break
                            case (NOMprice === state.currentNOMPrice):
                                update = {
                                    currentETHPrice: new BigNumber(action.value[i].toString()),
                                    ...update
                                }
                                break
                            case (action.value[i].toString() === state.currentETHPrice.toString()):
                                update = {
                                    currentNOMPrice: NOMprice,
                                    ...update
                                }
                                break
                            default: {}
                        }
                        break
                    case 1:
                        switch (true) {
                            case (!state.NOMallowance): update = {
                                    NOMallowance: (new BigNumber(action.value[i].toString())),
                                    ...update
                                }
                                break

                            case (action.value[i].toString() === state.NOMallowance.toString()) : break
                            default: update = {
                                NOMallowance: (new BigNumber(action.value[i].toString())),
                                ...update
                            }
                        }
                        break
                    case 2:
                        switch (true) {
                            case (!state.strongBalance): update = {
                                strongBalance: (new BigNumber(action.value[i].toString())),
                                ...update
                            }
                            break

                            case (action.value[i].toString() === state.strongBalance.toString()) : break
                            default: update = {
                                strongBalance: (new BigNumber(action.value[i].toString())),
                                ...update
                            }
                        }
                        break
                    case 3:
                        switch (true) {
                            case (!state.supplyNOM): update = {
                                supplyNOM: (new BigNumber(action.value[i].toString())),
                                ...update
                            }
                            break

                            case (action.value[i].toString() === state.supplyNOM.toString()) : break
                            default: update = {
                                supplyNOM: (new BigNumber(action.value[i].toString())),
                                ...update
                            }
                        }
                        break
                    case 4:
                        switch (true) {
                            case (!state.weakBalance): update = {
                                weakBalance: (new BigNumber(action.value[i].toString())),
                                ...update
                            }
                            break
                            case (action.value[i].toString() === state.weakBalance.toString()) : break
                            default: update = {
                                weakBalance: (new BigNumber(action.value[i].toString())),
                                ...update
                            }
                        }
                        break
                    default:
                        throw new Error();
                }
                
            } 
            return {
                ...update
            }
        default:
            throw new Error();
    }
}

export const ContractContext = createContext()
export const useContract = () => useContext(ContractContext)

export const UpdateContractContext = createContext()
export const useUpdateContract = () => useContext(UpdateContractContext)

function ContractProvider({ theme, children }) {
    const {
        account,
    //    ETHUSD,
        blockNumber,
        library,
    } = useChain()

    const [state, dispatch] = useReducer(reducer, initialState)

    const bondContract = BondingCont(library)
    const NOMcontract = NOMCont(library)
    
    const getContractData = useCallback(
        async () => {
            var values = await Promise.all(
                [
                        // May need to move these
                        // Current ETH Price & Current NOM Price
                        bondContract.buyQuoteETH((10**18).toString()),
                        // NOM Allowance
                        NOMcontract.allowance(account, addrs.BondingNOM),
                        // Strong Balance
                        library.getBalance(account),
                        // Supply NOM
                        bondContract.getSupplyNOM(),
                        // Weak Balance (May need to move these to Exchange)
                        NOMcontract.balanceOf(account),
                        // UniSwap Pricing
                        // UniSwapCont.getReserves(),
                ]
            ).catch((err) => ( console.log(err)))
            console.log("Promise Pulled")
            return values
       },[account, bondContract, library, NOMcontract]
    )

    useEffect(() => {
        async function blocker() {
            if (state.pendingBlock === blockNumber) {
                return 
            } else {
                console.log("Blocknumber Contract State: ", blockNumber)
                console.log("Pending Block: ", state.pendingBlock)
                console.log("Pending: ", state.pending)
                // listen for changes on an Ethereum address
                try {
                    dispatch({type: 'pending', value: blockNumber})
                    await getContractData()
                        .then((values) => {
                            dispatch({type: 'updateAll', value: values})
                            dispatch({type: 'pending', value: ''})
                    }).catch((err) => { 
                        console.log(err)
                    })
                } catch (e) {
                    console.log(e)
                }
            }
        }
        blocker()
    },[
        blockNumber,
        state.pending,
        getContractData
    ])

    const contextValue = {
        ...state,
        theme
    }
    //    ETHUSD,
    

    const updateValue = {
        dispatch
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
