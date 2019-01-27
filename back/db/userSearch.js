const db = require('@db')

const userSearch = async searchText => {
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
      .project({_id: 0, firstName: 1, surname: 1}))
      .toArray()
  } catch (err) {
    console.log('ERROR trying to find searchText db.users().find:', err)
    return {error: 'DB failure'}
  }
  return found
}

module.exports = {
  userSearch
}