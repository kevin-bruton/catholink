const jwt = require('jsonwebtoken')
const jwtSecret = require('@auth/jwt-secret')
const express = require('express')
const router = express.Router()

router.use(authorizeApi)

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('API version: 1.0')
})

/* GET user profile. */
router.get('/user', (req, res, next) => {
  res.send()
})

module.exports = router

async function authorizeApi (req, res, next) {
  const bearer = req.get('Authorization')
  if (bearer) {
    const token = bearer.slice('Bearer '.length)
    if (token) {
      try {
        jwt.verify(token, jwtSecret)
        next()
      } catch (err) {
        res.status(401).send({ error: 'Unauthorized' })
      }
    }
  }
  res.status(401).send({ error: 'Unauthorized' })
}
