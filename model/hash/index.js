'use strict';

var hm = {
  create: function createfn(userId, cb) {
    // create a new hash for this user and save it hash table
    
    // invlidate older hashes if exist for this user;
  },
  
  fetch: function fetch(keys, options, cb) {
    // fetch hashes with given keys as filters
  },
  
  isValidHash: function validatefn(hash, cb) {
    // check if this hash exists and has not expired
  },
  
  resetHash: function resetHashfn(userId, hash, cb) {
    // expire if the hash and userId association is correct
  }
};

module.exports = hm;
