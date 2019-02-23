const { defineStep } = require('cucumber')
const {selectProfileBtn, selectViewMyProfile} = require('../../pageObjects/common/profileBtn')
const {checkOnProfilePage, goToMyProfilePage, selectAddProfilePhoto, selectUploadPhoto, checkMyProfilePhotoSet} = require('../../pageObjects/profilePage')

defineStep('I select the "my profile" button', async function () {
  await selectProfileBtn()
})

defineStep('I select "view profile"', async function () {
  await selectViewMyProfile()
})

defineStep(`I'm on the profile page`, async function () {
  await checkOnProfilePage()
})

defineStep('I go to my profile page', async function () {
  await goToMyProfilePage()
})

defineStep('I select the add profile photo option', async function () {
  await selectAddProfilePhoto()
})

defineStep('I can select upload a photo', async function () {
  await selectUploadPhoto()
})

defineStep('I can see my photo on my profile page', async function () {
  await checkMyProfilePhotoSet()
})
