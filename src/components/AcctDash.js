import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { formatEther } from '@ethersproject/units'
import styled from 'styled-components'
import { borderRadius } from 'context/responsive/cssSizes'

import { Panel } from 'components/UI'
import { useChain } from 'context/chain/ChainContext'

function ChainId() {
    const { chainId } = useWeb3React()
  
    return (
      <>
        <span>Chain Id</span>
        <span>{chainId ?? ''}</span>
      </>
    )
  }
  
function BlockNumber() {
  
  const { blockNumber } = useChain()

  return (
    <>
      <span>Block Number</span>
      <span>{blockNumber === null ? 'Error' : blockNumber ?? ''}</span>
    </>
  )
}

function Account() {
  const { account } = useWeb3React()

  return (
    <>
      <span>Account</span>
      <span>
        {account === null
          ? '-'
          : account
          ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
          : ''}
      </span>
    </>
  )
}

function Balance() {
  const { ETHbalance, NOMbalance } = useChain()

  return (
    <>
      <span>ETH Balance</span>
      <span>{ETHbalance === null ? 'Error' : ETHbalance ? `${formatEther(ETHbalance)}` : ''}</span>
      <span>NOM Balance</span>
      <span>{NOMbalance === null ? 'Error' : NOMbalance ? `${formatEther(NOMbalance)}` : ''}</span>
    </>
  )
}

const AcctHeader = styled.header`
  font-size: 1.4rem;
  color: #fff;
  margin-bottom: 1rem;
  height: 3rem;
  line-height: 3rem;
  background: ${props => props.theme.colors.headerBackground};
  text-align: center;
  vertical-align: middle;
  border-radius: ${borderRadius};
`

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export default function AcctDash() {
  const { active, error } = useWeb3React()

  return (
    <FlexWrapper>
      <Panel>
        <AcctHeader>
          Account
        </AcctHeader>
        <div
          style={{
            display: 'grid',
            gridGap: '1rem',
            gridTemplateColumns: '1fr 1fr',
            maxWidth: '20rem',
            lineHeight: '2rem',
            margin: 'auto'
          }}
        >
          <span>Connection</span> 
          <span>{active ? '🟢' : error ? '🔴' : '🟠'}</span>    
          <ChainId />
          <BlockNumber />
          <Account />
          <Balance />
        </div>
      </Panel>
      </FlexWrapper>
  )
}