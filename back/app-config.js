if (!process.env.CAT_ENV_DIR) {
  console.log(`The required environment variable CAT_ENV_DIR hasn't been set. Exiting...`)
  process.exit()
}
const path = require('path')
const ENV = require(path.join(process.env.CAT_ENV_DIR, 'env.js')).ENV
const CONF = require(path.join(process.env.CAT_ENV_DIR, 'conf.js'))
const MONGO = CONF.MONGO[ENV]
const GOOGLE_CREDENTIALS = CONF.GOOGLE_CREDENTIALS
const JWT = CONF.JWT

module.exports = {
  JWT,
  MONGO,
  GOOGLE_CREDENTIALS
}
