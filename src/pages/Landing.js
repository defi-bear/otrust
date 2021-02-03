import React from 'react'
import styled from 'styled-components'
import logo from '../assets/logo.png'

const Wrapper = styled.div`
  text-align: center;
`

const StyledHeader = styled.header`
  background-color: #463d52;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`
export default function Landing({initWeb3}) {
    return (
      <Wrapper>
        <StyledHeader>
          <img src={logo} alt="logo" />
          <p>
            Welcome to Onomy!
            Please connect your wallet.
          </p>
          <button onClick={initWeb3}>Connect</button>
        </StyledHeader>
      </Wrapper>
    )
}