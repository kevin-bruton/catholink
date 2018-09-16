import { userConst } from '@constants'
import { userService } from '@services'
import { alertActions } from './alerts'
import { createBrowserHistory } from 'history'

export const userActions = {
  login,
  logout,
  getAll
}

const history = createBrowserHistory()

function login (username, password) {
  return dispatch => {
    dispatch(request({ username }))

    userService.login(username, password)
      .then(
        user => {
          dispatch(success(user))
          history.push('/')
          window.location.assign('/')
        },
        error => {
          dispatch(failure(error))
          dispatch(alertActions.error(error))
        }
      )
  }

  function request (user) { return { type: userConst.LOGIN_REQUEST, user } }
  function success (user) { return { type: userConst.LOGIN_SUCCESS, user } }
  function failure (error) { return { type: userConst.LOGIN_FAILURE, error } }
}

function logout () {
  userService.logout()
  return { type: userConst.LOGOUT }
}

function getAll () {
  return dispatch => {
    dispatch(request())

    userService.getAll()
      .then(
        users => dispatch(success(users)),
        error => dispatch(failure(error))
      )
  }

  function request () { return { type: userConst.GETALL_REQUEST } }
  function success (users) { return { type: userConst.GETALL_SUCCESS, users } }
  function failure (error) { return { type: userConst.GETALL_FAILURE, error } }
}
