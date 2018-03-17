import jwt from 'jsonwebtoken'
import config from '../../config/config'

const generateToken = data => jwt.sign(data, config.jwtSecret)
const validateToken = token => jwt.verify(token, config.jwtSecret)

export { generateToken, validateToken }
