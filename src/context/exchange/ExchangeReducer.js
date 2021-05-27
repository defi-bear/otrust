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
    strong = 'ETH',
    weak = 'wNOM'
}


export function ExchStringReducer(state, action) {
    switch (action.type) {
        case 'updateAll':
            var update
            for (let [key, value] of action.value.entries()) {
                if(state[key]) { 
                    switch (key) {
                        case 'input':
                            try { 
                                update = stringReducerCallback(
                                    state[key], 
                                    key, 
                                    value, 
                                    update
                                )
                            } catch(e) {
                                console.log(e)
                            }
                            break

                        case 'output':
                            try {
                                update = stringReducerCallback(
                                    state[key], 
                                    key, 
                                    value, 
                                    update
                                )
                            } catch(e) {
                                console.log(e)
                            }
                            break
                        case 'strong':
                            try {
                                update = stringReducerCallback(
                                    state[key], 
                                    key, 
                                    value, 
                                    update
                                )
                            } catch(e) {
                                console.log(e)
                            }
                            break
                        case 'weak':
                            try {
                                update = stringReducerCallback(
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



export function ExchBNReducer(state, action) {
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
                        case 'slippage':
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