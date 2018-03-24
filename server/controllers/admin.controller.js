import User from '../models/user.model'
import List from '../models/list.model'

export const getAllUsers = (req, res, next) => {
  User.find()
  .then(users => res.json(users))
  .catch(e => next(e))
}

export const getAllLists = (req, res, next) => {
  List.find()
  .then(lists => res.json(lists))
  .catch(e => next(e))
}

export const acceptList = (req, res, next) => {
  console.log('accept list')
  const { listId } = req.body
  List.findOne({ _id: listId })
  .then((list) => {
    if (!list) {
      return next(new Error('list was not found'))
    }
    list.status = 'active'
    return list.save()
  })
  .then(() => {
    res.send({ success: true })
  })
  .catch((e) => {
    console.error('error', e)
    res.send({ success: false, error: e })
  })
}
