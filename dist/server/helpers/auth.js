'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateToken = exports.generateToken = undefined;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateToken = function generateToken(data) {
  return _jsonwebtoken2.default.sign(data, _config2.default.jwtSecret);
};
var validateToken = function validateToken(token) {
  return _jsonwebtoken2.default.verify(token, _config2.default.jwtSecret);
};

exports.generateToken = generateToken;
exports.validateToken = validateToken;
//# sourceMappingURL=auth.js.map
