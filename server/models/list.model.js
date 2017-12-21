import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * List Schema
 */
const ListSchema = new mongoose.Schema({
  creator: { // username
    type: String,
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
      .exec()
      .then((list) => {
        if (list) {
          return list;
        }
        const err = new APIError('No such list exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

export default mongoose.model('List', ListSchema);
