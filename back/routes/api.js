const jwt = require('jsonwebtoken')
const privateKey = require('@auth/jwt-secret').privateKey
const express = require('express')
const router = express.Router()
const { getRequest } = require('@request')
const { getGospel, setGospel } = require('@gospel')
const { getUserByName, getUserByProfileId } = require('@db/users/search')
const { updateProfile } = require('@db/users/profile')
const atob = require('atob')
const dummyGospel = require('@gospel/dummy')

router.use(authorizeApi)

router.get('/', (req, res, next) => {
  console.log('Root api route')
  res.json({ apiVersion: '1.0' })
})

router.get('/validate', (req, res) => {
  console.log('Validate')
  res.status(200).end()
})

router.get('/user', (req, res) => {
  res.send()
})

router.post('/profile/update', async (req, res) => {
  await updateProfile(req.body.email, req.body.profile)
  res.status(200).end()
})

router.get('/profile/:profileId', async (req, res) => {
  const profileId = req.params.profileId
  const user = await getUserByProfileId(profileId)
  res.send(user)
})

router.get('/search', async (req, res) => {
  console.log('search', req.query.text)
  const searchResults = await getUserByName(req.query.text)
  res.send({searchResults})
})

router.post('/gospel', async (req, res) => {
  // can be optimized with a cronjob to get gospel only once a day for supported languages
  const lang = ((langCode) => ({ en: 'AM', es: 'SP' }[langCode]))(req.body.lang)
  let gospel = getGospel()
  if (!gospel.text) {
    console.log('Gospel not found. Fetching...')
    if (process.env.CATHOLINK_SERVER_MODE === 'DEV') {
      gospel = dummyGospel
    } else {
      const data = await getRequest(`https://publication.evangelizo.ws/${lang}/days/${req.body.date}`)
      const gospelIdx = data.data.readings.length - 1
      gospel = { text: (data.data || {}).readings[gospelIdx].text, title: data.data.readings[gospelIdx].title }
    }
    console.log('Going to set gospel')
    setGospel(gospel)
  } else console.log('Gospel found. Dont have to fetch')
  res.send(gospel)
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
        console.log('authorizeApi: Could not verify this token: ' + token + '\n')
        return res.status(401).send({ error: 'Unauthorized' })
      }
    }
    console.log('authorizeApi: No token\n')
  }
  console.log('authorizeApi: No bearer\n')
  return res.status(401).send({ error: 'Unauthorized' })
}
