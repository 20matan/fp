import express from 'express'
import * as adminController from '../controllers/admin.controller'

const router = express.Router() // eslint-disable-line new-cap

router.get('/user/all', adminController.getAllUsers)
router.get('/list/all', adminController.getAllLists)
router.get('/list/pending', adminController.getPendingLists)
router.get('/list/approved', adminController.getApprovedLists)
router.post('/list/:id/accept', adminController.acceptList)
router.post('/list/:id/deny', adminController.denyList)
router.put('/list/:id', adminController.updateList)
router.delete('/list/:id', adminController.deleteList)
export default router
