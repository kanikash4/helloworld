'use strict';

var 
  pUtils      = require('../lib/putils');

var
  dbModel     = require('../model'),
  wLog        = require('../lib/logger'),
  ApiError    = require('./../lib').apierror,
  pRoute      = 'app_model::userMessages';


var _lastMsgs = function(limit, cb) {

};

module.exports = {

	lastMsgs  : _lastMsgs
};