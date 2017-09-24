'use strict';

var
   request        = require('request'),
   url            = require('url'),
   utils          = require('../utils'),
   httpResponse   = require('./httpResponse'),
   httpConfig     = require('./config'),
   httpLogger     = require('./httpLogger'),
   pRoute         = "lib:request:httpRequest",
   wLog           = require('../logger');

var REQUIRED_KEYS = ['method', 'hostname', 'pathname','httpConfig'];
var httpRequest   = function (options, callback) {

  var missing_keys = utils.validateParams(options, REQUIRED_KEYS);
  if (missing_keys.length > 0) {
    wLog.error(pRoute, "Input options not correct. Missing_keys", missing_keys.join(','));
    return callback(new Error(pRoute, "Input options not correct. Missing_keys", missing_keys.join(',')));
  }
  this.httpConfig = new httpConfig(options.httpConfig, callback);
  this.url_only   = this.httpConfig.protocol + '/' + options.hostname + options.pathname;
  this.url        = constructUrlObject(options, this.httpConfig);
  this.method     = options.method;
  this.headers    = options.headers || null;
  this.body       = options.body || null;
  callback(null, this);
};

httpRequest.prototype.executeRequest = function(callback) {
  var requestObj = this;
  var apiOpts    = requestObj.getApiOpts();

  request(apiOpts, function(err, resp, body) {
    var httpResp = new httpResponse(err, resp, body);
    var httpLog  = new httpLogger(requestObj, httpResp);
    httpLog.logData();
    return callback(null, httpResp);
  });
};

httpRequest.prototype.getApiOpts = function(){
  var requestObj = this;
  var apiOpts = {};
  apiOpts.url     = requestObj.url;
  apiOpts.method  = requestObj.method;
  apiOpts.timeout = requestObj.httpConfig.timeout;
  if (requestObj.headers) {
    apiOpts.headers = requestObj.headers;
  }
  if (requestObj.body || (requestObj.headers && requestObj.headers['Content-Type'] === 'application/json')) {
    apiOpts.json = requestObj.body;
  }
  return apiOpts;
};

var post_json_request = function(options, callback) {
  options.headers                 = (options.headers || {});
  options.headers['Content-Type'] = "application/json";
  options.method                  = 'POST';
  var req = new httpRequest(options,function(err, req){
    if(err)
       return callback(err);
    req.executeRequest(callback);
  });
};

var get_request = function(options, callback) {
  options.method = 'GET';
  var req = new httpRequest(options,function(err, req){
    if(err)
       return callback(err);
    req.executeRequest(callback);
  });
};

var post_request = function(options, callback){
  options.method = 'POST';
  var req = new httpRequest(options,function(err, req){
    if(err)
       return callback(err);
    req.executeRequest(callback);
  }); 
};

function constructUrlObject(options, httpConfig) {
  var query_params = options.query_params || {};
  return url.format({
                      protocol  : httpConfig.protocol, 
                      host      : options.hostname, 
                      pathname  : options.pathname, 
                      query     : query_params
                    });
}

module.exports = {
  httpRequest         : httpRequest,
  post_json_request   : post_json_request,
  get_request         : get_request,
  post_request        : post_request,
};
