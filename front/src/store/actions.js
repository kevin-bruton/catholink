import { storeCategory, loginStatus } from './constants'
import { setStoreValue } from './manager'

// We define actions here only if some aditional action (apart from setting the state passed) is necessary
// As a general rule: include if we need to update a state based on the update of another state
export const actions = {
  [storeCategory.DUMMY]: loginAction
}

function loginAction (newLoginState, user) {
  newLoginState === loginStatus.SUCCESSFUL
    ? setStoreValue(storeCategory.USER, user)
    : setStoreValue(storeCategory.USER, {})
  return newLoginState
}
