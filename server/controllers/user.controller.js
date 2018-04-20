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
    .then((user) => {
      let totalScore = 0
      user.comments.forEach((c) => {
        totalScore += +c.rating
      })
      const avg = totalScore / user.comments.length
      console.log('avg', avg)
      const avgScore = avg ? avg.toFixed(1).replace(/[.,]00$/, '') : '-'
      const userWithAvg = Object.assign({}, user.toObject(), { avgScore })
      return res.json(userWithAvg)
    })
    .catch(e => next(e))
}

export const create = (req, res, next) => {
  const userData = validate(req.body, ['username', 'password'])
  const user = new User(userData)

  user.save().then(savedUser => res.json(savedUser)).catch(e => next(e))
}

export const update = (req, res, next) => {
  const { id } = req.params

  User.get(id)
    .then((user) => {
      Object.keys(req.body).forEach((k) => {
        user[k] = req.body[k]
      })
      return user.save()
    })
    .then(user => res.send({ success: true, user }))
    .catch(e => next(e))
}

export const list = (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query
  User.list({ limit, skip }).then(users => res.json(users)).catch(e => next(e))
}

export const remove = (req, res, next) => {
  const { user } = req
  user.remove().then(deletedUser => res.json(deletedUser)).catch(e => next(e))
}

export const getCreatedLists = (req, res, next) => {
  // const { user } = req.encoded
  const { id } = req.params
  List.byCreators(id).then(lists => res.json(lists)).catch(e => next(e))
}

export const getRegisteredLists = (req, res, next) => {
  const { id } = req.params
  List.findByUser(id).then(lists => res.json(lists)).catch(e => next(e))
}

export const getWonLists = (req, res, next) => {
  const { id } = req.params
  console.log('id', id)
  List.findByWinner(id)
    .then((lists) => {
      console.log('lists as response', lists)
      return res.json(lists)
    })
    .catch(e => next(e))
}

export const addComment = (req, res, next) => {
  const commentorId = req.encoded.user._id
  const { content, rating } = req.body
  const date = new Date()

  const userId = req.params.id

  // TODO: get commentor user object and include picUrl and username in the comment below

  if (!content) {
    return next(new Error('content cannot be empty'))
  }

  return User.get(userId)
    .then((user) => {
      if (user.comments.filter(c => c.userId === commentorId).length > 0) {
        user.comments = user.comments.map((c) => {
          if (c.userId === commentorId) {
            return Object.assign({}, c, { rating })
          }
          return c
        })
      } else {
        user.comments.push({
          userId: commentorId,
          content,
          rating,
          picture_url: req.encoded.user.picture_url,
          username: req.encoded.user.username,
          date
        })
      }
      return user.save()
    })
    .then(() => res.send({ success: true }))
    .catch(e => next(e))
}

export const deleteComment = (req, res, next) => {
  const commentorId = req.encoded.user._id

  const userId = req.params.id

  return User.get(userId)
    .then((user) => {
      user.comments = user.comments.filter(c => c.userId !== commentorId)
      console.log('commentorId', commentorId)
      return user.save()
    })
    .then(() => res.send({ success: true }))
    .catch(e => next(e))
}

export const addSubscription = (req, res, next) => {
  const userId = req.params.id
  const { _id, email } = req.encoded.user

  return User.get(userId)
    .then((user) => {
      if (user.subscribers.filter(c => c.userId === _id).length > 0) {
        throw new Error('Already subscribed')
      } else {
        user.subscribers.push({
          userId: _id,
          email,
          date: new Date()
        })
      }
      return user.save()
    })
    .then(() => res.send({ success: true }))
    .catch(e => next(e))
}

export const removeSubscription = (req, res, next) => {
  const { _id } = req.encoded.user

  const userId = req.params.id

  return User.get(userId)
    .then((user) => {
      user.subscribers = user.subscribers.filter(c => c.userId !== _id)
      return user.save()
    })
    .then(() => res.send({ success: true }))
    .catch(e => next(e))
}
