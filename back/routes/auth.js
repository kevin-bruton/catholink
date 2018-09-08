const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const jwtSecret = require('@auth/jwt-secret').privateKey
const db = require('@db')

router.post('/', async (req, res, next) => {
  console.log(`Authenticating user with email: ${req.body.email}; password: ${req.body.password}`)
  const found = await (await db.users.find({ email: req.body.email, password: req.body.password })).toArray()
  if (req.body.email === found[0].email && req.body.password === found[0].password) {
    console.log(' -> Authenticated!\n')
    return res.json({user: found[0], token: jwt.sign(found[0], jwtSecret)})
  }
  return res.json({ error: 'Invalid credentials' })
})

module.exports = router
