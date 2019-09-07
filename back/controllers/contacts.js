const getLiterals = require('../email/literals')
const { getUserByProfileId } = require('../db/users/search')
const { sendEmail } = require('../email')
const { getContactEmail } = require('../email/messages')
const {
  addInvitationSent,
  addInvitationReceived,
  addContact,
  removeInvitationSent,
  removeInvitationReceived
} = require('../db/users/contact')

module.exports = {
  inviteToBeContact,
  acceptInviteToBeContact
}

async function inviteToBeContact (lang, inviteeProfileId, inviterProfileId, message) {
  const inviteeUser = await getUserByProfileId(inviteeProfileId)
  const inviterUser = await getUserByProfileId(inviterProfileId)
  const getFullName = user => `${user.firstName} ${user.surname}`
  await sendEmail(
    inviteeUser.email,
    getLiterals(lang).contactEmail.subject,
    getContactEmail(lang, getFullName(inviteeUser), getFullName(inviterUser))
  )
  await addInvitationSent(inviterProfileId, inviteeProfileId)
  await addInvitationReceived(inviteeProfileId, inviterProfileId)
}

async function acceptInviteToBeContact (lang, inviteeProfileId, inviterProfileId) {
  const inviteeUser = await getUserByProfileId(inviteeProfileId)
  const inviterUser = await getUserByProfileId(inviterProfileId)
  const getFullName = user => `${user.firstName} ${user.surname}`
  await sendEmail(
    inviterUser.email,
    getLiterals(lang).contactAcceptedEmail.subject,
    getContactEmail(lang, getFullName(inviteeUser), getFullName(inviterUser))
  )
  await removeInvitationSent(inviterProfileId, inviteeProfileId)
  await removeInvitationReceived(inviteeProfileId, inviterProfileId)
  await addContact(inviteeProfileId, inviterProfileId)
  await addContact(inviterProfileId, inviteeProfileId)
}
