const { defineStep } = require('cucumber')
const {selectProfileBtn, selectViewMyProfile} = require('../../pageObjects/common/profileBtn')
const {
  checkOnProfilePage,
  goToMyProfilePage,
  selectVisibilitySettings,
  selectAddProfilePhoto,
  selectUploadPhoto,
  checkMyProfilePhotoSet,
  changeVisibilitySetting,
  saveVisibilitySettings,
  checkVisibilitySetting
} = require('../../pageObjects/profilePage')

defineStep('I select the "my profile" button', selectProfileBtn)

defineStep('I select "view profile"', selectViewMyProfile)

defineStep('I go to my visibility settings', selectVisibilitySettings)

defineStep(`I'm on the profile page`, checkOnProfilePage)

defineStep('I go to my profile page', goToMyProfilePage)

defineStep('I select the add profile photo option', selectAddProfilePhoto)

defineStep('I can select upload a photo', selectUploadPhoto)

defineStep('I can see my photo on my profile page', checkMyProfilePhotoSet)

defineStep('I change my visibility setting for {string}', async function (field) {
  await changeVisibilitySetting(field, this)
})

defineStep('I save my changes to my visibility settings', saveVisibilitySettings)

defineStep('my visibility setting for {string} is what I set previously', async function (field) {
  await checkVisibilitySetting(field, this)
})
