const express = require('express')
const router = express.Router()

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('API version: 1.0')
})

/* GET user profile. */
router.get('/user', (req, res, next) => {
  res.send()
})

module.exports = router
