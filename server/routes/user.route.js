import express from 'express'
import * as userCtrl from '../controllers/user.controller'

const router = express.Router() // eslint-disable-line new-cap

// router.route('/')
//   .get(userCtrl.list)
//   .post(userCtrl.create)

// router.route('/:username')
//   .get(userCtrl.get)
//   .put(userCtrl.update)
//   .delete(userCtrl.remove)
router.get('/:id', userCtrl.findById)
router.put('/:id', userCtrl.update)
router.get('/:id/createdLists', userCtrl.getCreatedLists)
router.get('/:id/lists', userCtrl.getRegisteredLists)
router.get('/:id/wins', userCtrl.getWonLists)
router.post('/:id/comment', userCtrl.addComment)
router.delete('/:id/comment', userCtrl.deleteComment)
router.post('/:id/subscribe', userCtrl.addSubscription)
router.delete('/:id/subscribe', userCtrl.removeSubscription)

// /** Load user when API with userId route parameter is hit */
// router.param('username', userCtrl.load)

export default router
