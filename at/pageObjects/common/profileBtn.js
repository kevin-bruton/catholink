module.exports = {
  selectProfileBtn,
  selectViewMyProfile
}

async function selectProfileBtn () {
  const profileBtn = await web.$('#ProfileBtn')
  await profileBtn.click()
}

async function selectViewMyProfile () {
  const viewMyProfileOpt = await web.$('#ViewMyProfileMenuOpt')
  await viewMyProfileOpt.click()
}