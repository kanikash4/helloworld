'use strict';

var home = {
  index: function indexfn(req, res, next) {
    res.locals.title = 'Hello World!';
    res.render('index');
  }
};

module.exports = home;
