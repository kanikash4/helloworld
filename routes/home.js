'use strict';

var home = {
  index: function indexfn(req, res, next) {
    //res.locals.title = 'Hello World!';
    res.render('login');
  }
};

module.exports = home;
