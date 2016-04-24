'use strict';

var um = require('../model').user;

var mailer = require('../lib/mailer');
var uid = require('rand-token').uid;

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
        req.session.email = req.body.email;
        res.render('dashboard', {
          welcomeDashMsg: "Welcome to Dashboard"
        });
      } else {
        //res.locals.message = 'Authentication failed';
        console.log("login failed");
        res.render('login', {
          logFailMessage: 'Login failed'
        });
      }
    }
  },

  dashboardWelcome: function dashboardWelcomefn(req, res) {
    if (!req.session.email) {
      return res.status(401).send();
    }

    // XXX: use res.render('index'); // to render logged in user home page instead?
    return res.status(200).send("welcome to super secret api");
  },

  signupPage: function signupPagefn(req, res, next) {
    res.render('signup');
  },

  validateSignup: function validateSignupfn(err, req, res, next) {
    if (!req.body || !req.body.firstName || !req.body.lastName || !req.body.email ||
      !req.body.phone || !req.body.password) {
      err = new Error('Missing some fields. Fill All the fields');
    }
    return next(err);
  },

  signup: function signupfn(req, res, next) {
    var data = {
      firstName     : req.body.firstName,
      lastName      : req.body.lastName,
      phone         : req.body.phone,
      email         : req.body.email,
      password      : req.body.password
    };

    um.create(data, respond);

    function respond(err, result) {
      if (err) {
        return next(err);
      }
      if (result) {
        next();
      } else {
        console.log("Signup failed");
        //res.render('login',{logFailMessage: 'Login failed'});
      }
    }
  },

  respond: function respondfn(req, res) {
    //req.flash('success', 'You are now registered and may log in');
      // XXX: generate a random hash (uuid)
      var token = uid(30);
      var mailOptions = {
        from: 'Email Verification <get2shikhakaushik@gmail.com>',
        to: req.body.email,
        subject: 'Email Verification Process',
        text: 'Email Verification',
        html: '<b>Hello </b>' + req.body.firstName + ' ' + req.body.lastName +
          '<br> Please click on the link to activate your account <br> <a href="http://' +
          req.headers.host + '/emailVerify?token=' + token + ' "> Verify Email </a>'
      };

      mailer.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        } else {
          res.render('signup', {
            signupMessage: 'You have successfully regisered. Kindly check the email to verify '
          });
        }
      });
  },

  emailVerify: function emailVerifyfn(req, res, next) {
    console.log(req.query);
  },

  forgotPasswordPage: function forgotPasswordPagefn(req, res, next) {
    res.render('forgot-password');
    //function(){}
  },

  validateResetRequest: function validateResetRequestfn(req, res) {
    var data = {
      email: req.body.email
    };

  },

  createResetRequest: function createResetRequestfn(req, res, next) {

    // var reset = forgot(email,  function(err){
    //   if(err)
    //     res.render('forgot-password',{resetFailMsg: 'failed....'});
    //   else res.render('',{resetMsg: 'check inbox for a password reset message'});
    // });
    // reset.on('', function(req, res){
    //   req.session.reset = {email:email,}
    // });

  },
  sendResetMail: function sendResetMailfn(req, res, next) {},
  validateHash: function validateHashfn(req, res, next) {},
  resetPasswordPage: function resetPasswordPagefn(req, res, next) {
    res.render('reset-password');
  },
  validateResetPassword: function validateResetPasswordfn(req, res, next, err) {
    if (!req.body.password || req.body.confirm)
      return next(err);
  },
  resetPassword: function resetPasswordfn(req, res, next, err) {
    //if(!req.session.reset)
    // return next(err);
    var data = {
      password: req.body.password,
      confirm: req.body.confirm
    };
    if (req.body.password !== req.body.confirm) {
      //res.end('password mismatch');
      console.log("password mismatch");
    } else {
      um.authenticate(data, respond);
      um.update(data, respond);
      console.log("pasword updated successfully");
      res.render('login', {
        resetMsg: "password successfully updated.You can login now"
      });
    }

    function respond(err, result) {
      // XXX: what is this for?
    }
  },

  loggingout: function logoutfn(req, res) {
    if (req.session.email) {
      req.session.destroy(function (err) {
        if (err) {
          console.log(err);
        }
        res.render('login');
      });
    }
  }
};

module.exports = user;
