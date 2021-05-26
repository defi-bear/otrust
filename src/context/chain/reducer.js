import BigNumber, { isBigNumber } from 'bignumber.js'

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
                pending: action.value
            }
        case 'updateAll':
            var update
            console.log("Action Value: ", action.value)
            Object.keys(action.value).forEach((key) => {
                if(state[key]) { 
                    console.log(key)
                    switch (key) {
                        case 'currentETHPrice':
                            console.log("current ETH price reducer")
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
                }   
            })
            console.log("Update: ", update)
            if (update) {
                return {
                    ...update
                }
            }
            
        default:
            throw new Error();
    }
}