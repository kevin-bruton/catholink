const jwt = require('jsonwebtoken')
const log = require('@log/')
const CAT_JWT = JSON.parse(process.env.CAT_JWT)
const router = require('express').Router()
const { getRequest } = require('../request/')
const { getGospel, setGospel } = require('../gospel/')
const { userSearch, getMyProfile, getAnothersProfile } = require('../db/users/search')
const { updateVisibility, updateProfile, updateAvatar, getMyContacts } = require('../db/users/profile')
const {getUserMessages} = require('../db/messages')
const dummyGospel = require('../gospel/dummy')
const { inviteToBeContact } = require('../controllers/contacts')
const { getContactsDetails } = require('../controllers/contacts-details')
const { setNewPasswordWithOldOne } = require('../controllers/password')
const { postNews, getNews } = require('../controllers/news')

router.use(authorizeApi)

router.get('/', (req, res) => {
  log('API: Root api route')
  res.json({ apiVersion: '1.0' })
})

router.get('/validate', (req, res) => {
  log('API: Validate')
  res.sendStatus(200)
})

router.post('/post', async (req, res) => {
  log(`\nRequest to add new post`)
  const result = await postNews(req.body)
  res.json(result)
})

router.get('/news', async (req, res) => {
  log(`\nRequest to get news`)
  const result = await getNews(req.profileId, req.query.page || 1)
  res.json(result)
})

router.get('/user', (req, res) => {
  res.send()
})

router.post('/password/set-new', async (req, res) => {
  const {oldPassword, newPassword} = req.body
  const profileId = req.profileId
  log(`\nAPI: Received request to reset password. Old: ${oldPassword}; New pwd: ${newPassword}`)
  try {
    await setNewPasswordWithOldOne(profileId, oldPassword, newPassword)
    res.sendStatus(200)
  } catch (err) {
    log('Error resetting new password with old one:')
    log(err)
    res.status(503).json({error: 'Error setting password with old one'})
  }
})

router.post('/visibility/update', async (req, res) => {
  await updateVisibility(req.profileId, req.body.visibility)
  res.sendStatus(200)
})

router.post('/profile/update', async (req, res) => {
  await updateProfile(req.profileId, req.body.profile)
  res.sendStatus(200)
})

router.post('/profile/avatar', async (req, res) => {
  log('API: Received request to update avatar...')
  await updateAvatar(req.profileId, req.body.avatar)
  res.sendStatus(200)
})

router.get('/profile/contacts', async (req, res) => {
  const contacts = await getMyContacts(req.profileId)
  res.send(contacts)
})

router.get('/profile/:profileId', async (req, res) => {
  const requestedProfileId = req.params.profileId
  const profile = (requestedProfileId === req.profileId)
    ? await getMyProfile(requestedProfileId)
    : await getAnothersProfile(req.profileId, requestedProfileId)
  res.send(profile)
})

router.post('/contacts-details', async (req, res) => {
  const contactsProfileIds = req.body
  const contactsDetails = await getContactsDetails(contactsProfileIds)
  res.send(contactsDetails)
})

router.get('/messages', async (req, res) => {
  const maxNumMessagesPerContact = 25
  const messages = await getUserMessages(req.profileId, maxNumMessagesPerContact)
  res.send(JSON.stringify(messages))
})

router.get('/search', async (req, res) => {
  const searchResults = await userSearch({requestingUser: req.profileId, searchText: req.query.text})
  res.send({searchResults})
})

router.post('/gospel', async (req, res) => {
  // can be optimized with a cronjob to get gospel only once a day for supported languages
  const lang = ((langCode) => ({ en: 'AM', es: 'SP' }[langCode]))(req.body.lang)
  let gospel = getGospel()
  if (!gospel.text) {
    log('API: Gospel not found. Fetching...')
    if (process.env.CAT_SERVER_MODE === 'DEV') {
      gospel = dummyGospel
    } else {
      const data = await getRequest(`https://publication.evangelizo.ws/${lang}/days/${req.body.date}`)
      const gospelIdx = data.data.readings.length - 1
      gospel = { text: (data.data || {}).readings[gospelIdx].text, title: data.data.readings[gospelIdx].title }
    }
    log('API: Going to set gospel')
    setGospel(gospel)
  } else log('API: Gospel found. Dont have to fetch')
  res.send(gospel)
})

router.post('/contact/invite', async (req, res) => {
  const { invitee, inviter, message } = req.body
  log(`\nAPI: Received request to invite ${invitee} as contact of ${inviter}`)
  try {
    await inviteToBeContact(invitee, inviter, message)
    res.sendStatus(200)
  } catch (err) {
    log('ERROR SENDING CONTACT INVITE: ' + err.message)
    res.status(503).json({error: 'Error sending contact invite', message: err.message})
  }
})

async function authorizeApi (req, res, next) {
  const bearer = req.get('Authorization')
  if (bearer) {
    const token = bearer.slice('Bearer '.length)
    if (token) {
      try {
        const decoded = jwt.verify(token, CAT_JWT.PRIVATE_KEY)
        req.email = decoded.email
        req.profileId = decoded.profileId
        log('API: authorizeApi: Token verified\n')
        return next()
      } catch (err) {
        log('API: authorizeApi: Could not verify this token: ' + token + '\n')
        return res.status(401).send({ error: 'Unauthorized' })
      }
    }
    log('API: authorizeApi: No token\n')
  }
  log('API: authorizeApi: No bearer\n')
  return res.status(401).send({ error: 'Unauthorized' })
}

module.exports = router
