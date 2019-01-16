const nodemailer = require('nodemailer');
const pass = require('../../../catholink')

module.exports = {
  sendEmail
}

const outlookConfig = {
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: {
    ciphers:'SSLv3'
  },
  auth: {
    user: 'catholink@outlook.com',
    pass
  }
}

const yandexConfig = {
  // host: "smtp.yandex.ru",
  host: "smtp.yandex.com",
  secureConnection: false,
  port: 465,
  tls: { ciphers: 'SSLv3'},
  auth: { user: 'catholink@yandex.com', pass: 'Gilber00' }
}

function sendEmail (to, subject, message) {
  return new Promise(resolve => {
    const mailOptions = {
      from: '"Catholink" <catholink@yandex.com>', // sender address (who sends)
      to, // list of receivers (who receives)
      subject,
      html: message // '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
    }
     
    const transporter = nodemailer.createTransport(yandexConfig)
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error)
        resolve({error})
      } else {
        console.log('Email sent to:', info.accepted)
        console.log('Response:', info.response)
        resolve({emailSentTo: info.accepted, response: info.response})
      }
    })
  })
}
