const db = require('@db')

const updateVisibility = async (email, visibility) => {
  try {
    console.log('Trying to update visibility with email', email)
    email && visibility && await db.users().updateOne({email}, {$set: {visibility}})
    console.log('OK\n')
    return {}
  } catch (err) {
    console.log('ERROR trying to update user profile visibility settings db.users().updateOne', err)
    return {error: 'DB failure'}
  }
}

const updateProfile = async (email, profile) => {
  try {
    console.log('Trying to update profile with email', email, '\n  and profile', profile)
    email && profile && await db.users().updateOne({email}, {$set: profile})
    console.log('OK\n')
    return {}
  } catch (err) {
    console.log('ERROR trying to update user profile db.users().updateOne', err)
    return {error: 'DB failure'}
  }
}

const updateAvatar = async (email, avatar) => {
  try {
    console.log('Trying to update avatar with email', email)
    email && avatar && await db.users().updateOne({email}, {$set: {avatar: avatar}})
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
