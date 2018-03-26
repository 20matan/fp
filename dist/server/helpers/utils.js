'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var axios = require('axios');

var FACEBOOK_FIELDS = ['id', 'name', 'email', 'picture.width(300)'];
var getFacebookURL = function getFacebookURL(accessToken) {
  return 'https://graph.facebook.com/me?access_token=' + accessToken + '&fields=' + FACEBOOK_FIELDS.slice(',') + '&format=json&method=get&pretty=0&suppress_http_code=1';
};

var validate = function validate(data, fields) {
  var d = {};
  fields.forEach(function (f) {
    if (data[f] === undefined) {
      throw new Error('Missing ' + f);
    }

    d[f] = data[f];
  });

  return d;
};
var facebookAuth = function facebookAuth(accessToken) {
  return axios.get(getFacebookURL(accessToken));
};

exports.default = { validate: validate, facebookAuth: facebookAuth };
module.exports = exports['default'];
//# sourceMappingURL=utils.js.map
