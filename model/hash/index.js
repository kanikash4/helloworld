'use strict';

var db = require('../db');

var hm = {
  table:db.define({
    name: 'userHash',
    columns:['email','hash', 'created_at', 'updated_at']
  }),
  create: function createfn(userId, cb) {
    // create a new hash for this user and save it hash table
    //   if (!data.email ) {
    //   return cb(new Error('Email not retrieved'));
    // }
    // hm.isEmailAvailable(data.email, function (err, exists) {
    //   if (err || exists) {
    //     return cb(err || new Error('User already exists.. Cannot Add: ' + data.email));
    //   } else {
    //     encrypt(data.password, function (err, hash) {
    //       if (err || !hash) {
    //         return cb(err || new Error('Unable to generate password hash'));
    //       }
    //       //add userhash
    //       var userentry = {
    //         email       : data.email,
    //         hash        : hash,
    //         created_at  : new Date()
    //       };

    //       var query = hm.table.insert(userentry);

    //       query.exec(function (err, res) {
    //         console.log(err || res);

    //         if (res) {
    //           userentry.id = res.insertId;
    //         }

    //         cb(err, userentry);
    //       });
    //     });
    //   }
    
    // // invlidate older hashes if exist for this user;
  },
  
  fetch: function fetch(keys, options, cb) {
    // fetch hashes with given keys as filters
    // var tbl = hm.table;
    // var query = tbl.select(options.selectFields);
    // var filters = [];
    // Object.keys(keys).forEach(function (key) {
    //   if (keys[key]) {
    //     filters.push(tbl[key].equals(keys[key]));
    //   }
    // });
    // if (filters.length) {
    //   query = query.where.apply(tbl, filters);
    // }
    // console.log(query.toQuery());

    // query.exec(cb);
  },
  
  isValidHash: function validatefn(hash, cb) {
    // check if this hash exists and has not expired
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
      // email: 'kanikash4@gmail.com',
      //   password: 'test'

    };

    //to run create function
    // hm.create(data, function (err, res) {
    //   console.log(err || res);
    // });


    var keys = {
      id: 1
    };

    var options = {
      selectFields: ['id', 'email', 'firstname']
    };

    encrypt('kkk', console.log);
  })();
}




