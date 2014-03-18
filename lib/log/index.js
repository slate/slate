
/**
 * Module dependencies.
 */

var Log = require('logger');

// initialize

var log = new Log({
  path: '/tmp/slate.log'
});

// separator

log.debug('INITIALIZE');

module.exports = log;