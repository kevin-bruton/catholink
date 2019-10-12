const log = require('@log/')
const router = require('express').Router()
const { sendResetPasswordEmail, setNewPasswordByCode } = require('../controllers/password')

router.post('/forgot', async (req, res) => {
  const email = req.body.email
  log(`\nAPI: Received request forgot password. Send reset password email. Email: ${email}`)
  try {
    await sendResetPasswordEmail(email)
    res.sendStatus(200)
  } catch (err) {
    log('Error sending reset password email:')
    log(err)
    res.status(503).json({error: 'Error sending reset password email'})
  }
})

router.post('/reset', async (req, res) => {
  const {code, newPassword, email} = req.body
  log(`\nAPI: Received request to reset password. Email: ${email}; Code: ${code}; New pwd: ${newPassword}`)
  try {
    await setNewPasswordByCode(email, code, newPassword)
    res.sendStatus(200)
  } catch (err) {
    log('Error resetting new password by code:')
    log(err)
    res.status(503).json({error: err.message})
  }
})

module.exports = router
