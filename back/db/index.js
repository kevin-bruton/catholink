const bcrypt = require('bcrypt-nodejs')

const db = (function () {
  const _url = process.env.CATHOLINK_MONGODB_URI
  const _dbName = 'catholink'
  let _mongoConnection
  let _dbConnection

  const connect = async () => {
    const mongo = require('mongodb').MongoClient

    try {
      _mongoConnection = await mongo.connect(_url, { useNewUrlParser: true })
    } catch (err) {
      console.log(err.stack)
      process.exit()
    }
    return _mongoConnection
  }
  const dbValidator = async (colName, funcName, ...params) => {
    let resp
    try {
      resp = await _dbConnection.collection(colName)[funcName](...params)
    } catch (err) {
      console.log(`CAUGHT A DB ERROR WHILE EXECUTING "${funcName}" on the "${colName}" collection:\n${err}\n${err.stack}`)
      _mongoConnection.close()
    }
    return resp
  }
  const collection = (colName) => {
    const collectionFunctions = {}
    const funcs = [ 'find', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany', 'findOneAndUpdate', 'findOneAndDelete', 'findOneAndReplace' ]
    funcs.forEach(func => { collectionFunctions[func] = async (...params) => dbValidator(colName, func, ...params) })
    return collectionFunctions
  }

  return {
    init: async () => {
      await connect()
      _dbConnection = _mongoConnection.db(_dbName)
      const initialUsers = [
        {
          _id: 1,
          firstName: 'Joe',
          surname: 'Blow',
          email: 'catholink.connect@gmail.com',
          password: bcrypt.hashSync('secret'),
          status: 'firstUser'
        }
      ]
      try {
        await _dbConnection.collection('users').insertMany(initialUsers)
      } catch (err) {}
    },
    users: collection('users'),
    signup: collection('signup'),
    close: () => _mongoConnection.close()
  }
})()

module.exports = db
