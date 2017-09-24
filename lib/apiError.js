'use strict';

var util      = require('util'),
    errorMap  = require('../lib/error_map'),
    _         = require('lodash');

var ApiError = function (errorCode, options) {
  this.errorCode = errorCode;

  var mappedError     = errorMap.codeMap[errorCode] || {};
  this.httpStatusCode = status || mappedError.status || 400;
  var message         = mappedError.message || "Some error occured";
  //Replace variables in message. Variable in message should be like eg message = "Validation failed for order item id : <order_item_id>"
  _.keys(options || {}).forEach(function(key) {message = message.replace("<" + key + ">", options[key])});
  this.message = message;
  this.title   = mappedError.title || "Some error occured";

  Error.captureStackTrace(this, ApiError);
};

util.inherits(ApiError, Error);

module.exports = ApiError;
