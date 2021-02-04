import styled from 'styled-components'

// Theme and helpers
import { device } from 'utils/device'
import { borderRadius, gap } from 'context/responsive/cssSizes'

// Components
import AcctDash from 'components/AcctDash'
import D3Chart from 'components/Chart/D3Chart'

import Swap from 'components/Swap'

const ContentWrapper = styled.div`
  display: grid;

  gap: ${gap};

  @media ${device.laptop} {
    grid-template-columns: 3fr 9fr;
  }

  @media ${device.desktopS} {
    grid-template-columns: 2fr 7fr 3fr;
  }
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