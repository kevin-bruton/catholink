import { combineReducers } from 'redux'

import { auth } from './auth'
import { users } from './users'
import { alerts } from './alerts'

export const reducer = combineReducers({
  auth,
  users,
  alerts
})
