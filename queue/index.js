/* 
	Starting point for Gateway specific Stuff
	This will be mainly used to run gateway specific services
*/

/*
 * RAbbit-mq module reference:
 * https://www.cloudamqp.com/blog/2015-05-18-part1-rabbitmq-for-beginners-what-is-rabbitmq.html
 */

/*jshint multistr: true ,node: true*/
"use strict";

var
	/* NODE internal */
	FS = require('graceful-fs'),
  OS = require('os'),
	HTTP = require('http'),
	UTIL = require('util'),
	PATH = require('path'),
	EVENTEMITTER = require('events').EventEmitter,

	/* NPM Third Party */
	_ = require('lodash'),
	Q = require('q'),
	MOMENT = require('moment'),
  EXPRESS = require('express'),
	PROGRAM = require('commander'),
	VALIDATOR = require('validator'),
	PUNYCODE = require('punycode');


const ddConstants = {
    REQUEST_TYPE     : 'REQUEST_TYPE',
    GATEWAY_NAME     : 'GATEWAY_NAME',
    FUNCTION_FOUND   : 'FUNCTION_FOUND',
    MACHINE_NAME     : 'MACHINE_NAME',
    EXCEPTION        : 'EXCEPTION',
    WORKER_ID        : 'WORKER_ID'
};

function webgw(config, opts) {
}

/**
 *	Load Gateways
 */
webgw.prototype._loadGateways = function() {

};


/* Start Subscriber */
webgw.prototype._startSubscriber = function() {
	/* Start subscribers for the gateways that we have */
};


/* configure Publisher to publish messages back to Service */
webgw.prototype._configurePublisher = function() {

};

/* configure Publisher to publish messages back to Clm */
webgw.prototype._configureClmPublisher = function() {

};

/* Start publisher */
webgw.prototype._startPublisher = function() {
		
};

/* Start Clm publisher */
webgw.prototype._startClmPublisher = function() {

};

/* Publish message back to Recharge service */
webgw.prototype._publishResponse = function(data, opts, key) {
	var self = this;
    self.toRechargePublisher.publish(data, opts, key);
};

module.exports = webgw;