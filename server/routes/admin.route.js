import express from 'express'
import * as adminController from '../controllers/admin.controller'

const router = express.Router() // eslint-disable-line new-cap

router.get('/user/all', adminController.getAllUsers)
router.get('/list/all', adminController.getAllLists)
router.post('/list/accept', adminController.acceptList)
export default router
