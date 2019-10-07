const db = require('@db/')
const log = require('@log/')

module.exports = {
  saveResetPasswordByEmailCode,
  setNewPassword
}

async function saveResetPasswordByEmailCode (profileId, code, timestamp) {
  try {
    log(`Storing the password email reset code for ${profileId}`)
    await db.users().updateOne({profileId}, {$set: {passwordResetByEmail: {code, timestamp}}})
    log('OK\n')
  } catch (err) {
    log(`ERROR:`)
    log(err + '\n')
    throw new Error()
  }
}

async function setNewPassword (profileId, hashedPassword) {
  try {
    log(`Setting new password for profileId ${profileId}. New hashed password=${hashedPassword}`)
    await db.users().updateOne({profileId}, {$set: {password: hashedPassword}})
    log('OK\n')
  } catch (err) {
    log(`ERROR:`)
    log(err + '\n')
    throw new Error()
  }
}
