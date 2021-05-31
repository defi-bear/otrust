import React, { useEffect } from "react";

import { useExchange } from 'context/exchange/ExchangeContext'
import { useModal } from 'context/modal/ModalContext'
import { useChain } from 'context/chain/ChainContext'
import { format18 } from 'utils/math'

import ApproveModal from 'components/Modals/components/ApproveModal'

import {
  SellBtn
} from "./exchangeStyles"
import BigNumber from "bignumber.js";


export default function NOMButton({ onBid, onApprove }) {
    const { weakBalance, NOMallowance } = useChain()
    const { handleModal } = useModal()

    const { 
      bidAmount, 
      bidDenom,
      input,
      weak
    } = useExchange()

    useEffect(() => {
      console.log("Bid Amount: ", bidAmount)
      console.log("NOM Allowance: ", NOMallowance)
    }, [NOMallowance, bidAmount])
    
    return (
      <> 
        { (bidDenom === 'strong') ?
          <SellBtn> Input Value </SellBtn> :
          (
            bidAmount.lte(weakBalance) ?
            (
              (input == '') ?
                <SellBtn> Input Value </SellBtn> :
                (
                  NOMallowance.gt(bidAmount) ?
                  <SellBtn onClick={onBid}>Sell {weak}</SellBtn> :
                  <SellBtn onClick={onApprove}>Approve</SellBtn>
                )
            ) : < SellBtn> Low {weak} Balance </SellBtn> 
          )          
        }
      </>
    )
  }