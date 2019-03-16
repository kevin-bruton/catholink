const db = require('../../../back/db')
const assert = require('assert')

module.exports = {
  selectSignUp,
  fillInRegistrationForm,
  verifySignUpCode,
  checkRegisteredUser,
  deleteUser,
  checkUserNotRegistered
}

const testUser = {firstName: 'Joe', surname: 'Blow', email: 'joe.blow@gmail.com', password: 'Rocker'}

async function selectSignUp () {
  await web.url('http://localhost:5000/login')
  const signUpBtn = await web.$('#signUpBtn')
  await signUpBtn.click()
}

async function fillInRegistrationForm () {
  const firstNameField = await web.$('[name="firstName"]')
  await firstNameField.setValue(testUser.firstName)
  const surnameField = await web.$('[name=surname]')
  await surnameField.setValue(testUser.surname)
  const emailField = await web.$('[name="email"]')
  await emailField.setValue(testUser.email)
  const passwordField = await web.$('[name="password"]')
  await passwordField.setValue(testUser.password)
  const passwordRepeatField = await web.$('[name="passwordRepeat"]')
  await passwordRepeatField.setValue(testUser.password)
  await passwordRepeatField.keys('Tab')
  const signUpBtn = await web.$('#signUpBtn')
  await signUpBtn.click()
}

async function verifySignUpCode () {
  await db.open()
  const users = await db.signUp().find({email: testUser.email}).toArray()
  await web.url(`http://localhost:5000/signupvalidate?code=${users[0].code}`)
  const validated = await web.$('#validatedMessage')
  const isValidated = await validated.isExisting()
  await db.close()
  assert.ok(isValidated)
}

async function checkRegisteredUser () {
  await db.open()
  const users = await db.users().find({email: testUser.email}).toArray()
  await db.close()
  assert.ok(users.length)
}

async function deleteUser () {
  await db.open()
  await db.users().deleteOne({email: testUser.email})
  await db.signUp().deleteOne({email: testUser.email})
  await db.close()
}

async function checkUserNotRegistered () {
  await db.open()
  const users = await db.users().find({email: testUser.email}).toArray()
  await db.close()
  assert.ok(!users.length)
}
