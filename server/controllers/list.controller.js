import List from '../models/list.model'
import User from '../models/user.model'
import { validate } from '../helpers/utils'


function load(req, res, next, id) {
  List.get(id)
    .then((listFromDB) => {
      console.log('got list from db')
      req.list = listFromDB // eslint-disable-line no-param-reassign
      return next()
    })
    .catch(e => next(e))
}

function get(req, res) {
  return res.json(req.list)
}


function create(req, res, next) {
  console.log('create function')
  const listData = validate(req.body,
    ['title', 'description', 'price', 'startDate', 'endDate', 'type', 'meta', 'location', 'amount']
  )

  const creator = req.encoded.user._id
  const withCreator = Object.assign({}, listData, { creator, status: 'pending' })
  const newList = new List(withCreator)
  newList.save()
  .then(savedList => res.json(savedList))
  .catch((e) => {
    console.error('e on save', e)
    next(e)
  })
}


// TODO: make sure you're the list creator / superadmin
function update(req, res, next) {
  console.log('on update list.controller')
  const reqList = req.list
  console.log('got the list from req')

  if (reqList.users && reqList.users.length > 0) {
    console.error('something with users')
    next(new Error('Cant edit the queue, there are people in it'))
    return
  }

  console.log('gonna save the list')
  Object.keys(req.body).forEach((k) => {
    reqList[k] = req.body[k]
  })
  // reqList = Object.assign({}, reqList, { title: `${Date.now}a` })
  reqList.save()
    .then((savedList) => {
      console.log('in the then of savedList', savedList)
      return res.json(savedList)
    })
    .catch((e) => {
      console.error('e,', e)
      next(e)
    })
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query
  // const query = {a: req.query}
  const query = Object.assign({}, req.query, { limit, skip, status: 'active' })
  console.log('query', query)
  List.list(query)
    .then(lists => res.json(lists))
    .catch(e => next(e))
}

function remove(req, res, next) {
  const reqList = req.list
  if (reqList.users && reqList.users.length > 0) {
    next(new Error('Cant remove the queue, there are people in it'))
    return
  }
  reqList.remove()
    .then(deletedList => res.json(deletedList))
    .catch(e => next(e))
}

function addUser(req, res, next) {
  const { _id } = req.encoded.user
  const listInReq = req.list

  console.log('id', _id)

  if (listInReq.status !== 'active') {
    next(new Error('the list is not active'))
    return
  }
  if (listInReq.users.includes(_id)) {
    next(new Error('User already in the queue'))
    return
  }

  // validates the user's data
  return User.get(_id)
  .then((user) => {
    console.log('found the user', _id)
    // if (!user.creditCard) {
    //   next(new Error('User has to place credit card to continue'))
    //   return
    // }
    // now validates the required data for the list
    // if (listInReq.type === 'car' && !user.drivingLicense) {
    //   next(new Error('Please provide your driving license for being added to this queue'))
    //   return
    // }
    // if (listInReq.type === 'flight' && !user.darkon) {
    //   next(new Error('Please provide your "darkon" for being added to this queue'))
    //   return
    // }

    listInReq.users.push(_id)
    return listInReq.save()
    .then(savedList => res.json(savedList))
  })
  .catch(e => next(e))
}

function removeUser(req, res, next) {
  const { id } = req.encoded
  const listInReq = req.list
  if (!listInReq.users.includes(id)) {
    next(new Error('The user is not in the queue', id))
    return
  }
  listInReq.users.pull(id)
  return listInReq.save()
  .then(savedList => res.json(savedList))
  .catch(e => next(e))
}

export default { get, create, update, list, load, remove, addUser, removeUser }
