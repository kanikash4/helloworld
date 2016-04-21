'use strict';

var db = require('../db');
var bcrypt = require('bcrypt');
var hm = {
            table       :db.define({
            name        : 'userHash',
            columns     :['email','hash', 'created_at', 'updated_at']
          }),
  create: function createfn(userId, cb) {
    // create a new hash for this user and save it hash table
        //generate a salt
        var salt = bcrypt.genSaltSync(10);
        //hash the password with salt
        var hash = bcrypt.hashSync("mypassword", salt);
         //storing the hash in db
         var data = 'kanikash4@gmail.com';
         //add userhash
          var userentry = {
            email       : data.email,
            hash        : hash,
            created_at  : new Date()
          };
         var query = hm.table.insert(userentry);
         query.exec(function(err, res){
          console.log(err||res);
          if(res){
            console.log("done");
          }
          cb(err, userentry)
         })
    
    // // invlidate older hashes if exist for this user;
  },
  
  fetch: function fetch(keys, options, cb) {
    //fetch hashes with given keys as filters
    hm.table.select(options.selectFields);
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
  
  isValidHash: function validatefn(hash, cb) {
    // check if this hash exists and has not expired
    bcrypt.compareSync("my password",hash);//true
    bcrypt.compareSync("not my password",hash);//false
  },
  
  resetHash: function resetHashfn(userId, hash, cb) {
    // expire if the hash and userId association is correct
  }
};

module.exports = hm;

///self test

if (require.main === module) {
  (function () {
    // var data = {
    //    email: 'kanikash4@gmail.com'
    // };

    //to run create function
    hm.create(data, function (err, res) {
      console.log(err || res);
    });
    var keys = {
      id: 1
    };
    var options = {
      selectFields: ['email', 'hash']
    };

  })();
}




