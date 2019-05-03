const {google} = require('googleapis')
const log = require('@log/')

const GOOGLE_CREDENTIALS = JSON.parse(process.env.CAT_GOOGLE_CREDENTIALS)
const GOOGLE_TOKEN = JSON.parse(process.env.CAT_GOOGLE_TOKEN)

if (!GOOGLE_CREDENTIALS || !GOOGLE_TOKEN) {
  log(`Could not retrieve GOOGLE_CREDENTIALS or GOOGLE_TOKEN or either. Exiting...`)
  process.exit()
}

module.exports = {
  gmailClient
}

async function gmailClient () {
  if (!GOOGLE_CREDENTIALS) return

  const oAuth2Client = await setCredentials(GOOGLE_CREDENTIALS)

  return google.gmail({version: 'v1', auth: oAuth2Client})
}

async function setCredentials (credentials) {
  // eslint-disable-next-line camelcase
  const {client_secret, client_id, redirect_uris} = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

  oAuth2Client.setCredentials(GOOGLE_TOKEN)
  return oAuth2Client
}
