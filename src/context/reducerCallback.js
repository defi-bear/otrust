import { isBigNumber } from 'bignumber.js'

export function stringReducerCallback(state, key, value, update) {
    switch (state) {
        case value: break
        default:
            update = {
                ...update,
                [key]: value
            }

            console.log("Update After: ", update)

            return update
        
    } 
}

export function bnReducerCallback(state, key, value, update) {
    switch (state) {
        case value: break
        default:    
            switch (true) {
                case (isBigNumber(value)):
                    return {
                        ...update,
                        [key]: value,
                    }
                default: throw new Error() 
        }
    } 
}