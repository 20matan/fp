'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _list = require('../controllers/list.controller');

var _list2 = _interopRequireDefault(_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/users - Get list of users */
.get(_list2.default.list)

/** POST /api/users - Create new user */
.post(_list2.default.create);

router.route('/:listId')
/** GET /api/users/:userId - Get user */
.get(_list2.default.get)

/** PUT /api/users/:userId - Update user */
.put(_list2.default.update)

/** DELETE /api/users/:userId - Delete user */
.delete(_list2.default.remove);

router.post('/:listId/addUser', _list2.default.addUser);
router.delete('/:listId/removeUser', _list2.default.removeUser);

router.param('listId', _list2.default.load);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=list.route.js.map
