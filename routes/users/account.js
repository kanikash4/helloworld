'use strict';

var q = require('q');

var account = {

	deactivate: function deactivate(req, res, next) {
		/**
		 * 1. prompt for final decision
		 * 2. Ask for password
		 * 3. Deactivate the account
		 */console.log('deactiavting account')

		 q.all(promiseArray)
		 	.then(function(result){
		 		next();
		 	})
		 	.fail(function(error){
		 		next(error);
		 	});

	}
};

module.exports = account;