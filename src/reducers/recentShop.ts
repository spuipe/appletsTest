import { RECENTSHOP } from '../constants/counter'

type INITIAL_STATE = {
    recentShop: Object
}

const INITIAL_STATE: INITIAL_STATE = {
    recentShop: {}
}

export default function recentShop (state=INITIAL_STATE,action: any){
    console.log(action)
    switch (action.type){
        case RECENTSHOP: 
        return {
            recentShop: action.recentShop
        }
        default:
            return state
    }
}