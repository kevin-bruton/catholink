import {getStoreValue, setStoreValue} from './manager'
import {storeCategory, eventType, messageStatus} from './constants'

export default actOnEvent

function actOnEvent (type, data) {
  const actions = {
    [eventType.MSG_TO_SERVER]: addMessageToServer,
    [eventType.MSG_RECEIVED]: addMessageReceived,
    [eventType.MSG_STATUS_UPDATE]: updateMessageStatus
  }
  if (!actions.hasOwnProperty(type)) return console.error(`'${type}' IS NOT A VALID ACTION TYPE FOR STORE EVENT HANDLER`)
  return actions[type](data)
}

function addMessageToServer (message) {
  console.log('STORE ACTION: adding message to send to server:', message)
  const messages = getStoreValue(storeCategory.MESSAGES)
  messages[message.to] = messages[message.to] || []
  messages[message.to].push(message)
  setStoreValue(storeCategory.MESSAGES, messages)
}

function addMessageReceived (message) {
  console.log('STORE ACTION: adding message received')
  message.status = messageStatus.RECEIVED
  const messages = getStoreValue(storeCategory.MESSAGES)
  messages[message.from] = messages[message.from] || []
  messages[message.from].push(message)
  setStoreValue(storeCategory.MESSAGES, messages)
}

function updateMessageStatus (messageNewStatus) {
  const user = getStoreValue(storeCategory.USER)
  console.log('UPDATE MESSAGE STATUS. Current User:', user.profileId, 'Message:', messageNewStatus)
  const messages = Object.assign({}, getStoreValue(storeCategory.MESSAGES))
  const msgDirection = messageNewStatus.to === user.profileId ? 'from' : 'to'
  const newMessagesContact = messages[messageNewStatus[msgDirection]].map(contactMsg =>
    contactMsg._id === messageNewStatus._id && messageNewStatus.status > contactMsg.status
      ? messageNewStatus : contactMsg)
  messages[messageNewStatus[msgDirection]] = newMessagesContact
  const newMessages = Object.assign({}, messages, {[messageNewStatus[msgDirection]]: newMessagesContact})
  setStoreValue(storeCategory.MESSAGES, newMessages)
}
