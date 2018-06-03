import Twilio from 'twilio'

const accountSid = 'AC3f4a856ee7cbb9e2d228b551f902ea80' // Your Account SID from www.twilio.com/console
const authToken = '9fd73be51cd71cd2549c80e1a90f50ac' // Your Auth Token from www.twilio.com/console

const client = new Twilio(accountSid, authToken)

const sendSMS = (number, listName, listId = '') =>
  client.messages.create({
    body: `You won the list ${listName}, enter https://w8-front.herokuapp.com/list/${listId} to redeem the prize!`,
    to: number, // Text this number
    from: '+13473345499' // From a valid Twilio number
  })

export default sendSMS
