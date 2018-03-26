'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _list = require('../models/list.model');

var _list2 = _interopRequireDefault(_list);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _utils = require('../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function load(req, res, next, id) {
  _list2.default.get(id).then(function (listFromDB) {
    console.log('got list from db');
    req.list = listFromDB; // eslint-disable-line no-param-reassign
    return next();
  }).catch(function (e) {
    return next(e);
  });
}

function get(req, res) {
  return res.json(req.list);
}

function create(req, res, next) {
  console.log('create function');
  var listData = (0, _utils.validate)(req.body, ['title', 'description', 'price', 'startDate', 'endDate', 'type', 'meta', 'location', 'amount']);

  var creator = req.encoded.user._id;
  var withCreator = Object.assign({}, listData, { creator: creator, status: 'pending' });
  var newList = new _list2.default(withCreator);
  newList.save().then(function (savedList) {
    return res.json(savedList);
  }).catch(function (e) {
    console.error('e on save', e);
    next(e);
  });
}

// TODO: make sure you're the list creator / superadmin
function update(req, res, next) {
  console.log('on update list.controller');
  var reqList = req.list;
  console.log('got the list from req');

  if (reqList.users && reqList.users.length > 0) {
    console.error('something with users');
    next(new Error('Cant edit the queue, there are people in it'));
    return;
  }

  console.log('gonna save the list');
  Object.keys(req.body).forEach(function (k) {
    reqList[k] = req.body[k];
  });
  // reqList = Object.assign({}, reqList, { title: `${Date.now}a` })
  reqList.save().then(function (savedList) {
    console.log('in the then of savedList', savedList);
    return res.json(savedList);
  }).catch(function (e) {
    console.error('e,', e);
    next(e);
  });
}

function list(req, res, next) {
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 50 : _req$query$limit,
      _req$query$skip = _req$query.skip,
      skip = _req$query$skip === undefined ? 0 : _req$query$skip;
  // const query = {a: req.query}

  var query = Object.assign({}, req.query, { limit: limit, skip: skip, status: 'active' });
  console.log('query', query);
  _list2.default.list(query).then(function (lists) {
    return res.json(lists);
  }).catch(function (e) {
    return next(e);
  });
}

function remove(req, res, next) {
  var reqList = req.list;
  if (reqList.users && reqList.users.length > 0) {
    next(new Error('Cant remove the queue, there are people in it'));
    return;
  }
  reqList.remove().then(function (deletedList) {
    return res.json(deletedList);
  }).catch(function (e) {
    return next(e);
  });
}

function addUser(req, res, next) {
  var _id = req.encoded.user._id;

  var listInReq = req.list;

  console.log('id', _id);

  if (listInReq.status !== 'active') {
    next(new Error('the list is not active'));
    return;
  }
  if (listInReq.users.includes(_id)) {
    next(new Error('User already in the queue'));
    return;
  }

  // validates the user's data
  return _user2.default.get(_id).then(function (user) {
    console.log('found the user', _id);
    // if (!user.creditCard) {
    //   next(new Error('User has to place credit card to continue'))
    //   return
    // }
    // now validates the required data for the list
    // if (listInReq.type === 'car' && !user.drivingLicense) {
    //   next(new Error('Please provide your driving license for being added to this queue'))
    //   return
    // }
    // if (listInReq.type === 'flight' && !user.darkon) {
    //   next(new Error('Please provide your "darkon" for being added to this queue'))
    //   return
    // }

    listInReq.users.push(_id);
    return listInReq.save().then(function (savedList) {
      return res.json(savedList);
    });
  }).catch(function (e) {
    return next(e);
  });
}

function removeUser(req, res, next) {
  var id = req.encoded.id;

  var listInReq = req.list;
  if (!listInReq.users.includes(id)) {
    next(new Error('The user is not in the queue', id));
    return;
  }
  listInReq.users.pull(id);
  return listInReq.save().then(function (savedList) {
    return res.json(savedList);
  }).catch(function (e) {
    return next(e);
  });
}

exports.default = { get: get, create: create, update: update, list: list, load: load, remove: remove, addUser: addUser, removeUser: removeUser };
module.exports = exports['default'];
//# sourceMappingURL=list.controller.js.map
