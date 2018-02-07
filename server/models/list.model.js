import _ from 'lodash';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const like = param => new RegExp(param, 'i');

/**
 * List Schema
 */
const ListSchema = new mongoose.Schema({
  creator: { // username
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['car', 'hotel', 'flight'],
    required: true,
  },
  meta: {
    type: Object,
    required: true,
  },
  users: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
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
// ListSchema.method({
// });

/**
 * Statics
 */
ListSchema.statics = {
  get(id) {
    return this.findById(id)
      // .exec()
      .then((listFromDB) => {
        console.log('list', id, listFromDB);
        if (listFromDB) {
          console.log('RETURN LIST');
          return Promise.resolve(listFromDB);
        }
        console.log('err');
        const err = new APIError('No such list exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  list(query) {
    const { skip = 0, limit = 50 } = query;
    const queryFilter = query;
    delete queryFilter.skip;
    delete queryFilter.limit;
    const likeQuery = {};
    _.each(queryFilter, (val, key) => {
      if (Number.isInteger(Number.parseInt(val, 10))) {
        likeQuery[key] = val;
      } else {
        likeQuery[key] = like(val);
      }
    });
    return this.find(likeQuery)
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
  byCreators(username) {
    return this.find({ creator: username })
    .exec()
    .then((lists) => {
      if (lists) {
        return lists;
      }
      const err = new APIError('No such lists exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    })
    .catch(e => Promise.reject(e));
  },
  // byRegistered(username) {
  //   return this.find({});
  // }
};

export default mongoose.model('List', ListSchema);
