'use strict';

var uuid = require('node-uuid');
var uuid1 = uuid.v1();
var uuid4 = uuid.v4();
var db = require('../db');
var hm = {
            table       :db.define({
            name        : 'userHash',
            columns     :['email','hash', 'created_at', 'updated_at']
          }),
  create: function createfn(entry, cb) {
    // create a new hash for this user and save it hash table
    //var vv =  ;

    var entry = {
      email: data.email,
      hash: uuid1,
      created_at: new Date()
    };
    hm.table.insert(entry).exec(cb);
    
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