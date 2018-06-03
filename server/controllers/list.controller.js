import List from '../models/list.model'
import User from '../models/user.model'
import { validate } from '../helpers/utils'
import sendEmail from '../helpers/mail'
import sendEmailSub from '../helpers/mail-sub'

function load(req, res, next, id) {
  List.get(id)
    .then((listFromDB) => {
      // console.log('got list from db')
      req.list = listFromDB // eslint-disable-line no-param-reassign
      return next()
    })
    .catch(e => next(e))
}

function get(req, res, next) {
  return List.get(req.params.listId)
    .then(listFromDB =>
      User.get(listFromDB.creator).then((creator) => {
        const listWithCreator = Object.assign({}, listFromDB.toObject(), {
          creatorName: creator.username
        })
        res.json(listWithCreator)
      })
    )
    .catch(e => next(e))
}

function create(req, res, next) {
  console.log('create function')
  const listData = validate(req.body, [
    'title',
    'description',
    'price',
    'startDate',
    'images',
    'endDate',
    'type',
    'meta',
    'location',
    'amount',
    'listEndDate',
  ])

  const creator = req.encoded.user._id
  const withCreator = Object.assign({}, listData, {
    creator,
    status: 'pending'
  })
  const newList = new List(withCreator)
  newList.save()
  .then((savedList) => {
    // send emails to whoever subbed
    // send emails for new list`
    res.json(savedList)
  })
  .catch((e) => {
    console.error('e on save', e)
    next(e)
  })
}

const _update = (reqList, data) => {
  Object.keys(data).forEach((k) => {
    reqList[k] = data[k]
  })
  // reqList = Object.assign({}, reqList, { title: `${Date.now}a` })
  return reqList.save().then((savedList) => {
    console.log('in the then of savedList', savedList)
    return savedList
  })
}

// TODO: make sure you're the list creator / superadmin
function update(req, res, next) {
  console.log('on update list.controller')
  const reqList = req.list
  console.log('got the list from req')

  if (reqList.users && reqList.users.length > 0) {
    console.error('something with users')
    return next(new Error('Cant edit the queue, there are people in it'))
  }

  // TODO: or super admin
  if (req.list.creator !== req.encoded.user._id) {
    throw new Error('You are not the list creator')
  }

  console.log('gonna save the list')
  return _update(req.list, req.boy).then(r => res.json(r)).catch(e => next(e))
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query
  // const query = {a: req.query}
  const query = Object.assign({}, req.query, { limit, skip, status: 'active' })
  console.log('query', query)
  List.list(query).then(lists => res.json(lists)).catch(e => next(e))
}

function remove(req, res, next) {
  const reqList = req.list
  if (reqList.users && reqList.users.length > 0) {
    next(new Error('Cant remove the queue, there are people in it'))
    return
  }
  reqList
    .remove()
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
      return listInReq.save().then(savedList => res.json(savedList))
    })
    .catch(e => next(e))
}

function removeUser(req, res, next) {
  const { _id } = req.encoded.user
  const listInReq = req.list
  if (!listInReq.users.includes(_id)) {
    next(new Error('The user is not in the queue', _id))
    return
  }
  listInReq.users.pull(_id)
  return listInReq
    .save()
    .then(savedList => res.json(savedList))
    .catch(e => next(e))
}

function startList(req, res, next) {
  if (req.list.status !== 'approved') {
    throw new Error(`The list status is ${req.list.status}.`)
  }


  User.get(creator)
    .then((user) => {
      user.subscribers.forEach((u) => {
        sendEmailSub(u.email, user.username, savedList.id)
      })
    })

  return _update(req.list, { status: 'active' })
    .then((updatedList) => {
      const { creator } = updatedList
      console.log('creator', creator)
      return User.get(creator).then((user) => {
        const { subscribers } = user
        subscribers.forEach(s =>
          sendEmailSub(s.email, user.username, updatedList._id, updatedList.title)
        )
        res.json(updatedList)
      })
    })
    .catch(e => next(e))
}

function redeem(req, res, next) {
  const redeemerId = req.encoded.user._id
  if (req.list.currentRedeemers.indexOf(redeemerId) !== -1) {
    // return _update(req.list, {}).then(r => res.json(r)).catch(e => next(e))
    req.list.winners.push(redeemerId)
    sendEmail(
      req.encoded.user.email,
      `You have redeemed list ${req.list.title}`,
      `Congratz! You have redeemed the list ${req.list.title}.`
    )
    return req.list.save().then(savedList => res.json(savedList)).catch((e) => {
      console.error('e on save', e)
      next(e)
    })
  }
  throw new Error('Oops, you are not in the redeemers')
}

