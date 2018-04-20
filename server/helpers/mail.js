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
const WIN_TEXT = 'You have won the list, click here for redeem (todo)'

const sendMail = (email, subject = WIN_SUBJECT, text = WIN_TEXT) =>
  transporter.sendMail({
    from: FROM_SENDER,
    to: email,
    subject,
    text
  })

export default sendMail
