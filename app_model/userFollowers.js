'use strict';

var db = require('./db');
var followersDBModel = require('../model/userFollowers');

var followers = {
  follow: function followfn(data, cb) {
	},

	unFollow: function unFollowfn(cb) {}

};

module.exports = followers;