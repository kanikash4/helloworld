'use strict';

var um = require('../model').user;


var user = {
  loginPage: function loginPagefn(req, res, next) {
    res.render('login');
  },

  validateLogin: function validateLoginfn(req, res, next) {
    // check for mandatory params;
    var err;
    if (!req.body || !req.body.email || !req.body.password) {
      err = new Error('Missing required params: email/password');
    }

    next(err);
  },

  login: function loginfn(req, res, next) {
    var data = {
      email: req.body.email,
      password: req.body.password
    };

    um.authenticate(data, respond);

    function respond(err, result) {
      if (err) {
        return next(err);
      }

      if (result) {
        res.render('index');
      } else {
        res.locals.message = 'Authentication failed';
        res.render('login');
      }
    }
  }
};

module.exports = user;
