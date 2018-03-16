import User from '../models/user.model'
import List from '../models/list.model'
import { validate } from '../helpers/utils'

function load(req, res, next, username) {
  User.get(username)
    .then((user) => {
      req.user = user // eslint-disable-line no-param-reassign
      return next()
    })
    .catch(e => next(e))
}

function get(req, res) {
  return res.json(req.user)
}

function create(req, res, next) {
  const userData = valate(req.body,
    ['username', 'password']
  )
  const user = new User(
    userData
  )

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e))
}

function update(req, res, next) {
  const { user } = req

  user.save(req.body)
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e))
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e))
}

function remove(req, res, next) {
  const { user } = req
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e))
}

function getCreatedLists(req, res, next) {
  const { user } = req
  List.byCreators(user.username)
  .then(lists => res.json(lists))
  .catch(e => next(e))
}

export default { load, get, create, update, list, remove, getCreatedLists }
