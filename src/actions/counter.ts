import {
  ADD,
  MINUS,
  USERDATA,
  LOCATION,
  RECENTSHOP,
  SELECTSHOPLOCATION
} from '../constants/counter'

export const add = () => {
  return {
    type: ADD
  }
}
export const minus = () => {
  return {
    type: MINUS
  }
}

export const userdata = (userData)=>{
  return {
    type: USERDATA,
    userData
  }
}

export const location = (location)=>{
  return {
    type: LOCATION,
    location
  }
}

export const recentShop = (recentShop)=>{
  return {
    type: RECENTSHOP,
    recentShop
  }
}

export const selectShopLocation = (selectShopLocation)=>{
  return {
    type: SELECTSHOPLOCATION,
    selectShopLocation
  }
}

// 异步的action
export function asyncAdd () {
  return dispatch => {
    setTimeout(() => {
      dispatch(add())
    }, 2000)
  }
}
