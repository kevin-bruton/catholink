import { alertConst } from '../constants'

export const alertActions = {
  success,
  error,
  clear
}

function success (message) {
  return { type: alertConst.SUCCESS, message }
}

function error (message) {
  return { type: alertConst.ERROR, message }
}

function clear () {
  return { type: alertConst.CLEAR }
}
