const getLiterals = require('./literals')

module.exports = {
  getSignUpMessage,
  getContactEmail,
  getContactAcceptedEmail
}

function getSignUpMessage (lang, firstName, code) {
  const literals = getLiterals(lang).signUpEmail
  return `
${literals.greeting} ${firstName}!<br><br>
&nbsp;&nbsp;&nbsp;&nbsp;${literals.line1}<br>
${literals.line2}<br>
&nbsp;&nbsp;&nbsp;&nbsp;<a href="${process.env.CAT_DOMAIN}/signupvalidate?code=${code}">${literals.validate}</a><br><br>
${literals.bye}<br>
${literals.signature}
`
}

function getContactEmail (lang, inviteeName, inviterName) {
  const literals = getLiterals(lang).contactEmail
  return `
${literals.greeting(inviteeName)}<br><br>
${literals.line1(inviterName)}<br>
${literals.line2}<br><br>
<button>${literals.acceptBtnText}</button>
`
}

function getContactAcceptedEmail (lang, inviteeName, inviterName) {
  const literals = getLiterals(lang).contactAcceptedEmail
  return `
${literals.greeting(inviterName)}<br><br>
${literals.line1(inviteeName)}<br>
${literals.line2}<br><br>
${literals.bye}<br><br>
${literals.signature}
`
}
