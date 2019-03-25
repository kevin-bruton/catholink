import { actions } from './actions'
import {statusType} from './constants'

export {
  getStatus,
  setStatus,
  subscribeStatus,
  unsubscribeStatus
}

// Initial values for store
let store = {
  [statusType.MESSAGES]: []
}
let listeners = {}

function getStatus (type) {
  return store[type]
}

function subscribeStatus (type, name, listener) {
  listeners[type] = listeners[type] || {}
  listeners[type][name] = listener
}

function unsubscribeStatus (type, name) {
  delete listeners[type][name]
}

function setStatus (type, value, ...data) {
  const newValue = actions[type]
    ? actions[type](value, ...data)
    : value

  store = Object.assign({}, store, { [type]: newValue })
  listeners[type] && Object.keys(listeners[type]).forEach(name => listeners[type][name](newValue))
}
