import React, { useCallback, useEffect } from "react";

import { BigNumber } from 'bignumber.js'

import { useChain } from 'context/chain/ChainContext'

import { BondingCont } from 'context/chain/contracts'

import { 
    useExchange, 
    useUpdateExchange 
} from 'context/exchange/ExchangeContext'

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
import RequestFailedModal from 'components/Modals/components/RequestFailedModal'

import NOMButton from 'components/Exchange/NOMButton'
import { format18, parse18 } from 'utils/math'
import { useWeb3React } from "@web3-react/core";
// import { validate } from "graphql";


export default function ExchangeQuote({strength, onSubmit}) {
  const { strongBalance, weakBalance } = useChain()
  const { handleModal } = useModal()
  const { library } = useWeb3React()
  
  const bondContract = BondingCont(library)

  const { 
    askAmount,
    bidDenom,
    input,
    output,
    strong,
    weak
  } = useExchange();
  
  useEffect(() => {
    console.log("Input: ", input)
    console.log("Output: ", output)
  })

  const { 
    objDispatch,
    strDispatch
  } = useUpdateExchange();

  const onBid = () => {
      if (bidDenom !== strength) {
        <RequestFailedModal
          error = "Please enter amount"
        />
      }
      
      handleModal(
          <ConfirmTransactionModal
            strength={strength}
            onConfirm={() => 
              onSubmit(bidDenom)
            }
          />
      )
  }

  const onMax = () => {
      (strength === 'strong') ? 
          strDispatch({
            type: 'input',
            value: format18(strongBalance).toString()
          }) : 
          strDispatch({
            type: 'input',
            value: format18(weakBalance).toString()
          })
  }

  const getAskAmount = async (askAmountState, bidAmountUpdate, textStrength) => {
    var askAmountUpdate = askAmountState
        
    switch (textStrength) {
        case 'strong':
            console.log('Strong: ', bidAmountUpdate.toFixed(0))
            askAmountUpdate = await bondContract.buyQuoteETH(
                bidAmountUpdate.toFixed(0)
            )
            console.log('Pull Strong Ask Amount', askAmountUpdate)
            break

        case 'weak':
            askAmountUpdate = await bondContract.sellQuoteNOM(
                bidAmountUpdate.toFixed(0)
            )
            console.log('Pull Weak Ask Amount', askAmountUpdate)
            break

        default:
            console.error("Denom not set");
    }
    return new BigNumber(askAmountUpdate.toString())
  }

  const onTextChange = useCallback(
    async (evt, textStrength) => {
      evt.preventDefault()
      console.log("Component Strength: ", strength)
      console.log("Text Strength: ", textStrength)
      console.log("Bid Denom: ", bidDenom)
      let strUpdate = new Map()
      switch (true) {
        case (bidDenom === strength && input === evt.target.value.toString()): break
        case (evt.target.value === ''):
          strUpdate = strUpdate.set(
            'input',
            ''
          )
          
          strUpdate = strUpdate.set(
            'output',
            ''
          )

          strDispatch({
            type: 'update', 
            value: strUpdate
          })
          break
        case (
            Number(evt.target.value) > 0 &&
            parseFloat(evt.target.value) > 0
        ):
          console.log("Input after test", evt.target.value)
          const bidAmountUpdate = parse18(new BigNumber(
              parseFloat(evt.target.value).toString()
            )
          )

          const inputUpdate = evt.target.value.toString()
          
          if (bidDenom !== strength) {
            strUpdate = strUpdate.set(
              'bidDenom',
              strength          
            )
          }

          var askAmountUpdate

          try {
            askAmountUpdate = await getAskAmount(askAmount, bidAmountUpdate, textStrength)
          } catch(err) {
            
            strUpdate = strUpdate.set(
              'input',
              ''
            )
            
            strUpdate = strUpdate.set(
              'output',
              'Invalid Input'
            )

            strDispatch({
              type: 'update', 
              value: strUpdate
            })

            if (err) {
              console.log(err)
              handleModal(
                <RequestFailedModal
                  error = {err}
                />
              )
            }
            break
          }

          let objUpdate = new Map()

          objUpdate = objUpdate.set(
            'askAmount',
            new BigNumber(askAmountUpdate.toString())
          )
          
          objUpdate = objUpdate.set(
            'bidAmount',
            bidAmountUpdate
          )

          objDispatch({
            type: 'update',
            value: objUpdate
          })

          strUpdate = strUpdate.set(
            'input',
            inputUpdate
          )
          
          strUpdate = strUpdate.set(
            'output',
            format18(new BigNumber(askAmountUpdate.toString())).toFixed(8)
          )

          strDispatch({
            type: 'update', 
            value: strUpdate
          })

          break
        default:
          handleModal(
            <RequestFailedModal
              error = "Please enter numbers only. Thank you!"
            />
          )
      }
  },
  [ 
    bidDenom,
    input,
    strDispatch,
    strength
  ]
  );

  return(
      <ExchangeItem>
          <strong>Bid {(strength === 'strong') ? strong : weak}</strong>
          <Sending>
              <strong>I'm bidding</strong>
              <ExchangeInput
                  type="text"
                  onChange={(evt) => onTextChange(evt, strength)}
                  value={(bidDenom === strength) ? input : ''}
              />
              {(strength === 'strong') ? strong : weak}
              <MaxBtn onClick={() => onMax()}>Max</MaxBtn>
          </Sending>
            <Receiving>
                <strong>I'm asking</strong>
                <ReceivingValue>
                    {(strength === bidDenom) ? output : ''}
                    {' '}
                    {(strength === 'strong') ? weak : strong}
                </ReceivingValue>
            </Receiving>
            { 
              (strength === 'strong') ? 
              (<ExchangeButton onClick={onBid}>
                  Buy {(strength === 'strong') ? weak : strong}
              </ExchangeButton>) :
              (<NOMButton 
                onBid={onBid}
              />)
            }
      </ExchangeItem>
  )
}