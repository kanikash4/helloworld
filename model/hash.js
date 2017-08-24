'use strict';

var uuid = require('node-uuid');
var uuid1 = uuid.v1();
var uuid4 = uuid.v4();

var async = require('async');

var expiryTime = 86400;

var db = require('./db');
var hm = {
            table       : db.define({
            name        : 'userHash',
            columns     :['id','email','hash','status', 'created_at', 'updated_at']
          }),


  create: function createfn(data, cb) {
    // create a new hash for this user and save it hash table

    db.getConnection(function(err_conn, connection) {
    if(err_conn) return cb(err_conn);

      connection.beginTransaction(function(err_txn) {
        if(err_txn) return cb(err_txn);

        var entry = {
          email       : data.email,
          hash        : uuid4
        };

        async.waterfall([
          _createHash,
          _invalidOlderHash
        ], function(err, okPacket) {
          if(err) {
            connection.rollback(function() {
              connection.release();
              return cb(err);
            });
          } else {
            connection.commit(function(err) {
              connection.release();
              if(err) {
                return cb(err);
              }
              cb(null, okPacket);
            });
          }
        });

        function _createHash(callback) {
          var query = hm.table.insert(entry);
          query.exec(function (err, result) {
            if(err || !result){
              return cb(err || new Error('Unable to create the hash'));
            }
            callback(null, result);
          });
        }

        function _invalidOlderHash(result, callback) {
          // invlidate older hashes if exist for this user;
          console.log("_invalidOlderHash funct", result);
          if(result.affectedRows === 1) {
            hm.table.update({status: 0}).where(hm.table.email.equals(data.email).and(hm.table.id.notEquals(result.insertId))).exec(function(e, r){
              console.log("updating the hash table", e || r);
              if(e || !r){
                return cb(e || new Error('Unable to update the older hash'));
              }
              callback(null, r);
            });
          } else {
            // Not to process with new hash created since new hash is not created
            return cb(new Error('New hash is not created for the user'));
          }
        }

      });
    });  
  },
  
  fetch: function fetchfn(keys, options, cb) {
    //fetch hashes with given keys as filters

    db.getConnection(function(err_conn, connection) {
      if(err_conn) return cb(err_conn);

      connection.beginTransaction(function(err_txn) {
        if(err_txn) return cb(err_txn);
        var tbl     = hm.table;
        var query   = tbl.select(options.selectFields);
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
    });
  });

  },
  
  isValidHash: function validatefn(keys, options, cb) {
    // check if this hash exists and has not expired

    db.getConnection(function(err_conn, connection) {
      if(err_conn) return cb(err_conn);

      connection.beginTransaction(function(err_txn) {
        if(err_txn) return cb(err_txn);

        hm.fetch(keys, options, function(e, r) {
          if(e || !r){
            cb(new Error('Not able to check the hash'));
          }
        // TODO: validate for the hash here
        console.log("fetched hash: ", r);
        if(r.status !== 1){
          return cb(new Error('Invalid hash for the user'));
        }


        });


      });
    });


    // function fetch1(error , results, feilds){
    //   if(results.length>0){
    //   if(results[0].status==0){
    //     var expiryTime = Math.floor(Date.now() / 1000) - results[0].created_at;
    //     if (expiryTime > 86400) {
    //       //res.render('accountActivation', { layout: false, message: 'Sorry! Your verification link has been expired'});
    //       console.log("account expired");
    //     } else {
    //       var data = {
    //         email: 'kanika.sharma@paytm.com'
    //       };
    //      um.update(data, respond),
    //       // um.query({
    //       //   sql: 'UPDATE `users1` SET `status` = ? WHERE `username` = ? and `password` = ?',
    //       //   values: [1, results[0].username, results[0].password]
    //       // },
    //        function(errorUpdate, resultUpdate) {
    //         if(resultUpdate.affectedRows==1){
    //           //res.render('accountActivation', { layout: false, message: 'Congratulation! Your account has been successfully activated'});
    //           console.log("account has been successfully activated");
    //          }
    //    else {
    //     console.log("already activated account");
    //     //res.render('accountActivation', { layout: false, message: 'Your account is already activated'});
    //   }
    // //   else {
    // //   console.log("invalid token");
    // //   //res.render('accountActivation', { layout: false, message: 'Sorry! Invalid token number'});
    // // }
    // };
  },
  
  resetHash: function resetHashfn(userId, hash, cb) {
    // expire if the hash and userId association is correct

  }
};

module.exports = hm;

///self test

if (require.main === module) {
  (function () {
    var data = {
       email: 'kanikash4@gmail.com'
    };

    //to run create function
    // hm.create(data, function (err, res) {
    //   console.log(">>>")
    //   console.log(err || res);
    // });

    //fetch 
    var keys = {
      status: 1
    };
    var options = {
      selectFields: ['email', 'hash', 'status']
    };

    // hm.fetch(keys, options, function(err, resp) {
    //   console.log(err || resp);
    // });

    hm.isValidHash(keys, options, function(e,r){
      console.log("QQ: ", e || r);
    });

    //

  })();
}