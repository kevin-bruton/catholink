const fs = require('fs')
const readline = require('readline')
const {google} = require('googleapis')

module.exports = {
  gmailClient
}

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'
]
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = '../../catholink2/token.json'
const CREDENTIALS_PATH = '../../catholink2/credentials.json'

async function gmailClient () {
  const credentials = getCredentials()
  if (!credentials) return

  const oAuth2Client = await setCredentials(credentials)
  
  return google.gmail({version: 'v1', auth: oAuth2Client});
}

function getCredentials () {
  let content
  try {
    content = fs.readFileSync(CREDENTIALS_PATH)
    content = JSON.parse(content)
  } catch (err) {
    console.log('Error loading client secret file:', err)
    return false
  }
  return content
}

async function setCredentials(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
  
  let token = getToken()
  if (!token) {
    try {
      token = await getNewToken(oAuth2Client)
    } catch (err) {
      console.log(`Couldn't obtain new token: ${err}`)
      return
    }
  }
  oAuth2Client.setCredentials(token)
  return oAuth2Client
}

function getToken() {
  let token
  try {
    token = fs.readFileSync(TOKEN_PATH) 
  } catch (err) {
    console.log(`Couldn't obtain saved token`)
    return false
  }
  return JSON.parse(token)
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve, reject) => {
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) {
            console.error('Error retrieving access token', err);
            reject(err)
          }
          // Store the token to disk for later program executions
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) {
              console.error('Error saving token:', err)
              reject(err)
            }
            console.log('Token stored to', TOKEN_PATH);
            resolve(token)
          });
        })
      });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      console.log('Labels:');
      labels.forEach((label) => {
        console.log(`- ${label.name}`);
      });
    } else {
      console.log('No labels found.');
    }
  });
}