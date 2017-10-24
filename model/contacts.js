'use strict';

var
  util    = require('util'),
  _       = require('lodash'),
  async   = require('async'),
  db      = require('./db');

var contact = {};

contact.table = db.define({
  name      : 'contact',
  columns   : ['id', 'logged_user_id', 'contact_id', 'created_at', 'updated_at']
});

contact.selectContactList     = _selectContactList;

function _selectContactList(data, cb) {
  db.getConnection(function (err_conn, connection) {
    if (err_conn) return cb(err_conn);
    connection.query(
      // INSERT IGNORE will just cause a warning (instead of error)
      'INSERT INTO contact (loggedUserId, contactId) VALUES (?,?)', [data.loggedUserId, data.contactId],
      function (err, okPacket) {
        connection.release();
        if (err) {
          return cb({"status": 0});
        }
        cb(null, okPacket);
      });
  });
}

module.exports = contact;

/*-------------------------------------- TEST CODE  ------------------------------------------*/
