import { useEffect, useState } from 'react';
import { useWeb3React } from "@web3-react/core"

import { useChain } from "context/chain/ChainContext";
import addrs from './chain/NOMAddrs.json';
import BigNumber from 'bignumber.js';

export const getAllowance = async (
  contract,
  account,
) => {
  try {
    const allowance = await contract.allowance(account, addrs.BondingNOM)
    return allowance
  } catch (e) {
    return '0'
  }
}

export const useAllowance = () => {
  const [allowance, setAllowance] = useState(new BigNumber(0));
  const { account } = useWeb3React()
  const { NOMcontract } = useChain();

  useEffect(() => {
    const fetchAllowance = async () => {
      const res = await getAllowance(NOMcontract, account)
      setAllowance(res)
    }

    if (account && NOMcontract) {
      fetchAllowance();
    }
    
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)

  }, [account, NOMcontract])
  
  return allowance
}