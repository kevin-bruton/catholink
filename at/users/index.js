const atob = require('atob')
const users = require('./userList')

module.exports = {
  getRegisteredUser,
  getUserWithName,
  getUserWithConditions
}

const possibleConditions = [
  'ProfilePhotoSet',
  'NoProfilePhotoSet',
  'WorkplaceNotSet'
]

function getRegisteredUser () {
  return transform(users.find(user => user.conditions.includes('Registered')))
}

function getUserWithName (name) {
  return transform(users.find(user => user.name === name))
}

function getUserWithConditions (conditions) {
  return transform(users.find(user => conditions.reduce((acc, cur) => (acc && user.conditions.includes(cur)), true)))
}

function transform (user) {
  if (!user) {
    console.log('************************** USER WITH THE REQUIRED CONDTITIONS NOT FOUND **********************************')
    return false
  }
  const transformedUser = Object.assign({}, user, {password: atob(user.password)})
  global.user = transformedUser
  return transformedUser
}
