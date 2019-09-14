const log = require('@log/')
const getLiterals = require('../email/literals')
const { getUserByProfileId } = require('../db/users/search')
const { sendEmail } = require('../email')
const { getContactEmail } = require('../email/messages')
const {
  addInvitationSent,
  addInvitationReceived,
  storeInvitationCode,
  addContact,
  removeInvitationSent,
  removeInvitationReceived,
  removeInvitationCode,
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
  const getFullName = user => `${user.firstName} ${user.surname}`
  await sendEmail(
    inviteeUser.email,
    getLiterals(inviteeUser.lang).contactEmail.subject(getFullName(inviterUser)),
    getContactEmail(inviteeUser.lang, getFullName(inviteeUser), getFullName(inviterUser), code)
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
  await sendEmail(
    inviterUser.email,
    getLiterals(inviteeUser.lang).contactAcceptedEmail.subject,
    getContactEmail(inviterUser.lang, getFullName(inviteeUser), getFullName(inviterUser))
  )
  await removeInvitationSent(inviterProfileId, inviteeProfileId)
  await removeInvitationReceived(inviteeProfileId, inviterProfileId)
  await removeInvitationCode(inviterProfileId, inviteeProfileId)
  await addContact(inviteeProfileId, inviterProfileId)
  await addContact(inviterProfileId, inviteeProfileId)
  return {fullname: getFullName(inviterUser), gender: inviterUser.gender, profileId: inviterUser.profileId}
}
