import { isBigNumber } from 'bignumber.js'

export const initialState = { 
    blockNumber: '',
    currentETHPrice: '',
    currentNOMPrice: '',
    NOMbalance: '',
    strongBalance: '',
    supplyNOM: '',
    weakBalance: ''
}

function reducerCallback(state, key, value, update) {
    switch (state[key]) {
        case value: break
        default: 
            switch (true) {
                case (isBigNumber(value)):
                    return {
                        [key]: value,
                        ...update
                    }
                default: break
            } 
    }
}

export function reducer(state, action) {
    switch (action.type) {
        case 'blockNumber': return {
            blockNumber: action.value
        }
        case 'pending': return {
                block: action.value
            }
        case 'updateAll':
            var update
            console.log("Action Value: ", action.value)
            Object.keys(action.value).forEach((key) => {
                console.log(key)
                switch (key.toString()) {
                    case 'currentETHPrice':
                        try {
                            update = reducerCallback(
                                state[key], 
                                key, 
                                action.value[key], 
                                update
                            )
                        } catch(e) {
                            console.log(e)
                        }
                        break

                    case 'currentNOMPrice':
                        try {
                            update = reducerCallback(
                                state[key], 
                                key, 
                                action.value[key], 
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
                                action.value[key], 
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
                                action.value[key], 
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
                                action.value[key], 
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
                                action.value[key], 
                                update
                            )
                        } catch(e) {
                            console.log(e)
                        }
                        break
                    default:
                        throw new Error();
                }
                
            })
            console.log("Update: ", update)
            return {
                ...update
            }
        default:
            throw new Error();
    }
}