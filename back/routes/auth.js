const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const jwtSecret = require('../auth/jwt-secret')

/* POST login. */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Something is not right', user: user })
    }
    req.login(user, {session: false}, (err) => {
      if (err) {
        res.send(err)
      }
      // generate a signed json web token with the contents of user object and return it in the response
      const token = jwt.sign(user, jwtSecret)
      return res.json({user, token})
    })
  })(req, res)
})

module.exports = router

/*
const path = require('path')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const HttpsProxyAgent = require('https-proxy-agent')
const cryptojs = require('crypto-js')
const cache = require('memory-cache')

module.exports = {
  createToken,
  verifyToken,
  authenticate,
  authorizeApi,
  authorizeFront
}

function createToken (username, password) {
  return jwt.sign({username, password}, 'elsecretodelatun', {})
}

function verifyToken (token) {
  return new Promise((resolve, reject) =>
    token
      ? jwt.verify(token, 'elsecretodelatun', (err, decoded) => err ? resolve(false) : resolve(true))
      : resolve(false)
  )
}

async function authenticate (req, res, next) {
  const username = req.body.username
  const password = cryptojs.AES.decrypt(req.body.password, username).toString(cryptojs.enc.Utf8)
  const url = 'https://descinet.bbva.es/stash/rest/api/latest/projects/BBVANET/'
  const basicCredentials = Buffer.from(`${username}:${password}`).toString('base64')
  const options = { headers: { 'Authorization': `Basic ${basicCredentials}` } }
  let response

  if (cache.get('proxy') === 'proxy') {
    options.agent = new HttpsProxyAgent(`http://${username}:${password}@23.2.2.18`)
  }

  try {
    response = await fetch(url, options)
  } catch (err) {
    console.log(`Network error with ${cache.get('proxy')}: ${err}`)
    res.send(`Network error: ${err}`)
  }
  if (response.status === 200) {
    console.log(`User "${username}" was authenticated correctly and will be issued with a token. Proxy setting: ${cache.get('proxy')}`)
    res.send({ authtok: createToken(username, password) })
  } else {
    console.log(`Could not authenticate user ${username}`)
    res.status(403).send(`Could not authenticate user ${username}`)
  }
}

async function authorizeFront (req, res, next) {
  (await verifyToken(req.cookies.authtok))
    ? next()
    : res.sendFile(path.join(__dirname, '..', '..', 'front', 'login.html'))
}

async function authorizeApi (req, res, next) {
  const bearer = req.get('Authorization')
  if (bearer) {
    const token = bearer.slice('Bearer '.length)
    token
      ? (await verifyToken(token))
        ? next()
        : res.status(403).send(`Token "${token}" is not valid`)
      : res.status(403).send(`Token not found`)
  } else {
    res.status(403).send(`No authorization header found`)
  }
}
*/
