'use strict';

var bcrypt = require('bcrypt');

var db = require('../db');

var um = {

  table: db.define({
    name: 'users',
    columns: ['id', 'email', 'firstname', 'lastname', 'status', 'phone', 'password','token', 
      'created_at', 'updated_at']
  }),

  create: function createfn(data, cb) {
    if (!data.email || !data.password || !data.firstName || !data.lastName || !data.phone) {
      return cb(new Error('Missing required field: Email/Password'));
    }
    um.isEmailAvailable(data.email, function (err, exists) {
      if (err || exists) {
        return cb(err || new Error('User already exists.. Cannot Add: ' + data.email));
      } else {
        encrypt(data.password, function (err, hash) {
          if (err || !hash) {
            return cb(err || new Error('Unable to generate password hash'));
          }

          //add new user
          var newuser = {
            email: data.email,
            firstname: data.firstName,
            lastname: data.lastName,
            status: 1,
            phone: data.phone,
            password: hash,
            token : data.token,
            created_at: new Date()
          };

          var query = um.table.insert(newuser);

          query.exec(function (err, res) {
            console.log(err || res);

            if (res) {
              newuser.id = res.insertId;
            }

            cb(err, newuser);
          });
        });
      }
    });
  },

  isEmailAvailable: function (email, cb) {
    var keys = {
      email: email
    };
    var options = {
      selectFields: ['id', 'email']
    };

    um.fetch(keys, options, function (err, res) {
      cb(err, res && res.length);
    });
  },

  fetch: function fetchfn(keys, options, cb) {
    var tbl = um.table;
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

  update: function updatefn(data, cb) {
    if (!data.email) {
      return cb(new Error('Missing required field for update: email'));
    }

    if (data.password) {
      encrypt(data.password, function (err, hash) {
        if (err || !hash) {
          return cb(new Error('Unable to generate password hash'));
        }

        data.password = hash;
        updateUser();
      });
    } else {
      updateUser();
    }

    function updateUser() {
      um.table.update(data).where(um.table.email.equals(data.email)).exec(cb);
    }
  },

  remove: function removefn(data, cb) {
    if (!data.email) {
      return cb(new Error('Missing required field for update: email'));
    }

    var updateData = {
      status: 0
    };

    um.table.update(updateData).where(um.table.email.equals(data.email)).exec(cb);
  },

  authenticate: function authenticatefn(data, cb) {
    if (!data.email || !data.password) {
      return cb(new Error('Missing required params: email/password'));
    }

    var keys = {
      email: data.email
    };

    var options = {
      selectFields: ['id', 'email', 'password']
    };

    um.fetch(keys, options, function (err, res) {
      if (err || !res || !res.length) {
        return cb(err || new Error('No such user: ' + data.email));
      }

      var dbUser = res[0];

      bcrypt.compare(data.password, dbUser.password, cb);
    });
  }
};

function encrypt(password, cb) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, cb);
  });
}

module.exports = um;


////self test


if (require.main === module) {
  (function () {


    var data = {
      // id: 6,
       email: 'get2shikhadubey@gmail.com',
      // status: '0',
      //   phone: '9909496511',
      //   firstname: 'kk',
      //   lastname: 'ss',
      //   password: 'test'

    };

    //to run create function
    // um.create(data, function (err, res) {
    //   console.log(err || res);
    // });


    var keys = {
      id: 1
    };

    var options = {
      selectFields: ['id', 'email', 'firstname']
    };

    // to run update function
    // um.update(data, function(err, res) {
    //   console.log(err || res);
    // });

    //to run remove function to change status of user 0/1
    // um.remove(data, function (err, res) {
    // 	console.log(err || res);
    // });

    //encrypt('kkk', console.log);
  })();
}
