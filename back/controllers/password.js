const { sendEmail } = require('../email')
const getLiterals = require('../email/literals')
const {getUserByEmail, getUserPwdByProfileId} = require('@db/users/search')
const {generateCode} = require('@helpers/')
const {saveResetPasswordByEmailCode, setNewPassword} = require('@db/users/password')
const {getResetPasswordLinkEmail} = require('../email/messages')
const bcrypt = require('bcrypt-nodejs')
const log = require('@log/')

module.exports = {
  sendResetPasswordEmail,
  setNewPasswordByCode,
  setNewPasswordWithOldOne
}

async function sendResetPasswordEmail (email) {
  const user = await getUserByEmail(email)
  const code = generateCode(50)
  const timestamp = (new Date()).getTime()
  await saveResetPasswordByEmailCode(user.profileId, code, timestamp)
  await sendEmail(
    email,
    getLiterals(user.lang).resetPasswordLinkEmail.subject,
    getResetPasswordLinkEmail(user.lang, user.firstName, email, code)
  )
}

async function setNewPasswordByCode (email, code, newPassword) {
  const user = await getUserByEmail(email)
  const now = (new Date()).getTime()
  const timeOfCodeInMins = (now - user.passwordResetByEmail.timestamp) / 1000 / 60
  const maxMinsForValidCode = 15
  const validCode = user.passwordResetByEmail.code === code
  const outdated = timeOfCodeInMins > maxMinsForValidCode
  if (validCode && !outdated) {
    const hashedPassword = bcrypt.hashSync(newPassword)
    await setNewPassword(user.profileId, hashedPassword)
    log(`New password set by code. Change was requested ${Math.round(timeOfCodeInMins)} mins ago`)
    return true
  } else {
    if (!validCode) {
      log(`Could not validate setting new password by email. Code is invalid!`)
      throw new Error('CODE_INVALID')
    } else if (outdated) {
      log(`Could not validate setting new password by email. Code is outdated. Age: ${Math.round(timeOfCodeInMins)} mins`)
      throw new Error('CODE_OUTDATED')
    }
  }
}

async function setNewPasswordWithOldOne (profileId, oldPassword, newPassword) {
  console.log('setNewPasswordWithOldOne args:', profileId, oldPassword, newPassword)
  const password = await getUserPwdByProfileId(profileId)
  const oldPasswordIsValid = bcrypt.compareSync(oldPassword, password)
  if (oldPasswordIsValid) {
    console.log('old pass valid')
    await setNewPassword(profileId, bcrypt.hashSync(newPassword))
    return true
  } else {
    log(`Could not set new password because the old one provided was incorrect`)
    throw new Error('Could not set new password as old one was invalid')
  }
}
