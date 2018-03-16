import User from '../models/user.model'
import { facebookAuth } from '../helpers/utils'
import { generateToken } from '../helpers/auth'

function login(req, res, next) {
  if (!req.body.access_token) {
    next(new Error('No access_token was sent in the body'))
    return
  }

  facebookAuth(req.body.access_token)
  .then(({ data }) => {
    console.log('res', data)
    if (data.error) {
      next(data.error)
      return
    }
    console.log('no error in facebook auth, moving on')

    User.findOrCreate(data.id, Object.assign({}, data, { username: data.name }))
    .then((creationRes) => {
      console.log('creationRes', creationRes)
      const { user } = creationRes

      const token = generateToken(user)
      // TODO: return jwt
      res.send({ succcess: true, token, user })
      return
    })
  })
  .catch(next)
}

export default { login }
