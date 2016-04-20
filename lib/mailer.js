'use strict';

var nodemailer = require('nodemailer');

// XXX: create a dummy gmail account and use it here
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: '---@gmail.com',
    pass: '---'
  }
});

var mailer = {
  sendMail: function sendmailfn(mail, cb) {
    transporter.sendMail(mail, cb);
  }
};

module.exports = mailer;
