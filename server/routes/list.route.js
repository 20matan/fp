import express from 'express';
import listCtrl from '../controllers/list.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(listCtrl.list)

  /** POST /api/users - Create new user */
  .post(listCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(listCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(listCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(listCtrl.remove);

export default router;
