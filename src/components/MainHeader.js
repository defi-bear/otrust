import React from 'react'
import styled from 'styled-components'

import { Container } from 'components/UI'
import { headerFill, header } from 'context/responsive/cssSizes'
import logo from 'assets/logo.png'

const Sticker = styled.header`
    position: sticky;
    top: 0;
    z-index: 10;
`
const HeaderWrapper = styled.div`
    width: 100%;
    background-color: ${props => props.theme.colors.headerBackground};
    border-bottom: .1rem solid ${props => props.theme.colors.border};
`
const Filler = styled.div`
    height: ${p => p.height};
    width: 100%;
    z-index: 10;
    
`
const StyledHeader = styled.div`
    height: ${p => p.height};
    text-align: center;
`

export default function MainHeader() {
    return (
        <Sticker>
            <HeaderWrapper>
                <Container>
                    <StyledHeader height={header}>
                    <img src={logo} alt="logo" />
                    </StyledHeader>
                </Container>
            </HeaderWrapper>
            <Filler height={headerFill}/>
        </Sticker>
    )
}