'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _methodOverride = require('method-override');

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _expressWinston = require('express-winston');

var _expressWinston2 = _interopRequireDefault(_expressWinston);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _winston = require('./winston');

var _winston2 = _interopRequireDefault(_winston);

var _index = require('../server/routes/index.route');

var _index2 = _interopRequireDefault(_index);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _APIError = require('../server/helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

var _auth = require('../server/routes/auth.route');

var _auth2 = _interopRequireDefault(_auth);

var _auth3 = require('../server/helpers/auth');

var _mail = require('../server/helpers/mail');

var _mail2 = _interopRequireDefault(_mail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

if (_config2.default.env === 'development') {
  app.use((0, _morgan2.default)('dev'));
}

// parse body params and attache them to req.body
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

app.use((0, _cookieParser2.default)());
app.use((0, _compression2.default)());
app.use((0, _methodOverride2.default)());

// secure apps by setting various HTTP headers
app.use((0, _helmet2.default)());

// enable CORS - Cross Origin Resource Sharing
app.use((0, _cors2.default)());

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
app.post('/mail', function (req, res, next) {
  (0, _mail2.default)();
  // setTimeout(() => {
  res.send('ok');
  // }, 3000)
});
app.use('/auth', _auth2.default);
app.use('/api', function (req, res, next) {
  console.log('will validate /api route');
  var token = req.cookies['access-token'];

  // NOTE: Temporary workaround
  if (req.originalUrl === '/api/auth') {
    return next();
  }

  if (!token) {
    return next(new Error('No access-token header provided'));
  }
  var encodedData = (0, _auth3.validateToken)(token);
  console.log('encodedData', encodedData);
  req.encoded = { user: encodedData }; // eslint-disable-line no-global-assign
  next();
});
app.use('/api/admin', function (req, res, next) {
  console.log('will validate /api/admin route');
  if (!req.encoded.user.admin) {
    return next(new Error('You are not admin!'));
  }
  next();
});
app.use('/api', _index2.default);

// if error is not an instanceOf APIError, convert it.
app.use(function (err, req, res, next) {
  console.error('err', err);
  if (err instanceof _expressValidation2.default.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    var unifiedErrorMessage = err.errors.map(function (error) {
      return error.messages.join('. ');
    }).join(' and ');
    var error = new _APIError2.default(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof _APIError2.default)) {
    var apiError = new _APIError2.default(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new _APIError2.default('API not found', _httpStatus2.default.NOT_FOUND);
  return next(err);
});

// log error in winston transports except when executing test suite
// if (config.env !== 'test') {
//   app.use(expressWinston.errorLogger({
//     winstonInstance
//   }));
// }

// error handler, send stacktrace only during development
app.use(function (err, req, res, next // eslint-disable-line no-unused-vars
) {
  return res.status(err.status).json({
    message: err.message,
    stack: _config2.default.env === 'development' ? err.stack : {}
  });
});

exports.default = app;
module.exports = exports['default'];
//# sourceMappingURL=express.js.map
