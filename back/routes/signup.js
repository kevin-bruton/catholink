const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')
const db = require('@db')
const bcrypt = require('bcrypt-nodejs')
const {sendEmail} = require('../email')
const {getLiterals} = require('../email/signupLiterals')

router.use(cookieParser())

router.post('/init', async (req, res) => {
  const {firstName, surname, email, password} = req.body
  const hashedPassword = bcrypt.hashSync(password)
  console.log(`Sign up request for user with email: ${req.body.email};\npassword: ${req.body.password}`)

  const userIsRegistered = await userRegistered(email)
  if (userIsRegistered.error) {
    return res.status(503).json(userIsRegistered.error)
  }
  if (userIsRegistered) {
    return res.status(409).json({error: 'User is already registered'})
  } else { // The user isn't registered already: proceed to sign up process
    const lang = req.cookies.language ? (req.cookies.language).substring(0,2) : 'en'
    const startedSignUp = await hasStartedSignUp(email)
    if (startedSignUp.error) {
      return res.status(503).json(startedSignUp.error)
    }
    const code = generateCode()
    let signUpNowStarted
    if (startedSignUp) { // Sign up process started previously
      signUpNowStarted = await restartSignUp (firstName, surname, email, hashedPassword, code)
    } else {
      signUpNowStarted = await startSignUp (firstName, surname, email, hashedPassword, code)
    }
    if (signUpNowStarted) {
      const sentEmail = await sendEmail(email, getSubject(lang), getMessage(lang, firstName, code))
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
  console.log('Validation request received with code:', code)
  try {
    found = await (await db.signup.find({$and: [{code}, {status: {$not: /registered/}}]})).toArray()
  } catch (err) {
    console.log('ERROR trying to find code db.signup.find:', err)
    return res.status(503).json({error: 'DB failure'})
  }
  if (!found.length) {
    console.log('User with that code and not registered, not found')
    return res.status(200).json({error: 'Not a valid code'})
  }
  console.log('Valid code')
  // code found so register user and update signup
  const registered = await registerUser(found[0])
  console.log('User registered:', registered)
  return registered.error ? res.status(503).json(registered) : res.status(200).end()
})

async function registerUser (user) {
  try {
    await db.signup.updateOne({email: user.email}, {$set:{status: 'registered'}})
    await db.users.insertOne({firstName: user.firstName, surname: user.surname, email: user.email, password: user.hashedPassword, status: 'active'})
  } catch (err) {
    console.log('ERROR trying in registerUser trying db.signup.updateOne and db.user.insertOne', err)
    return {error: 'DB failure'}
  }
  return true
}

async function userRegistered (email) {
  let found
  try {
    found = await (await db.users.find({email})).toArray()
  } catch (err) {
    console.log(`ERROR db.users.find ${email}: ${err}`)
    return {error: 'Server error'}
  }
  return !!found.length
}

async function hasStartedSignUp (email) {
  let found
  try {
    found = await (await db.signup.find({email})).toArray()
  } catch (err) {
      console.log(`ERROR db.signup.find ${email}: ${err}`)
      return {error: 'Server error'}
  }
  return !!found[0]
}

async function restartSignUp (firstName, surname, email, hashedPassword, code) {
  try {
    const res = await db.signup.updateOne({email}, {$set: {firstName, surname, hashedPassword, code, status: 'signUpStarted'}})
    console.log('Updated a user in signup. ModifiedCount:', res.modifiedCount)
    return true
  } catch (err) {
    console.log(`ERROR trying to updateOne in db.signup: ${err}`)
    return false
  } 
}

async function startSignUp (firstName, surname, email, hashedPassword, code) {
  try {
    const res = await db.signup.insertOne({firstName, surname, email, hashedPassword, code, status: 'signUpStarted', numEmailsSent: 0})
    console.log('Inserted a new user in signup:')
    console.log('res.insertedCount:', res.insertedCount)
    return true
  } catch (err) {
    console.log(`ERROR trying to insertOne in db.signup: ${err}`)
    return false
  } 
}

async function recordEmailFailureStatus (email) {
  try {
    await db.signup.updateOne({email}, {$set: {status: 'emailSendingFailure'}})
  } catch (err) {
    console.log(`ERROR trying to updateOne in db.signup: ${err}`)
  }
}

async function recordEmailSentStatus (email) {
  try {
    await db.signup.updateOne({email}, {$set:{status: 'emailSent'}, $inc:{numEmailsSent:1}})
  } catch (err) {
    console.log(`ERROR -recordEmailSentStatus- trying to updateOne in db.signup: ${err}`)
  }
}

function getSubject(lang) {
  let subject
  switch(lang) {
    case 'es': subject = 'Bienvenido a Catholink'; break
    default: subject = 'Welcome to Catholink'; break
  }
  return subject
}

function getMessage(lang, firstName, code) {
  const message = getLiterals(lang)
  return `
${message.greeting} ${firstName}!<br><br>
&nbsp;&nbsp;&nbsp;&nbsp;${message.line1}<br>
${message.line2}<br>
&nbsp;&nbsp;&nbsp;&nbsp;<a href="http://localhost:5000/signupvalidate?validationid=${code}">${message.validate}</a><br><br>
${message.bye}<br>
${message.signature}
`
}

function generateCode () {
  const length = 50
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array(length).join().split(',').map(function() { return chars.charAt(Math.floor(Math.random() * chars.length)); }).join('')
}

module.exports = router
