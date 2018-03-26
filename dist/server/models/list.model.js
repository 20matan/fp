'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _APIError = require('../helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var like = function like(param) {
  return new RegExp(param, 'i');
};
var FREE_SEARCH_COLUMNS = ['title', 'location', 'description', 'price', 'type'];

/**
 * List Schema
 */
var ListSchema = new _mongoose2.default.Schema({
  creator: { // user if (facebooj id)
    type: _mongoose2.default.Schema.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: { // how many people can win?
    type: Number,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['car', 'hotel', 'flight'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'done', 'deny']
  },
  meta: {
    type: Object,
    required: true
  },
  users: {
    type: Array,
    default: []
  },
  winners: { // User.id
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  hidden: {
    type: String
  }
});
//
// /**
//  * Add your
//  * - pre-save hooks
//  * - validations
//  * - virtuals
//  */
//
// /**
//  * Methods
//  */
ListSchema.methods = {
  finish: function finish() {
    this.endDate = Date.now();
    this.save();
  }
};

var generateHiddenField = function generateHiddenField(obj) {
  var title = obj.title,
      description = obj.description,
      price = obj.price,
      type = obj.type,
      location = obj.location;

  return title + ' - ' + description + ', ' + type + ' in ' + location;
};

ListSchema.pre('save', function (next) {
  console.log('pre save of list');
  this.hidden = generateHiddenField(this);
  console.log('this hidden');
  next();
});

/**
 * Statics
 */
ListSchema.statics = {
  getPassedButNonFinished: function getPassedButNonFinished() {
    console.log('getPassedButNonFinished');
    // get all lists which end date was passed but we didnt send emails
    return this.find({
      endDate: {
        $lt: Date.now()
      },
      status: 'active'
    });
  },
  get: function get(id) {
    return this.findById(id)
    // .exec()
    .then(function (listFromDB) {
      console.log('list', id, listFromDB);
      if (listFromDB) {
        console.log('RETURN LIST');
        return listFromDB;
      }
      console.log('err');
      var err = new _APIError2.default('No such list exists!', _httpStatus2.default.NOT_FOUND);
      return _bluebird2.default.reject(err);
    });
  },
  list: function list(query) {
    console.log('query', query);
    var _query$skip = query.skip,
        skip = _query$skip === undefined ? 0 : _query$skip,
        _query$limit = query.limit,
        limit = _query$limit === undefined ? 50 : _query$limit;

    var queryFilter = query;
    delete queryFilter.skip;
    delete queryFilter.limit;
    var likeQuery = {};
    if (queryFilter.freesearch) {
      console.log('free search');
      var freeSearch = queryFilter.freesearch.replace(/ /g, '');

      likeQuery.$and = [];
      freeSearch.split(',').forEach(function (cond) {
        var condRegex = new RegExp(cond);
        console.log('condRegex', condRegex);
        var columnsOrs = FREE_SEARCH_COLUMNS.map(function (col) {
          return _defineProperty({}, col, condRegex);
        });
        likeQuery.$and.push({ $or: columnsOrs });
      });
      console.log('queryFilter', likeQuery);
    } else {
      _lodash2.default.each(queryFilter, function (val, key) {
        if (Number.isInteger(Number.parseInt(val, 10))) {
          likeQuery[key] = val;
        } else {
          likeQuery[key] = like(val);
        }
      });
    }

    console.log('likeQuery', JSON.stringify(likeQuery));
    return this.find(likeQuery).sort({ createdAt: -1 }).skip(+skip).limit(+limit);
    // .exec()
  },
  byCreators: function byCreators(userId) {
    return this.find({ creator: userId })
    // .exec()
    .then(function (lists) {
      if (lists) {
        return lists;
      }
      var err = new _APIError2.default('No such lists exists!', _httpStatus2.default.NOT_FOUND);
      return _bluebird2.default.reject(err);
    }).catch(function (e) {
      return _bluebird2.default.reject(e);
    });
  },
  findByUser: function findByUser(userId) {
    return this.find({ users: userId });
  },
  findByWinner: function findByWinner(userId) {
    console.log('findByWinner', userId);
    return this.find({ winners: userId });
  }
};
ListSchema.index({ hidden: 'text' });
exports.default = _mongoose2.default.model('List', ListSchema);
module.exports = exports['default'];
//# sourceMappingURL=list.model.js.map
