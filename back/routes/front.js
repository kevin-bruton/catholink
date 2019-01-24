const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const frontRouter = express.Router()
const frontDir = path.join(__dirname, '..', '..', 'front', 'build')
const requestLanguage = require('express-request-language')

frontRouter.use(cookieParser())

frontRouter.use(requestLanguage({
  languages: ['en', 'en-AU', 'en-UK', 'en-US', 'es', 'es-ES'],
  cookie: {
    name: 'language',
    options: { maxAge: 24 * 3600 * 1000 },
    url: '/languages/{language}'
  }
}))

frontRouter.use(express.static(frontDir))

frontRouter.get('/*', (req, res) => {
  res.sendFile(path.join(frontDir + '/index.html'))
})

module.exports = frontRouter
