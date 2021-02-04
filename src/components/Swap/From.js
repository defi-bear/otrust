import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
`
const Dropdown = styled.select`
`

export default function From() {
    return (
        <Wrapper>
            From:
            <input type="text"/>
            <Dropdown />
        </Wrapper>
    )
}