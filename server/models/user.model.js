import Promise from 'bluebird'
import mongoose from 'mongoose'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  picture_url: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String
  },
  darkon: {
    type: String
  },
  drivingLicense: {
    type: String
  },
  creditCard: new mongoose.Schema({
    number: {
      type: String,
      get: cc => `****-****-****-${cc.slice(cc.length - 4, cc.length)}`
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
})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({})

/**
 * Statics
 */
UserSchema.statics = {
  get(id) {
    console.log('get function inside UserSchema', id)
    return (
      this.findById(id)
        // .exec()
        .then((user) => {
          console.log('user', user, id)
          if (user) {
            return user
          }
          const err = new APIError(
            'No such user exists!',
            httpStatus.NOT_FOUND
          )
          return Promise.reject(err)
        })
        .catch((e) => {
          console.error('error in get function in UserSchema', e)
          throw e
        })
    )
  },

  findOrCreate(id, data) {
    return this.findOne({ id }).then((user) => {
      if (user) {
        console.log('createIfNotExist - user exist')
        return { user: user.toObject(), created: false }
      }

      console.log(
        'createIfNotExist - user does not exist, wil try to create one now'
      )
      const newUser = new this(data)
      return newUser.save().then(() => {
        console.log('created the user')
        return { created: true, user: newUser }
      })
    })
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
    // .exec()
  }
}

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema)
