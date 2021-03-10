import React, { useEffect } from 'react'
import Landing from '../pages/Landing'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import Web3Modal from "web3modal";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";
import { PortisConnector } from '@web3-react/portis-connector'

import { useEagerConnect } from '../hooks/useEagerConnect'
import { useInactiveListener } from '../hooks/useInactiveListener'
import { Networks } from '../utils'

export const injectedConnector = new InjectedConnector({
    supportedChainIds: [
      Networks.MainNet, // Mainet
      Networks.Ropsten, // Ropsten
      Networks.Rinkeby, // Rinkeby
      Networks.Goerli, // Goerli
      Networks.Kovan, // Kovan
      Networks.Ganache // Ganache Testnet
    ],
})

export function AutoLogin({children}) {

    const {
        // activate,
        active,
        connector,
    } = useWeb3React()

    const subscribeProvider = async (web3, provider) => {
        if (!provider.on) {
          return;
        }
        provider.on("close", () => console.log());
        provider.on("accountsChanged", async (accounts) => {
            console.log('accounts changed', accounts)
        });
        provider.on("chainChanged", async (chainId) => {
          const networkId = await web3.eth.net.getId();
          console.log('network changed', networkId)
        });
    
        provider.on("networkChanged", async (networkId) => {
          const chainId = await web3.eth.chainId();
          console.log('chainId changed', chainId)
        });
      };

    const initWeb3 = async () => {
        // activate(injectedConnector)
        const providerOptions = {
            walletconnect: {
              package: WalletConnectProvider,
              options: {
                infuraId: process.env.REACT_APP_INFURA_ID
              }
            },
            torus: {
              package: Torus
            },
            fortmatic: {
              package: Fortmatic,
              options: {
                key: process.env.REACT_APP_FORTMATIC_KEY
              }
            },
            authereum: {
              package: Authereum
            },
            portis: {
                package: PortisConnector,
                options: {
                    key: process.env.REACT_APP_PORTIS_ID
                }
            }
        };

        const web3Modal = new Web3Modal({
            network: "mainnet", // optional
            cacheProvider: true, // optional
            providerOptions // required
        });
        
        const provider = await web3Modal.connect();
        
        const web3 = new Web3(provider);
        await subscribeProvider(web3, provider);

        const accounts = await web3.eth.getAccounts();

        const address = accounts[0];

        const networkId = await web3.eth.net.getId();
        console.log('address', address)
        console.log('networkId', networkId)
        // const chainId = await web3.eth.chainId();
    }
    
    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = React.useState()
    
    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined)
        }
    }, [activatingConnector, connector])

    // mount only once or face issues :P
    const triedEager = useEagerConnect()
    useInactiveListener(!triedEager || !!activatingConnector)

    return (
        <>
            { active ? children : <Landing initWeb3={initWeb3} /> }
        </>
    )
}