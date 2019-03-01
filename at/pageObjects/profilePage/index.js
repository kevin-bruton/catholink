const expect = require('expect')

module.exports = {
  checkOnProfilePage,
  goToMyProfilePage,
  selectVisibilitySettings,
  selectAddProfilePhoto,
  selectUploadPhoto,
  checkMyProfilePhotoSet,
  changeVisibilitySetting,
  saveVisibilitySettings,
  checkVisibilitySetting
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

/* Selects visibility tab from the profile page */
async function selectVisibilitySettings () {
  const visibilityTab = await web.$(`[data-tab='visibility']`)
  await visibilityTab.click()
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

async function changeVisibilitySetting (field, world) {
  const visibilityOptions = ['public', 'members', 'contacts', 'private']
  const getVisibilityOptionNotSet = async field => {
    return visibilityOptions.reduce(async (accu, cur) => {
      const acc = await accu
      if (acc) return acc
      const fieldVisibility = await web.$(`#${field}-${cur}`)
      const checked = await fieldVisibility.getAttribute('checked')
      return checked ? false : fieldVisibility
    }, false)
  }
  const fieldPrivacy = await getVisibilityOptionNotSet(field)
  world.visibilityOptionSelected = {[field]: fieldPrivacy.selector}
  await fieldPrivacy.waitForDisplayed(5000)
  await fieldPrivacy.click()
}

async function saveVisibilitySettings () {
  const saveVisibilitySettingsBtn = await web.$(`#saveVisibilityBtn`)
  await saveVisibilitySettingsBtn.scrollIntoView(true)
  await saveVisibilitySettingsBtn.waitForDisplayed()
  await saveVisibilitySettingsBtn.click()
}

async function checkVisibilitySetting (field, world) {
  const radioToCheck = await web.$(world.visibilityOptionSelected[field])
  const checked = await radioToCheck.getAttribute('checked')
  expect(checked).toBeTruthy()

}
