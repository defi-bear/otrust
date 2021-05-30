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
    bidAmount,
    bidDenom,
    input,
    inputPending,
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
        strDispatch({
          type: 'bidDenom',
          value: strength
        })
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

  const validateText = useCallback(
    async (askAmountState, bidAmountState, bidAmountText, textStrength) => {
      let strUpdate = new Map()
      switch (true) {
        case (bidAmountText === '' || !bidAmountText):
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
          BigNumber.isBigNumber(new BigNumber(Number(bidAmountText).toString())) &&
          BigNumber.isBigNumber(new BigNumber(parseFloat(bidAmountText).toString())) &&
          BigNumber.isBigNumber(new BigNumber(parseFloat(bidAmountText).toString())) !== bidAmountState
        ):
          console.log("Is BigNumber: ", )
          
          objDispatch({
            type: 'inputPending',
            value: true
          })

          const bidAmountUpdate = parse18(new BigNumber(
              parseFloat(bidAmountText).toString()
            )
          )
          
          var askAmountUpdate

          try {
            askAmountUpdate = await getAskAmount(askAmountState, bidAmountUpdate, textStrength)
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

            objDispatch({
              type: 'inputPending',
              value: false
            })
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
          
          console.log("Set Input: ", format18(bidAmountUpdate).toString())
          strUpdate = strUpdate.set(
            'input',
            format18(bidAmountUpdate).toString()
          )
          
          strUpdate = strUpdate.set(
            'output',
            format18(new BigNumber(askAmountUpdate.toString())).toFixed(8)
          )

          strDispatch({
            type: 'update', 
            value: strUpdate
          })

          objDispatch({
            type: 'inputPending',
            value: false
          })

          break
        default: 
          handleModal(
            <RequestFailedModal
              error = 'Please enter numbers only'
            />
          )
      }
  },[getAskAmount, handleModal, inputPending, objDispatch, strDispatch])

  const onTextChange = useCallback(
    async (evt) => {
      evt.preventDefault()
      console.log("Input Pending", inputPending)
      if (inputPending === true) {
        handleModal(
          <RequestFailedModal
              error = 'Network Updating. Please try again.'
          />
        )
      } else {
        if (bidDenom !== strength) {
          strDispatch({
            type: 'bidDenom',
            value: strength
          })
          await validateText(askAmount, bidAmount, evt.target.value, strength)
        }
        
        if (evt.target.value === input) {
          return
        } else {
          await validateText(askAmount, bidAmount, evt.target.value, strength)
        }
      }
  },
  [ 
    bidDenom,
    input,
    strDispatch,
    strength,
    validateText
  ]
);

  return(
      <ExchangeItem>
          <strong>Bid {(strength === 'strong') ? strong : weak}</strong>
          <Sending>
              <strong>I'm bidding</strong>
              <ExchangeInput
                  type="text"
                  onChange={onTextChange}
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