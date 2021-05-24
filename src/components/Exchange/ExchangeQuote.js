import React, { useCallback, useEffect } from "react";
import { 
    useExchange, 
    useUpdateExchange 
} from 'context/ExchangeContext'

import { useContract } from 'context/chain/ContractContext'

import { BigNumber } from 'bignumber.js'

import {
    ExchangeItem,
    Sending,
    Receiving,
    ExchangeInput,
    MaxBtn,
    ReceivingValue,
    ExchangeButton
} from "./exchangeStyles"

import { useModal } from 'context/modal/ModalContext'
import ConfirmTransactionModal from 'components/Modals/components/ConfirmTransactionModal'

import NOMButton from 'components/Exchange/NOMButton'
import { format18, isNumber, parse18 } from 'utils/math'


export default function ExchangeQuote(strength, onSubmit) {
  let { handleModal } = useModal()
  let { strongBalance, weakBalance } = useContract()

  const { 
      bidAmount,
      askAmount,
      input,
      output,
      bidDenom,
      pair,
      slippage
    } = useExchange();
    
    const { 
      setBidAmount,
      setInput,
      setOutput,
      setBidDenom,
      setSlippage
    } = useUpdateExchange();

  const onTextChange = useCallback(
      (evt) => {
        evt.preventDefault()
        setInput(evt.target.value)
        if (bidDenom !== strength) {
          setBidDenom(strength)
        }
      },
      [
          bidDenom,
          setInput,
          setBidDenom
      ]
  );

  const onBid = () => {
      if (bidDenom !== strength) {
              setBidDenom(strength);
      }
      
      handleModal(
          <ConfirmTransactionModal
            closeModal={() => handleModal()}
            type={bidDenom}
            amount={bidAmount}
            result={askAmount}
            onConfirm={() => 
              onSubmit(bidDenom)
            }
            setSlippage={setSlippage}
            slippage={slippage}
          />
      )
  }

  const onBidNOM = () => {
    if (bidDenom !== strength) {
      setBidDenom(strength);
    }
  }

  const onMax = () => {
      (strength === 'strong') ? 
          setInput(format18(strongBalance).toString()) :
          setInput(format18(weakBalance).toString())
  }

  useEffect(() => {
      if (isNumber(parseFloat(input))) {
        try {
          const bidAmountUpdate = parse18(
            new BigNumber(
              parseFloat(input).toString()
            )
          )
          if (bidAmount !== bidAmountUpdate) {
              setBidAmount(
                bidAmountUpdate
              ) 
          }
        } catch (e) {
          console.log(e)
          if (input !== '') {
            setOutput("Invalid Input")
            setBidAmount('')
          }  
        }
      }
  },[bidAmount, input, setOutput, setBidAmount])

  return(
      <ExchangeItem>
          <strong>Bid {strength === 'strong' ? pair[0] : pair[1]}</strong>
          <Sending>
              <strong>I'm bidding</strong>
              <ExchangeInput
                  type="text"
                  onChange={onTextChange}
                  value={(bidDenom === strength) ? input : ''}
              />
              {(bidDenom === strength) ? pair[0] : pair[1]}
              <MaxBtn onClick={onMax()}>Max</MaxBtn>
          </Sending>
          <Receiving>
              <strong>I'm asking</strong>
              <ReceivingValue>
                  {
                      (bidDenom === strength) ?
                      (
                          (BigNumber.isBigNumber(output)) ? 
                          format18(output).toFixed(8) : 
                          output
                      ) : ''
                  } {
                  (strength === 'strong') ? pair[1] : pair[0]
              }
              </ReceivingValue>
          </Receiving>
          { 
            (pair[1] === 'wNOM') ?
            <NOMButton 
              onBid={onBid}
            /> : 
            <ExchangeButton onClick={onBid}>
              Buy {strength === 'strong' ? pair[1] : pair[0]}
            </ExchangeButton>
          }
      </ExchangeItem>
  )
}