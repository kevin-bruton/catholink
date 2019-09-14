const log = require('@log/')
const router = require('express').Router()
const { acceptInviteToBeContact } = require('../controllers/contacts')

router.get('/:code', async (req, res) => {
  const code = req.params.code
  log(`\nAPI: Received request to accept contact. Code: ${code}`)
  try {
    const inviterUser = await acceptInviteToBeContact(code)
    log('Returning the inviter user:')
    log(inviterUser)
    res.status(200).json(inviterUser)
  } catch (err) {
    log('Error accepting contact:')
    log(err)
    res.status(503).json({error: 'Error accepting another user as contact', message: err})
  }
})

module.exports = router
