const jwt = require('jsonwebtoken')
const privateKey = require('@auth/jwt-secret').privateKey
const express = require('express')
const router = express.Router()

router.use(authorizeApi)

router.get('/', (req, res, next) => {
  console.log('Root api route')
  res.json({ apiVersion: '1.0' })
})

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
        jwt.verify(token, privateKey)
        console.log('authorizeApi: Token verified\n')
        return next()
      } catch (err) {
        console.log('authorizeApi: Token not verified\n')
        return res.status(401).send({ error: 'Unauthorized' })
      }
    }
    console.log('authorizeApi: No token\n')
  }
  console.log('authorizeApi: No bearer\n')
  return res.status(401).send({ error: 'Unauthorized' })
}
