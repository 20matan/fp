'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('./user.route');

var _user2 = _interopRequireDefault(_user);

var _list = require('./list.route');

var _list2 = _interopRequireDefault(_list);

var _auth = require('./auth.route');

var _auth2 = _interopRequireDefault(_auth);

var _admin = require('./admin.route');

var _admin2 = _interopRequireDefault(_admin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

router.get('/test', function (req, res) {
  return res.send('OK');
});

// mount user routes at /users
router.use('/user', _user2.default);
router.use('/list', _list2.default);

// mount auth routes at /auth
router.use('/auth', _auth2.default);
router.use('/admin', _admin2.default);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=index.route.js.map
