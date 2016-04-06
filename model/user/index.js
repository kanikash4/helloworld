'use strict';

var db = require('../db');

var um = {
	
	table: db.define({
		name: 'users',
		columns: ['id', 'email', 'firstname', 'lastname', 'status', 'phone','username','password', 'created_at', 'updated_at']
	}),

  create: function createfn(data, cb) {
  	if (!data.email) {
  		return  cb(new Error('Missing required field: Email'));
  	}
  	um.isEmailAvailable(data.email, function(err, exists){
  		if (err||exists) {
  			return cb(err || new Error('User already exists.. Cannot Add: ' + data.email));
  		}
  		else{
  			//add new user
  			var newuser={
  				email: data.email,
  				firstname: data.firstname,
  				lastname: data.lastname,
  				status: 1,
  				phone: data.phone,
  				username: data.username,
  				password:data.password,
  				created_at: new Date()
  			};
  			var query = um.table.insert(newuser);

  			query.exec(function(err, res) {
           console.log(err || res);

           if (res) {
             newuser.id = res.insertId;
           }

           cb(err, newuser);
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


  isEmailUpdatePossible: function (email, cb) {

    if(email == null && phone == null ) {
      cb();
    }
    var keys = {
      email: email
    };
    var options = {
      selectFields: ['id', 'email', 'phone']
    };
    um.fetch(keys, options, function (err, res) {
       cb(err, res && res.length);
    });

  },
  
  fetch: function fetchfn(keys, options, cb) {
    var tbl = um.table;
    var query = tbl.select(options.selectFields);
    var filters = [];
    Object.keys(keys).forEach(function(key){
    	if (keys[key]) {
    		filters.push(tbl[key].equals(keys[key]));
    	}
    });
    if(filters.length){
    query = query.where.apply(tbl, filters);    	
    }
    console.log(query.toQuery());

    query.exec(cb);
  },
  
  update: function updatefn(data,cb) {
  		//to  update the phone number of any user  w.r.t. email  id
  	 um.isEmailUpdatePossible(data.email, function(err) {
       if (!err ) {
   		console.log('Email Available in db');
   			var  existing_user={};
   			if(data.email){
   					//existing_user.email = data.email;
   					existing_user.phone  = data.phone;
   					existing_user.updated_at= new Date();
   					//var query= um.table.update(existing_user).where(um.email.equals(data.email)).toQuery();
   					var query= um.table.update(existing_user).where(um.table.email.equals(data.email));
   					query.exec(function(err, res){
   					console.log(err||res);
   					if(res){
   						existing_user.id= res.insertId;
   					}
   					cb(err, existing_user);
   					});
	   		}
	   }
  	});
  },

   isRemovePossible: function (status, cb) {
    if(status === 0) {
      cb();
    }
    var keys = {
      status: status
    };
    var options = {
      selectFields: ['id', 'email']
    };
    um.remove(keys, options, function (err, res) {
       cb(err, res && res.length);
    });
  },
  
  remove: function removefn(data, cb) {
    um.isRemovePossible(data.status, function(err) {
       if (!err) {
   			console.log('present in db');
   			var inactive_user={};
   			if(data.email){
   			inactive_user.status= data.status;
   			inactive_user.updated_at= new Date();
   			var query= um.table.update(inactive_user).where(um.table.email.equals(data.email));
   			query.exec(function(err, res){
   			console.log(err||res);
   			if(res){
   			inactive_user.id= res.insertId;
   			}
   			cb(err, inactive_user);
   	  	});
   		}
	   }
  	});
  }
};

module.exports = um;


////self test


if (require.main === module) {
  (function() {


    var data = {
      //id: 6,
      email: 'kanika.sharma@paytm.com',
      status:'0'
      //phone: '9909496511'
      // firstname: 'testing',
      // lastname: 'testing with new dbinsertion',
      // username: 'user1',
      // password: 'test'
      
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
    um.remove(data, function(err,res){
    	console.log(err||res);
    });



  })();
}
