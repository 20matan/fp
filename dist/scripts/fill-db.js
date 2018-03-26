'use strict';

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _user = require('../server/models/user.model');

var _user2 = _interopRequireDefault(_user);

var _list = require('../server/models/list.model');

var _list2 = _interopRequireDefault(_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const USERS_ROWS = 1
var LIST_ROWS = 30; // const app = require('..')

var LIST_TYPES = ['car', 'hotel', 'flight'];
var LIST_STATUSES = ['pending', 'active'];
var addedUsers = [];

// const generateUser = () => {
//   const data = {
//     id: faker.
//   }
//   const user = new User(data)
//   user.save()
// }
var rand = function rand(n) {
  return Math.floor(Math.random() * n);
};

var generateListAndCreators = function generateListAndCreators() {
  console.log('added users', addedUsers.length);
  var amountOfComments = rand(Math.min(addedUsers.length, 5));
  var comments = Array(amountOfComments).fill(1).map(function () {
    var user = addedUsers[rand(addedUsers.length - 1)];
    // console.log('user', user)
    return {
      userId: user._id,
      content: _faker2.default.lorem.sentence(),
      rating: rand(4) + 1,
      picture_url: user.picture_url,
      username: user.username
    };
  });

  var userData = {
    id: _faker2.default.random.uuid(),
    username: _faker2.default.name.findName(),
    picture_url: _faker2.default.image.avatar(),
    email: _faker2.default.internet.email(),
    comments: comments,
    mobileNumber: _faker2.default.phone.phoneNumber()
  };
  // console.log('gonna create user', userData)
  var user = new _user2.default(userData);
  return user.save().then(function (u) {
    // console.log('response from save', u._id)
    addedUsers.push(u.toObject());
    var users = [];
    var status = LIST_STATUSES[Math.floor(Math.random() * 2)];
    if (status === 'active') {
      // 0 or 1
      // console.log('hae users')
      var amountOfUsers = rand(10);
      // console.log('amount of users', amountOfUsers)
      users = addedUsers.slice(0, amountOfUsers).map(function (u) {
        return u._id;
      });
    }
    var listData = {
      creator: u._id,
      title: _faker2.default.lorem.sentence(),
      location: _faker2.default.address.country() + ', ' + _faker2.default.address.city(),
      description: _faker2.default.lorem.paragraph(),
      amount: Math.floor(Math.random() * 9) + 1,
      price: _faker2.default.commerce.price(),
      startDate: _faker2.default.date.recent(),
      endDate: _faker2.default.date.future(),
      type: LIST_TYPES[Math.floor(Math.random() * 3)],
      status: status,
      meta: {
        a: '1'
      },
      users: users,
      winners: []
    };
    // console.log('gonna create list', listData)
    var list = new _list2.default(listData);
    return list.save().then(function (l) {
      console.log('created list');
    });
  }).catch(function (e) {
    console.error('errrorrr');
    console.error('e', e);
  });
};

// Array(USERS_ROWS).fill(1).map(generateUser) // call ROWS times
// Array(LIST_ROWS).fill(1).map(generateUser) // call ROWS times
// Array(LIST_ROWS).fill(1).map(() => {
//   generateListAndCreators()
// })

var i = 0;
var f = function f() {
  return generateListAndCreators().then(function () {
    console.log('in the then', i, LIST_ROWS);
    if (i < LIST_ROWS) {
      i++;
      f();
    }
  }).catch(function (e) {
    console.error('e', e);
  });
};

f();
//# sourceMappingURL=fill-db.js.map
