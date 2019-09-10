import { combineReducers } from 'redux'
import counter from './counter'
import userData from './userData'
import location from './location'
import recentShop from './recentShop'

export default combineReducers({
  counter,
  userData,
  location,
  recentShop
})
