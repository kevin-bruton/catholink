const db = (function () {
  const _url = 'mongodb://localhost:27017'
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
      console.log(`CAUGHT A DB ERROR WHILE EXECUTING "${funcName}" on the "${colName}" collection:\n${err}`)
      _mongoConnection.close()
      process.exit()
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
          email: 'kevin',
          password: 'lucasdanielguapitos'
        }
      ]
      try {
        await _dbConnection.collection('users').insertMany(initialUsers)
      } catch (err) {}
    },
    users: collection('users'),
    close: () => _mongoConnection.close()
  }
})()

module.exports = db
