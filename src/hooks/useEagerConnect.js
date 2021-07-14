import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { SUPPORTED_WALLETS } from '../connectors';

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);
  useEffect(() => {
    const connectorId = window.localStorage.getItem('connectorId');
    if (!connectorId) return;

    Object.values(SUPPORTED_WALLETS).forEach(sWallet => {
      if (sWallet.name === connectorId) {
        // This part of code never can be executed with SUPPORTED_WALLETS constants. Can it be deleted?
        if (sWallet.name === 'Injected') {
          if (typeof web3 !== 'undefined') {
            activate(sWallet.connector);
          } else {
            window.open('https://metamask.io/download.html');
          }
        } else {
          activate(sWallet.connector);
        }
      }
    });
    // injected.isAuthorized().then(isAuthorized => {
    //   if (isAuthorized) {
    //     activate(injected, undefined, true).catch(() => {
    //       setTried(true);
    //     });
    //   } else {
    //     setTried(true);
    //   }
    // });
  }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}
