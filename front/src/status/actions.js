import { type, login } from './constants'
import { update } from './manager'

// We define actions here only if some aditional action (apart from setting the state passed) is necessary
// As a general rule: include if we need to update a state based on the update of another state
export const actions = {
  [type.LOGIN]: loginAction
}

function loginAction (newLoginState, user) {
  newLoginState === login.SUCCESSFUL ? update(type.USER, user) : update(type.USER, {})
  return newLoginState
}
