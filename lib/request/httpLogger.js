'use strict';

var _      = require('lodash'),
    wLog   = require('./../logger'),
    pRoute = "lib:request:httpLogger";

var httpLogger = function (httpRequest, httpResponse) {
  this.httpRequest  = httpRequest;
  this.httpResponse = httpResponse;
};

httpLogger.prototype.logData = function() {

  var data = {
      request : {
        method : this.httpRequest.method,
        url_only : this.httpRequest.url_only,
        //url : this.httpRequest.url,
        //headers : this.httpRequest.headers, //Never log headers
        body : this.httpRequest.body
      },
      response : {
        status_code           : this.httpResponse.statusCode,
        response_headers      : this.httpResponse.responseHeaders,
        response_content_type : this.httpResponse.contentType,
        error                 : this.httpResponse.error,
        error_code            : this.httpResponse.errorCode
      }
  };
    if (this.httpRequest.giftConfig.logData)
    {
      _.set(data, "request.url" , this.httpRequest.url);
      _.set(data, "response.json_reponse_body" , this.httpResponse.responseBody);
    }
   wLog.info(pRoute, data);
};

module.exports = httpLogger;
