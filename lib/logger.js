'use strict';

var wLogger = require('winston');

wLogger.setLevels({
 critical   : 0,
 error      : 1,
 warn       : 2,
 info       : 3,
 debug      : 4,
 verbose    : 5,
 silly      : 6
});
wLogger.addColors({
  debug     : 'green',
  info      : 'cyan',
  silly     : 'magenta',
  warn      : 'yellow',
  error     : 'red',
  critical  : 'red',
  verbose   : 'white'
});
wLogger.remove(wLogger.transports.Console);
wLogger.add(wLogger.transports.Console, {
  level     : 'verbose',
  colorize  : true,
  timestamp : function () {
    return new Date();
  },
  prettyPrint: true
});

/*
wLogger.info('info');
wLogger.debug('debug');
wLogger.error('error');
*/
module.exports = wLogger;
