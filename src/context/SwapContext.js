import React, { useEffect, useState, createContext, useContext } from 'react'
import { ETHtoNOM, NOMtoETH } from 'utils/bonding'
import { useChain } from './ChainContext'

export const SwapContext = createContext()
export const useSwap = () => useContext(SwapContext)

export const UpdateSwapContext = createContext()
export const useUpdateSwap = () => useContext(UpdateSwapContext)

function SwapProvider ({children}) {
    const { currSupply } = useChain()
    const [swapBuyAmount, setSwapBuyAmount] = useState('')
    const [swapDenom, setSwapDenom] = useState('ETH')
    const [swapSellAmount, setSwapSellAmount] = useState(0)
    const [swapSupply, setSwapSupply] = useState([])

    const contextValue = {
        swapBuyAmount,
        swapDenom,
        swapSellAmount,
        swapSupply
    }

    const updateValue = {
        setSwapBuyAmount,
        setSwapDenom,
        setSwapSellAmount,
        setSwapSupply
    }

    useEffect(() => {
        if (swapBuyAmount === 0) {
            setSwapSellAmount(0)
            setSwapSupply([])
        } else {
            if (swapDenom === 'ETH') {
                const { supplyBot, supplyTop, diff } = ETHtoNOM(swapBuyAmount, currSupply)
                setSwapSellAmount(diff)
                setSwapSupply([supplyBot, supplyTop])
            } else {
                const { supplyBot, supplyTop, diff } = NOMtoETH(swapBuyAmount, currSupply)
                setSwapSellAmount(diff)
                setSwapSupply([supplyBot, supplyTop])
            }
        }
        console.log("Gets here", swapSellAmount)
    },[swapDenom, swapBuyAmount, currSupply])

    return (
        <UpdateSwapContext.Provider value = { updateValue }>
            <SwapContext.Provider value = { contextValue } >
                {children}
            </SwapContext.Provider>
        </UpdateSwapContext.Provider>
    )
}

export default SwapProvider