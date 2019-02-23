const atob = require('atob')

module.exports = {
  getUserWithName,
  getUserWithCondition,
  getUserWithConditions
}

const possibleConditions = [
  'Registered',
  'ProfilePhotoSet',
  'NoProfilePhotoSet',
  'WorkplaceNotSet'
]

const users = [
  {
    name: 'test1',
    firstName: 'Kevin',
    surname: 'Bruton',
    email: 'kevin.jose.bs@gmail.com',
    password: 'R2lsYmVyMDA=',
    profileId: 'kevin.bruton-xz8ty5j8',
    conditions: [
      'Registered',
      'ProfilePhotoSet'
    ]
  },
  {
    name: 'test2',
    firstName: 'Joe',
    surname: 'Blow',
    email: 'joe.blow@gmail.com',
    password: 'R2lsYmVyMDA=',
    profileId: 'joe.blow-xz8ty5j8',
    conditions: [
      'Registered',
      'NoProfilePhotoSet',
      'WorkplaceNotSet'
    ]
  }
]

function getUserWithName (name) {
  return transform(users.find(user => user.name === name))
}

function getUserWithCondition (condition) {
  return transform(users.find(user => user.conditions.includes(condition)))
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
