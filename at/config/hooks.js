const { remote } = require('webdriverio')
const {Before, After, setDefaultTimeout} = require('cucumber')

setDefaultTimeout(15 * 1000)

Before({tags: "@web", timeout: 60 * 1000}, async function () {
  // This hook will be executed before scenarios tagged with @web
  global.web = await remote({
    logLevel: 'error',
    path: '/wd/hub',
    capabilities: {
        browserName: 'chrome'
    }
  })
  global.web.maximizeWindow()
})

After({tags: "@web"}, async function () {
  await global.web.deleteSession()
})
