import { LOCATION } from '../constants/counter'

type INITIAL_STATE = {
    location: Object
}

const INITIAL_STATE: INITIAL_STATE = {
    location: {}
}

export default function location (state=INITIAL_STATE,action){
    switch (action.type){
        case LOCATION: 
        return {
            location: action.location
        }
        default:
            return state
    }
}