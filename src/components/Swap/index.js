import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Panel } from 'components'
import Dropdown from 'components/Dropdown'
import { borderRadius } from 'context/responsive/cssSizes'
import { AccentButton } from 'components/UI/Button'
import { useAsyncFn } from 'lib/use-async-fn'
import { useSwap, useUpdateSwap } from 'context/SwapContext'
import { useChain } from 'context/chain/ChainContext'
import { formatEther, parseEther } from '@ethersproject/units'

const FlexWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const GridWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
`

const RowWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
`
const StyledInput = styled.input`

    width: ${p => p.width};
    height: ${p => p.height};
    padding-left: ${p => p.paddingLeft};

    border: .1rem solid ${props => props.theme.colors.background};
    border-radius: ${borderRadius};

    font-size: 1rem;
    

    box-sizing: border-box;

    ::placeholder {
        color: ${props => props.theme.colors.background};;
    }

    &:focus {
        outline: none;
        color: #000;

        ::placeholder {
            color: ${props => props.theme.colors.background};
        }
    }
`

const RightComponentWrapper = styled.div`
    width: 5em;
    text-align: center;
    vertical-align: middle;
    line-height: 2rem;
`
const LeftComponentWrapper = styled.div`
    width: 3em;
    text-align: right;
    vertical-align: middle;
    line-height: 2rem;
`

const MiddleComponentWrapper = styled.div`
    text-align: center;
    vertical-align: middle;
    line-height: 2rem;
`

const SwapHeader = styled.header`
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
const Button = styled(AccentButton)`
    background-color: ${props => props.theme.colors.headerBackground}
`
export default function Swap() {
    const { swapDenom, swapBuyAmount, swapSellAmount } = useSwap()
    const { setSwapBuyAmount, setSwapDenom } = useUpdateSwap()
    const onTextChange = useCallback(evt => setSwapBuyAmount(evt.target.value), [])
    const { bondContract, NOMcontract } = useChain()

    const submitTrans = useCallback(
        async evt => {
          if (evt) evt.preventDefault()
          if (!swapBuyAmount) return
          try {
            if (swapDenom == 'ETH') {
                console.log("Purchase amount ETH: ", swapBuyAmount)
                try {
                    const response = bondContract.buyNOM({value: parseEther(swapBuyAmount.toString()).toString()})
                    setSwapBuyAmount('')
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e.stack || e)
                    setSwapBuyAmount(swapBuyAmount)
                }
            } else {
                console.log("Sell amount NOM: ", swapBuyAmount)
                const res1 = await NOMcontract.increaseAllowance(bondContract.address, parseEther(swapBuyAmount.toString()))
                const res2 = await bondContract.sellNOM(parseEther(swapBuyAmount.toString())).then((f) => {
                    console.log("Transaction receipt: ", f)
                })
                setSwapBuyAmount('')
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e.stack || e)
            setSwapBuyAmount(swapBuyAmount)
          }
        }
    )

    const [onSubmit, isWorking, error] = useAsyncFn(submitTrans)

    const onTextAreaKeyDown = e => {
        if (e.keyCode === 13 && e.shiftKey === false) {
          e.preventDefault()
        }
        setSwapBuyAmount(e)
    }

    return (
        <FlexWrapper>
            <Panel>
                <form onSubmit={ onSubmit }>
                    <SwapHeader>
                        Swap
                    </SwapHeader>
                    <GridWrapper>
                    <LeftComponentWrapper>
                        From:
                        </LeftComponentWrapper>
                        <StyledInput
                            type='text'
                            value={swapBuyAmount}
                            onChange={onTextChange}
                            onTextAreaKeyDown={onTextAreaKeyDown}
                            placeholder={isWorking ? "Confirming":"Enter amount"}
                            width='10rem' 
                            height='2rem' 
                            paddingLeft='1.25rem'
                        />
                        <Dropdown denom={swapDenom} setDenom={setSwapDenom}/>
                        <LeftComponentWrapper>
                        To: 
                        </LeftComponentWrapper>
                        <MiddleComponentWrapper>
                            { (swapSellAmount) ? swapSellAmount.toFixed(9) : null }
                        </MiddleComponentWrapper>
                        <RightComponentWrapper>
                            { swapDenom == 'NOM' ? 'ETH' : 'NOM' }
                        </RightComponentWrapper>
                    </GridWrapper>
                        
                    <RowWrapper>
                        <Button type='submit'>
                            Execute
                        </Button>
                    </RowWrapper>
                </form>
                
            </Panel>
        </FlexWrapper>
    )
}