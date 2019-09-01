const db = require('@db/')

module.exports = {
  insertLog
}

async function insertLog (id, text) {
  try {
    console.log('Going to write to log:', id, text)
    await db.log().insertOne({_id: id, text})
    return {}
  } catch (err) {
    console.log('error writing log:', id, text)
    console.log(err)
    return {error: 'DB failure'}
  }
}
