const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const frontRouter = express.Router()
const frontDir = path.join(__dirname, '..', '..', 'front', 'build')
// const authorizeFront = require('./auth').authorizeFront
const requestLanguage = require('express-request-language')
// frontRouter.get('/service-worker.js', (req, res) => res.sendFile(path.join(__dirname, '..', '..', 'front', 'service-worker.js')))
// frontRouter.get('/login-logo', (req, res) => res.sendFile(path.join(frontDir, 'images', 'logo3.jpg')))

frontRouter.use(cookieParser())

frontRouter.use(requestLanguage({
  languages: ['en', 'en-AU', 'en-UK', 'en-US', 'es', 'es-ES'],
  cookie: {
    name: 'language',
    options: { maxAge: 24 * 3600 * 1000 },
    url: '/languages/{language}'
  }
}))

// frontRouter.use(authorizeFront)

frontRouter.use(express.static(frontDir))

module.exports = frontRouter
