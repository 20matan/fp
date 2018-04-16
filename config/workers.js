import User from '../server/models/user.model'
import List from '../server/models/list.model'
import sendEmail from '../server/helpers/mail'
import sendSMS from '../server/helpers/sms'

// every minute check for non finished lists
const finishList = (list) => {
  const { users } = list
  console.log('finishList, list id = ', list.id, 'users = ', users)
  if (!users || users.length === 0) {
    console.log('no users....')
    list.status = 'done'
    list.save()
    return
  }
  
  console.log('keep goin')
  const winnerIds = users.slice(0, list.amount)
  list.winners = winnerIds
  list.status = 'done'
  list.save().then(() => {
    console.log('after1')
    const winnerIdsPromises = winnerIds.map(id => User.get(id))
    console.log('winnerIdsPromises', winnerIdsPromises)
    Promise.all(winnerIdsPromises).then((usersFromPromise) => {
      console.log('inside the promise all')
      // console.log('users', usersFromPromise)
      // const emails = usersFromPromise.map(u => u.email) 
      usersFromPromise.forEach((u) => {
        console.log('current in user', u.email, u.mobileNumber)
        sendEmail(u.email)
        if (u.mobileNumber) {
          console.log('gonna send win sms to', u.mobileNumber)
          sendSMS(u.mobileNumber, list.title)
        }
      })
      // const phoneNumbers = usersFromPromise.map(u => u.phoneNumber)
      // console.log('emails', emails)
      // emails.map(sendEmail)
      // phoneNumbers.map(sendSMS)
    })
  })
}
const fetchAllLists = () => {
  List.getPassedButNonFinished().then((lists) => {
    console.log(
      'sendEmailsForWinners.List.getPassedButNonFinished lists.length ',
      lists.length
    )
    lists.forEach(finishList)
  })
}

const init = () => {
  console.log('init workers function')
  fetchAllLists()
  setInterval(fetchAllLists, 60000)
}

export default init
