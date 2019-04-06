import { actions } from './actions'
import {storeCategory} from './constants'

export {
  getStoreValue,
  setStoreValue,
  sendEvent,
  subscribeStoreChanges,
  unsubscribeStoreChanges
}

// Initial values for store
let store = {
  [storeCategory.MESSAGES]: []
}
let listeners = {}

function getStoreValue (type) {
  return store[type]
}

function subscribeStoreChanges (type, name, listener) {
  listeners[type] = listeners[type] || {}
  listeners[type][name] = listener
}

function unsubscribeStoreChanges (type, name) {
  delete listeners[type][name]
}

function setStoreValue (type, value, ...data) {
  const newValue = actions[type]
    ? actions[type](value, ...data)
    : value

  store = Object.assign({}, store, { [type]: newValue })
  listeners[type] && Object.keys(listeners[type]).forEach(name => listeners[type][name](newValue))
}
