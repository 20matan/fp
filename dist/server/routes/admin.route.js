'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _admin = require('../controllers/admin.controller');

var adminController = _interopRequireWildcard(_admin);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

router.get('/user/all', adminController.getAllUsers);
router.get('/list/all', adminController.getAllLists);
router.get('/list/pending', adminController.getPendingLists);
router.post('/list/:id/accept', adminController.acceptList);
router.post('/list/:id/deny', adminController.denyList);
router.put('/list/:id', adminController.updateList);
router.delete('/list/:id', adminController.deleteList);
exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=admin.route.js.map
