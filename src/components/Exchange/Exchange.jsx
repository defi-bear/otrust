import React, { useCallback, useState, useEffect } from "react";
import { useAsyncFn } from "lib/use-async-fn";
import { BigNumber } from 'bignumber.js'
import { format18, isNumber, parse18 } from 'utils/math'

import {
  ExchangeWrapper,
  ExchangeItem,
  Sending,
  Receiving,
  ExchangeInput,
  MaxBtn,
  ReceivingValue,
  SellBtn,
  ExchangeButton,
} from "./exchangeStyles";

import ConfirmTransactionModal from 'components/Modals/components/ConfirmTransactionModal';

import { useModal } from 'context/modal/ModalContext'
import { useExchange, useUpdateExchange } from "context/ExchangeContext";
import { useChain, useUpdateChain } from "context/chain/ChainContext";

import TransactionCompletedModal from "components/Modals/components/TransactionCompletedModal";
import OnomyConfirmationModal from "components/Modals/components/OnomyConfirmationModal";
import TransactionFailedModal from "components/Modals/components/TransactionFailedModal";
import PendingModal from "components/Modals/components/PendingModal";

export default function Exchange() {
  let { handleModal } = useModal()

  const { 
    bidAmount,
    askAmount,
    input,
    output,
    bidDenom,
    pair
  } = useExchange();
  
  const { 
    setBidAmount,
    setInput,
    setOutput,
    setBidDenom,
  } = useUpdateExchange();

  const { 
    bondContract, 
    NOMallowance, 
    NOMcontract, 
    strongBalance, 
    weakBalance, 
    pendingTx 
  } = useChain();
  
  const { setPendingTx } = useUpdateChain();
  
  const [completedAmount, setCompletedAmount] = useState(null);
  const [completedResult, setCompletedResult] = useState(null);
  const [slippage, setSlippage] = useState(1);
  const [previousTx, setPreviousTx] = useState(null);

  const onBidStrongTextChange = useCallback(
    (evt) => {
      evt.preventDefault()
      setInput(evt.target.value)
      if (bidDenom !== "strong") {
        setBidDenom("strong")
      }
    },
    [
      setInput,
      setBidDenom
    ]
  );
  
  const onBidWeakTextChange = useCallback(
    (evt) => {
      evt.preventDefault()
      setInput(evt.target.value)
      if (bidDenom !== "weak") {
        setBidDenom("weak")
      }
    },
    [
      setInput,
      setBidDenom
    ]
  );

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

  const submitTrans = useCallback(
    async () => {
      if (!bidAmount || !askAmount) return;
      try {
        let tx;
        switch (bidDenom) {
          case 'strong':
            // Preparing for many tokens / coins
            switch (pair[0]) {
              case 'ETH':
                {
                  tx = await bondContract.buyNOM(
                    askAmount.toFixed(0),
                    slippage * 100,
                    { value: bidAmount.toFixed(0) }
                  )
                }
              break

              default:
                {}
            }
            break
          
          case 'weak':
            switch (pair[1]) {
              case 'wNOM':
                {
                  tx = await bondContract.sellNOM(
                    bidAmount.toFixed(0),
                    askAmount.toFixed(0),
                    slippage * 100,
                  )
                }
                break
              default:
                {}
            }
            break
          
          default:
            console.log()
        }
      
        setPendingTx(tx);
        setCompletedAmount(bidAmount);
        setCompletedResult(askAmount);
        handleModal(
          <PendingModal />
        )
        bidAmount("");
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e.code, e.message.message);
        // alert(e.message)
        handleModal(
          <TransactionFailedModal
            closeModal={() => handleModal()}
            error={e.code + '\n' + e.message.slice(0,80) + '...'}
          />
        )
      }
    },
    [
      askAmount,
      bidAmount,
      bidDenom,
      bondContract,
      handleModal,
      pair,
      setPendingTx,
      setCompletedAmount,
      setCompletedResult,
      slippage
    ]
  );

  useEffect(() => {
    if (pendingTx) {
      pendingTx.wait().then(() => {
        setPreviousTx(pendingTx);
        setPendingTx(null);
        handleModal(
          <TransactionCompletedModal
            closeModal={() => handleModal()}
            type={bidDenom}
            amount={completedAmount}
            result={completedResult}
            previousTx={previousTx}
          />
        )
      })
    }
  }, [
    bidDenom,
    completedAmount,
    completedResult,
    handleModal,
    pendingTx,
    previousTx,
    setPendingTx,
  ])

  const onBidStrong = () => {
    setBidDenom(pair[0]);
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

  const onBidWeak = () => {
    setBidDenom(pair[1]);
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
  
  const onApprove = async (value) => {
    if(value <= weakBalance) {
      try {
        handleModal(
          <PendingModal />
        );
        setBidDenom('APPROVE')
        let tx = await NOMcontract.increaseAllowance(
          bondContract.address,
          value.toFixed(0)
        );
        setPendingTx(tx);
      } catch (e) {
        // eslint-disable-next-line no-console
        // console.error(e.code, e.message.message);
        // alert(e.message)
        handleModal(
          <TransactionFailedModal
            closeModal={() => handleModal()}
            error={e.code + '\n' + e.message.slice(0,80) + '...'}
          />
        )
      }    
    } else {
      handleModal(
            <TransactionFailedModal
              closeModal={() => handleModal()}
              error={`${pair[1]} Balance too low`}
            />
      )
    }
  } 
  
  

  const [onSubmit, error] = useAsyncFn(submitTrans);

  const onStrongMax = () => {
    setInput(format18(strongBalance).toString())
  }

  const onWeakMax = (weakBalance) => {
    setInput(format18(weakBalance).toString)
  }
  return (
    <ExchangeWrapper>
      <ExchangeItem>
        <strong>Bid {pair[1]}</strong>
        <Sending>
          <strong>I'm bidding</strong>
          <ExchangeInput
            type="text"
            onChange={onBidStrongTextChange}
            value={(bidDenom === 'strong') ? input : ''}
          />
          {pair[0]}
          <MaxBtn onClick={onStrongMax}>Max</MaxBtn>
        </Sending>
        <Receiving>
          <strong>I'm asking</strong>
          <ReceivingValue>
            {
              (bidDenom === 'strong') ?
              (
                (BigNumber.isBigNumber(output)) ? 
                  format18(output).toFixed(8) : 
                  output
              ) :
              ''
            } {pair[1]}
          </ReceivingValue>
        </Receiving>
        <div>
          <ExchangeButton onClick={onBidStrong}>Buy {pair[1]}</ExchangeButton>
        </div>
      </ExchangeItem>

      <ExchangeItem>
        <strong>Bid {pair[0]}</strong>
        <Sending>
          <strong>I'm bidding</strong>
          <ExchangeInput
            type="text"
            onChange={onBidWeakTextChange}
            value={(bidDenom === 'weak') ? input : ''}
          />
          {pair[1]}
          <MaxBtn onClick={onWeakMax}>Max</MaxBtn>
        </Sending>
        <Receiving>
          <strong>I'm asking</strong>
          <ReceivingValue>
            {
              (bidDenom === 'weak') ?
              (BigNumber.isBigNumber(output)) ? 
                  format18(output).toFixed(8) : 
                  output :  ''
            } {pair[0]}
          </ReceivingValue>
        </Receiving>
        <div>
          {
            (
              NOMallowance > bidAmount && 
              bidDenom === 'weak' && weakBalance > bidAmount) ? 
              (<SellBtn onClick={onBidWeak}>Sell {pair[1]}</SellBtn>) : 
              (weakBalance > bidAmount) ? 
                <SellBtn 
                  onClick={() => handleModal(
                    <OnomyConfirmationModal
                      closeModal={() => handleModal()}
                      onConfirm={() => onApprove(bidAmount)}
                    />
                )}>
                  Approve
                </SellBtn> : (bidDenom === 'weak') ?
                <SellBtn>Not enough {pair[1]}</SellBtn> : {}
          }
        </div>
      </ExchangeItem>

      {error && <div>{error}</div>}
    </ExchangeWrapper>
  );
}