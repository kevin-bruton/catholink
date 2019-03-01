module.exports = {
  login,
  loginAsUserWithName,
  loginAsUserWithConditions,
}

const {getRegisteredUser, getUserWithName, getUserWithConditions} = require('../../users')
const {checkOnHomePage} = require('../homePage')

async function login () {
  const user = getRegisteredUser()
  await loginAsUser(user)
}

async function loginAsUserWithName (name) {
  const user = getUserWithName(name)
  await loginAsUser(user)
}

async function loginAsUserWithConditions (conditions) {
  const user = getUserWithConditions(conditions)
  await loginAsUser(user)
}

async function loginAsUser (user) {
  await goToLoginPage()
  await fillInLoginForm(user.email, user.password)
  await checkOnHomePage()
}

async function goToLoginPage () {
  const frontDevUrl = 'http://localhost:5000/login'
  await web.url(frontDevUrl)
}

async function fillInLoginForm (email, password) {
  const emailInput = await web.$('[name=email]')
  await emailInput.setValue(email)

  const passwordInput = await web.$('[name=password]')
  await passwordInput.setValue(password)

  const loginBtn = await web.$('#loginBtn')
  await loginBtn.click()
}