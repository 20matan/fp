import User from '../models/user.model'
import List from '../models/list.model'
import { validate } from '../helpers/utils'

// export const load = (req, res, next, username) => {
//   User.get(username)
//     .then((user) => {
//       req.user = user // eslint-disable-line no-param-reassign
//       return next()
//     })
//     .catch(e => next(e))
// }

// export const get = (req, res) => res.json(req.user)

export const findById = (req, res, next) => {
  const { id } = req.params
  console.log('id params in findById = ', id)
  User.get(id)
  .then(user => res.json(user))
  .catch(e => next(e))
}

export const create = (req, res, next) => {
  const userData = validate(req.body, ['username', 'password'])
  const user = new User(userData)

  user
    .save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e))
}

// export const update = (req, res, next) => {
//   const { user } = req
//
//   user
//     .save(req.body)
//     .then(savedUser => res.json(savedUser))
//     .catch(e => next(e))
// }

export const list = (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e))
}

export const remove = (req, res, next) => {
  const { user } = req
  user
    .remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e))
}

export const getCreatedLists = (req, res, next) => {
  const { user } = req.encoded
  List.byCreators(user.id)
    .then(lists => res.json(lists))
    .catch(e => next(e))
}

export const getRegisteredLists = (req, res, next) => {
  const { user } = req.encoded
  List.findByUser(user.id)
    .then(lists => res.json(lists))
    .catch(e => next(e))
}

// export default {
//   load,
//   get,
//   create,
//   update,
//   list,
//   remove,
//   getCreatedLists,
//   getRegisteredLists
// }
