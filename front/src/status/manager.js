import { actions } from './actions'

export {
  getStatus,
  setStatus,
  subscribeStatus,
  unsubscribeStatus
}

let store = {}
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

  /*
  console.log('setting new status of type', type, ':', newValue)
  console.log('  calling listeners:')
  listeners[type] && (console.log('  ', listeners[type]))
  */
  store = Object.assign(store, { [type]: newValue })
  listeners[type] && Object.keys(listeners[type]).forEach(name => {
    listeners[type][name](newValue)
  })
}
