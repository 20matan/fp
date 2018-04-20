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

export const getPendingLists = (req, res, next) => {
  List.find({ status: 'pending' })
  .then(lists => res.json(lists))
  .catch(e => next(e))
}

export const getApprovedLists = (req, res, next) => {
  List.find({ status: 'approved' })
  .then(lists => res.json(lists))
  .catch(e => next(e))
}

export const acceptList = (req, res, next) => {
  console.log('accept list')
  const { id } = req.params
  List.get(id)
  .then((list) => {
    list.status = 'approved'
    return list.save()
  })
  .then(() => {
    res.send({ success: true })
  })
  .catch(e => next(e))
}

export const denyList = (req, res, next) => {
  console.log('accept list')
  const { id } = req.params
  List.get(id)
  .then((list) => {
    list.status = 'deny'
    return list.save()
  })
  .then(() => {
    res.send({ success: true })
  })
  .catch(e => next(e))
}

// TODO: make sure you're the list creator / superadmin
export const updateList = (req, res, next) => {
  console.log('on updateList on admin controller')
  const { id } = req.params
  List.get(id)
  .then((list) => {
    console.log('got the list from req')

    Object.keys(req.body).forEach((k) => {
      list[k] = req.body[k]
    })
    return list.save()
  })
  .then(() => res.send({ success: true }))
  .catch((e) => {
    console.error('e,', e)
    next(e)
  })
}

export const deleteList = (req, res, next) => {
  console.log('on deleteList on admin controller')
  const { id } = req.params
  List.get(id)
  .then((list) => {
    console.log('got the list from req')

    return list.remove()
  })
  .then(() => res.send({ success: true }))
  .catch((e) => {
    console.error('e,', e)
    next(e)
  })
}
