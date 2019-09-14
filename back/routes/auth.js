const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('@db/')
const bcrypt = require('bcrypt-nodejs')
const btoa = require('btoa')
const log = require('@log/')
const CAT_JWT = JSON.parse(process.env.CAT_JWT)

router.post('/', async (req, res, next) => {
  const clearPassword = req.body.password
  const email = req.body.email
  log(`Authenticating user with email: ${req.body.email}; password: ${req.body.password}`)
  let found
  try {
    found = await (await db.users().find({email})).toArray()
  } catch (err) {
    log(`ERROR: ${err}`)
    return res.json({ error: 'Server error' })
  }
  if (found.length) {
    if (email === found[0].email && bcrypt.compareSync(clearPassword, found[0].password)) {
      log(' -> Authenticated!\n')
      const basicUserInfo = {email, firstName: found[0].firstName, surname: found[0].surname, profileId: found[0].profileId, contacts: found[0].contacts}
      return res.json({user: btoa(JSON.stringify({...basicUserInfo, ...{avatar: found[0].avatar}})), token: jwt.sign(basicUserInfo, CAT_JWT.PRIVATE_KEY)})
    }
  }
  const message = 'Invalid credentials'
  log(message)
  return res.status(401).json({ error: message })
})

module.exports = router
