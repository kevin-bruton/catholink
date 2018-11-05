import { actions } from './actions'

export {
  getState,
  update,
  subscribe,
  unsubscribe
}

let store = {}
let listeners = {}

function getState (type) {
  return store[type]
}

function subscribe (type, listener) {
  listeners[type] = listener
}

function unsubscribe (type) {
  delete listeners[type]
}

function update (type, value, ...data) {
  const newValue = actions[type]
    ? actions[type](value, ...data)
    : value

  store = Object.assign(store, { [type]: newValue })
  listeners[type] && listeners[type](store[type])
}
