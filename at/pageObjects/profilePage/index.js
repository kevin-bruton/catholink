const atob = require('atob')
const expect = require('expect')

module.exports = {
  checkOnProfilePage,
  goToMyProfilePage,
  selectAddProfilePhoto,
  selectUploadPhoto,
  checkMyProfilePhotoSet
}

async function checkOnProfilePage () {
  const profilePage = await web.$('#ProfilePage')
  await profilePage.waitForDisplayed(5000)
}

async function goToMyProfilePage () {
  await web.url('http://localhost:5000/profile/' + user.profileId)
  const profilePage = await web.$('#ProfilePage')
  await profilePage.waitForDisplayed(5000)
}

async function selectAddProfilePhoto () {
  const addAvatar = await web.$('#addAvatar')
  await addAvatar.click()
}

async function selectUploadPhoto () {
  const uploadAvatar = await web.$('#avatarEdit')
  await uploadAvatar.click()
}

async function checkMyProfilePhotoSet () {
  const avatarImg = await web.$('#showAvatar > div > img')
  const srcValue = await avatarImg.getAttribute('src')
  expect(srcValue).toBeDefined()
}
