'use strict';

var 
  util    = require('util'),
  _       = require('lodash'),
  async   = require('async'),  
  db      = require('./db');

var userMessages = {};

userMessages.table = db.define({
  name      : 'userMessages',
  columns   : ['id', 'user_id', 'message', 'message_type', 'attachment_url', 'deleted_at', 'created_at', 'updated_at']
});

userMessages.fetchMessages         = _fetchMessages; 
userMessages.insertIfNotExists     = _insertIfNotExists;
userMessages.deleteMessage         = _deleteMessage;

function _insertIfNotExists(data, cb) {
  db.getConnection(function (err_conn, connection) {
    if (err_conn) return cb(err_conn);
    connection.query(
      'INSERT INTO userMessages (user_id, message, message_type, attachment_url) VALUES (?,?,?,?)',
       [data.user_id,data.message, data.msgType, data.url],
      function (err, okPacket) {
        connection.release();
        if (err) {
          return cb(err);
        }
        cb(null, okPacket);
      });
  });
}

function _fetchMessages(data, cb) {
  db.getConnection(function (err_conn, connection) {
    if (err_conn) return cb(err_conn);
    connection.query(
      'SELECT message from userMessages where user_id = ? and status = 1 order by id  desc limit ?', [data.user_id,data.msgLimit],
      function (err, okPacket) {
        connection.release();
        if (err) {
          return cb(err);
        }
        cb(null, okPacket);
      });
  });
}

function _deleteMessage(data, cb) {
  db.getConnection(function (err_conn, connection) {
    if (err_conn) return cb(err_conn);
    connection.query(
      'update userMessages set status= 0, deleted_at= ? where id = ? and user_id = ?', [data.deleted_at, data.msgId, data.userId],
      function (err, okPacket) {
        connection.release();
        if (err) {
          return cb(err);
        }
        cb(null, okPacket);
      });
  });
}

module.exports = userMessages;

/*---------------------- TEST CODE  -------------------------*/

(function() {
  if (require.main == module) {
    var data;
    userMessages.fetchMessages({user_id:86, msgLimit:10}, function(err, resp) {
      console.log(err || resp);
    });
    // data = { user_id: 86,message: 'test msg 1', msgType: 'text', url : ''};
    // userMessages.insertIfNotExists(data, function(e,r) {
    //   console.log(e ? e : 'Message posted' );
    // });
    // data = {deleted_at : '2017-08-28 13:06:15', msgId : 2, userId: 86};
    // userMessages.deleteMessage(data, function(e, r){
    //   console.log(e ? e : r);
    // });
  }
}());
