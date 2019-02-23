const {getUserWithName, getUserWithCondition, getUserWithConditions} = require('./index')

console.log('getUserWithName test2:\n', getUserWithName('test2'))

console.log('getUserWithCondition ProfilePhotoSet:\n', getUserWithCondition('ProfilePhotoSet'))

console.log('getUserWithConditions:\n', 
    getUserWithConditions(['NoProfilePhotoSet', 'WorkplaceNotSet'])
  )
  