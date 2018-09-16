const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const jwtSecret = require('@auth/jwt-secret').privateKey
const db = require('@db')

router.post('/', async (req, res, next) => {
  console.log(`Authenticating user with username: ${req.body.username}; password: ${req.body.password}`)
  let found
  try {
    const cursor = await db.users.find({ username: req.body.username, password: req.body.password })
    found = await cursor.toArray()
    console.log(found)
  } catch (err) {
    console.log(`ERROR: ${err}`)
    return res.json({ error: 'Server error' })
  }
  if (found.length) {
    if (req.body.username === found[0].username && req.body.password === found[0].password) {
      console.log(' -> Authenticated!\n')
      return res.json({user: found[0].username, token: jwt.sign(found[0], jwtSecret)})
    }
  }
  return res.status(401).json({ error: 'Invalid credentials' })
})

module.exports = router
