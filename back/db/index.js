const mongo = require('mongodb').MongoClient

const _url = process.env.CATHOLINK_MONGODB_URI
const _dbName = 'catholink'
let _mongoConnection
let _dbConnection

const open = async () => {
  try {
    if (!_url) {
      console.log(`Environment Variable 'CATHOLINK_MONGODB_URL' not defined. Exiting...`)
      process.exit()
    }
    _mongoConnection = await mongo.connect(_url, { useNewUrlParser: true })
  } catch (err) {
    console.log(err.stack)
    process.exit()
  }
  _dbConnection = _mongoConnection.db(_dbName)
}

const close = () => _mongoConnection.close()

const connection = () => _dbConnection

// Direct access to collections:
const signUp = () => _dbConnection.collection('signup')
const users = () => _dbConnection.collection('users')
const messages = () => _dbConnection.collection('messages')

module.exports = {
  open,
  close,
  connection,
  signUp,
  users,
  messages
}
