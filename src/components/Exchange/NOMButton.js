import React from "react";

import { useWeb3React } from "@web3-react/core"
import { useExchange, useUpdateExchange } from 'context/exchange/ExchangeContext'
import { useModal } from 'context/modal/ModalContext'
import { useChain } from 'context/chain/ChainContext'

import { BondingCont, NOMCont } from 'context/chain/contracts'

import ApproveModal from 'components/Modals/components/ApproveModal'

import {
  SellBtn
} from "./exchangeStyles"


export default function NOMButton(onBid) {
    const { weakBalance } = useChain()
    const { handleModal } = useModal()

    const { 
      bidAmount, 
      bidDenom,
      NOMallowance,
      weak
    } = useExchange()
    
    return (
      <> 
        {
          (NOMallowance > bidAmount && bidDenom === 'weak' && weakBalance > bidAmount) ? 
            (<SellBtn onClick={onBid}>Sell {weak}</SellBtn>) : 
            ((weakBalance > bidAmount) ? 
              (<SellBtn 
                onClick={() => handleModal(
                  <ApproveModal />
              )}>
                Approve
              </SellBtn>) : 
              (
                (bidDenom === 'weak') ?
                  (bidAmount === '' ? 
                      <SellBtn>Input Value</SellBtn> :
                    < SellBtn>Not enough {weak}</SellBtn>
                  ) : <SellBtn>Input Value</SellBtn>
                  
              )    
            )   
        }
      </>
    )
  }