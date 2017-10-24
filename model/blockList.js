'use strict';

var
  util    = require('util'),
  _       = require('lodash'),
  async   = require('async'),
  db      = require('./db');

var blockList = {};

blockList.table = db.define({
  name      : 'blockList',
  columns   : ['id', 'user_id', 'participant_id', 'status', 'created_at', 'updated_at']
});

blockList.insertIfNotExists     = _insertIfNotExists;
blockList.updateUser            = _updateUser;

function _insertIfNotExists(data, cb) {
  db.getConnection(function (err_conn, connection) {
    if (err_conn) return cb(err_conn);
    connection.query(
      // INSERT IGNORE will just cause a warning (instead of error)
      'INSERT INTO blockList (user_id, participant_id) VALUES (?,?)', [data.user_id,data.participant_id],
      function (err, okPacket) {
        connection.release();
        if (err) {
          return cb({"status": 0});
        }
        cb(null, okPacket);
      });
  });
}

function _updateUser(data, cb) {
  db.getConnection(function (err_conn, connection) {
    if (err_conn) return cb(err_conn);
    connection.query(
      'UPDATE blockList SET status (?), participant_id (?) where user_id (?) ', [data.status, data.participant_id, ,data.user_id],
      function (err, okPacket) {
        connection.release();
        if (err) {
          return cb({"status": 0});
        }
        cb(null, okPacket);
      });
  });
}

module.exports = blockList;

/*-------------------------------------- TEST CODE  ------------------------------------------*/

(function() {
  if (require.main == module) {
    var data = {};
    blockList.insertIfNotExists("545213, 'TEST1', 'TE_001', '', ''",console.log);
  }
}());
