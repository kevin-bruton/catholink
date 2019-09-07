const db = require('@db/')
const log = require('@log/')

module.exports = {
  updateVisibility,
  updateProfile,
  updateAvatar,
  getMyContacts,
  addInvitationSent,
  addInvitationReceived,
  addContact,
  removeInvitationSent,
  removeInvitationReceived,
  removeContact
}

async function updateVisibility (profileId, visibility) {
  try {
    log('Trying to update visibility with email', profileId)
    profileId && visibility && await db.users().updateOne({profileId}, {$set: {visibility}})
    log('OK\n')
    return {}
  } catch (err) {
    log('ERROR trying to update user profile visibility settings db.users().updateOne', err)
    return {error: 'DB failure'}
  }
}

async function updateProfile (profileId, profile) {
  try {
    log('Trying to update profile with profileId', profileId, '\n  and profile', profile)
    profileId && profile && await db.users().updateOne({profileId}, {$set: profile})
    log('OK\n')
    return {}
  } catch (err) {
    log('ERROR trying to update user profile db.users().updateOne', err)
    return {error: 'DB failure'}
  }
}

async function updateAvatar (profileId, avatar) {
  try {
    log('Trying to update avatar with profileId', profileId)
    profileId && avatar && await db.users().updateOne({profileId}, {$set: {avatar: avatar}})
    log('OK\n')
    return {}
  } catch (err) {
    log('ERROR trying to update user avatar db.users().updateOne')
    log(err)
    return {error: 'DB failure'}
  }
}

async function addInvitationSent (profileId, sentToProfileId) {
  try {
    log(`Trying to add invitation sent for ${profileId}. Sent to ${sentToProfileId}`)
    await db.users().updateOne({profileId}, {$push: {invitationsSent: sentToProfileId}})
    log('OK\n')
  } catch (err) {
    log(`ERROR trying to add ${sentToProfileId} to invitationsSent for ${profileId}`)
    log(err)
    throw new Error()
  }
}

async function addInvitationReceived (profileId, profileIdReceivedFrom) {
  try {
    log(`Trying to add invitation received for ${profileId}. Received from ${profileIdReceivedFrom}`)
    await db.users().updateOne({profileId}, {$push: {invitationsReceived: profileIdReceivedFrom}})
    log('OK\n')
  } catch (err) {
    log(`ERROR trying to add ${profileIdReceivedFrom} to invitationsReceived for ${profileId}`)
    log(err)
    throw new Error()
  }
}

async function addContact (profileId, newContactProfileId) {
  try {
    log(`Trying to add the ${newContactProfileId} as a new contact for ${profileId}`)
    await db.users().updateOne({profileId}, {$push: {contacts: newContactProfileId}})
    log('OK\n')
  } catch (err) {
    log(`ERROR trying to add ${newContactProfileId} as a contact for ${profileId}`)
    log(err)
    throw new Error()
  }
}

async function removeInvitationSent (profileId, profileIdToRemove) {
  try {
    log(`Trying to remove ${profileIdToRemove} from invitationsSent for ${profileId}`)
    await db.users().updateOne({profileId}, {$pull: {invitationsSent: profileIdToRemove}})
    log('OK\n')
  } catch (err) {
    log(`ERROR trying to remove ${profileIdToRemove} from invitationsSent for ${profileId}`)
    log(err)
    throw new Error()
  }
}

async function removeInvitationReceived (profileId, profileIdToRemove) {
  try {
    log(`Trying to remove ${profileIdToRemove} from invitationsReceived for ${profileId}`)
    await db.users().updateOne({profileId}, {$pull: {invitationsReceived: profileIdToRemove}})
    log('OK\n')
  } catch (err) {
    log(`ERROR trying to remove ${profileIdToRemove} from invitationsReceived for ${profileId}`)
    log(err)
    throw new Error()
  }
}

async function removeContact (profileId, profileIdToRemove) {
  try {
    log(`Trying to remove ${profileIdToRemove} from contacts for ${profileId}`)
    await db.users().updateOne({profileId}, {$pull: {contacts: profileIdToRemove}})
    log('OK\n')
  } catch (err) {
    log(`ERROR trying to remove ${profileIdToRemove} from contacts for ${profileId}`)
    log(err)
    throw new Error()
  }
}

async function getMyContacts (profileId) {
  try {
    log('Getting contacts for user with profileId ', profileId)
    const resp = await db.users().find({profileId}).project({_id: 0, contacts: 1}).toArray()
    return resp[0].contacts
  } catch (err) {
    log('DB ERROR: trying to get contacts for user with profileId', profileId, ':', err)
    return {error: 'DB ERROR'}
  }
}
