module.exports = {
  connect,
  init
}

async function connect () {
  const mongo = require('mongodb').MongoClient
  const url = 'mongodb://localhost:27017'

  let mongoConnection
  try {
    mongoConnection = await mongo.connect(url, { useNewUrlParser: true })
    console.log('DB connection open...')
  } catch (err) {
    console.log(err.stack)
    process.exit()
  }
  return mongoConnection
}

async function init (mongoConnection) {
  const dbName = 'catholink'
  const dbConnection = mongoConnection.db(dbName)
  const dbUsers = dbConnection.collection('users')
  const initialUsers = [
    {
      _id: 1,
      username: 'kevin',
      password: 'kevin'
    }
  ]
  try {
    await dbUsers.insertMany(initialUsers)
  } catch (err) {}
  return [ dbUsers ]
}
