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
    output,
    strong,
    weak
  } = useExchange();
  
  useEffect(() => {
    console.log("Input: ", input)
    console.log("Output: ", output)
  })

  const { 
    bnDispatch,
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

  const onTextChange = useCallback(
    async (evt) => {
      evt.preventDefault()
      
      if (
        !BigNumber.isBigNumber(new BigNumber(parseFloat(evt.target.value).toString()))
      ) {
        if(evt.target.value === '') {
          let strUpdate = new Map()

          strUpdate = strUpdate.set(
            'bidDenom',
            strength
          )

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
        } else {
          handleModal(
            <RequestFailedModal
              error = 'Please enter numbers only'
            />
          )
        }
      } else {
        const bidAmountUpdate = parse18(
          new BigNumber(
            parseFloat(evt.target.value).toString()
          )
        )

        switch (true) {
          case (bidAmountUpdate !== bidAmount):
            var askAmountUpdate = askAmount
            try {  
              switch (strength) {
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
              askAmountUpdate = new BigNumber(askAmountUpdate.toString())
            } catch (err) {
              let strUpdate = new Map()
    
              strUpdate = strUpdate.set(
                'bidDenom',
                strength
              )
    
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
                handleModal(
                  <RequestFailedModal
                    error = {err.error.message}
                  />
                )
              }
            }
      
            if (askAmount !== askAmountUpdate) {
              let bnUpdate = new Map()
    
              bnUpdate = bnUpdate.set(
                'askAmount',
                new BigNumber(askAmountUpdate.toString())
              )
              
              bnUpdate = bnUpdate.set(
                'bidAmount',
                bidAmountUpdate
              )
    
              bnDispatch({
                type: 'update',
                value: bnUpdate
              })
    
              let strUpdate = new Map()
    
              if (bidDenom !== strength) {
                strUpdate = strUpdate.set(
                  'bidDenom',
                  strength
                )
              }
              
    
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
            } break
                    
            default: 
              console.log("Defaulting")
              strDispatch({
                type: 'output',
                value: 'Invalid Input'
              })
        } 
      }
  },
  [ 
    askAmount,
    bidAmount,
    bidDenom,
    bondContract,
    bnDispatch,
    handleModal,
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