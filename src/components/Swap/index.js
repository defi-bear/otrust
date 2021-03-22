import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Panel } from 'components'
//import Dropdown from 'components/Dropdown'
import { borderRadius } from 'context/responsive/cssSizes'
import { AccentButton } from 'components/UI/Button'
import { useAsyncFn } from 'lib/use-async-fn'
import { useSwap, useUpdateSwap } from 'context/SwapContext'
import { useChain, useUpdateChain } from 'context/chain/ChainContext'
import { parseEther } from '@ethersproject/units'

const adjustedRadius = `${parseFloat(borderRadius.slice(0,-3))/2}rem`;

const FlexWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const GridWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%
    align-items: center;
    justify-content: space-between;
    gap: 0.7rem;
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
    width: 9rem;
    height: ${p => p.height};
    padding: 0rem 0.5rem;
    border: .1rem solid ${props => props.theme.colors.bgNormal};
    border-radis: ${adjustedRadius};
    color: ${props => props.theme.colors.txtPrimary};
    font-size: 0.8rem;
    box-sizing: border-box;
    background-color: ${p => p.theme.colors.bgHighlight};
    text-align: center;
    ::placeholder {
        color: ${props => props.theme.colors.txtPrimary};
    }
    &:focus {
        outline: none;
        color: #000;

        ::placeholder {
            color: ${props => props.theme.colors.txtPrimary};
        }
    }
`

const RightComponentWrapper = styled.div`
    text-align: right;
    padding: 0rem 0.6rem;
    vertical-align: middle;
    line-height: 2rem;
    color: ${props => props.theme.colors.txtPrimary};
`

const LeftComponentWrapper = styled.div`
    width: 5.5rem;
    text-align: left;
    padding: 0rem 0.5rem 0rem 1rem;
    vertical-align: middle;
    line-height: 2rem;  
    color: ${props => props.theme.colors.txtSecondary};
`

const MiddleComponentWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 10rem;
    text-align: right;
    align-items: center;
    color: ${props => props.theme.colors.txtPrimary}
`

const TextLabel = styled.div`
    padding: 0rem 0.2rem;
    vertical-align: middle;
    height: '2.2rem';
`

const SwapHeader = styled.header`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.txtPrimary}};
  margin-bottom: 1rem;
  height: 2rem;
  line-height: 2rem;
  background: ${props => props.theme.colors.bgNormal};
  text-align: left;
  vertical-align: middle;
`
const SendingWrapper = styled.div` 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 2.8rem;
    font-size: 0.7rem;
    border-radius: ${adjustedRadius};
    border-style: solid;
    border-width: 0.1rem;
    border-color: ${props => props.theme.colors.bgHighlight}
`
const ReceivingWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 2.8rem;
    font-size: 0.7rem;
    border-radis: ${adjustedRadius};
    background-color: ${props => props.theme.colors.bgDarken};
    border-radius : 0.3rem;
`

const Button = styled(AccentButton)`
    font-size: 0.7rem;
    color: #fff;
    margin-bottom: 1rem;
    width: 100%;
    height: 2.8rem;
    line-height: 2.8rem;
    text-align: center;
    vertical-align: middle;
    border-radius: ${adjustedRadius};   
    background-image: ${props => props.colorGradient}
`
export default function Swap({text, colorGradient}) {
    const { swapDenom, swapBuyAmount, swapSellAmount } = useSwap()
    const { setSwapBuyAmount, setSwapDenom } = useUpdateSwap()
    const onTextChange = useCallback(evt => setSwapBuyAmount(evt.target.value), [setSwapBuyAmount])
    const { bondContract, NOMcontract } = useChain()
    const { setPendingTx } = useUpdateChain()

    let [denom, setDenom] =useState('ETH')

    const submitTrans = useCallback(
        async evt => {
          if (evt) evt.preventDefault()
          if (!swapBuyAmount) return
          try {
            if (swapDenom === 'ETH') {
                try {
                    const tx = await bondContract.buyNOM({value: parseEther(swapBuyAmount.toString()).toString()})
                    setPendingTx(tx)
                    setSwapBuyAmount('50')
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e.stack || e)
                    setSwapBuyAmount(swapBuyAmount)
                }
            } else {
                let tx = await NOMcontract.increaseAllowance(bondContract.address, parseEther(swapBuyAmount.toString()))
                setPendingTx(tx)
                tx = await bondContract.sellNOM(parseEther(swapBuyAmount.toString()))
                setPendingTx(tx)
                setSwapBuyAmount('')
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e.stack || e)
            setSwapBuyAmount(swapBuyAmount)
          }
        },[swapBuyAmount, swapDenom, bondContract, NOMcontract, setSwapBuyAmount, setPendingTx]
    )

    const [onSubmit, isWorking, error] = useAsyncFn(submitTrans)

    const onTextAreaKeyDown = e => {
        if (e.keyCode === 13 && e.shiftKey === false) {
          e.preventDefault()
        }
        setSwapBuyAmount(e)
    }
   
    setDenom = (e) => {
        console.log(e.target)
        //setDenom(e.target.name)
    }
    return (
        <FlexWrapper>
            <Panel onClick={setDenom} name={text} >
                <form onSubmit={ onSubmit } >
                    <SwapHeader>
                       {text}
                    </SwapHeader>
                    <GridWrapper>
                        <SendingWrapper>
                            <LeftComponentWrapper>
                                I'm sending
                            </LeftComponentWrapper>
                            { error ? error : null }
                            <MiddleComponentWrapper>
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
                                <TextLabel >
                                   {text==='Buy NOM'? 'ETH' : 'NOM'} 
                                </TextLabel> 
                            </MiddleComponentWrapper>
                           
                            <RightComponentWrapper>
                                <span style={{color:    '#FFDDA1', textAlign: 'right'}}>Max</span>
                            </RightComponentWrapper>
                        </SendingWrapper>
                        <ReceivingWrapper>
                            <LeftComponentWrapper>
                                I'm receiving
                            </LeftComponentWrapper>
                            <MiddleComponentWrapper>
                                
                            </MiddleComponentWrapper>
                            <RightComponentWrapper>
                                { `${(swapSellAmount) ? parseFloat(swapSellAmount).toPrecision(4) : null} ${text==='Buy NOM'? 'ETH' : 'NOM'}` }
                            </RightComponentWrapper>
                        </ReceivingWrapper>                   
                                            
                        <RowWrapper>
                            <Button colorGradient={colorGradient} type='submit'>
                                {text}
                            </Button>
                        </RowWrapper>
                    </GridWrapper>
                </form>
                
            </Panel>
        </FlexWrapper>
    )
}