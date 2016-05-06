'use strict';

var db = require('../db');
var pm = {
            table       : db.define({
            name        : 'userPosts',
            columns     : ['email','comment','status', 'created_at', 'updated_at']
          }),
  create: function createfn(data, cb) {  

    var entry = {
            email       : data.email,
            comment     : data.comment,
            created_at  : new Date()
    };
    var query = pm.table.insert(entry);
          query.exec(function (err, result) {
            console.log(err || result);
            if (result) {
              entry.id = result.insertId;
            }
            cb(err, entry);
          });  
  },
  
  fetch: function fetch(keys, options, cb) {
    var  tbl = pm.table;
    var query = tbl.select(options.selectFields);
    var filters = [];
    Object.keys(keys).forEach(function (key) {
      if (keys[key]) {
        filters.push(tbl[key].equals(keys[key]));
      }
    });
    if (filters.length) {
    query = query.where.apply(tbl, filters);
    }
    console.log(query.toQuery());
    query.exec(cb);

  }
};

module.exports = pm;

///self test

if (require.main === module) {
  (function () {
    var data = {
       email  : 'kanika.sharma@paytm.com',
       comment:  'test comment'
    };

    //to run create function
    pm.create(data, function (err, res) {
      console.log(err || res);
    });
    var keys = {
      id: 1
    };
    var options = {
      selectFields: ['email', 'comment']
    };

  })();
}