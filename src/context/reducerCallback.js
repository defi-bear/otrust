import { isBigNumber } from 'bignumber.js'

export function stringReducerCallback(state, key, value, update) {
    console.log("String Callback Key: ", key)
    console.log("String Callback Value: ", value)
    console.log("String Callback State: ", state)
    console.log("String Callback Update: ", update)
    switch (state) {
        case value: console.log("Catches Value: ", value)
        default:
            console.log("Key: ", key)
            console.log("Value: ", value)
            console.log("Update Before: ", update)
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