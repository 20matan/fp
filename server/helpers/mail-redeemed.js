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
const WIN_SUBJECT = 'Thats it! you have done it!'

const sendMail = (email, cb = () => {}) => {
  const WIN_TEXT = `
Great job you redeemed your win of the waiting list!
The creator of the waiting list will contact you as soon as possible to settle all the details.

Thank you for using W8APP!
We will be waiting for you to come back :)
`

  transporter.sendMail({
    from: FROM_SENDER,
    to: email,
    subject: WIN_SUBJECT,
    text: WIN_TEXT
  }, (err, info) => {
    console.log('after mail', err, info)
  })
}

export default sendMail
