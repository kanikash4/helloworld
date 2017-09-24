'use strict';

var pRoute = "lib:request:httpResponse";

var httpResponse = function(err, res, body) {
  if (res) {
    this.statusCode       = res.statusCode;
    this.responseBody     = body;
    this.responseHeaders  = res.headers;
    this.contentType      = res.headers['content-type'];
  }
  if (err) {
     this.error = err.message.toString();
     this.errorCode = err.code;
  }
};

httpResponse.prototype.isSuccess = function() {
  //If there is any error return false
  if (this.error) {
    return false;
  }
  //If the status code is not 2XX return false
  if (this.statusCode.toString().match(/2[0-9][0-9]/) === null) {
    return false;
  }
  return true;
};

httpResponse.prototype.errorString = function() {
   return this.statusCode + this.error + this.error_code;
};

module.exports = httpResponse;
