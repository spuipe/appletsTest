import { USERDATA } from '../constants/counter'

type INITIAL_STATE = {
    userData: Object
}

const INITIAL_STATE: INITIAL_STATE = {
    userData: {}
}

export default function userData (state=INITIAL_STATE,action: any){
    switch (action.type){
        case USERDATA: 
        return {
            userData: action.userData
        }
        default:
            return state
    }
}