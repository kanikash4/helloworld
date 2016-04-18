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
      email       : req.body.email,
      password    : req.body.password
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
  },


  signupPage: function signupPagefn(req, res, next){
    res.render('signup',{title: 'signup page'});
  },
  validateSignup: function validateSignupfn(req, res,  next){
    if(!req.body ||req.body.firstName ||req.body.lastName || req.body.email || req.body.phone  || req.body.pass){
      err= new Error('Missing some fields. Fill All the fields');
    }
    next(err);
  },
  signup: function signupfn(req, res, next){
    // var data = {
    //   firstName   : req.body.firstName,
    //   lastName    : req.body.lastName,
    //   phone       : req.body.phone,
    //   email       : req.body.email,
    //   password    : req.body.password
    // };
    // //insertquery
    // if(!err){
    //   var transporter= nodemailer.createTransport({
    //     service   : 'Gmail',
    //     auth      : {
    //                   user: 'gmail id',
    //                   pass: 'password of id'
    //                 }
    //   });
    //    var mailOptions = {
    //     from    : 'Node Application <---@gmail.com>'
    //     to      : req.body.email,
    //     subject : 'Email Verification Process',
    //     text    : 'Email Verification',
    //     html    : '<b>Hello</b>'+ req.body.firstName + '' + req.body.lastName + '<br> Please click on the link to activate your account <br> <a href="http://'+ req.headers.host + '/email-verify?token=' + token + ' "> Verify Email </a>'       }
    // };
    // transporter.sendMail(mailOptions, function(error, info){
    //   if(error){
    //     return console.log(error);
    //   }
    //   else{
    //     res.render('signup',{signupMessage: 'You have successfully regisered. Kindly check the email to verify '});
    //   }

    // });
  },
  

  respond: function  respondfn(){},
  forgotPasswordPage: function forgotPasswordPagefn(req, res, next){
    res.render('forgotPassword');
  },
  validateResetRequest: function validateResetRequestfn(){},
  createResetRequest: function createResetRequestfn(){},
  sendResetMail: function sendResetMailfn(){},
  validateHash: function validateHashfn(){},
  resetPasswordPage: function resetPasswordPagefn(){},
  validateResetPassword: function validateResetPasswordfn(req, res, next){
    res.render('reset-password');
  },
  resetPassword: function resetPasswordfn(){}



};

module.exports = user;
