/*
const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const authorizeApi = require('./auth').authorizeApi
const tagRequest = require('../api-requests/tags')
const plans = require('../api-requests/plans')
const releases = require('../api-requests/releases')

express().use(bodyParser.json())
express().use(bodyParser.urlencoded({extended: false}))

router.route('/').get((req, res) => res.json('v.0.1.0'))

router.use(authorizeApi)
router.get('/tags', tagRequest)
router.get('/plans', plans)
router.get('/plans/:plancode', plans)
router.route('/releases')
  .get(releases.get)
  .post(releases.create)
  .delete(releases.eliminate)

module.exports = router
*/
