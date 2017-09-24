'use strict';

var ERR_PROV = {
  msg     : "Sorry! We are facing technical issues. Please try again in sometime.",
  title   : "Technical issue"
};

/*
httpMap - Common HTTP codes mapped to their message.

codeMap - Specific error codes for application errors. Each object has 4 fields
   message : This will be the error message that will be returned to client. Should be user friendly message.
   title   : Similar to above, it is returned as error title. Used error dialogs on UI.
   status  : HTTP status.
   xmsg    : Not sent in response. Can be used for internal purposes.
 */

var map = {

  httpMap: {
    400: "Bad Request",
    401: "Login required",
    403: "Forbidden",
    404: "Not Found",
    406: "Validation Error",
    412: "Precondition Failed",
    422: "Unprocessable Entity",
    500: "Unknown Error",
  },

  codeMap: {
    'SEARCH_NR': {
      message : "No search results found for your request.",
      title   : "No results found",
      status  : 404,
      xmsg    : "No results"
    },
    'INV_REQ': {
      message : "Invalid Request Attempt",
      title   : "Invalid Request",
      status  : 412,
      xmsg    : "Invalid Request Parameters"
    },
    'INV_EMAIL' : {
      message : "INVALID Email Received",
      title   : "Invalid Email Received",
      status  : 422
    },
    'INV_PHN' : {
      message : "INVALID Phone number Received",
      title   : "Invalid Phone number Received",
      status  : 422
    },
    'INV_ORDR_ID' : {
      message : "INVALID/Missing ORDER ID",
      title   : "Invalid Order id",
      status  : 422
    },
    'INV_ITM_NACK' : {
      message : "Nacking  due to invalid item",
      title   : "Invalid items",
      status  : 422
    },
    'WRNG_DATE' : {
      message : "Request does not have the SCHEDULED DATE in the expected format",
      title   : "WRONG DATE",
      status  : 422
    },
    'NO_BODY_FE' : {
      message : "No request body found",
      title   : "No request body found",
      status  : 400
    },
    'NO_DATA_FE' : {
      message : "No request data found",
      title   : "No request data found",
      status  : 400
    },
    'ERR_OCC' : {
      message : "Some error occured",
      title   : "Error occured",
      status  : 412
    },
    'ERR_USR_INF' : {
      message : "Error in getting user info",
      title   : "Error in getting user info",
      status  : 500
    },

    /*-------------------------------------------------------------------------------
    Database Side Errors - Prefixed with DB. Such errors should only be added below.
    ---------------------------------------------------------------------------------*/
    'DB_GID_NF' : {
      message : "Error in fetching group id's from db",
      title   : "Error in fetching group id's from db for the merchant",
      status  : 500
    },
    'DB_UE' : {
      message : "Error in updating status for item",
      title   : "Error in updating status for insert id#",
      status  : 500
    },


    /*-------------------------------------------------------------------------------
    HTTP Side Errors - Prefixed with HTTP. Such errors should only be added below.
    ---------------------------------------------------------------------------------*/

    'HTTP_REQUEST_101' : {
      message : "Input options not correct",
      status  : 400,
    },

    /*-------------------------------------------------------------------------------
    Prevalidation Errors - Prefixed with PV. Such errors should only be added below.
    ---------------------------------------------------------------------------------*/

    //Precondition Errors
     'PV_101' : {
      message : "Missing metadata in the cart items",
      status  : 412
    }

};

module.exports = map;
