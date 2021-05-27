export function stringReducerCallback(state, key, value, update) {
    switch (state[key]) {
        case value: break
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

export function bnReducerCallback(state, key, value, update) {
    switch (state[key]) {
        case value: break
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