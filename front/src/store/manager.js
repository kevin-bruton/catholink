import { actions } from './actions'
import {storeCategory} from './constants'
import actOnEvent from './actOnEvent'
/* Improvements to make:
  - apply DRY to subscribe and unsubscribe as well as calling the listeners
 */
export {
  getStoreValue,
  setStoreValue,
  sendStoreEvent,
  subscribeStoreChanges,
  unsubscribeStoreChanges,
  subscribeStoreEvents,
  unsubscribeStoreEvents
}

const listenerType = {
  EVENT: 'EVENT',
  CATEGORY: 'CATEGORY'
}

// Initial values for store
let store = {
  [storeCategory.MESSAGES]: {}
}
let categoryListeners = {}
let eventListeners = {}

/**
 * Retrieves the value of the specified category in the store
 * @param {string} type - The store category we want the retrieve the value from
 */
function getStoreValue (type) {
  if (type === storeCategory.MESSAGES) return JSON.parse(JSON.stringify(store[type]))
  return store[type]
}

/**
 * Changes values directly in the store in the specified category
 * @param {string} type - The category of the store we want to listen to
 * @param {*} name - The unique name of the listener: we'd usually use the name of the calling component
 * @param {*} listener - The function that will be called when there are changes
 */
function subscribeStoreChanges (type, name, listener) {
  subscribe(listenerType.CATEGORY, type, name, listener)
}

/**
 * Registers a listener that will be called when an event has been fired
 * @param {*} type - The name of the event we want to listen to
 * @param {*} name - The unique name of the listener: we'd usually use the name of the calling component and the event name
 * @param {*} listener - The function that will be called when an event has been fired
 */
function subscribeStoreEvents (type, name, listener) {
  subscribe(listenerType.EVENT, type, name, listener)
}

/**
 * Unregisters the listeners of a certain category in the store
 * @param {*} type - The name of the category we no longer want to listen to
 * @param {*} name - The unique name of the listener we no longer want to use
 */
function unsubscribeStoreChanges (type, name) {
  categoryListeners && categoryListeners[type] && categoryListeners[type][name] && delete categoryListeners[type][name]
}

/**
 * Unregisters the listener of a certain event
 * @param {*} type - The name of the event we no longer want to listen to
 * @param {*} name - The unique name of the listener we no longer want to use
 */
function unsubscribeStoreEvents (type, name) {
  delete eventListeners[type][name]
}

/**
 * MAY BE DEPRECATED...
 * Directly sets a new value to the corresponding category in the store
 * @param {*} type - Store category we want to set
 * @param {*} value - The value we want to set the store category to
 * @param  {...any} data - Additional data we can set using actions
 */
function setStoreValue (type, value, ...data) {
  const newValue = actions[type]
    ? actions[type](value, ...data)
    : value

  store = Object.assign({}, store, { [type]: newValue })
  console.log('SET STORE VALUE. Type:', type, 'newValue:', newValue, 'value:', value)
  callListeners(listenerType.CATEGORY, type, newValue)
}

/**
 * Send an event with data
 * @param {string} type - The event type we are sending
 * @param {object} data - The data we are sending with the event
 */
function sendStoreEvent (type, data) {
  // callListeners(listenerType.EVENT, type, data)
  console.log('Store got event:', type, 'With data:', data)
  actOnEvent(type, data)
}

function subscribe (subscribeType, category, name, listener) {
  const listeners = subscribeType === listenerType.EVENT ? eventListeners : categoryListeners
  listeners[category] = listeners[category] || {}
  listeners[category][name] = listener
}

function callListeners (subscribeType, category, newValue) {
  const listeners = subscribeType === listenerType.EVENT ? eventListeners : categoryListeners
  listeners && listeners[category] && Object.keys(listeners[category]).forEach(name => listeners[category][name](newValue))
}
