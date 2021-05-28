import React from "react";

import { useWeb3React } from "@web3-react/core"
import { useExchange, useUpdateExchange } from 'context/exchange/ExchangeContext'
import { useModal } from 'context/modal/ModalContext'
import { useChain } from 'context/chain/ChainContext'

import { BondingCont, NOMCont } from 'context/chain/contracts'

import OnomyConfirmationModal from 'components/Modals/components/OnomyConfirmationModal'

import {
  SellBtn
} from "./exchangeStyles"

import TransactionFailedModal from "components/Modals/components/TransactionFailedModal";
import PendingModal from "components/Modals/components/PendingModal";



export default function NOMButton(onBid) {
    const { weakBalance } = useChain()
    const { handleModal } = useModal()
    const { library } = useWeb3React()
    const bondContract = BondingCont(library)
    const NOMcontract = NOMCont(library)

    const { 
      bidAmount, 
      bidDenom,
      NOMallowance,
      weak
    } = useExchange()

    const {
      setBidDenom
    } = useUpdateExchange()

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
          handleModal()
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
                error={`${weak} Balance too low`}
              />
        )
      }
    }
    
    return (
      <> 
        {
          (NOMallowance > bidAmount && bidDenom === 'weak' && weakBalance > bidAmount) ? 
            (<SellBtn onClick={onBid}>Sell {weak}</SellBtn>) : 
            ((weakBalance > bidAmount) ? 
              (<SellBtn 
                onClick={() => handleModal(
                  <OnomyConfirmationModal
                    closeModal={() => handleModal()}
                    onConfirm={() => onApprove(bidAmount)}
                  />
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