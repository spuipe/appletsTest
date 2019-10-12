import { SELECTSHOPLOCATION } from '../constants/counter'

const INITIAL_STATE = {
  selectShopLocation: {}
}

export default function selectShopLocation (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECTSHOPLOCATION:
      return {
        ...state,
        selectShopLocation: action.selectShopLocation
      }
     default:
       return state
  }
}
