const { defineStep } = require('cucumber')
const {login, loginAsUserWithName, loginAsUserWithConditions} = require('../../pageObjects/loginPage')

defineStep('I login', async function () {
  await login()
})

defineStep('I login as user with name {string}', async function (name) {
  await loginAsUserWithName(name)
})

/* defineStep('I login as user with condition {string}', async function (condition) {
  await loginAsUserWithCondition(condition)
}) */

defineStep('I login as user with {string}', async function (conditions) {
  const conditionsArr = conditions.split(', ')
  await loginAsUserWithConditions(conditionsArr)
})
