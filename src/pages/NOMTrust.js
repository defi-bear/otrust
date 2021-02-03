import styled from 'styled-components'

import AcctDash from 'components/AcctDash'
import D3Chart from 'components/Chart/D3Chart'
import Swap from 'components/Swap'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    gap: 12px;
    padding: 12px;
`

export default function NOMTrust() {
    return (
        <Wrapper>
            <AcctDash />
            <D3Chart />
            <Swap />
        </Wrapper>  
    )
}