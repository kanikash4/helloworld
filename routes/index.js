'use strict';

var home = require('./home');
var user = require('./user');
var error = require('./error');

module.exports = function (app) {
  app.get('/', home.index);


  // user routes
  app.get('/login', user.loginPage);
  app.post('/login', user.validateLogin, user.login, error);

  app.get('/signup', user.signupPage);
  app.post('/signup', user.validateSignup, user.signup, user.respond, error);

  app.get('/forgot-password', user.forgotPasswordPage);
  app.post('/reset-request', user.validateResetRequest, user.createResetRequest,
    user.sendResetMail, user.respond, error);
  app.get('/reset-password/:resetHash', user.validateHash, user.resetPasswordPage);
  app.post('/reset-password', user.validateResetPassword, user.resetPassword);

};


// basic ops for any api;
//data collection
//data validation
//business logic check
//respond

// http://localhost:3000/reset-password/skdhfksdflsl,mxnc9ueljksdjflkdsjflds
// 
// reset hash - (generate uuid.v4())
//   - will have expiry (24 hours)
//   - every new hash will invalidate old hash
