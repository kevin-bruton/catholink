const db = require('@db/')
const log = require('@log/')

module.exports = {
  updateVisibility,
  updateProfile,
  updateAvatar,
  getMyContacts
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
    return {error: '-DB failure'}
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
