const { defineStep } = require('cucumber')
const {
  selectSignUp,
  fillInRegistrationForm,
  verifySignUpCode,
  checkRegisteredUser,
  deleteUser,
  checkUserNotRegistered
} = require('../../pageObjects/signUp')

defineStep('I select the sign up option on the login page', selectSignUp)

defineStep('I fill in the registration form and send it', fillInRegistrationForm)

defineStep('I verify my email with the code sent', verifySignUpCode)

defineStep('I am a registered user', checkRegisteredUser)

defineStep('I delete myself from the DB', deleteUser)

defineStep('I am no longer found on the DB', checkUserNotRegistered)
