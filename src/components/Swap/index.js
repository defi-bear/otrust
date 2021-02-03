import React from 'react'
import styled from 'styled-components'
import { Panel } from 'components'

const SwapContainer = styled.div`
    width: 600px;
`

export default function Swap() {
    return (
        <SwapContainer>
            <Panel>
                Swap
            </Panel>
        </SwapContainer>
    )
}