const db = require('@db')

const getUserByName = async searchText => {
  let found
  try {
    found = await (await db.users()
      .find(
        {$or:
          [
            {"firstName" : {$regex: new RegExp(searchText)}},
            {"surname": {$regex: new RegExp(searchText)}}
          ]
        }
      )
      .project({_id: 0, password: 0}))
      .toArray()
  } catch (err) {
    console.log('ERROR trying to find searchText db.users().find:', err)
    return {error: 'DB failure'}
  }
  return found
}

const getUserByEmail = async email => {
  try {
    const found = await (await db.users().find({email}).project({_id: 0, password: 0}))
    return !!found.length && found[0]
  } catch (err) {
    console.log('ERROR trying to get user by email db.users().find', err)
    return {error: 'DB failure'}
  }
}

const getUserByProfileId = async profileId => {
  try {
    const found = await (await db.users().find({profileId}).project({_id: 0, password: 0}).toArray())
    console.log('Search by profileId', profileId, '& found')
    return !!found.length && found[0]
  } catch (err) {
    console.log('ERROR trying to get user by profileId db.users().find', err)
    return {error: 'DB failure'}
  }
}

const profileIdExists = async profileId => {
  try {
    const found = await (await db.users().findOne({profileId}))
    return Boolean(found)
  } catch (err) {
    return false
  }
} 

module.exports = {
  getUserByName,
  getUserByEmail,
  getUserByProfileId,
  profileIdExists
}