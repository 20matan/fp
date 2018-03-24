import express from 'express'
import userRoutes from './user.route'
import listRoutes from './list.route'
import authRoutes from './auth.route'
import adminRoutes from './admin.route'

const router = express.Router() // eslint-disable-line new-cap

router.get('/test', (req, res) => res.send('OK'))

// mount user routes at /users
router.use('/user', userRoutes)
router.use('/list', listRoutes)

// mount auth routes at /auth
router.use('/auth', authRoutes)
router.use('/admin', adminRoutes)

export default router
