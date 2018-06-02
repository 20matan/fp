import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: {
    user: 'qqqafa@gmail.com',
    pass: 'mamram123123'
  }
})

const FROM_SENDER = 'qqqafa@gmail.com'
const WIN_SUBJECT = 'Wooow! you won the list!! ✔'

const sendMail = (email, listId, cb = () => {}) => {
  const WIN_TEXT = `You have won the list, click here for redeem https://w8-front.herokuapp.com/list/${listId}`

  console.log('gonna send email', email, listId)
  transporter.sendMail({
    from: FROM_SENDER,
    to: email,
    subject: WIN_SUBJECT,
    text: WIN_TEXT
  }, cb)
}

export default sendMail
