'use strict';

var db = require('./db');

var userFollowers = {};

userFollowers.table = db.define({
  name      : 'userFollowers',
  columns   : ['id', 'user_id', 'message', 'message_type', 'attachment_url', 'deleted_at', 'created_at', 'updated_at']
});

userFollowers.follow       = _follow; 
userFollowers.unfollow     = _unfollow;

function _follow(data, cb) {
  db.getConnection(function (err_conn, connection) {
    if (err_conn) return cb(err_conn);
    connection.query(
      '',
       [],
      function (err, okPacket) {
        connection.release();
        if (err) {
          return cb(err);
        }
        cb(null, okPacket);
      });
  });
}


function _unfollow(data, cb) {
  db.getConnection(function (err_conn, connection) {
    if (err_conn) return cb(err_conn);
    connection.query(
      '',
       [],
      function (err, okPacket) {
        connection.release();
        if (err) {
          return cb(err);
        }
        cb(null, okPacket);
      });
  });
}

module.exports = userFollowers;