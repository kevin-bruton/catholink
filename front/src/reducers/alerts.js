import { alertConst } from '@constants'

export function alerts (state = {}, action) {
  switch (action.type) {
    case alertConst.SUCCESS:
      return {
        type: 'alert-success',
        message: action.message
      }
    case alertConst.ERROR:
      return {
        type: 'alert-danger',
        message: action.message
      }
    case alertConst.CLEAR:
      return {}
    default:
      return state
  }
}
