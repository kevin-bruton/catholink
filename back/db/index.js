const {USER, PWD, HOST, DB_NAME} = require('@/app-config').MONGO
const mongo = require('mongodb').MongoClient
const _url = `mongodb://${USER}:${PWD}@${HOST}/${DB_NAME}`
let _mongoConnection
let _dbConnection

const open = async () => {
  try {
    _mongoConnection = await mongo.connect(_url, { useNewUrlParser: true })
  } catch (err) {
    console.log(err.stack)
    process.exit()
  }
  _dbConnection = _mongoConnection.db(DB_NAME)
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
