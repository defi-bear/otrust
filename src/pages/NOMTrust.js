import styled from 'styled-components'

// Theme and helpers
import { device } from 'utils/device'
import { borderRadius, gap } from 'context/responsive/cssSizes'

// Components
import AcctDash from 'components/AcctDash'
import D3Chart from 'components/Chart/D3Chart'

import Swap from 'components/Swap'

const ContentWrapper = styled.div`
  display: fles;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
  justify-content: center;
`

export default function NOMTrust() {
    return (
        <ContentWrapper>
            <AcctDash />
            <D3Chart />
            <Swap />
        </ContentWrapper>
    )
}