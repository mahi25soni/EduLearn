const sgMail = require("@sendgrid/mail")
require("dotenv").config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const createMessage = (email, otp) => {
  const msg = {
    to: email, // Change to your recipient
    from: process.env.SEND_GRID_SENDER, // Change to your 
    subject: 'OTP for your EduLearn Registration',
    text : "Something is very very fishi",
    html: `<strong>Your registration OTP is <strong>${otp} <strong>and this is valid for 2 minutes only</strong>`,
  }

  return msg;
}
const sendEmail = (message) => {
    sgMail
    .send(message)
    .then((response) => {
      console.log(response[0].statusCode)
      console.log(response[0].headers)
    })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = {createMessage, sendEmail}



