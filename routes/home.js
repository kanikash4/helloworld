'use strict';

var home = {
  index: function indexfn(req, res, next) {
    res.render('login');
  }
};

module.exports = home;
