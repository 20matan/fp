'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addComment = exports.getWonLists = exports.getRegisteredLists = exports.getCreatedLists = exports.remove = exports.list = exports.update = exports.create = exports.findById = undefined;

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _list = require('../models/list.model');

var _list2 = _interopRequireDefault(_list);

var _utils = require('../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// export const load = (req, res, next, username) => {
//   User.get(username)
//     .then((user) => {
//       req.user = user // eslint-disable-line no-param-reassign
//       return next()
//     })
//     .catch(e => next(e))
// }

// export const get = (req, res) => res.json(req.user)

var findById = exports.findById = function findById(req, res, next) {
  var id = req.params.id;

  console.log('id params in findById = ', id);
  _user2.default.get(id).then(function (user) {
    return res.json(user);
  }).catch(function (e) {
    return next(e);
  });
};

var create = exports.create = function create(req, res, next) {
  var userData = (0, _utils.validate)(req.body, ['username', 'password']);
  var user = new _user2.default(userData);

  user.save().then(function (savedUser) {
    return res.json(savedUser);
  }).catch(function (e) {
    return next(e);
  });
};

var update = exports.update = function update(req, res, next) {
  var id = req.params.id;


  _user2.default.get(id).then(function (user) {
    Object.keys(req.body).forEach(function (k) {
      user[k] = req.body[k];
    });
    return user.save();
  }).then(function (user) {
    return res.send({ success: true, user: user });
  }).catch(function (e) {
    return next(e);
  });
};

var list = exports.list = function list(req, res, next) {
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 50 : _req$query$limit,
      _req$query$skip = _req$query.skip,
      skip = _req$query$skip === undefined ? 0 : _req$query$skip;

  _user2.default.list({ limit: limit, skip: skip }).then(function (users) {
    return res.json(users);
  }).catch(function (e) {
    return next(e);
  });
};

var remove = exports.remove = function remove(req, res, next) {
  var user = req.user;

  user.remove().then(function (deletedUser) {
    return res.json(deletedUser);
  }).catch(function (e) {
    return next(e);
  });
};

var getCreatedLists = exports.getCreatedLists = function getCreatedLists(req, res, next) {
  // const { user } = req.encoded
  var id = req.params.id;

  _list2.default.byCreators(id).then(function (lists) {
    return res.json(lists);
  }).catch(function (e) {
    return next(e);
  });
};

var getRegisteredLists = exports.getRegisteredLists = function getRegisteredLists(req, res, next) {
  var id = req.params.id;

  _list2.default.findByUser(id).then(function (lists) {
    return res.json(lists);
  }).catch(function (e) {
    return next(e);
  });
};

var getWonLists = exports.getWonLists = function getWonLists(req, res, next) {
  var id = req.params.id;

  console.log('id', id);
  _list2.default.findByWinner(id).then(function (lists) {
    console.log('lists as response', lists);
    return res.json(lists);
  }).catch(function (e) {
    return next(e);
  });
};

var addComment = exports.addComment = function addComment(req, res, next) {
  var commentorId = req.encoded.user._id;
  var _req$body = req.body,
      content = _req$body.content,
      rating = _req$body.rating;


  var userId = req.params.id;

  // TODO: get commentor user object and include picUrl and username in the comment below

  if (!content) {
    return next(new Error('content cannot be empty'));
  }

  _user2.default.get(userId).then(function (user) {
    user.comments.push({
      userId: commentorId,
      content: content,
      rating: rating,
      picture_url: req.encoded.user.picture_url,
      username: req.encoded.user.username
    });
    return user.save();
  }).then(function () {
    return res.send({ success: true });
  }).catch(function (e) {
    return next(e);
  });
};
//# sourceMappingURL=user.controller.js.map
