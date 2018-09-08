const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const jwtSecret = require('@auth/jwt-secret').privateKey
const db = require('@db')

router.post('/', async (req, res, next) => {
  console.log(`Authenticating user with email: ${req.body.email}; password: ${req.body.password}`)
  let found
  try {
    const cursor = await db.users.find({ email: req.body.email, password: req.body.password })
    found = await cursor.toArray()
    console.log(found)
  } catch (err) {
    console.log(`ERROR: ${err}`)
    return res.json({ error: 'Server error' })
  }
  if (found.length) {
    if (req.body.email === found[0].email && req.body.password === found[0].password) {
      console.log(' -> Authenticated!\n')
      return res.json({user: found[0], token: jwt.sign(found[0], jwtSecret)})
    }
  }
  return res.status(401).json({ error: 'Invalid credentials' })
})

module.exports = router
