module.exports = {
  postNewsDB,
  getNewsDB
}

const db = require('@db/')
const log = require('@log/')

async function postNewsDB (post) {
  try {
    log('Insert new post in news collection')
    log(post)
    await db.news().insertOne(post)
    log(`OK\n`)
    return {success: true}
  } catch (err) {
    log(`DB ERROR trying to insert a new post.`)
    log(err)
    return {error: 'DB failure'}
  }
}

async function getNewsDB (profileId, page) {
  try {
    log('Getting news for user with profileId ' + profileId)
    const resp = await db.news().find({audience: profileId}).project({_id: 0, audience: 0}).sort({timestamp: -1}).skip(25 * (page - 1)).limit(25).toArray()
    console.log(resp)
    return resp
  } catch (err) {
    log('DB ERROR: trying to get news for user with profileId ' + profileId + ':' + err)
    return {error: 'DB ERROR'}
  }
}
