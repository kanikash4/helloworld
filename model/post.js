'use strict';

var db = require('./db');

var pm = {
            table       : db.define({
            name        : 'userPosts',
            columns     : ['id', 'email','comment','status', 'deleted_at', 'created_at', 'updated_at']
          }),

  create: function createfn(data, cb) {
    var entry = {
            email       : data.email,
            comment     : data.comment,
            created_at  : new Date()
    };
    var query = pm.table.insert(entry);
    query.exec(function (err, result) {
      if (result) {
        entry.id = result.insertId;
      }
      cb(err, entry);
    });
  },

  fetch: function fetch(keys, options, cb) {
    var query = pm.table.select(options.selectFields);
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
  },

  // update: function update() {},

  delete : function(data, cb) {
    pm.table.update({status:0, deleted_at:data.deleted_at}).where(pm.table.id.equals(data.postId)).exec(cb);
  }
};

module.exports = pm;

///self test

if (require.main === module) {
  (function () {
    var data = {
       email  : 'kanikash4@gmail.com',
       comment:  'test post 3'
    };

    var keys = {
      id: 1
    };
    var options = {
      selectFields: ['email', 'comment']
    };

    // to run create function
    // pm.create(data, function (err, res) {
    //   console.log(err || res);
    // });

    pm.delete({postId:65, deleted_at: new Date(), deleted_at: new Date()}, function(e,r){
      console.log(e ? e : r)
    });

  })();
}