'use strict';

var fs = require('fs');

var um = require('../model').user;
var hm = require('../model').hash;

var mailer = require('../lib/mailer');

var user = {

  validateLogin: function validateLoginfn(req, res, next) {
    // check for mandatory params;
    var err;
    if (!req.body || !req.body.email || !req.body.password) {
      err = new Error('Missing required params: email/password');
      return next(err);
    }
    next();
  },

  login: function loginfn(req, res, next) {
    var data = {
      email    : req.body.email,
      password : req.body.password
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
        res.render('login', {logFailMessage: 'Login failed'});
      }
    }
  },

  dashboardWelcome: function dashboardWelcomefn(req, res) {
    if (!req.session.email) {
      return res.status(401).send();
    }
    res.render('dashboard');
  },

  validateSignup: function validateSignupfn(req, res, next) {
    if (!req.body || !req.body.firstName || !req.body.lastName || !req.body.email ||
      !req.body.phone || !req.body.password) {
      var err = new Error('Missing some fields. Fill All the fields');
      return next(err);
    }
    next();
  },

  createHash: function createHashfn(req, res, next){
    var data = {
      email:req.body.email
    };
    hm.create(data, function(err, result){
      if(err){
        return next(err);
      }
      return next();
    });
  },

  fetchHash: function fetchHashfn(req, res, next){
    var hashGen;
    var keys = {
      email : req.body.email
    };
    var options = {
      'selectFields': ['email', 'hash']
    };
  
   hm.fetch({email: req.body.email},{selectFields: ['email','hash']},function (err, result){
    if (err) {
     return next(err);
    }
    console.log("Fetching the token....", result[0].hash);
    hashGen         = result[0].hash;
    req.body.crypto = hashGen;
    next();
    });
  },

  signup: function signupfn(req, res, next) {
    var data = {
      firstName     : req.body.firstName,
      lastName      : req.body.lastName,
      phone         : req.body.phone,
      email         : req.body.email,
      password      : req.body.password,
      token         : req.body.crypto
    };
    req.session.email= req.body.email;
    um.create(data, respond);

    function respond(err, result) {
      if (err) {
        return next(err);
      }
      if (result) {
        console.log("sign up successful");
        //next();
      } else {
        console.log("Signup failed");
      }
    }
    return next();
  },

  respond: function respondfn(req, res, next) {
    var mailOptions;
    if(req.session.email || req.body.crypto>0){
      console.log(req.body.crypto);
      mailOptions = {
        from    : 'Email Verification <get2shikhakaushik@gmail.com>',
        to      : req.body.email,
        subject : 'Email Verification Process',
        text    : 'Email Verification',
        html    : '<b>Hello </b>' + req.body.firstName + ' ' + req.body.lastName +
          '<br> Please click on the link to activate your account <br> <a href="http://' +
          req.headers.host + '/emailVerify?token=' + req.body.crypto + ' "> Verify Email </a>'
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
    } else {
      console.log("sending mail for reset password with hash generated");
      mailOptions = {
        from: 'Reset Password <get2shikhakaushik@gmail.com>',
        to: req.body.email,
        subject: 'Reset Password Process',
        text: 'Reset Password',
        html: '<b>Hello </b>' + 
          '<br> Please click on the link to reset your password <br> <a href="http://' +
          req.headers.host + '/emailVerify?token=' + req.body.crypto + ' "> Reset Password </a>'
      };
      console.log(req.body.crypto);
      mailer.sendMail(mailOptions, function (error, info) {
        if (error) {
         console.log(error);
        } else {
          res.render('forgot-password', {
            resetMsg: 'Attempt successful... Kindly check the email to verify '
          });
        }
        return next();
      });
    }
  },

  emailVerify: function emailVerifyfn(req, res, next) {
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

  validateResetRequest: function validateResetRequestfn(req, res, next) {
    var keys = {
     email : req.body.email
    };
    var options = {
     'selectFields': ['email']
    };
    var query = um.fetch({email : req.body.email}, {selectFields : ['email']}, function(err, result) {
     console.log("email received to check : " + req.body.email);
     console.log(result);
     if(! err && result.length > 0){
      console.log(" present in db"+ result);
      res.render('forgot-password', {resetMsg : ' email present in db'});
      next();
     }
     else
     {
      console.log("data was not present");
      res.render('forgot-password', {resetFailMsg : ' email not present in db'});
     }
   });
  },

  createResetRequest: function createResetRequestfn(req, res, next) {
    console.log("create reset request function starts...");
    var data = {
      email      : req.body.email
    };
    hm.create(data, respond);
    function respond(err, result){
      if(err){
        console.log("error : " + err);
        return next(err);
      }
      console.log("hash is generated for reset password");
      return next();
    }
  },
  sendResetMail: function sendResetMailfn(err, req, res, next) {
    console.log("send reset mail fn.....");
     next();
  },

  validateHash: function validateHashfn(err, req, res, next) {
     //every new hash will invalidate old hash
     console.log("validating the hash");
     next();
  },

  validateResetPassword: function validateResetPasswordfn(req, res, next, err) {
    if (!req.body.password || req.body.confirm)
      return next(err);
  },

  resetPassword: function resetPasswordfn(req, res, next) {
    //if(!req.session.reset)
    // return next(err);
    if (req.body.password !== req.body.confirm) {
      //res.end('password mismatch');
      console.log("password mismatch");
    } else {
      var updateData = {
        emailId     : 'xxx',
        userId      : 133,
        password    : req.body.password
      };

      um.update(updateData, respond);
      console.log("pasword updated successfully");
    }

    function respond(err, result) {
      // XXX: what is this for?
      // check err if err pass updaet failed 
      if(!err){
      res.render('login', {
        resetMsg: "Password successfully updated.You can login now"
      });
      }
    }
  },

  loggingout: function logoutfn(req, res, next) {
    if (req.session.email) {
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        }
        res.render('login');
      });
    }
  },

  imageUpload: function imageUploadfn(req, res, next){
    console.log("uploading image");
    console.log(req);
    var tempPath   = req.files.file.path,
        targetPath = path.resolve('../uploads/image.png');
    if (path.extname(req.files.file.name).toLowerCase() === '.png') {
        fs.rename(tempPath, targetPath, function(err) {
            if (err) throw err;
            console.log("Upload completed!");
        });
    } else {
        fs.unlink(tempPath, function (err, resp) {
            if (err) throw err;
            console.error("Only .png files are allowed!");
        });
    }

  }
};


module.exports = user;
