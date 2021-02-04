import React from 'react'
import styled from 'styled-components'
import { Panel } from 'components'
import Dropdown from 'components/Dropdown'

const FlexWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const RowWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 2rem;
    margin-top: 1rem;
`
const StyledInput = styled.input`

    width: ${p => p.width};
    height: ${p => p.height};
    padding-left: ${p => p.paddingLeft};

    border: .1rem solid #b7c6de;
    border-radius: 1.75rem;

    font-size: 1rem;
    color: #fff;

    box-sizing: border-box;

    ::placeholder {
        color: #b7c6de;
    }

    &:focus {
        outline: none;
        color: #000;

        ::placeholder {
            color: #b7c6de;
        }
    }
`

const StyledText = styled.text`
    width: ${p => p.width};
    height: ${p => p.height};

    border: .1rem solid #b7c6de;
    border-radius: 1.75rem;

    font-size: 1rem;
    color: #fff;

    box-sizing: border-box;
`

const RightComponentWrapper = styled.div`
    width: 5em;
    text-align: left;
    vertical-align: middle;
    line-height: 2rem;
`
const LeftComponentWrapper = styled.div`
    width: 3em;
    text-align: left;
    vertical-align: middle;
    line-height: 2rem;
`


export default function Swap() {
    return (
        <FlexWrapper>
            <Panel>
                Swap
                <RowWrapper>
                    <LeftComponentWrapper>
                    From:
                    </LeftComponentWrapper>
                    <StyledInput width='10rem' height='2rem' paddingLeft='1.25rem' />
                    <Dropdown />
                </RowWrapper>
                <RowWrapper>
                    <LeftComponentWrapper>
                    To: 
                    </LeftComponentWrapper> 
                    <StyledText width='10rem' height='2rem'>
                        1.00004
                    </StyledText>
                    <RightComponentWrapper>
                       NOM
                    </RightComponentWrapper>
                </RowWrapper>
            </Panel>
        </FlexWrapper>
    )
}