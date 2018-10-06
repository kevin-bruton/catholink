import { actions } from './actions'

export {
  getState,
  update,
  subscribe,
  unsubscribe
}

let store = {}
let reporters = {}

function getState (type) {
  return store[type]
}

function subscribe (type, listener) {
  reporters[type] = listener
}

function unsubscribe (type) {
  delete reporters[type]
}

function update (type, value, ...data) {
  const newValue = actions[type] ? actions[type](value, ...data) : value

  store = Object.assign(store, { [type]: newValue })
  reporters[type] && reporters[type](store[type])
}
