// const app = require('..')
import faker from 'faker'
import User from '../server/models/user.model'
import List from '../server/models/list.model'
// const USERS_ROWS = 1
const LIST_ROWS = 30
const LIST_TYPES = ['car', 'hotel', 'flight']
const LIST_STATUSES = ['pending', 'active']
const addedUsers = []

// const generateUser = () => {
//   const data = {
//     id: faker.
//   }
//   const user = new User(data)
//   user.save()
// }
const rand = n => Math.floor(Math.random() * n)

const generateListAndCreators = () => {
  console.log('added users', addedUsers.length)
  const amountOfComments = rand(Math.min(addedUsers.length, 5))
  const comments = Array(amountOfComments).fill(1).map(() => {
    const user = addedUsers[rand(addedUsers.length - 1)]
    // console.log('user', user)
    return {
      userId: user._id,
      content: faker.lorem.sentence(),
      rating: rand(4) + 1,
      picture_url: user.picture_url,
      username: user.username
    }
  })

  const userData = {
    id: faker.random.uuid(),
    username: faker.name.findName(),
    picture_url: faker.image.avatar(),
    email: faker.internet.email(),
    comments,
    mobileNumber: faker.phone.phoneNumber(),
  }
  // console.log('gonna create user', userData)
  const user = new User(userData)
  return user.save()
  .then((u) => {
    // console.log('response from save', u._id)
    addedUsers.push(u.toObject())
    let users = []
    const status = LIST_STATUSES[Math.floor(Math.random() * 2)]
    if (status === 'active') { // 0 or 1
      // console.log('hae users')
      const amountOfUsers = rand(10)
      // console.log('amount of users', amountOfUsers)
      users = addedUsers.slice(0, amountOfUsers).map(u => u._id)
    }
    const listData = {
      creator: u._id,
      title: faker.lorem.sentence(),
      location: `${faker.address.country()}, ${faker.address.city()}`,
      description: faker.lorem.paragraph(),
      amount: Math.floor(Math.random() * 9) + 1,
      price: faker.commerce.price(),
      startDate: faker.date.recent(),
      endDate: faker.date.future(),
      type: LIST_TYPES[Math.floor(Math.random() * 3)],
      status,
      meta: {},
      users,
      winners: [],
    }
    // console.log('gonna create list', listData)
    const list = new List(listData)
    return list.save()
    .then((l) => {
      console.log('created list')
    })
  })
  .catch((e) => {
    console.error('errrorrr')
    console.error('e', e)
  })
}

// Array(USERS_ROWS).fill(1).map(generateUser) // call ROWS times
// Array(LIST_ROWS).fill(1).map(generateUser) // call ROWS times
// Array(LIST_ROWS).fill(1).map(() => {
//   generateListAndCreators()
// })

let i = 0
const f = () => generateListAndCreators()
.then(() => {
  console.log('in the then', i, LIST_ROWS)
  if (i < LIST_ROWS) {
    i++
    f()
  }
})
.catch((e) => {
  console.error('e', e)
})

f()
