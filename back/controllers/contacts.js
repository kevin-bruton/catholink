const log = require('@log/')
const getLiterals = require('../email/literals')
const { getUserByProfileId } = require('../db/users/search')
const { sendEmail } = require('../email')
const { getContactEmail, getContactAcceptedEmail } = require('../email/messages')
const {
  addInvitationSent,
  addInvitationReceived,
  addContact,
  storeInvitationCode,
  removeInvitationCode,
  removeInvitationSent,
  removeInvitationReceived,
  getContactInvitationEntry
} = require('../db/users/contact')

module.exports = {
  inviteToBeContact,
  acceptInviteToBeContact
}

async function inviteToBeContact (inviteeProfileId, inviterProfileId, message) {
  // TODO: Add personalized message to email sent to invitee
  const code = await storeInvitationCode(inviterProfileId, inviteeProfileId)
  const inviteeUser = await getUserByProfileId(inviteeProfileId)
  const inviterUser = await getUserByProfileId(inviterProfileId)
  if (inviterUser.invitationsSent.includes(inviteeProfileId)) {
    throw new Error('Invitation already sent to this user')
  }
  const getFullName = user => `${user.firstName} ${user.surname}`
  await sendEmail(
    inviteeUser.email,
    getLiterals(inviteeUser.lang).contactEmail.subject(getFullName(inviterUser)),
    getContactEmail(inviteeUser.lang, getFullName(inviteeUser), getFullName(inviterUser), inviterUser.gender, code)
  )
  await addInvitationSent(inviterProfileId, inviteeProfileId)
  await addInvitationReceived(inviteeProfileId, inviterProfileId)
}

async function acceptInviteToBeContact (code) {
  const {inviterProfileId, inviteeProfileId} = await getContactInvitationEntry(code)
  log('inviterProfileId: ' + inviterProfileId + '; inviteeProfileId: ' + inviteeProfileId)
  const inviteeUser = await getUserByProfileId(inviteeProfileId)
  const inviterUser = await getUserByProfileId(inviterProfileId)
  const getFullName = user => `${user.firstName} ${user.surname}`
  const inviteeFullName = getFullName(inviteeUser)
  const inviterFullName = getFullName(inviterUser)
  if (inviterUser.contacts.includes(inviteeProfileId) && inviteeUser.contacts.includes(inviterProfileId)) {
    return {fullname: inviterFullName, gender: inviterUser.gender, profileId: inviterUser.profileId}
  }
  await sendEmail(
    inviterUser.email,
    getLiterals(inviterUser.lang).contactAcceptedEmail.subject(inviteeFullName),
    getContactAcceptedEmail(inviterUser.lang, inviteeFullName, inviterFullName, inviteeUser.gender)
  )
  await removeInvitationSent(inviterProfileId, inviteeProfileId)
  await removeInvitationReceived(inviteeProfileId, inviterProfileId)
  await removeInvitationCode(inviterProfileId, inviteeProfileId)
  await addContact(inviteeProfileId, inviterProfileId)
  await addContact(inviterProfileId, inviteeProfileId)
  return {fullname: inviterFullName, gender: inviterUser.gender, profileId: inviterUser.profileId}
}
