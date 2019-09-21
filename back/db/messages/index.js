const db = require('@db/')
const log = require('@log/')

module.exports = {
  getUserMessages,
  saveMessage,
  updateStatus
}

/** Gets all messages to or from the user
 * The maximum number of messages is defined by the "limit" paramater
 * @param {String} profileId - profileId of the user
 * @param {Number} limit - The maximum number of messages to retrieve per user
 */
async function getUserMessages (profileId, limit) {
  const groupedMessages = {}
  try {
    log(`Trying to get messages for user with profileId ${profileId}, limiting to ${limit} messages per contact`)
    const messages = await db.messages().find({
      $or: [
        {to: profileId},
        {from: profileId}
      ]
    })
      .sort({dateTime: 1})
      .toArray()
    messages.forEach(message => {
      const contactId = message.from === profileId ? message.to : message.from
      if (!groupedMessages[contactId]) {
        groupedMessages[contactId] = []
      }
      if (groupedMessages[contactId].length < limit) {
        groupedMessages[contactId].push(message)
      }
    })
    return groupedMessages
  } catch (err) {
    log('DB ERROR: trying to get messages for user with profileId', profileId, ':', err)
    return {error: 'DB ERROR'}
  }
}

/**
 * Updates the status of a message
 * @param {String} messageId - Corresponds to the "_id" field of the message
 * @param {String} newStatus - The new status to update the message with
 */
async function updateStatus (messageId, newStatus) {
  try {
    log(`Update status for message with id ${messageId}`)
    await db.messages().updateOne({_id: messageId}, {$set: {status: newStatus}})
    log('OK\n')
    return {}
  } catch (err) {
    log(`DB ERROR trying to update message status. messageId: ${messageId}; newStatus: ${newStatus}`, err)
    return {error: 'DB failure'}
  }
}

/**
 * Inserts a new message in the messages collection
 * @param {Object} message - The message to insert
 */
async function saveMessage (message) {
  try {
    log(`Insert new message in messages collection`)
    await db.messages().insertOne(message)
    log('OK\n')
    return {}
  } catch (err) {
    log(`DB ERROR trying to insert a new message. messageId: ${message._id}`)
    log(err)
    return {error: 'DB failure'}
  }
}
