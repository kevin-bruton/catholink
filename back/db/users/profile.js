const db = require('@db')

const updateVisibility = async (profileId, visibility) => {
  try {
    console.log('Trying to update visibility with email', profileId)
    profileId && visibility && await db.users().updateOne({profileId}, {$set: {visibility}})
    console.log('OK\n')
    return {}
  } catch (err) {
    console.log('ERROR trying to update user profile visibility settings db.users().updateOne', err)
    return {error: 'DB failure'}
  }
}

const updateProfile = async (profileId, profile) => {
  try {
    console.log('Trying to update profile with profileId', profileId, '\n  and profile', profile)
    profileId && profile && await db.users().updateOne({profileId}, {$set: profile})
    console.log('OK\n')
    return {}
  } catch (err) {
    console.log('ERROR trying to update user profile db.users().updateOne', err)
    return {error: 'DB failure'}
  }
}

const updateAvatar = async (profileId, avatar) => {
  try {
    console.log('Trying to update avatar with profileId', profileId)
    profileId && avatar && await db.users().updateOne({profileId}, {$set: {avatar: avatar}})
    console.log('OK\n')
    return {}
  } catch (err) {
    console.log('ERROR trying to update user avatar db.users().updateOne', err)
    return {error: 'DB failure'}
  }
}

module.exports = {
  updateVisibility,
  updateProfile,
  updateAvatar
}
