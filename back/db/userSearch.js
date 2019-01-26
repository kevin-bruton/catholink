const db = require('@db')

const userSearch = async searchText => {
  let found
  console.log('Searching db with text:', searchText)
  try {
    found = await (await db.users().find({"firstName" : {$regex: new RegExp(searchText)}}).project({_id: 0, firstName: 1, surname: 1})).toArray()
  } catch (err) {
    console.log('ERROR trying to find searchText db.users().find:', err)
    return {error: 'DB failure'}
  }
  console.log(found)
  return found
}

module.exports = {
  userSearch
}