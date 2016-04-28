'use strict';

var um = require('../model').user;

var mailer = require('../lib/mailer');
var uid = require('rand-token').uid;
var gentoken = uid(30);

var uuid =  require('node-uuid');
var uuid1 = uuid.v1();
var uuid4 = uuid.v4();

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
        //req.session.error = 'Access denied!';
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
    //return res.status(200).send("welcome to super secret api");
    res.render('dashboard');
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
      password      : req.body.password, 
      token         : uuid1
    };
    req.session.email= req.body.email;
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
      if(req.session.email || uuid1>0){
      var mailOptions = {
        from: 'Email Verification <get2shikhakaushik@gmail.com>',
        to: req.body.email,
        subject: 'Email Verification Process',
        text: 'Email Verification',
        html: '<b>Hello </b>' + req.body.firstName + ' ' + req.body.lastName +
          '<br> Please click on the link to activate your account <br> <a href="http://' +
          req.headers.host + '/emailVerify?token=' + uuid1 + ' "> Verify Email </a>'
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
    }
    else
    {
      console.log("sending mail for reset password with hash generated");
    var mailOptions = {
        from: 'Reset Password <get2shikhakaushik@gmail.com>',
        to: req.body.email,
        subject: 'Reset Password Process',
        text: 'Reset Password',
        html: '<b>Hello </b>' + 
          '<br> Please click on the link to reset your password <br> <a href="http://' +
          req.headers.host + '/emailVerify?token=' + uuid4 + ' "> Verify Email </a>'
      };
      console.log(uuid4);
      mailer.sendMail(mailOptions, function (error, info, next) {
        if (error) {
         console.log(error);
        } else {
          res.render('forgot-password', {
            resetMsg: 'Attempt successful... Kindly check the email to verify '
          });
        }
        return next(error);
      });
    }
  },

  emailVerify: function emailVerifyfn(req, res, next) {
    //console.log(JSON.stringify(req));
   var keys = {
     email : req.session.email
   };
   var options = {
     'selectFields': ['email', 'token']
   };
   um.fetch({email : req.session.email}, {selectFields : ['email', 'token']}, function(err, result) {
     console.log(req.query.token + ' : ' +result[0].token);
     if(req.query.token === result[0].token) {
      var expiryTime = Math.floor(Date.now() / 1000 - result[0].created_at);
      if(expiryTime > 86400){
        res.render('login', {logFailMessage:'link has been expired'});
      }
      else { 
        res.render('login', {logMsg: 'Email verified. Now you may login.'});
      }
     } else {
       res.render('login', {logFailMessage: 'Email Verification failed'});
     }
   });
  },

  forgotPasswordPage: function forgotPasswordPagefn(req, res, next) {
    res.render('forgot-password');
    //function(){}
  },

  validateResetRequest: function validateResetRequestfn(req, res, next) {
    //console.log(JSON.stringify(req));
    var keys = {
     email : req.body.email
    };
    var options = {
     'selectFields': ['email']
    };
    var query = um.fetch({email : req.body.email}, {selectFields : ['email']}, function(err, result) {
     console.log("email received to check : " + req.body.email);
     console.log(result);
     if(result.length >0){
      console.log(" present in db"+ result);
      res.render('forgot-password', {resetMsg : ' email present in db'});
     }
     else
     {
      console.log("data was not present");
      res.render('forgot-password', {resetFailMsg : ' email not present in db'});
     }
     return next(err);
   });
  },

  createResetRequest: function createResetRequestfn(err, req, res, next) {
    // var reset = forgot(email,  function(err){
    //   if(err)
    //     res.render('forgot-password',{resetFailMsg: 'failed....'});
    //   else res.render('',{resetMsg: 'check inbox for a password reset message'});
    // });
    // reset.on('', function(req, res){
    //   req.session.reset = {email:email}
    // });
    return next(err);

  },
  sendResetMail: function sendResetMailfn(err, req, res, next) {
         return next(err);
  },
  validateHash: function validateHashfn(req, res, next) {
     //every new hash will invalidate old hash
  },
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
        resetMsg: "Password successfully updated.You can login now"
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
  },

  imageUpload: function imageUploadfn(req, res){
    console.log("uploading image");

  }
};

module.exports = user;
