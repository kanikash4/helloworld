'use strict';

var util = require('util');
var mysequel = require('mysequel');

var config = {
    user: 'root',
    password: 'mysql123',
    host: 'localhost',
    database: 'mktplace'
}

var dbConfig = {
 url: util.format('mysql://%s:%s@%s:3306/%s',
   encodeURIComponent(config.user),
   encodeURIComponent(config.password),
   config.host,
   config.database),
 connections: {
   min: config.min || 2,
   max: config.max || 10
 }
};

var db = mysequel(dbConfig);


module.exports = db;
