import _ from 'lodash'
import Promise from 'bluebird'
import mongoose from 'mongoose'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'

const like = param => new RegExp(param, 'i')
const FREE_SEARCH_COLUMNS = ['title', 'location', 'description', 'price', 'type']

/**
 * List Schema
 */
const ListSchema = new mongoose.Schema({
  creator: { // user if (facebooj id)
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: { // how many people can win?
    type: Number,
    required: true,
  },
  price: {
    type: String,
    required: true
  },
  listEndDate: {
    type: Date,
    requierd: true,
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
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'redeem', 'done', 'deny']
  },
  meta: {
    type: Object,
    required: true,
  },
  users: {
    type: Array,
    default: []
  },
  currentRedeemersIndex: {
    type: Number,
    default: 0,
  },
  currentRedeemers: {
    type: Array,
    default: []
  },
  winners: { // User.id
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  hidden: {
    type: String
  }
})
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
  finish() {
    this.listEndDate = Date.now()
    this.save()
  }
}


const generateHiddenField = (obj) => {
  const { title, description, price, type, location } = obj
  return `${title} - ${description}, ${type} in ${location}`
}

ListSchema.pre('save', function (next) {
  console.log('pre save of list')
  this.hidden = generateHiddenField(this)
  console.log('this hidden')
  next()
})


/**
 * Statics
 */
ListSchema.statics = {
  getPassedButNonFinished() {
    console.log('getPassedButNonFinished')
    // get all lists which end date was passed but we didnt send emails
    return this.find({
      listEndDate: {
        $lt: Date.now()
      },
      status: 'active'
    })
  },
  get(id) {
    return this.findById(id)
      // .exec()
      .then((listFromDB) => {
        // console.log('list', id, listFromDB)
        if (listFromDB) {
          console.log('RETURN LIST')
          return listFromDB
        }
        console.log('err')
        const err = new APIError('No such list exists!', httpStatus.NOT_FOUND)
        return Promise.reject(err)
      })
  },
  list(query) {
    console.log('query', query)
    const { skip = 0, limit = 50 } = query
    const queryFilter = query
    delete queryFilter.skip
    delete queryFilter.limit
    const likeQuery = {}
    if (queryFilter.freesearch) {
      console.log('free search')
      const freeSearch = queryFilter.freesearch.replace(/ /g, '')

      likeQuery.$and = []
      freeSearch.split(',').forEach((cond) => {
        const condRegex = new RegExp(cond)
        console.log('condRegex', condRegex)
        const columnsOrs = FREE_SEARCH_COLUMNS.map(col => ({ [col]: condRegex }))
        likeQuery.$and.push({ $or: columnsOrs })
      })
      console.log('queryFilter', likeQuery)
    } else {
      _.each(queryFilter, (val, key) => {
        if (Number.isInteger(Number.parseInt(val, 10))) {
          likeQuery[key] = val
        } else {
          likeQuery[key] = like(val)
        }
      })
    }

    console.log('likeQuery', JSON.stringify(likeQuery))
    return this.find(likeQuery)
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      // .exec()
  },
  getActiveExccept(id) {
    return this.find({ status: 'active', _id: { $ne: id } })
  },
  byCreators(userId) {
    return this.find({ creator: userId })
    // .exec()
    .then((lists) => {
      if (lists) {
        return lists
      }
      const err = new APIError('No such lists exists!', httpStatus.NOT_FOUND)
      return Promise.reject(err)
    })
    .catch(e => Promise.reject(e))
  },
  findByUser(userId) {
    return this.find({ users: userId })
  },
  findByWinner(userId) {
    console.log('findByWinner', userId)
    return this.find({ winners: userId })
  }
}
ListSchema.index({ hidden: 'text' })
export default mongoose.model('List', ListSchema)
