'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = undefined;

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _utils = require('../helpers/utils');

var _auth = require('../helpers/auth');

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FACEBOOK_ADMINS_ID = ['10200352632296071', '10215761152011739', '1782689235075417', '1718396558181782'];
var COOKIE_OPTIONS = {
  maxAge: 864 * 10000000, // 100 days
  httpOnly: true // The cookie only accessible by the web server
};
//
// export const adminLogin = (req, res, next) => {
//   console.log('adminLogin function')
//
//   const { username, password } = req.body
//   if (!username) {
//     return next(new Error('please enter username'))
//   }
//   if (!password) {
//     return next(new Error('please enter password'))
//   }
//
//   if (username !== config.admin.username || password !== config.admin.password) {
//     console.error('wrong credentials')
//     return next(new Error('Wrong credentials'))
//   }
//
//   console.log('good credentials')
//   const data = Object.assign({}, { admin: true }, config.admin)
//   const token = generateToken(data)
//   res.cookie('access-token', token, COOKIE_OPTIONS)
//   res.send({ succcess: true, token })
// }


var login = exports.login = function login(req, res, next) {
  if (!req.body.access_token) {
    next(new Error('No access_token was sent in the body'));
    return;
  }
  (0, _utils.facebookAuth)(req.body.access_token).then(function (_ref) {
    var data = _ref.data;

    console.log('res', data);
    if (data.error) {
      // next(data.error)
      res.send({ success: false, error: data.error });
      return;
    }
    console.log('no error in facebook auth, moving on');
    var userData = Object.assign({}, data, { username: data.name, picture_url: data.picture.data.url });
    // console.log('userData', userData)
    return _user2.default.findOrCreate(data.id, userData).then(function (creationRes) {
      var user = creationRes.user;

      var userData = user.toObject ? user.toObject() : user;
      var dataToTokenize = Object.assign({}, userData);

      console.log('id', data.id);
      if (FACEBOOK_ADMINS_ID.indexOf(data.id) !== -1) {
        console.log('admin log in');
        dataToTokenize.admin = true;
      }

      var token = (0, _auth.generateToken)(dataToTokenize);
      res.cookie('access-token', token, COOKIE_OPTIONS);
      res.send({ succcess: true, token: token, user: dataToTokenize });
      return;
    });
  }).catch(function (e) {
    console.error('e', e);
    next(e);
  });
};
//# sourceMappingURL=auth.controller.js.map
