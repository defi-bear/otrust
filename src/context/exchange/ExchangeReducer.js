import { bnReducerCallback, stringReducerCallback } from 'context/reducerCallback'


export function exchStringReducer(state, action) {
    // console.log("Exchange String Reducer State: ", state)
    // console.log("Exchange String Reducer Action: ", action)
    var update = state
    switch (action.type) {
        case 'bidDenom':
            try { 
                update = stringReducerCallback(
                    state[action.type], 
                    action.type, 
                    action.value, 
                    update
                )
            } catch(e) {
                console.log(e)
            }
            break
        case 'input':
                update = stringReducerCallback(
                    state[action.type], 
                    action.type, 
                    action.value, 
                    update
                )
            console.log("Input triggered: ", update)
            break
        case 'output':
            try { 
                update = stringReducerCallback(
                    state[action.type], 
                    action.type, 
                    action.value, 
                    update
                )
            } catch(e) {
                console.log(e)
            }
            break
        case 'status':
            try { 
                update = stringReducerCallback(
                    state[action.type], 
                    action.type, 
                    action.value, 
                    update
                )
            } catch(e) {
                console.log(e)
            }
            break
        case 'strong':
            try { 
                update = stringReducerCallback(
                    state[action.type], 
                    action.type, 
                    action.value, 
                    update
                )
            } catch(e) {
                console.log(e)
            }
            break
        case 'weak':
            try { 
                update = stringReducerCallback(
                    state[action.type], 
                    action.type, 
                    action.value, 
                    update
                )
            } catch(e) {
                console.log(e)
            }
            break
        case 'update':
            for (let [key, value] of action.value.entries()) {
                if(state[key]) { 
                    switch (key) {
                        case 'bidDenom':
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
            break
        default:
            throw new Error();
    }
    if (update) {
        console.log("Exchange String Update: ", update)
        return {
            ...update
        }
    }
}



export function exchBnReducer(state, action) {
    console.log("Exchange BN Reducer State: ", state)
    console.log("Exchange BN Reducer State Action: ", action)
    var update = state

    switch (action.type) {
        case 'askAmount':
            try { 
                update = bnReducerCallback(
                    state[action.type], 
                    action.type, 
                    action.value, 
                    update
                )
            } catch(e) {
                console.log(e)
            }
            console.log("AskAmount Update", action.value)
            break
        case 'bidAmount':
            try { 
                update = bnReducerCallback(
                    state[action.type], 
                    action.type, 
                    action.value, 
                    update
                )
            } catch(e) {
                console.log(e)
            }
            break
        case 'slippage':
            try { 
                update = bnReducerCallback(
                    state[action.type], 
                    action.type, 
                    action.value, 
                    update
                )
            } catch(e) {
                console.log(e)
            }
            break
        case 'update':
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
            break
        default:
            throw new Error();
    }
    
    if (update) {
        console.log("Exchange BN Reducer Update: ", update)
        return {
            ...update
        }
    }
}