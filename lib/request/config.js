'use strict';
var pUtils   = require('../putils'),
    apiError = require('../apierror.js'),
    pRoute   = "lib:request:config";

var requestConfig = function(options) {
  this.protocol = options.protocol || "https";
  this.timeout  = options.timeout || 30000;
  if(options.logData === false){
    this.logData = false;
  }
  else{
    this.logData =  true;
  }
};

module.exports = requestConfig;
