import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'qqqafa@gmail.com',
    pass: 'mamram123123'
  }
})

const mailOptions = {
  from: 'qqqafa@gmail.com',
  // to: '20matan@gmail.com ',
  subject: 'Wooow! you won the list!! ✔',
  text: 'You have won the list, click here for redeem (todo)'
}


const sendMail = email =>
    transporter.sendMail(Object.assign({}, mailOptions, { to: email }))

export default sendMail
