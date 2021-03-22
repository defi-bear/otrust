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
import { SigningCosmosClient } from "@cosmjs/launchpad";

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
        activate,
        active,
        connector,
    } = useWeb3React()

    const initWeb3 = () => {
      activate(injectedConnector)
    }
    
    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = React.useState()
    
    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined)
        }
    }, [activatingConnector, connector])

    const connectKeplr = async () => {
      const chainId = "cosmoshub-3";
      if(window.keplr) {
        await window.keplr.enable(chainId);
        // const offlineSigner = window.getOfflineSigner(chainId);
        // const accounts = await offlineSigner.getAccounts();
      } else {
        alert('Install keplr chrome extension')
      }
    }

    const sendInKeplr = async (recipient, amount) => {
      // See above.
      const chainId = "cosmoshub-3";
      await window.keplr.enable(chainId);
      const offlineSigner = window.getOfflineSigner(chainId);

      const accounts = await offlineSigner.getAccounts();

      // Initialize the gaia api with the offline signer that is injected by Keplr extension.
      const cosmJS = new SigningCosmosClient(
          "https://node-cosmoshub-3.keplr.app/rest",
          accounts[0].address,
          offlineSigner
      );

      const result = await cosmJS.sendTokens(recipient, [{
          denom: "uatom",
          amount: amount.toString(),
      }]);

      console.log(result);

      if (result.code !== undefined &&
          result.code !== 0) {
          alert("Failed to send tx: " + result.log || result.rawLog);
      } else {
          alert("Succeed to send tx");
      }
    }

    // mount only once or face issues :P
    const triedEager = useEagerConnect()
    useInactiveListener(!triedEager || !!activatingConnector)

    return (
        <>
            { active ? children : <Landing initWeb3={initWeb3} connectKeplr={connectKeplr} /> }
        </>
    )
}