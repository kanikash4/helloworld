'use strict';

var home = require('./home');
var user = require('./user');
var error = require('./error');
var render = require('./render');
var userMessage = require('./users').message;

module.exports = function (app) {
  app.get('/', home.index);

  // user routes
  /**
   * @api {post} /login Login for registered users
   * @apiName Registered users login
   * @apiGroup Login
   * @apiVersion 1.0.0
   *
   * @apiSuccess (200) {String} Success-Response:
   *    HTTP/1.1 200 OK
   *
   * @apiParamExample {json} Request-Example:
   * {
   * }
  */
  app.get('/login', render.loginPage);
  app.post('/login', user.validateLogin, user.login, error);

  app.get('/dashboard', user.dashboardWelcome);

  app.get('/signup', render.signupPage);
  app.post('/signup', user.validateSignup, user.createHash, user.fetchHash, user.signup, user.respond, error);
  app.get('/emailVerify', user.emailVerify, error);

  app.get('/forgot-password', render.forgotPasswordPage);
  app.post('/reset-request', user.validateResetRequest, user.createResetRequest,user.fetchHash, 
    user.sendResetMail, user.respond, error);
  app.get('/reset-password/:resetHash', user.validateHash, render.resetPasswordPage, error);
  app.post('/reset-password', user.validateResetPassword, user.resetPassword, error);

  app.post('/logout', user.loggingout, error);

  app.post('/upload', user.imageUpload, error);


  // app.get('/getMessages', userMessage.getMessages);

  // app.post('/sendMessages', userMessage.sendMessages);

  app.post('/deleteMessages', userMessage.deleteMessage, error);

  // app.post('/deletePosts', error);

  app.get('/chat', render.chatPage);

  app.post('/deactivateAccount', error);

};

// reset hash - (generate uuid.v4())
//   - will have expiry (24 hours)
//   - every new hash will invalidate old hash
