const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')
const db = require('@db/')
const {profileIdExists} = require('@db/users/search')
const bcrypt = require('bcrypt-nodejs')
const {sendEmail} = require('../email')
const getLiterals = require('../email/literals')
const {getSignUpMessage} = require('../email/messages')
const {generateCode, standardize, removeSpaces} = require('@helpers/')
const log = require('@log/')

router.use(cookieParser())

router.post('/init', async (req, res) => {
  const {firstName, surname, gender, email, password} = req.body
  const hashedPassword = bcrypt.hashSync(password)
  log(`Sign up request for user with email: ${req.body.email}; password: ${req.body.password}`)

  const userIsRegistered = await userRegistered(email)
  if (userIsRegistered.error) {
    return res.status(503).json(userIsRegistered.error)
  }
  if (userIsRegistered) {
    return res.status(409).json({error: 'User is already registered'})
  } else { // The user isn't registered already: proceed to sign up process
    const lang = getLangFromReq(req)
    const startedSignUp = await hasStartedSignUp(email)
    if (startedSignUp.error) {
      return res.status(503).json(startedSignUp.error)
    }
    const codeLength = 50
    const code = generateCode(codeLength)
    let signUpNowStarted
    if (startedSignUp) { // Sign up process started previously
      signUpNowStarted = await restartSignUp(firstName, surname, gender, email, hashedPassword, code, lang)
    } else {
      signUpNowStarted = await startSignUp(firstName, surname, gender, email, hashedPassword, code, lang)
    }
    if (signUpNowStarted) {
      const sentEmail = await sendEmail(email, getLiterals(lang).signUpEmail.subject, getSignUpMessage(lang, firstName, code))
      if (sentEmail.error) {
        await recordEmailFailureStatus(email)
        return res.status(503).json({error: 'Email service failure'})
      } else {
        await recordEmailSentStatus(email)
        return res.status(200).json({message: 'Validation email sent'})
      }
    } else { // Couldn't start or restart sign up process becuase of a DB failure
      return res.status(503).json({error: 'DB failure'})
    }
  }
})

router.get('/validate', async (req, res) => {
  const code = req.query.code
  let found
  log('Validation request received with code: ' + code)
  try {
    found = await (await db.signUp().find({$and: [{code}, {status: {$not: /registered/}}]})).toArray()
  } catch (err) {
    log('ERROR trying to find code db.signUp().find: ' + err)
    return res.status(503).json({error: 'DB failure'})
  }
  if (!found.length) {
    log('User with that code and not registered, not found')
    return res.status(200).json({error: 'Not a valid code'})
  }
  log('Valid code')
  // code found so register user and update signup
  const registered = await registerUser(found[0])
  log('User registered:', registered)
  return registered.error ? res.status(503).json(registered) : res.status(200).end()
})

async function registerUser (user) {
  const profileId = await generateProfileId(user)
  try {
    await db.signUp().updateOne({email: user.email}, {$set: {status: 'registered'}})
    await db.users().insertOne({
      firstName: user.firstName,
      surname: user.surname,
      email: user.email,
      gender: user.gender,
      lang: user.lang,
      profileId,
      joinDate: (new Date()).getTime(),
      groups: [],
      posts: [],
      address1: '',
      address2: '',
      mobile: '',
      telephone: '',
      photoUrl: '',
      workPlace: '',
      parish: '',
      password: user.hashedPassword,
      status: 'active',
      contacts: [],
      visibility: {
        profile: 'public',
        parish: 'members',
        workPlace: 'members',
        email: 'contacts',
        address: 'private',
        mobile: 'private',
        telephone: 'private'
      }
    })
  } catch (err) {
    log('ERROR trying in registerUser trying db.signUp().updateOne and db.user.insertOne', err)
    return {error: 'DB failure'}
  }
  return true
}

async function generateProfileId (user) {
  const codeLength = 8
  const nameStr = standardize(removeSpaces(`${user.firstName}.${user.surname}`)).toLowerCase()
  let profileId
  let profileIdAlreadyExists = false
  do {
    profileId = `${nameStr}-${generateCode(codeLength)}`
    profileIdAlreadyExists = await profileIdExists(profileId)
  } while (profileIdAlreadyExists)
  return profileId
}

async function userRegistered (email) {
  let found
  try {
    found = await (await db.users().find({email})).toArray()
  } catch (err) {
    log(`ERROR db.users().find ${email}: ${err}`)
    return {error: 'Server error'}
  }
  return !!found.length
}

async function hasStartedSignUp (email) {
  let found
  try {
    found = await (await db.signUp().find({email})).toArray()
  } catch (err) {
    log(`ERROR db.signUp().find ${email}: ${err}`)
    return {error: 'Server error'}
  }
  return !!found[0]
}

async function restartSignUp (firstName, surname, gender, email, hashedPassword, code, lang) {
  try {
    const res = await db.signUp().updateOne({email}, {$set: {firstName, surname, gender, hashedPassword, code, lang, status: 'signUpStarted'}})
    log('Updated a user in signup. ModifiedCount:', res.modifiedCount)
    return true
  } catch (err) {
    log(`ERROR trying to updateOne in db.signup: ${err}`)
    return false
  }
}

async function startSignUp (firstName, surname, gender, email, hashedPassword, code, lang) {
  try {
    const res = await db.signUp().insertOne({firstName, surname, gender, email, hashedPassword, code, lang, status: 'signUpStarted', numEmailsSent: 0})
    log('Inserted a new user in signup:')
    log('res.insertedCount:', res.insertedCount)
    return true
  } catch (err) {
    log(`ERROR trying to insertOne in db.signup: ${err}`)
    return false
  }
}

async function recordEmailFailureStatus (email) {
  try {
    await db.signUp().updateOne({email}, {$set: {status: 'emailSendingFailure'}})
  } catch (err) {
    log(`ERROR trying to updateOne in db.signup: ${err}`)
  }
}

async function recordEmailSentStatus (email) {
  try {
    await db.signUp().updateOne({email}, {$set: {status: 'emailSent'}, $inc: {numEmailsSent: 1}})
  } catch (err) {
    log(`ERROR -recordEmailSentStatus- trying to updateOne in db.signup: ${err}`)
  }
}

function getLangFromReq (req) {
  return req.cookies
    ? req.cookies.language
      ? (req.cookies.language).substring(0, 2)
      : 'en'
    : 'en'
}

module.exports = router
