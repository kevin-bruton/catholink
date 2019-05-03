const fs = require('fs')
const {google} = require('googleapis')
const path = require('path')
const readline = require('readline')
const log = require('@log/')

const GOOGLE_CREDENTIALS = JSON.parse(process.env.CAT_GOOGLE_CREDENTIALS)
const SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'
]

setCredentials(GOOGLE_CREDENTIALS)

async function setCredentials (credentials) {
  // eslint-disable-next-line camelcase
  const {client_secret, client_id, redirect_uris} = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

  let token
  if (!token) {
    try {
      token = await getNewToken(oAuth2Client)
    } catch (err) {
      log(`Couldn't obtain new token: ${err}`)
      return
    }
  }
  oAuth2Client.setCredentials(token)
  return oAuth2Client
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken (oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise((resolve, reject) => {
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close()
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          console.error('Error retrieving access token', err)
          reject(err)
        }
        // Store the token to disk for later program executions
        log(process.env.CAT_ENV_DIR
          ? 'Trying to store new Google token to directory set in env variable CAT_ENV_DIR'
          : `Can't set new Google token to directory because env varialbe CAT_ENV_DIR isn't set`)
        const TOKEN_PATH = path.join(process.env.CAT_ENV_DIR, 'google-token.json')
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) {
            console.error('Error saving token:', err)
            reject(err)
          }
          log('Token stored to', TOKEN_PATH)
          resolve(token)
        })
      })
    })
  })
}
