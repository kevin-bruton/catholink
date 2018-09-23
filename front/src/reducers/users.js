import { userConst } from '@constants'

export function users (state = {}, action) {
  switch (action.type) {
    case userConst.GETALL_REQUEST:
      return {
        loading: true
      }
    case userConst.GETALL_SUCCESS:
      return {
        items: action.users
      }
    case userConst.GETALL_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
