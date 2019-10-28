module.exports = {
  postNews
}

const { addPost } = require('../db/news')
async function postNews (post) {
  const result = await addPost(post)
  return result
}
