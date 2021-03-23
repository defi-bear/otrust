import styled from 'styled-components'
import SwapProvider from 'context/SwapContext'

// Components
import AcctDash from 'components/AcctDash'
import D3Chart from 'components/Chart/D3Chart'


const ContentWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    align-items: center;
    justify-content: center;
`
const LeftComponent = styled.div`
    display: grid;
    gap: 2rem;
`

export default function NOMTrust() {
    
    return (
        <ContentWrapper>
            <SwapProvider>
                <D3Chart />
                <LeftComponent>
                    <AcctDash />
                </LeftComponent>            
            </SwapProvider>
        </ContentWrapper>
    )
}