const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const jwtSecret = require('@auth/jwt-secret').privateKey
const db = require('@db')
const crypto = require('crypto-js')

router.post('/', async (req, res, next) => {
  const decryptedPasswd = crypto.AES.decrypt(req.body.password, req.body.username).toString(crypto.enc.Utf8)
  console.log(`Authenticating user with username: ${req.body.username};\npassword: ${req.body.password};\ndecrypted: ${decryptedPasswd}`)
  let found
  try {
    const cursor = await db.users.find({ username: req.body.username, password: decryptedPasswd })
    found = await cursor.toArray()
    console.log(found)
  } catch (err) {
    console.log(`ERROR: ${err}`)
    return res.json({ error: 'Server error' })
  }
  if (found.length) {
    if (req.body.username === found[0].username && decryptedPasswd === found[0].password) {
      console.log(' -> Authenticated!\n')
      return res.json({user: found[0].username, token: jwt.sign(found[0], jwtSecret)})
    }
  }
  const message = 'Invalid credentials'
  console.log(message)
  return res.status(401).json({ error: message })
})

module.exports = router
