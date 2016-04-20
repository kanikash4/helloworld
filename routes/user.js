'use strict';

var um = require('../model').user;


var user = {
  loginPage: function loginPagefn(req, res, next) {
    res.render('login');
  },

  validateLogin: function validateLoginfn(req, res, next) {
    // check for mandatory params;
    var err;
    if(!req.body || !req.body.email || !req.body.password) {
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
      if(err) {
        return next(err);
      }
      if(result) {
        req.session.email = req.body.email;
        res.render('dashboard',{welcomeDashMsg:"Welcome to Dashboard"});
      } else {
        //res.locals.message = 'Authentication failed';
        console.log("login failed");
        res.render('login',{logFailMessage: 'Login failed'});
      }
    }
  },

  dashboardWelcome: function dashboardWelcomefn(req, res){
    if(!req.session.email){
      return res.status(401).send();
    }
    return res.status(200).send("welcome to super secret api")
  },


  signupPage: function signupPagefn(req, res, next){
    res.render('signup');
  },
  validateSignup: function validateSignupfn(err, req, res,  next){
    if(!req.body || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.phone  || !req.body.password){
      err= new Error('Missing some fields. Fill All the fields');
      console("error occured");
    }
     return next(err);
  },
  signup: function signupfn(req, res, next){
    console.log("signing up the user");
    var data = {
      firstName   : req.body.firstName,
      lastName    : req.body.lastName,
      phone       : req.body.phone,
      email       : req.body.email,
      password    : req.body.password
    };
    um.create(data, respond);

    function respond(err, result) {
      if (err) {
        return next(err);
      }
      if (result) {
        res.render('signup',{signupMessage:"Successfully signed up."});
      } else {
        console.log("Signup failed");
        //res.render('login',{logFailMessage: 'Login failed'});
      }
    }
       
  },
  
  respond: function  respondfn(err, req, res){
     //req.flash('success', 'You are now registered and may log in');

    if(!err){
      var transporter= nodemailer.createTransport({
        service   : 'Gmail',
        auth      : {
                      user: '---@gmail.com',
                      pass: '---'
                    }
      });
       var mailOptions = {
        from    : 'Node Application <---@gmail.com>',
        to      : req.body.email,
        subject : 'Email Verification Process',
        text    : 'Email Verification',
        html    : '<b>Hello</b>'+ req.body.firstName + '' + req.body.lastName + '<br> Please click on the link to activate your account <br> <a href="http://'+ req.headers.host + '/email-verify?token=' + token + ' "> Verify Email </a>'       }
    };
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        return console.log(error);
      }
      else{
        res.render('signup',{signupMessage: 'You have successfully regisered. Kindly check the email to verify '});
      }

    });
  },
  forgotPasswordPage: function forgotPasswordPagefn(req, res, next){

    res.render('forgot-password');
    //function(){}
  },
  validateResetRequest: function validateResetRequestfn(req, res){
    var data =  {
        email : req.body.email  
    }; 
    
    // var reset = forgot(email,  function(err){
    //   if(err) 
    //     res.render('forgot-password',{resetFailMsg: 'failed....'});
    // });
  },
  createResetRequest: function createResetRequestfn(){
   
  },
  sendResetMail: function sendResetMailfn(){},
  validateHash: function validateHashfn(){},
  resetPasswordPage: function resetPasswordPagefn(){
    res.render('reset-password');
  },
  validateResetPassword: function validateResetPasswordfn(req, res, next, err){
    if(!req.body.password|| req.body.confirm)
      return next(err);
  },
  resetPassword: function resetPasswordfn(req, res, next, err){
     //if(!req.session.reset)
     // return next(err);
    var data={
      password   : req.body.password,
      confirm    : req.body.confirm
    };
    if(req.body.password !== req.body.confirm) {
      //res.end('password mismatch');
      console.log("password mismatch");
    }
    else{
      um.authenticate(data, respond);
      um.update(data, respond);
      console.log("pasword updated successfully");
      res.render(login,{resetMsg:"password successfully updated.You can login now"});
    }

  },

  loggingout: function logoutfn(req, res){
    if(req.session)
    req.session.destroy(function(err){
      if(err){
        console.log(err);
      }
      else{
      res.render('login');        
      }
    });
      
    
  }


};

module.exports = user;
