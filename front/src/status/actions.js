import { statusType, loginStatus } from './constants'
import { setStatus } from './manager'

// We define actions here only if some aditional action (apart from setting the state passed) is necessary
// As a general rule: include if we need to update a state based on the update of another state
export const actions = {
  [statusType.LOGIN]: loginAction
}

function loginAction (newLoginState, user) {
  newLoginState === loginStatus.SUCCESSFUL
    ? setStatus(statusType.USER, user)
    : setStatus(statusType.USER, {})
  return newLoginState
}
