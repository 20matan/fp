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
const WIN_SUBJECT = 'New list in W8 App!'

const sendMail = (email, publisher, listId, title, cb = () => {}) => {
  const WIN_TEXT = `Hey!
we wanted to inform you that ${publisher} has published new list: ${title}

Get in now and be the firt one to register!
click here to see it! https://w8-front.herokuapp.com/list/${listId}`

  transporter.sendMail({
    from: FROM_SENDER,
    to: email,
    subject: WIN_SUBJECT,
    text: WIN_TEXT
  }, cb)
}

export default sendMail
