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

function getContactEmail (lang, inviteeName, inviterName, inviterGender, code) {
  const literals = getLiterals(lang).contactEmail
  return `
<div style="font-size:14px;">
  ${literals.greeting(inviteeName)}<br><br>
  ${literals.line1(inviterName, inviterGender)}<br>
  ${literals.line2}<br><br>
  <a href="${process.env.CAT_DOMAIN}/contact/accept/${code}"><button style="cursor:pointer;background-color:#3273dc;color:white;padding:0.75em;border-radius:4px;">${literals.acceptBtnText}</button></a>
</div>
`
}

function getContactAcceptedEmail (lang, inviteeName, inviterName, inviteeGender) {
  const literals = getLiterals(lang).contactAcceptedEmail
  return `
    <div style="font-size:14px;">
      ${literals.greeting(inviterName)}<br><br>
      ${literals.line1(inviteeName)}<br>
      ${literals.line2(inviteeGender)}<br><br>
      ${literals.bye}<br><br>
      ${literals.signature}
    </div>
  `
}
