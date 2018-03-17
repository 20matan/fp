import User from '../server/models/user.model'
import List from '../server/models/list.model'
import sendEmail from '../server/helpers/mail'

// every minute check for non finished lists
const finishList = (list) => {
  const { users } = list
  console.log('finishList, list id = ', list.id, 'users = ', users)
  if (!users || users.length === 0) {
    list.finished = true
    list.save()
    return
  }

  const winnerFacebookId = users[0]
  console.log('winner winnerFacebookId', winnerFacebookId)
  User.get(winnerFacebookId)
  .then((user) => {
    const userEmail = user.email
    console.log('user email', userEmail)

    sendEmail(userEmail)
    .then(() => {
      console.log('sent winning email to ', userEmail)
      list.finished = true
      list.save()
    })
    .catch((e) => {
      console.error('error in sending an email for list id = ', list.id, 'user email = ', userEmail, e)
    })
  })
}
const fetchAllLists = () => {
  List.getPassedButNonFinished()
  .then((lists) => {
    console.log('sendEmailsForWinners.List.getPassedButNonFinished lists = ', lists)
    lists.forEach(finishList)
  })
}

const init = () => {
  console.log('init workers function')
  fetchAllLists()
  setInterval(fetchAllLists, 60000)
}

export default init
