const {defineStep} = require('cucumber')
const {checkOnHomePage} = require('../../pageObjects/homePage')

defineStep('I am on the {string} page', async function(pageName) {
  switch (pageName) {
    case 'Home':
      await checkOnHomePage()
      break
  }
})