import { combineReducers } from 'redux'
import counter from './counter'
import userData from './userData'
import location from './location'
import recentShop from './recentShop'
import selectShopLocation from './selectShopLocation'

export default combineReducers({
  counter,
  userData,
  location,
  recentShop,
  selectShopLocation
})
