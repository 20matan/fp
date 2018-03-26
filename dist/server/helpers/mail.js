'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transporter = _nodemailer2.default.createTransport({
  service: 'gmail',
  auth: {
    user: 'qqqafa@gmail.com',
    pass: 'mamram123123'
  }
});

var mailOptions = {
  from: 'qqqafa@gmail.com',
  // to: '20matan@gmail.com ',
  subject: 'Wooow! you won the list!! ✔',
  text: 'You have won the list, click here for redeem (todo)'
};

var sendMail = function sendMail(email) {
  return transporter.sendMail(Object.assign({}, mailOptions, { to: email }));
};

exports.default = sendMail;
module.exports = exports['default'];
//# sourceMappingURL=mail.js.map
