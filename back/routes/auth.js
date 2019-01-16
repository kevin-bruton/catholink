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
  console.log(`Authenticating user with email: ${req.body.email};\npassword: ${req.body.password}`)
  let found
  try {
    found = await (await db.users.find({email})).toArray()
    console.log(found)
  } catch (err) {
    console.log(`ERROR: ${err}`)
    return res.json({ error: 'Server error' })
  }
  if (found.length) {
    if (email === found[0].email && bcrypt.compareSync(clearPassword, found[0].password)) {
      console.log(' -> Authenticated!\n')
      return res.json({user: btoa(JSON.stringify({email, firstName: found[0].firstName, surname: found[0].surname})), token: jwt.sign(found[0], jwtSecret)})
    }
  }
  const message = 'Invalid credentials'
  console.log(message)
  return res.status(401).json({ error: message })
})

module.exports = router
