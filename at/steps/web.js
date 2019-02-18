const { Given, When, Then } = require('cucumber')
const expect = require('expect')

Given('the browser starts', function() {
  expect(true).toBe(true)
})

When('navegate to google', async function() {
  await web.url('https://webdriver.io')
  expect(true).toBe(true)
})

Then('the title of the web page is google', async function() {
  const title = await web.getTitle()
  expect(title).toBe('WebdriverIO · Next-gen WebDriver test framework for Node.js')
})