const _getPlacesForList = (places) => {
  // console.log('places', places)
  const aPlaces = places.split(',')
  try {
    aPlaces[1] = aPlaces[1].substring(1, aPlaces[1].length)
  } catch (e) {
    aPlaces[1] = 'undefined'
  }
  return aPlaces
}
const _fromSameLocation = (locationA, locationB) => {
  // console.log('location a', locationA, 'locaiton b', locationB)
  const placesA = _getPlacesForList(locationA)
  const placesB = _getPlacesForList(locationB)
  for (let i = 0; i < placesA.length; i += 1) {
    for (let j = 0; j < placesB.length; j += 1) {
      // console.log(
      //   '_fromSameLocation',
      //   'location A = ',
      //   locationA,
      //   'location B = ',
      //   locationB
      // )
      // console.log(
      //   '_fromSameLocation',
      //   'placesA[i] = ',
      //   placesA[i],
      //   'placesB[j] = ',
      //   placesB[j]
      // )
      if (placesA[i] === placesB[j]) {
        console.log('_fromSameLocation will return true now')
        return true
      }
    }
  }

  // console.log('_fromSameLocation FALSE')
  return false
}
const _sortBySimiliarty = originalList => (listAModel, listBModel) => {
  const PRICE_WEIGHT = 5
  const LOCATION_WEIGHT = 100
  const START_DATE_WEIGHT = 30
  const END_DATE_WEIGHT = 15

  const listA = listAModel.toObject()
  const listB = listBModel.toObject()

  let similiarA = 0
  let similiarB = 0

  // by location
  const locationA = listA.location
  const locationB = listB.location
  if (_fromSameLocation(originalList.location, locationA)) {
    similiarA += LOCATION_WEIGHT
  }
  if (_fromSameLocation(originalList.location, locationB)) {
    similiarB += LOCATION_WEIGHT
  }

  // by price
  const priceA = listA.price
  const priceB = listB.price
  const diffPriceA = Math.abs(priceA - originalList.price)
  const diffPriceB = Math.abs(priceB - originalList.price)
  // console.log('diffPriceA = ', diffPriceA, 'diffPriceB = ', diffPriceB)
  if (diffPriceA < diffPriceB) {
    similiarA += PRICE_WEIGHT
  } else {
    similiarB += PRICE_WEIGHT
  }

  // by start date
  const starDateA = listA.startDate
  const starDateB = listB.startDate
  const diffDateA = Math.abs(starDateA - originalList.startDate)
  const diffDateB = Math.abs(starDateB - originalList.startDate)
  // console.log('diffDateA = ', diffDateA, 'diffPriceB = ', diffDateB)
  if (diffDateA < diffDateB) {
    similiarA += START_DATE_WEIGHT
  } else {
    similiarB += START_DATE_WEIGHT
  }

  // by end date
  const endDateA = listA.endDate
  const endDateB = listB.endDate
  const diffEndDateA = Math.abs(endDateA - originalList.startDate)
  const diffEndDateB = Math.abs(endDateB - originalList.startDate)
  // console.log('diffEndDateA = ', diffEndDateA, 'diffEndDateB = ', diffEndDateB)
  if (diffEndDateA < diffEndDateB) {
    similiarA += END_DATE_WEIGHT
  } else {
    similiarB += END_DATE_WEIGHT
  }

  // console.log('=============== similiartiy: ====================')
  // console.log('listA: ', listA._id, similiarA)
  // console.log('listB: ', listB._id, similiarB)
  // console.log('=============== end =============================')
  if (similiarA > similiarB) {
    return -1
  }
  if (similiarB > similiarA) {
    return 1
  }
  return 0
}
async function getSimiliar(req, res, next) {
  const query = Object.assign({}, { status: 'active' })
  console.log('query', query)
  if (!req.params.listId) {
    return next('No list id parameter was supplied')
  }
  try {
    const lists = await List.getActiveExccept(req.params.listId)
    const reqList = await List.get(req.params.listId)

    // const thisList = req.list

    // find the most similiar
    const topSimiliar = lists.sort(_sortBySimiliarty(reqList)).slice(0, 20)
    return res.json(topSimiliar)
  } catch (e) {
    console.error('error', e)
    return next(e)
  }
}

export default {
  get,
  create,
  update,
  list,
  load,
  remove,
  addUser,
  removeUser,
  startList,
  redeem,
  getSimiliar
}
