'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('../controllers/user.controller');

var userCtrl = _interopRequireWildcard(_user);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

// router.route('/')
//   .get(userCtrl.list)
//   .post(userCtrl.create)

// router.route('/:username')
//   .get(userCtrl.get)
//   .put(userCtrl.update)
//   .delete(userCtrl.remove)
router.get('/:id', userCtrl.findById);
router.put('/:id', userCtrl.update);
router.get('/:id/createdLists', userCtrl.getCreatedLists);
router.get('/:id/lists', userCtrl.getRegisteredLists);
router.get('/:id/wins', userCtrl.getWonLists);
router.post('/:id/comment', userCtrl.addComment);

// /** Load user when API with userId route parameter is hit */
// router.param('username', userCtrl.load)

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=user.route.js.map
