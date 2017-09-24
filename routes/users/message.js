'use strict';

// var ApiError  = require('../../lib/apierror');

var message = {

	getMessages: function getMessages(req, res, next) {
		// if(!req.session.email) {
			// return next(new ApiError('....'));
        // return next(new ApiError('MIS_GRP', 400));

		// }
		//call db/es to fetch messages
		next();
	},

	sendMessages : function sendMessages(req, res, next) {
		next();

	},

	deleteMessage : function deleteMessage(req, res, next) {}
};

module.exports = message;