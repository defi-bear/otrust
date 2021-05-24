import React, { useCallback, useEffect } from "react";

import { ErrorBoundary } from 'react-error-boundary'

import { BigNumber } from 'bignumber.js'

import { 
    useExchange, 
    useUpdateExchange 
} from 'context/ExchangeContext'

import { useContract } from 'context/chain/ContractContext'

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


export default function ExchangeQuote({strength, onSubmit}) {
  let { handleModal } = useModal()
  let { bondContract, strongBalance, weakBalance, supplyNOM } = useContract()

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
    setBidDenom,
    setAskAmount,
    setInput,
    setOutput,
    setSlippage
  } = useUpdateExchange();

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

  const onMax = () => {
      (strength === 'strong') ? 
          setInput(format18(strongBalance).toString()) :
          setInput(format18(weakBalance).toString())
  }

  useEffect(() => {
    console.log("Output: ", output)
  },[output])

  useEffect(() => {
    
  },[])

  const onTextChange = useCallback(
    async (evt) => {
      evt.preventDefault()
      console.log("Pair :", pair[0])

      if (bidDenom !== strength) {
        setBidDenom(strength)
      }

      setInput(evt.target.value)

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
            setBidAmount(
              bidAmountUpdate
            )
            exchAmount(parse18(new BigNumber(evt.target.value)))
          }
        } catch (e) {
          console.log(e)
          if (input !== '') {
            setOutput("Invalid Input")
            setBidAmount('')
          }  
        }
    } else {
        setOutput('')
    }
  },
  [ 
    bidAmount,
    bidDenom,
    input, 
    setBidAmount,
    setBidDenom,
    setOutput, 
    setInput,
  ]
);

const exchAmount = useCallback( async (amount) => {
  if (supplyNOM && BigNumber.isBigNumber(amount) && amount.toNumber() > 0) {
      try {
          var askAmountUpdate
          switch (bidDenom) {
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
              setAskAmount(new BigNumber(askAmountUpdate.toString()))
              setOutput(format18(new BigNumber(askAmountUpdate.toString())).toFixed(8))
          }
      } catch (err) {
          console.log("Error Quote: ", err)    
      }
  } else {
    if (amount === '') {
      setOutput('')
    } else {
      setOutput('Invalid Value')
      setBidAmount('')
    }
  }
}, [
  bidAmount,
  bidDenom,
  bondContract,
  supplyNOM,
])

  return(
      <ExchangeItem>
          <strong>Bid {(strength === 'strong') ? pair[0] : pair[1]}</strong>
          <Sending>
              <strong>I'm bidding</strong>
              <ExchangeInput
                  type="text"
                  onChange={onTextChange}
                  value={(bidDenom === strength) ? input : ''}
              />
              {(bidDenom === strength) ? pair[0] : pair[1]}
              <MaxBtn onClick={() => onMax()}>Max</MaxBtn>
          </Sending>
            <Receiving>
                <strong>I'm asking</strong>
                <ReceivingValue>
                    {(bidDenom === strength) ? output : ''}
                    {' '}
                    {(strength === 'strong') ? pair[1] : pair[0]}
                </ReceivingValue>
            </Receiving>
            { 
              (strength === 'strong') ? 
              (<ExchangeButton onClick={onBid}>
                  Buy {(strength === 'strong') ? pair[1] : pair[0]}
              </ExchangeButton>) :
              (<NOMButton 
                onBid={onBid}
              />)
            }
      </ExchangeItem>
  )
}