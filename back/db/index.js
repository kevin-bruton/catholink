const mongo = require('mongodb').MongoClient
const MONGO_CREDENTIALS = JSON.parse(process.env.CAT_MONGO)
const _url = `mongodb://${MONGO_CREDENTIALS.USER}:${MONGO_CREDENTIALS.PWD}@${MONGO_CREDENTIALS.HOST}/${MONGO_CREDENTIALS.DB_NAME}`
let _mongoConnection
let _dbConnection

const open = async () => {
  try {
    _mongoConnection = await mongo.connect(_url, { useNewUrlParser: true })
    console.log(`Connected to mongo at ${_url}`)
  } catch (err) {
    console.log(err.stack)
    console.log('\nCOULD NOT CONNECT TO MONGO... IS IT RUNNING?\n')
    process.exit()
  }
  _dbConnection = _mongoConnection.db(MONGO_CREDENTIALS.DB_NAME)
}

const close = () => _mongoConnection.close()

const connection = () => _dbConnection

// Direct access to collections:
const signUp = () => _dbConnection.collection('signup')
const users = () => _dbConnection.collection('users')
const logger = () => _dbConnection.collection('log')
const messages = () => _dbConnection.collection('messages')
const contactInvitations = () => _dbConnection.collection('contactInvitations')

module.exports = {
  open,
  close,
  connection,
  signUp,
  users,
  messages,
  log: logger,
  contactInvitations
}
