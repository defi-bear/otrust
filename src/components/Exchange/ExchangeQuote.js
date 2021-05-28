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
    slippage,
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
            closeModal={() => handleModal()}
            bidDenom={bidDenom}
            bidAmount={bidAmount}
            askAmount={askAmount}
            onConfirm={() => 
              onSubmit(bidDenom)
            }
            pair={[strong, weak]}
            bnDispatch = {bnDispatch}
            slippage={slippage}
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

  useEffect(() => {
    console.log("Output: ", output)
  },[output])

  const exchAmount = useCallback( async (amount) => {
    if (supplyNOM && BigNumber.isBigNumber(amount) && amount.toNumber() > 0) {
        try {
            var askAmountUpdate
            switch (strength) {
                case 'strong':
                    console.log("Ask Amount Update")
                    askAmountUpdate = await bondContract.buyQuoteETH(
                        amount.toFixed(0)
                    )
                    console.log("Ask Amount Update", askAmountUpdate.toString())
                    break
  
                case 'weak':
                    askAmountUpdate = await bondContract.sellQuoteNOM(
                        amount.toFixed(0)
                    )
                    break
  
                default:
                    console.error("Denom not set");
            }  
            if (askAmount !== askAmountUpdate) {
                bnDispatch({
                  type: 'askAmount', 
                  value: new BigNumber(askAmountUpdate.toString())
                })
                
                strDispatch({
                  type: 'output', 
                  value: format18(new BigNumber(askAmountUpdate.toString())).toFixed(8)
                })
            }
        } catch (err) {
            console.log("Error Quote: ", err)
            strDispatch({
              type: 'output', 
              value: ''
            })
        }
    } else {
      if (amount === '') {
        strDispatch({
          type: 'output',
          value: ''
        })
      } else {
        strDispatch({
          type: 'output',
          value: 'Invalid Value'
        })
        bnDispatch({
          type: 'bidAmount',
          value: new BigNumber(0)
        })
      }
    }
  }, [
    askAmount,
    bondContract,
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

      strDispatch({type: 'input', value: evt.target.value})

      if (isNumber(parseFloat(evt.target.value))) {
        try {
          const bidAmountUpdate = parse18(
            new BigNumber(
              parseFloat(evt.target.value).toString()
            )
          )
          console.log("Input: ", evt.target.value)
          console.log("Bid Amount Update", bidAmountUpdate.toString())
          if (bidAmount !== bidAmountUpdate) {
            console.log("Update Bid Amount")
            bnDispatch({
              type: 'bidAmount',
              value: bidAmountUpdate
            })
            exchAmount(parse18(new BigNumber(evt.target.value)))
          }
        } catch (e) {
          console.log(e)
          if (input !== '') {
            strDispatch({
              type: 'output', 
              value: "Invalid Input"
            })
            bnDispatch({
              type: 'bidAmount',
              value: new BigNumber(0)
            })
          }  
        }
    } else {
        strDispatch({
          type: 'output',
          value: ''
        })
    }
  },
  [ 
    bidAmount,
    bidDenom,
    exchAmount,
    input,
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