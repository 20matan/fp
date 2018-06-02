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

const sendMail = (email, publisher, listId, cb = () => {}) => {
  const WIN_TEXT = `${publisher} has published new list. click here to see it! https://w8-front.herokuapp.com/list/${listId}`

  transporter.sendMail({
    from: FROM_SENDER,
    to: email,
    subject: WIN_SUBJECT,
    text: WIN_TEXT
  }, cb)
}

export default sendMail
