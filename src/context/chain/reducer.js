import BigNumber, { isBigNumber } from 'bignumber.js'

function reducerCallback(state, key, value, update) {
    switch (state[key]) {
        case value: break
        default: 
            switch (key) {
                case 'blockNumber':
                    return {
                        [key]: value,
                        ...update
                    }
                default: 
                    switch (true) {
                        case (isBigNumber(value)):
                            return {
                                [key]: value,
                                ...update
                            }
                        default: throw new Error() 
                    }
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
            console.log("Update All Action Value: ", action.value)
            for (let [key, value] of action.value.entries()) {
                console.log("State: ", state[key])
                if(state[key]) { 
                    console.log(key)
                    switch (key) {
                        case 'currentETHPrice':
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

                        case 'currentNOMPrice':
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
            
        default:
            throw new Error();
    }
}