const {gmailClient} = require('./gmailClient')
let gmail

module.exports = {
  sendEmail,
  getLabels
}

async function sendEmail(to, subject, message) {
  try {
    gmail = gmail || await gmailClient()
  } catch (err) {
    console.log(`COULDN'T GET GMAIL AUTH CREDENTIALS TO SEND EMAIL:`, err)
    return {error: 'ERROR_SENDING_MAIL'}
  }
  // You can use UTF-8 encoding for the subject using the method below.
  // You can also just use a plain string if you don't need anything fancy.
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    'From: Catholink <catholink.connection@gmail.com>',
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    `${message}`,
  ];
  const messageJoined = messageParts.join('\n');

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(messageJoined)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  try {
    const res = await gmail.users.messages.send({userId: 'me', requestBody: {raw: encodedMessage}})
    return res.data && res.data.labelIds && res.data.labelIds[0]
  } catch (err) {
    console.log(`COULDN'T SEND EMAIL:`, err)
    return {error: 'ERROR_SENDING_EMAIL'}
  }
}

async function getLabels () {
  gmail = gmail || await gmailClient()
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
  })
}
