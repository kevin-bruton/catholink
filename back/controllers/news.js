module.exports = {
  postNews,
  getNews
}

const { postNewsDB, getNewsDB } = require('../db/news')

async function postNews (post) {
  const result = await postNewsDB(post)
  return result
}

async function getNews (profileId, page) {
  const result = await getNewsDB(profileId, page)
  return result
}
