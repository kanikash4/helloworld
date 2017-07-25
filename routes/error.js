'use strict';

module.exports = function errorfn(err, req, res, next) {
	if(err){
	  res.locals.message = err.message;
	  res.locals.status  = err.status || 500;
	  res.locals.stack   = err.stack;
	  res.render('error');
	}
};
