module.exports = {
  getContactsDetails
}

const { getUsersByProfileId } = require('../db/users/search')

async function getContactsDetails (contactsProfileIds) {
  const contactsDetails = await getUsersByProfileId(contactsProfileIds)
  const selectDetails = contactsDetails.map(contact => ({
    profileId: contact.profileId,
    firstName: contact.firstName,
    surname: contact.surname
  }))
  return selectDetails
}
