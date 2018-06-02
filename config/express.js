import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import methodOverride from 'method-override'
import cors from 'cors'
import httpStatus from 'http-status'
import expressWinston from 'express-winston'
import expressValidation from 'express-validation'
import helmet from 'helmet'
import winstonInstance from './winston'
import routes from '../server/routes/index.route'
import config from './config'
import APIError from '../server/helpers/APIError'
import authRoute from '../server/routes/auth.route'
import { validateToken } from '../server/helpers/auth'
import listCtrl from '../server/controllers/list.controller'

import sendMail from '../server/helpers/mail'

const app = express()

if (config.env === 'development') {
  app.use(logger('dev'))
}

app.get('/', (req, res) => {
  res.send('im alive!')
})
// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(compress())
app.use(methodOverride())

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

// enable detailed API logging in dev env
// if (config.env === 'development') {
//   expressWinston.requestWhitelist.push('body');
//   expressWinston.responseWhitelist.push('body');
//   app.use(expressWinston.logger({
//     winstonInstance,
//     meta: true, // optional: log meta data about request (defaults to true)
//     msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
//     colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
//   }));
// }

// mount all routes on /api path
app.get('/mail', (req, res) => {
  sendMail('20matan@gmail.com', 'Wooow! you won the list!! ✔', 'You have won the list, click here for redeem https://w8-front.herokuapp.com', (a, b) => {
    res.send({ err: a, ans: b })
  })
})
// app.post('/mail', (req, res, next) => {
//   // setTimeout(() => {
//   res.send('ok')
//   // }, 3000)
// })
app.use('/auth', authRoute)
app.get('/list', listCtrl.list)
app.get('/list/:listId', listCtrl.get)
app.use('/api', (req, res, next) => {
  console.log('will validate /api route')
  const token = req.cookies['access-token']

  // NOTE: Temporary workaround
  if (req.originalUrl === '/api/auth') {
    return next()
  }

  if (!token) {
    return next(new Error('No access-token header provided'))
  }
  const encodedData = validateToken(token)
  console.log('encodedData', encodedData)
  req.encoded = { user: encodedData } // eslint-disable-line no-global-assign
  next()
})
app.use('/api/admin', (req, res, next) => {
  console.log('will validate /api/admin route')
  if (!req.encoded.user.admin) { return next(new Error('You are not admin!')) }
  next()
})
app.use('/api', routes)

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  console.error('err', err)
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors
      .map(error => error.messages.join('. '))
      .join(' and ')
    const error = new APIError(unifiedErrorMessage, err.status, true)
    return next(error)
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic)
    return next(apiError)
  }
  return next(err)
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND)
  return next(err)
})

// log error in winston transports except when executing test suite
// if (config.env !== 'test') {
//   app.use(expressWinston.errorLogger({
//     winstonInstance
//   }));
// }

// error handler, send stacktrace only during development
app.use((
  err,
  req,
  res,
  next // eslint-disable-line no-unused-vars
) =>
  res.status(err.status).json({
    message: err.message,
    stack: config.env === 'development' ? err.stack : {}
  })
)

export default app
