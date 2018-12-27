const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const jwtSecret = require('@auth/jwt-secret').privateKey
const db = require('@db')
// const bcrypt = require('bcrypt-nodejs')

router.post('/', async (req, res, next) => {
  const clearPassword = req.body.password
  // const saltRounds = 10
  // const correctPassword = await bcrypt.compare(clearPassword, saltRounds)
  // const hashedPassword = await bcrypt.hash(clearPassword, 10)
  console.log(`Authenticating user with email: ${req.body.email};\npassword: ${req.body.password}`)
  let found
  try {
    const cursor = await db.users.find({ email: req.body.email, password: clearPassword })
    found = await cursor.toArray()
    console.log(found)
  } catch (err) {
    console.log(`ERROR: ${err}`)
    return res.json({ error: 'Server error' })
  }
  if (found.length) {
    if (req.body.email === found[0].email && clearPassword === found[0].password) {
      console.log(' -> Authenticated!\n')
      return res.json({user: found[0].email, token: jwt.sign(found[0], jwtSecret)})
    }
  }
  const message = 'Invalid credentials'
  console.log(message)
  return res.status(401).json({ error: message })
})

module.exports = router
