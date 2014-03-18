
/**
 * Module dependencies.
 */

var format = node('util').format;
var fs = node('fs');

/**
 * Log levels.
 */

var levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

/**
 * Expose `Log`.
 */

module.exports = Log;

/**
 * Initialize the logger.
 *
 * @param {Object} [opts]
 * @api public
 */

function Log(opts) {
  opts = opts || {};
  this.path = opts.path;
  this.stream = fs.createWriteStream(this.path, { flags: 'a' });
  this.level('debug');
}

/**
 * Set level.
 *
 * @param {String} level
 * @api public
 */

Log.prototype.level = function(level){
  var n = levels[level];
  if (null == n) throw new Error('invalid log level');
  this._level = n;
};

/**
 * Write to the log.
 *
 * @param {String} level
 * @param {Array} args
 * @api private
 */

Log.prototype.write = function(level, args){
  var n = levels[level];

  // ignore
  if (n < this._level) return;

  // message
  var msg = new Date().toUTCString();

  // level
  msg += ' - ' + level;

  // format
  msg += ' - ' + format.apply(null, args);

  // log
  this.stream.write(msg + '\n');
};

/**
 * Debug level.
 */

Log.prototype.debug = function(){
  this.write('debug', arguments);
};

/**
 * Info level.
 */

Log.prototype.info = function(){
  this.write('info', arguments);
};

/**
 * Warning level.
 */

Log.prototype.warn = function(){
  this.write('warn', arguments);
};

/**
 * Error level.
 */

Log.prototype.error = function(){
  this.write('error', arguments);
};