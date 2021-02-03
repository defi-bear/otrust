import React, { useEffect, useState, createContext, useContext } from 'react'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from "@walletconnect/web3-provider";
import Landing from '../pages/Landing'

export const Web3Context = createContext()
export const useWeb3 = () => useContext(Web3Context)

export const UpdateWeb3Context = createContext()
export const useUpdateWeb3 = () => useContext(UpdateWeb3Context)

export function Web3Provider({children}) {
    const [web3, updateWeb3] = useState()
    const [accounts, updateAccounts] = useState()
    const [networkId, updateNetworkId] = useState()

    const [web3Connected, updateWeb3Connected] = useState('')

    const providerOptions = {
        metamask: {
            id: 'injected',
            name: 'MetaMask',
            type: 'injected',
            check: 'isMetaMask'
        },
        walletconnect: {
            package: WalletConnectProvider, // required
            options: {
              infuraId: 'e2d976079ef24c0eb7e1f41098737e60' // required
            }
        }
    }

    const initWeb3 = async () => {
        try {

            const web3Modal = new Web3Modal({
                providerOptions
            })
    
            const provider = await web3Modal.connect()
            const newWeb3 = new Web3(provider)
            updateWeb3(newWeb3)
            updateAccounts(await Web3.eth.getAccounts())
            updateNetworkId(await Web3.eth.net.getId())
            updateWeb3Connected(true)
        } catch (error) {
            // Catch any errors for any of the above operations
            alert(
                'Failed to connect.'
            )
            console.error(error)
        }
    }

    useEffect(() => {
        initWeb3()
    },[])

    const contextValue = {  
        accounts,
        networkId,
        web3,
        web3Connected
    }

    const updateValue = {  
        updateWeb3, 
        updateWeb3Connected
    }

    return (
        <UpdateWeb3Context.Provider value= { updateValue }>
            <Web3Context.Provider value = { contextValue } >
                { web3Connected ? children : 
                <Landing initWeb3={initWeb3} /> }
            </Web3Context.Provider>
        </UpdateWeb3Context.Provider>
    )
}