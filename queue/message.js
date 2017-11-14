/*jshint multistr: true ,node: true*/
"use strict";

var	OS = require('os'),
	  PATH = require('path'),
    FS = require('graceful-fs'),
	  MOMENT = require('moment'),
	  _ = require('lodash');

var M = {

	REQUEST_TYPE 	: {
		VALIDATION			: "VALIDATION",
		STATUSCHECK 		: "STATUSCHECK",
		DATA        		: "DATA"
	},

	HOSTNAME 		: OS.hostname().toString().replace(/[^a-zA-Z0-9]/g,'_'),

	INITIAL_TS 		: 'init',
	CALLBACK_TS 	: 'gwcallback',
	CURRENT_TS	 	: 'current',

	/* Generate a new message */
	genMsg : function(reqType, id) {

		var newMsg = {

			/*
				Id : In case ID is passed we use that, otherwise we generate our own
			*/
			id : (id) ? id : M.genID(),
			catalogProductID: null,
			userData : {},
			serverId: M.getSrvrID(),
      gwMachineId : null,
			reqType : reqType,
			validationSuccessful : null,
			// Message to displayy on Frontend in case validation fails
			frontendErrorMessage : null,
			// Route to gateway True for Validation
			routeToGwForValidation 	: null,
			attempt : 1,
			// Database update ID , THIS IS KEPT JUST SO THAT WE CAN UPDATE TXNS MORE QUICKLY
			dbUpdateID : null,
			// timestamps
			/* Keep it Object only and not a multi level Object */
			timestamps : {},
			// internal Key to see if transaction was deferred
			deferCurrent : {},
			// internal key to see if message was put back in RE from deferred txn
			deferCurrentReturn : {},
			// here we keep on inserting whether a message was deferred or put back in RE
			deferRecords : [],
			// total count to keep how many times deferred
			deferCount : 0,
			// total count of how many times returned from defer
			deferCountReturned	: 0,
			// in status code
			inStatusMap : {},
			logs : '',
			etc : {}

		};

		// Add initial timestamp
		M.addTimestamp(newMsg, M.INITIAL_TS);

	},
	

	/* Get Server Id */
	getSrvrID : function() {
		/* 
			Taking hostname as server ID , as we host 1 services per host 
			We alos remove all chars except a-z and 0-9
		*/

		return M.HOSTNAME;
	},

	/* Get DEPLOY COLOR */
	getDeployColor : function() {
		return "blue";
	},

	/*
		Re Initialize some Message params once messages are taken out from deferred and reintroduced
	*/
	reinitializeCycledKeys : function(message) {
		[

			// This is set to neutrilize 
			"deferCurrent",

			// Route to gateway for recharge = null ... should be reset by a new rule
			"routeToGwForRecharge",

			// routeToOldInForRecharge is set to False ... should be set by rules
			"routeToOldInForRecharge",
            
			//key is being reinitialized for dummy orders which have by any means entered deferred_transactions
            "skipApplyRule",

            // let's decide it on real time only because we may have put the transaction in queue because
            // of some issue in cluster only
			"publishToCluster",
            "gwMachineId",
			"statusCheckRetryIntervals",
			"routeToGwForStatuscheck",
			"statusCheckAttempt"
		].forEach(function(k){ _.set(message, k, null); });
		//this is being done as we update any transaction to 07 only if its IR
		_.set(message, "inStatusMap.responseCode", 'IR');
		_.set(message, "inStatusMap.transactionStatus", 'INITIATED');

		// If recharge request, Add a default message that it would need
		if(message.reqType == M.REQUEST_TYPE.RECHARGE)  			message.rechargeGwResponse = M.getDefaultRechargeResponse();
		else if (message.reqType == M.REQUEST_TYPE.VALIDATION) 		message.validationGwResponse = M.getDefaultValidationResponse();
		else if (message.reqType == M.REQUEST_TYPE.STATUSCHECK) 	message.statuscheckGwResponse = M.getDefaultStatusCheckResponse();


		/*
			Reinitizlise server ID also.. We have no idea to which server this request came from
			after recycling, this messages's originating server would change
		*/
		// message.serverId = M.getSrvrID();

		M.addTimestamp(message, M.CURRENT_TS);
		return message;
	},

	/* Create a clone of current message as a status check message */
	createStatusCheckClone 	: function(message) {
		var newScMsg = M.genMsg(M.REQUEST_TYPE.STATUSCHECK);

		// Clone These items
		[
			'catalogProductID',
			'userData',
			'productInfo',
			'orderInfo',
			'customerInfo'
		].forEach(function(k){
			_.set(newScMsg, k, _.cloneDeep(message[k]));
		});

	},

	/* Generate a new message ID*/
	genID : function() {
		/*
			NOTE: 
				MAKE SURE THIS IS ALWAYS INTEGER .... 
				and NOT ALPHANUMERIC
				Gateways such as Telangana are dependent on it ... 
				Maybe late on we will generate 2 IDs, 1 alphanumeric and 1 numberic

			A Unique ID is needed for the messages likve validation msg,etc where they are not related to any order
			Trying to keep it in integer format so that can be used as string also

			TOTAL 20 DIGITS ( DO NOT CHANGE THIS IN A HURRY)
			13 Digit 	: Unix Millisecond // To be sure that uniqueness is there
			7 Digit 	: Random number // To be sure that multiple are generated in same millisec

		*/

		return MOMENT().format('x') + Math.random().toString().slice(2,9); 
	},

	addTimestamp : function(message, type) {
		_.set(message, 'timestamps.' + type, new Date());
		/*
			We Earlier had MOMENT().format("YYYY-MM-DD HH:mm:ss.SSS")
			But now we keep a very ELASTICSEARCH friendly date format
		*/

	},

	addValidationGwResponse : function(message, response) {
		message.validationGwResponse = _.cloneDeep(response);
	},

	addUserPlansGwResponse : function(message, response) {
		message.userplansGwResponse = _.cloneDeep(response);
	},

	getGwReplyKey : function(message, response) {
		/*

			This key is for the Queue where we want to 
			publish mesage to Rule Engine where we know
			the server where we have to publish
			E.g. Synchronous messages

			< server Id > . < request type >
		*/
		return message.serverId + "." + message.reqType;
	},

	getGwRequestKey : function(message) {
		/*

			This key is for the Queue where we want to 
			publish mesage to Gateway and we know what
			the gateway is
			E.g. Synchronous/ Async messages

			< current Gateway > . < Request Type >
		*/
		return message.currentGw + "." + message.reqType;
	},

	getGwQueueName : function(messageOrGwName) {
		/*

			Get Queue name of a gateway from Gateway name or message
			E.g. Synchronous/ Async messages

			< current Gateway > . < Request Type >
		*/
		var gwName = _.get(messageOrGwName, 'currentGw', messageOrGwName);
		return 'q_gw_' + gwName;
	},

	getServerColorQueueName : function(deployColor) {
		/*

			Get Queue name of server according to deploy color
			This Queue is for pushing messages to all servers of that color
			who share the messages in round robin format
		*/

		if(deployColor === undefined) 	deployColor = M.getDeployColor();

		return 'q_recharge_server_' + deployColor;
	},

	getServerIdQueueName : function() {
		/*

			Get Queue name of server according to its ID
			This is personal Queue of this server mostly for Sync messages
		*/
		return 'q_recharge_server_' + M.getSrvrID();
	},
	
	getDeferredToReKey : function(message, deployColor) {
		if(deployColor === undefined) 	deployColor = M.getDeployColor();

		return deployColor + ".deferred." + message.reqType;
	}

};

module.exports = M;
