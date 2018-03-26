'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _APIError = require('../helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * User Schema
 */
var UserSchema = new _mongoose2.default.Schema({
  id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  picture_url: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  comments: {
    type: Array },
  mobileNumber: {
    type: String
  },
  darkon: {
    type: String
  },
  drivingLicense: {
    type: String
  },
  creditCard: new _mongoose2.default.Schema({
    number: {
      type: String,
      get: function get(cc) {
        return '****-****-****-' + cc.slice(cc.length - 4, cc.length);
      }
    },
    expire: {
      type: String
    },
    cvc: {
      type: String
    },
    name: {
      type: String
    }
  }),
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  usePushEach: true
  // was getting an error caused by different mongo versions.
  // This tells the mongo to use push instead of pushAll which doesn't exist in certain versions
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({});

/**
 * Statics
 */
UserSchema.statics = {
  get: function get(id) {
    console.log('get function inside UserSchema', id);
    return this.findById(id)
    // .exec()
    .then(function (user) {
      console.log('user', user, id);
      if (user) {
        return user;
      }
      var err = new _APIError2.default('No such user exists!', _httpStatus2.default.NOT_FOUND);
      return _bluebird2.default.reject(err);
    }).catch(function (e) {
      console.error('error in get function in UserSchema', e);
      throw e;
    });
  },
  findOrCreate: function findOrCreate(id, data) {
    var _this = this;

    return this.findOne({ id: id }).then(function (user) {
      if (user) {
        console.log('createIfNotExist - user exist');
        return { user: user.toObject(), created: false };
      }

      console.log('createIfNotExist - user does not exist, wil try to create one now');
      var newUser = new _this(data);
      return newUser.save().then(function () {
        console.log('created the user');
        return { created: true, user: newUser };
      });
    });
  },


  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list: function list() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$skip = _ref.skip,
        skip = _ref$skip === undefined ? 0 : _ref$skip,
        _ref$limit = _ref.limit,
        limit = _ref$limit === undefined ? 50 : _ref$limit;

    return this.find().sort({ createdAt: -1 }).skip(+skip).limit(+limit);
    // .exec()
  }
};

/**
 * @typedef User
 */
exports.default = _mongoose2.default.model('User', UserSchema);
module.exports = exports['default'];
//# sourceMappingURL=user.model.js.map
