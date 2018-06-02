import User from '../server/models/user.model'
import List from '../server/models/list.model'
import sendEmail from '../server/helpers/mail'
import sendSMS from '../server/helpers/sms'

const TIME_TO_REDEEM = 1000 * 60 * 2 // 15 mins
const changeRedeemers = (listId) => {
  List.findById(listId).then((list) => {
    console.log('changeRedeemers')
    const { users } = list
    const { currentRedeemersIndex = 0 } = list
    console.log('currentRedeemersIndex', currentRedeemersIndex)

    const skip = currentRedeemersIndex * list.amount - list.winners.length
    const winnersLeft = list.amount - list.winners.length

    if (list.winners.length === list.amount || skip > users.length) {
      // we're done
      list.status = 'done'
      list.save()
      console.log('ok thats it')
      return
    }
    const redeemersIds = users.slice(skip, skip + winnersLeft)
    console.log(
      'a',
      currentRedeemersIndex,
      list.amount,
      winnersLeft,
      list.amount,
      list.winners.length
    )
    console.log('redeemersIds', redeemersIds)
    list.currentRedeemersIndex += 1
    list.currentRedeemers = redeemersIds
    list.roundEndDate = Date.now() + TIME_TO_REDEEM
    list.save().then(() => {
      const redeemersUsersPromise = redeemersIds.map(id => User.get(id))
      Promise.all(redeemersUsersPromise).then((usersFromPromise) => {
        usersFromPromise.forEach((u) => {
          sendEmail(u.email)
          if (u.mobileNumber) {
            sendSMS(u.mobileNumber, list.title)
          }
        })
      })
      setTimeout(() => changeRedeemers(listId), TIME_TO_REDEEM)
    })
  })
}

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

  list.status = 'redeem'
  list.save().then(() => {
    changeRedeemers(list._id)
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
  setInterval(fetchAllLists, 5000)
}

export default init
