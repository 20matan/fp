import User from '../models/user.model'
import { facebookAuth } from '../helpers/utils'
import { generateToken } from '../helpers/auth'
import config from '../../config/config'

const FACEBOOK_ADMINS_ID = ['10200352632296071', '10215761152011739', '1782689235075417']
const COOKIE_OPTIONS = {
  maxAge: 864 * 10000000, // 100 days
  httpOnly: true // The cookie only accessible by the web server
}
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


export const login = (req, res, next) => {
  if (!req.body.access_token) {
    next(new Error('No access_token was sent in the body'))
    return
  }
  facebookAuth(req.body.access_token)
    .then(({ data }) => {
      console.log('res', data)
      if (data.error) {
        // next(data.error)
        res.send({ success: false, error: data.error })
        return
      }
      console.log('no error in facebook auth, moving on')
      const userData = Object.assign({}, data, { username: data.name, picture_url: data.picture.data.url })
      console.log('userData', userData)
      return User.findOrCreate(data.id, userData)
      .then((creationRes) => {
        const { user } = creationRes
        const dataToTokenize = Object.assign({}, user.toObject())

        console.log('id', data.id)
        if (FACEBOOK_ADMINS_ID.indexOf(data.id) !== -1) {
          console.log('admin log in')
          dataToTokenize.admin = true
        }

        const token = generateToken(dataToTokenize)
        res.cookie('access-token', token, COOKIE_OPTIONS)
        res.send({ succcess: true, token, user: dataToTokenize })
        return
      })
    })
    .catch((e) => {
      console.error('e', e)
      next(e)
    })
}
