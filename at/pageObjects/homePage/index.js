module.exports = {
  checkOnHomePage
}

async function checkOnHomePage () {
  const homePage = await web.$('#HomePage')
  await homePage.waitForDisplayed(5000)
}
