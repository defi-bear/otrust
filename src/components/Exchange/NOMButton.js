import React, { useCallback, useEffect } from "react";

import { useContract } from 'context/chain/ContractContext'
import { useUpdateChain } from 'context/chain/ChainContext'
import { useExchange, useUpdateExchange } from 'context/ExchangeContext'
import { useModal } from 'context/modal/ModalContext'

import OnomyConfirmationModal from 'components/Modals/components/OnomyConfirmationModal'

import {
  SellBtn
} from "./exchangeStyles"

import TransactionFailedModal from "components/Modals/components/TransactionFailedModal";
import PendingModal from "components/Modals/components/PendingModal";



export default function NOMButton(onBid) {

  let { handleModal } = useModal()
  const { setPendingTx } = useUpdateChain();

    const { 
      bidAmount, 
      bidDenom,
      NOMallowance,
      pair
    } = useExchange()

    const {
      setBidDenom
    } = useUpdateExchange()
  
    const {
      weakBalance,
      NOMcontract,
      bondContract
    } = useContract()

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
    
    return (
      <div>
        {
          (NOMallowance > bidAmount && 
            bidDenom === 'weak' && weakBalance > bidAmount) ? 
            (<SellBtn onClick={onBid}>Sell {pair[1]}</SellBtn>) : 
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
    )
  }