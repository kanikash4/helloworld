'use strict';

var _ = require('lodash');
var redis = require('./redis');
var putils = require('./utils');
var util = require('util');

var MAX_MGET_CHUNK_SIZE = 1000;
var MAX_MSET_CHUNK_SIZE = 100;

var redisUtil = {
  getKey: putils.getRedisKey,

  setx: function (keys, data, ttl, cb) {
    var value = JSON.stringify(data);
    keys = typeof keys === 'object' ? putils.getRedisKey(keys) : keys;
    // var selectDB = options && Number(options.selectDB) ? Number(options.selectDB) : 0;
    // redis.select(selectDB, function (e, r) {
    //   if (e) {
    //     return cb(e);
    //   }
      redis.setex(keys, ttl, value, function (err) {
        if (cb) {
          cb(err, data);
        }
      });
    // });
  },

  getx: function (params, cb, options) {
    var key = typeof params === 'object' ? putils.getRedisKey(params) : params;

    var selectDB = options && Number(options.selectDB) ? Number(options.selectDB) : 0;
    redis.select(selectDB, function (e, r) {
      if (e) {
        return cb(e);
      }
      redis.get(key, respond);
    });

    function respond(err, data) {
      var searchResult;
      if (!err && data) {
        try {
          searchResult = JSON.parse(data);
        } catch (e) {
          err = new Error('Error parsing search data from redis: ' + data);
        }
      } else {
        err = err || new Error('No search results found in redis for key:' + key);
      }

      cb(err, searchResult);
    }
  },

  //Flush
  delx: function (key, cb, options) {
    var selectDB = options && Number(options.selectDB) ? Number(options.selectDB) : 0;
    redis.select(selectDB, function (e, r) {
      if (e) {
        return cb(e);
      }
      redis.del(key, cb);
    });
  }
};

module.exports = redisUtil;

if (require.main === module) {
  (function () {
        redisUtil.mgetx(['movie_pdata_HO00008389_154', 'movie_pdata_HO00002617_2', 'movie_pdata_FM00003568_2'], function(err, res){
          console.log(res);

        }, {selectDB: 8});
    // redisUtil.lpopx('external_promo_abc', console.log);
    // redisUtil.setnx({test:1, test2:2}, {data:11,val:22}, 20, console.log);
    // redisUtil.getx('1_2', console.log, {
    //   selectDB: 1
    // });
    // redisUtil.delx('abc1', console.log, {selectDB:2});

  })();
}
