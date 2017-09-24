'use strict';

var _ = require('lodash');

var utils = {
  currentTime: function () {
    var d = new Date();
    return this.formatDate(d) + ' ' + this.formatTime(d);
  },

  currentDate: function () {
    var d = new Date();
    return this.formatDate(d);
  },

  formatTime: function (d) {
    return [d.getHours(), d.getMinutes(), d.getSeconds()].map(function (e) {
      return (e < 10) ? ('0' + e) : e;
    }).join(':');
  },

  formatDate: function (d) {
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(function (e) {
      return (e < 10) ? ('0' + e) : e;
    }).join('-');
  },

  addDays: function (d, n) {
    var date = new Date(d.getTime() + (n * 24 * 60 * 60 * 1000));
    return this.formatDate(date);
  },

  subtractMinutes: function(d, min) {
    var temp = new Date();
    temp.setMinutes(d.getMinutes() - min);
    return this.formatDate(temp) + ' ' + this.formatTime(temp);
  },

  addMonths: function(d, n) {
    var date = new Date(d.setMonth(d.getMonth() + n));
    return this.formatDate(date);
  },

  validateParams: function(params, required_keys) {
    var required_keys_length = required_keys.length;
    var missing_keys = [];
    for (var i = 0; i < required_keys_length; i++) { 
      if (_.get(params, required_keys[i]) === undefined) {
            missing_keys.push(required_keys[i]);
      }
    }
    return missing_keys;
  }
};

module.exports = utils;

//----------------------- TEST -------------------------//

(function () {
  if (require.main === module) {
    // console.log(utils.currentDate());
    // console.log(utils.formatDate(new Date('2015-12-18T09:23:52.000Z')));
    // console.log(utils.addMonths(new Date('2015-12-08 00:00:00'), 1));
  }
}());
