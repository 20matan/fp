'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../server/models/user.model');

var _user2 = _interopRequireDefault(_user);

var _list = require('../server/models/list.model');

var _list2 = _interopRequireDefault(_list);

var _mail = require('../server/helpers/mail');

var _mail2 = _interopRequireDefault(_mail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// every minute check for non finished lists
var finishList = function finishList(list) {
  var users = list.users;

  console.log('finishList, list id = ', list.id, 'users = ', users);
  if (!users || users.length === 0) {
    list.status = 'done';
    list.save();
    return;
  }

  var winnerIds = users.slice(0, list.amount);
  list.winners = winnerIds;
  list.status = 'done';
  list.save().then(function () {
    var winnerIdsPromises = winnerIds.map(function (id) {
      return _user2.default.get(id);
    });
    Promise.all(winnerIdsPromises).then(function (usersFromPromise) {
      // console.log('users', usersFromPromise)
      var emails = usersFromPromise.map(function (u) {
        return u.email;
      });
      console.log('emails', emails);
      emails.map(_mail2.default);
    });
  });
};
var fetchAllLists = function fetchAllLists() {
  _list2.default.getPassedButNonFinished().then(function (lists) {
    console.log('sendEmailsForWinners.List.getPassedButNonFinished lists.length ', lists.length);
    lists.forEach(finishList);
  });
};

var init = function init() {
  console.log('init workers function');
  fetchAllLists();
  setInterval(fetchAllLists, 60000);
};

exports.default = init;
module.exports = exports['default'];
//# sourceMappingURL=workers.js.map
