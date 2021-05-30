import React, { useCallback } from "react";

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
import { format18, isNumber, parse18 } from 'utils/math'
import { useWeb3React } from "@web3-react/core";


export default function ExchangeQuote({strength, onSubmit}) {
  const { strongBalance, weakBalance, supplyNOM } = useChain()
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

  const exchAmount = useCallback(async (amount) => {
    console.log('Gets here!')
    console.log('Supply NOM: ',supplyNOM)
    console.log('Amount: ', amount)
    switch (true) {
      case (BigNumber.isBigNumber(amount) && amount !== bidAmount):
        var askAmountUpdate = askAmount
        console.log("Passes Test")
        try {  
          switch (strength) {
              case 'strong':
                  console.log('Strong: ', amount.toFixed(0))
                  askAmountUpdate = await bondContract.buyQuoteETH(
                      amount.toFixed(0)
                  )
                  console.log('Pull Strong Ask Amount', askAmountUpdate)
                  break

              case 'weak':
                  askAmountUpdate = await bondContract.sellQuoteNOM(
                      amount.toFixed(0)
                  )
                  console.log('Pull Weak Ask Amount', askAmountUpdate)
                  break

              default:
                  console.error("Denom not set");
          }
          askAmountUpdate = new BigNumber(askAmountUpdate.toString())
        } catch (err) {
          let update = new Map()

          update = update.set(
            'input',
            ''
          )
          
          update = update.set(
            'output',
            'Invalid Input'
          )

          strDispatch({
            type: 'update', 
            value: update
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
            amount
          )

          bnDispatch({
            type: 'update',
            value: bnUpdate
          })

          let strUpdate = new Map()

          strUpdate = strUpdate.set(
            'input',
            format18(amount).toString()
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
  }, [
    askAmount,
    bidAmount,
    bnDispatch,
    bondContract,
    handleModal,
    strDispatch,
    strength,
    supplyNOM,
  ])

  const onTextChange = useCallback(
    async (evt) => {
      evt.preventDefault()
      
      if (bidDenom !== strength) {
        strDispatch({
          type: 'bidDenom',
          value: strength
        })
      }
      
      if (
        isNumber(Number(evt.target.value)) &&
        isNumber(parseFloat(evt.target.value))
      ) {
        const bidAmountUpdate = parse18(
          new BigNumber(
            parseFloat(evt.target.value).toString()
          )
        )

        if (bidAmount !== bidAmountUpdate) {
          await exchAmount(bidAmountUpdate)
        }
      } else {
        if(evt.target.value === '') {
          let strUpdate = new Map()

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
      }
  },
  [ 
    bidAmount,
    bidDenom,
    exchAmount,
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