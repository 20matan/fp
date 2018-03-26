'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteList = exports.updateList = exports.denyList = exports.acceptList = exports.getPendingLists = exports.getAllLists = exports.getAllUsers = undefined;

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _list = require('../models/list.model');

var _list2 = _interopRequireDefault(_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getAllUsers = exports.getAllUsers = function getAllUsers(req, res, next) {
  _user2.default.find().then(function (users) {
    return res.json(users);
  }).catch(function (e) {
    return next(e);
  });
};

var getAllLists = exports.getAllLists = function getAllLists(req, res, next) {
  _list2.default.find().then(function (lists) {
    return res.json(lists);
  }).catch(function (e) {
    return next(e);
  });
};

var getPendingLists = exports.getPendingLists = function getPendingLists(req, res, next) {
  _list2.default.find({ status: 'pending' }).then(function (lists) {
    return res.json(lists);
  }).catch(function (e) {
    return next(e);
  });
};

var acceptList = exports.acceptList = function acceptList(req, res, next) {
  console.log('accept list');
  var id = req.params.id;

  _list2.default.get(id).then(function (list) {
    list.status = 'active';
    return list.save();
  }).then(function () {
    res.send({ success: true });
  }).catch(function (e) {
    return next(e);
  });
};

var denyList = exports.denyList = function denyList(req, res, next) {
  console.log('accept list');
  var id = req.params.id;

  _list2.default.get(id).then(function (list) {
    list.status = 'deny';
    return list.save();
  }).then(function () {
    res.send({ success: true });
  }).catch(function (e) {
    return next(e);
  });
};

// TODO: make sure you're the list creator / superadmin
var updateList = exports.updateList = function updateList(req, res, next) {
  console.log('on updateList on admin controller');
  var id = req.params.id;

  _list2.default.get(id).then(function (list) {
    console.log('got the list from req');

    Object.keys(req.body).forEach(function (k) {
      list[k] = req.body[k];
    });
    return list.save();
  }).then(function () {
    return res.send({ success: true });
  }).catch(function (e) {
    console.error('e,', e);
    next(e);
  });
};

var deleteList = exports.deleteList = function deleteList(req, res, next) {
  console.log('on deleteList on admin controller');
  var id = req.params.id;

  _list2.default.get(id).then(function (list) {
    console.log('got the list from req');

    return list.remove();
  }).then(function () {
    return res.send({ success: true });
  }).catch(function (e) {
    console.error('e,', e);
    next(e);
  });
};
//# sourceMappingURL=admin.controller.js.map
