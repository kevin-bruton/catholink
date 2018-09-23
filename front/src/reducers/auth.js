import { userConst } from '@constants'

let user = JSON.parse(window.localStorage.getItem('user'))
const initialState = user ? { loggedIn: true, user } : {}

export function auth (state = initialState, action) {
  switch (action.type) {
    case userConst.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      }
    case userConst.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      }
    case userConst.LOGIN_FAILURE:
      return {
        loginFailure: true
      }
    case userConst.LOGOUT:
      return {}
    default:
      return state
  }
}
