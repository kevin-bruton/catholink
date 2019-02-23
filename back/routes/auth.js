const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const jwtSecret = require('@auth/jwt-secret').privateKey
const db = require('@db')
const bcrypt = require('bcrypt-nodejs')
const btoa = require('btoa')

router.post('/', async (req, res, next) => {
  const clearPassword = req.body.password
  const email = req.body.email
  console.log(`Authenticating user with email: ${req.body.email}; password: ${req.body.password}`)
  let found
  try {
    found = await (await db.users().find({email})).toArray()
  } catch (err) {
    console.log(`ERROR: ${err}`)
    return res.json({ error: 'Server error' })
  }
  if (found.length) {
    if (email === found[0].email && bcrypt.compareSync(clearPassword, found[0].password)) {
      console.log(' -> Authenticated!\n')
      const basicUserInfo = {email, firstName: found[0].firstName, surname: found[0].surname, profileId: found[0].profileId}
      return res.json({user: btoa(JSON.stringify(basicUserInfo)), token: jwt.sign(basicUserInfo, jwtSecret)})
    }
  }
  const message = 'Invalid credentials'
  console.log(message)
  return res.status(401).json({ error: message })
})

module.exports = router
