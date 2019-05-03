import {getStoreValue, setStoreValue, sendStoreEvent} from './manager'
import {storeCategory, eventType, messageStatus} from './constants'
import { getSocket } from '@services/socket'

export default actOnEvent

function actOnEvent (type, data) {
  const actions = {
    [eventType.MSG_TO_SERVER]: messageToServer,
    [eventType.MSG_RECEIVED]: addMessageReceived,
    [eventType.MSG_STATUS_UPDATE]: updateMessageStatus,
    [eventType.MSGS_STATUS_READ]: updateMessagesToRead
  }
  if (!actions.hasOwnProperty(type)) return console.error(`'${type}' IS NOT A VALID ACTION TYPE FOR STORE EVENT HANDLER`)
  return actions[type](data)
}

function updateMessagesToRead(from) {
  const messages = getStoreValue(storeCategory.MESSAGES)
  messages[from] = messages[from] || []
  const contactMsgs = messages[from]
  const msgsToUpdate = contactMsgs.filter(msg => msg.status !== messageStatus.READ)
  const updatedMsgs = msgsToUpdate.map(msg => ({...msg, status: messageStatus.READ}))
  updatedMsgs.forEach(msg => sendMessageStatusUpdate(msg))
}

function messageToServer (data) {
  const {to, from, text} = data
  const dateTime = (new Date()).getTime()
  const message = {
    _id: `${from}_${to}_${dateTime}`,
    text,
    status: messageStatus.NOT_SENT,
    dateTime,
    from,
    to
  }
  getSocket().emit('MSG_TO_SERVER', JSON.stringify(message),
    serverResponse => {
      console.log('Sent Message to server. Server response:', serverResponse, 'Message:', message)
      if (serverResponse === 'OK') {
        message.status = messageStatus.SENT
        sendStoreEvent(eventType.MSG_STATUS_UPDATE, message)
      }
    })
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

function sendMessageStatusUpdate(updatedMessage) {
  console.log('Sending message status update to server', updatedMessage)
  getSocket().emit(
    'MSG_STATUS_UPDATE_TO_SERVER',
    JSON.stringify(updatedMessage),
    serverResp => {
      if (serverResp === 'OK') {
        sendStoreEvent(eventType.MSG_STATUS_UPDATE, updatedMessage)
      } else console.log(`ERROR: server didn't update message status to 'read'`)
    }
  )
}

function updateMessageStatus (updatedMsg) {
  const user = getStoreValue(storeCategory.USER)
  console.log('UPDATE MESSAGE STATUS. Current User:', user.profileId, 'Message:', updatedMsg)
  const messages = Object.assign({}, getStoreValue(storeCategory.MESSAGES))
  const msgDirection = updatedMsg.to === user.profileId ? 'from' : 'to'
  const newMessagesContact = messages[updatedMsg[msgDirection]].map(contactMsg =>
    contactMsg._id === updatedMsg._id && updatedMsg.status > contactMsg.status
      ? updatedMsg : contactMsg)
  // messages[updatedMsg[msgDirection]] = newMessagesContact
  const newMessages = Object.assign({}, messages, {[updatedMsg[msgDirection]]: newMessagesContact})
  setStoreValue(storeCategory.MESSAGES, newMessages)
}
