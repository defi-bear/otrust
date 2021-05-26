import React, { useReducer, useEffect, createContext, useContext } from 'react'
import { useWeb3React } from "@web3-react/core"
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from '@apollo/client'
import { BondingCont, NOMCont, contAddrs } from 'context/chain/contracts'
import { BigNumber } from 'bignumber.js'


function reducer(state, action) {
    switch (action.type) {
        case 'blockNumber': return {
            blockNumber: action.value
        }
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
                    case 5:
                        switch (true) {
                            case (!state.blockNumber): update = {
                                blockNumber: action.value[i],
                                ...update
                            }
                            break
                            case (action.value[i].toString() === state.blockNumber.toString()) : break
                            default: update = {
                                blockNumber: (new BigNumber(action.value[i].toString())),
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

export const ChainContext = createContext()
export const useChain = () => useContext(ChainContext)

export const UpdateChainContext = createContext()
export const useUpdateChain = () => useContext(UpdateChainContext)

function ChainProvider({ theme, children }) {
    const initialState = { blockNumber: 0 }
    const { account, library } = useWeb3React()
    const bondContract = BondingCont(library)
    const NOMContract = NOMCont(library)

    const [state, dispatch] = useReducer(reducer, initialState)

    // const [blockNumber, setBlockNumber] = useState()
    
    if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
        throw new Error('REACT_APP_GRAPHQL_ENDPOINT environment variable not defined')
    }

    const client = new ApolloClient({
        uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
        cache: new InMemoryCache(),
    })

    useEffect(() => {
        // listen for changes on an Ethereum address
        library.on('block', async (number) => {
            console.log('update block...')
            
            await Promise.all(
                [
                        // Current ETH Price & Current NOM Price
                        bondContract.buyQuoteETH((10**18).toString()),
                        // NOM Allowance
                        NOMContract.allowance(account, contAddrs.BondingNOM),
                        // Strong Balance
                        library.getBalance(account),
                        // Supply NOM
                        bondContract.getSupplyNOM(),
                        // Weak Balance (May need to move these to Exchange)
                        NOMContract.balanceOf(account),
                        number
                        // UniSwap Pricing
                        // UniSwapCont.getReserves(),
                ]
            ).then((values) => {
                dispatch({type: 'updateAll', value: values})
            }).catch((err) => { 
                console.log(err)
            })
            dispatch({type: 'blockNumber', value: number})
            
        })
        // remove listener when the component is unmounted
        return () => {
          library.removeAllListeners('block')
        }
        // trigger the effect only on component mount
    })
    

    const contextValue = {
        account,
        library,
        ...state
    }

    return (
        <ApolloProvider client={client}>
            <UpdateChainContext.Provider value={dispatch}>
                <ChainContext.Provider value={contextValue} >
                    {children}
                </ChainContext.Provider>
            </UpdateChainContext.Provider>
        </ApolloProvider>
    )
}

export default ChainProvider
