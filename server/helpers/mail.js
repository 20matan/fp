import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'qqqafa@gmail.com',
    pass: 'mamram123123'
  }
})

const FROM_SENDER = 'qqqafa@gmail.com'
const WIN_SUBJECT = 'Wooow! you won the list!! ✔'
const WIN_TEXT = 'You have won the list, click here for redeem https://w8-front.herokuapp.com'

const sendMail = (email, subject = WIN_SUBJECT, text = WIN_TEXT, cb = () => {}) => {
  console.log('gonna send email', email, subject, text)
  transporter.sendMail({
    from: FROM_SENDER,
    to: email,
    subject,
    text
  }, cb)
}

export default sendMail
