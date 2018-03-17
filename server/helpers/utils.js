const axios = require('axios')

const FACEBOOK_FIELDS = ['id', 'name', 'email']
const getFacebookURL = accessToken => `https://graph.facebook.com/me?access_token=${accessToken}&fields=${FACEBOOK_FIELDS.slice(',')}&format=json&method=get&pretty=0&suppress_http_code=1`

const validate = (data, fields) => {
  const d = {}
  fields.forEach((f) => {
    if (data[f] === undefined) {
      throw new Error(`Missing ${f}`)
    }

    d[f] = data[f]
  })

  return d
}
const facebookAuth = accessToken => axios.get(getFacebookURL(accessToken))

export default { validate, facebookAuth }
