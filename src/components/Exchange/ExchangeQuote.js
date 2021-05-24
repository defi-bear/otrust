import { 
    useExchange, 
    useUpdateExchange 
} from 'context/ExchangeContext'

import {
    ExchangeItem,
    Sending,
    Receiving,
    ExchangeInput,
    MaxBtn,
    ReceivingValue,
    ExchangeButton,
} from "./exchangeStyles"

function NOMButton() {
  
  return (
    <div>
      {
        (NOMallowance > bidAmount && 
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
  )
}

export default function ExchangeQuote(strength) {
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

    const onTextChange = useCallback(
        (evt) => {
          evt.preventDefault()
          setInput(evt.target.value)
          if (bidDenom !== strength) {
            setBidDenom(strength)
          }
        },
        [
            bidDenom,
            setInput,
            setBidDenom
        ]
    );

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

    onBidNOM = () => {
      if (bidDenom !== strength) {
        setBidDenom(strength);
      }
    }

    const onMax = () => {
        (strength === 'strong') ? 
            setInput(format18(strongBalance).toString()) :
            setInput(format18(weakBalance).toString())
    }

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

    return(
        <ExchangeItem>
            <strong>Bid {strength === 'strong' ? pair[0] : pair[1]}</strong>
            <Sending>
                <strong>I'm bidding</strong>
                <ExchangeInput
                    type="text"
                    onChange={onTextChange}
                    value={(bidDenom === strength) ? input : ''}
                />
                {(bidDenom === strength) ? pair[0] : pair[1]}
                <MaxBtn onClick={onMax()}>Max</MaxBtn>
            </Sending>
            <Receiving>
                <strong>I'm asking</strong>
                <ReceivingValue>
                    {
                        (bidDenom === strength) ?
                        (
                            (BigNumber.isBigNumber(output)) ? 
                            format18(output).toFixed(8) : 
                            output
                        ) : ''
                    } {
                    (strength === 'strong') ? pair[1] : pair[0]
                }
                </ReceivingValue>
            </Receiving>
            { 
              (pair[1] === 'wNOM') ?
              <NOMButton /> : 
              <ExchangeButton onClick={onBid}>
                Buy {strength === 'strong' ? pair[1] : pair[0]}
              </ExchangeButton>
            }
        </ExchangeItem>
    )
}