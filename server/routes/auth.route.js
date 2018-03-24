import express from 'express'
import * as authCtrl from '../controllers/auth.controller'

const router = express.Router() // eslint-disable-line new-cap

router.post('/', authCtrl.login)
// router.post('/admin', authCtrl.adminLogin)

export default router
