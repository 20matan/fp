import User from '../server/models/user.model'
import List from '../server/models/list.model'
import sendEmail from '../server/helpers/mail'

// every minute check for non finished lists
const finishList = (list) => {
  const { users } = list
  console.log('finishList, list id = ', list.id, 'users = ', users)
  if (!users || users.length === 0) {
    list.status = 'done'
    list.save()
    return
  }

  const winnerIds = users.slice(0, list.amount)
  list.winners = winnerIds
  list.status = 'done'
  list.save()
  .then(() => {
    const winnerIdsPromises = winnerIds.map(id => User.get(id))
    Promise.all(winnerIdsPromises)
    .then((usersFromPromise) => {
      // console.log('users', usersFromPromise)
      const emails = usersFromPromise.map(u => u.email)
      console.log('emails', emails)
      emails.map(sendEmail)
    })
  })
}
const fetchAllLists = () => {
  List.getPassedButNonFinished()
  .then((lists) => {
    console.log('sendEmailsForWinners.List.getPassedButNonFinished lists.length ', lists.length)
    lists.forEach(finishList)
  })
}

const init = () => {
  console.log('init workers function')
  fetchAllLists()
  setInterval(fetchAllLists, 60000)
}

export default init
