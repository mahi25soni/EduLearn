const sgMail = require("@sendgrid/mail")
require("dotenv").config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
    to: 'aayehaye.25@gmail.com', // Change to your recipient
    from: process.env.SEND_GRID_SENDER, // Change to your 
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }

const sendEmail = () => {
    sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode)
      console.log(response[0].headers)
    })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = sendEmail



