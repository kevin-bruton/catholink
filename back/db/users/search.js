const db = require('@db/')
const log = require('@log/')

module.exports = {
  getUserByName,
  userSearch,
  getUserByEmail,
  getUserByProfileId,
  getUsersByProfileId,
  profileIdExists,
  getMyProfile,
  getAnothersProfile,
  getUserPwdByProfileId
}

async function getUserByName (searchText) {
  let found
  try {
    found = await (await db.users()
      .find(
        {$or:
          [
            {firstName: {$regex: new RegExp(searchText)}},
            {surname: {$regex: new RegExp(searchText)}}
          ]
        }
      )
      .project({_id: 0, password: 0}))
      .toArray()
  } catch (err) {
    log('ERROR trying to find searchText db.users().find:', err)
    return {error: 'DB failure'}
  }
  return found
}

async function userSearch (search) {
  // requestingUser is the email of the requesting user
  // get users with visibility.profile public,
  // and users with visibility.profile members,
  // and users with visibility.profile contacts that contains requestingUser
  let found
  try {
    found = await (await db.users()
      .find(
        {$and: [
          {$or: [
            {'visibility.profile': 'public'},
            {'visibility.profile': 'members'},
            {$and: [{'visibility.profile': 'contacts'}, {contacts: search.requestingUser}]}
          ]},
          {$or: [{firstName: {$regex: new RegExp(search.searchText, 'i')}}, {surname: {$regex: new RegExp(search.searchText, 'i')}}]}
        ]}
      )
      .project({_id: 0, password: 0, avatar: 0}))
      .toArray()
  } catch (err) {
    log('ERROR trying to find searchText db.users().find:', err)
    return {error: 'DB failure'}
  }
  return found
}

async function getUserByEmail (email) {
  try {
    const found = await db.users().findOne({email}, {projection: {_id: 0, password: 0}})
    return !!found && found
  } catch (err) {
    log('ERROR trying to get user by email db.users().find')
    log(err)
    return {error: 'DB failure'}
  }
}

async function getUserPwdByProfileId (profileId) {
  try {
    const found = await db.users().findOne({profileId}, {projection: {password: 1}})
    log('Search by profileId', profileId, '& found')
    return !!found && found.password
  } catch (err) {
    log('ERROR trying to get user password by profileId ' + profileId + ' db.users().find', err)
    return {error: 'DB failure'}
  }
}

async function getUserByProfileId (profileId) {
  try {
    const found = await db.users().findOne({profileId}, {projection: {_id: 0, password: 0}})
    log('Search by profileId', profileId, '& found')
    return !!found && found
  } catch (err) {
    log('ERROR trying to get user by profileId ' + profileId + ' db.users().find', err)
    return {error: 'DB failure'}
  }
}

async function getUsersByProfileId (profileIds) {
  try {
    const found = await db.users().find({profileId: {$in: profileIds}}, {projection: {_id: 0, password: 0}})
    log('Search by profileId', profileIds, '& found')
    return found
  } catch (err) {
    log('ERROR trying to get users with profileIds ' + profileIds + ' db.users().find', err)
    return {error: 'DB failure'}
  }
}

async function getMyProfile (profileId) {
  const profile = await getUserByProfileId(profileId)
  const {email, joinDate, address1, address2, mobile, telephone, workPlace, avatar, visibility, posts, groups, contacts} = profile
  return {email, joinDate, address1, address2, mobile, telephone, workPlace, avatar, visibility, posts, groups, contacts}
}

async function getAnothersProfile (requestersProfileId, requestedProfileId) {
  function isVisible (isContact, field) {
    return profile.visibility[field] === 'public'
      ? true
      : profile.visibility[field] === 'members'
        ? true
        : (profile.visibility[field] === 'contacts ' && isContact)
  }
  const profile = await getUserByProfileId(requestedProfileId)
  if (profile.error) return profile
  const isContact = profile.contacts.includes(requestersProfileId)
  const profileIsVisible = isVisible(isContact, 'profile')
  if (!profileIsVisible) {
    return {error: 'Not visible'}
  }
  let visibleProfile = {
    firstName: profile.firstName,
    surname: profile.surname,
    avatar: profile.avatar
  }
  if (isVisible(isContact, 'email')) {
    visibleProfile = Object.assign({}, visibleProfile, {email: profile.email})
  }
  if (isVisible(isContact, 'address')) {
    visibleProfile = Object.assign({}, visibleProfile, {address1: profile.address1, address2: profile.address2})
  }
  if (isVisible(isContact, 'mobile')) {
    visibleProfile = Object.assign({}, visibleProfile, {mobile: profile.mobile})
  }
  if (isVisible(isContact, 'telephone')) {
    visibleProfile = Object.assign({}, visibleProfile, {telephone: profile.telephone})
  }
  if (isVisible(isContact, 'parish')) {
    visibleProfile = Object.assign({}, visibleProfile, {parish: profile.parish})
  }
  if (isVisible(isContact, 'workPlace')) {
    visibleProfile = Object.assign({}, visibleProfile, {workPlace: profile.workPlace})
  }
  return visibleProfile
}

async function profileIdExists (profileId) {
  try {
    const found = await db.users().findOne({profileId})
    return Boolean(found)
  } catch (err) {
    return false
  }
}
