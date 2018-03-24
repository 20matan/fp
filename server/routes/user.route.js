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

router.get('/me/createdLists', userCtrl.getCreatedLists)
router.get('/me/lists', userCtrl.getRegisteredLists)
router.get('/me/wins', userCtrl.getWonLists)
router.get('/profile/:id', userCtrl.findById)

// /** Load user when API with userId route parameter is hit */
// router.param('username', userCtrl.load)

export default router
