import { BigNumber } from 'bignumber.js'
import { bnReducerCallback, stringReducerCallback } from 'context/reducerCallback'


export const bnInitialState = {
    bidAmount = new BigNumber(0),
    askAmount = new BigNumber(0),
    slippage = new BigNumber(0)
}

export const stringInitialState = {
    input = '',
    output = '',
    pair = ['ETH', 'wNOM']
}




export function ExchAmountReducer(state, action) {
    switch (action.type) {
        case 'updateAll':
            var update
            for (let [key, value] of action.value.entries()) {
                if(state[key]) { 
                    switch (key) {
                        case 'askAmount':
                            try { 
                                update = bnReducerCallback(
                                    state[key], 
                                    key, 
                                    value, 
                                    update
                                )
                            } catch(e) {
                                console.log(e)
                            }
                            break

                        case 'bidAmount':
                            try {
                                update = bnReducerCallback(
                                    state[key], 
                                    key, 
                                    value, 
                                    update
                                )
                            } catch(e) {
                                console.log(e)
                            }
                            break
                        case 'NOMallowance':
                            try {
                                update = reducerCallback(
                                    state[key], 
                                    key, 
                                    value, 
                                    update
                                )
                            } catch(e) {
                                console.log(e)
                            }
                            break
                        case 'strongBalance':
                            try {
                                update = reducerCallback(
                                    state[key], 
                                    key, 
                                    value, 
                                    update
                                )
                            } catch(e) {
                                console.log(e)
                            }
                            break
                        case 'supplyNOM':
                            try {
                                update = reducerCallback(
                                    state[key], 
                                    key, 
                                    value, 
                                    update
                                )
                            } catch(e) {
                                console.log(e)
                            }
                            break
                        case 'weakBalance':
                            try {
                                update = reducerCallback(
                                    state[key], 
                                    key, 
                                    value, 
                                    update
                                )
                            } catch(e) {
                                console.log(e)
                            }
                            break
                        case 'blockNumber':
                            try {
                                update = reducerCallback(
                                    state[key], 
                                    key, 
                                    value, 
                                    update
                                )
                            } catch(e) {
                                console.log(e)
                            }
                            break
                        default:
                            throw new Error();
                    }    
                }   
            }
            if (update) {
                return {
                    ...update
                }
            }
            break
        default:
            throw new Error();
    }
}