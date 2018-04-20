import express from 'express'
import listCtrl from '../controllers/list.controller'

const router = express.Router() // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(listCtrl.list)

  /** POST /api/users - Create new user */
  .post(listCtrl.create)

router.route('/:listId')
  /** GET /api/users/:userId - Get user */
  .get(listCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(listCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(listCtrl.remove)

router.post('/:listId/addUser', listCtrl.addUser)
router.delete('/:listId/removeUser', listCtrl.removeUser)
router.post('/:listId/start', listCtrl.startList)
router.post('/:listId/redeem', listCtrl.redeem)

router.param('listId', listCtrl.load)


export default router
