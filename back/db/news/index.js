module.exports = {
  addPost
}

const db = require('@db/')
const log = require('@log/')

async function addPost (post) {
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
