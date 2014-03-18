
/**
 * Module dependencies.
 */

var growl = node('growl');

/**
 * Notify `msg` and optional `title`.
 *
 * @param {String} msg
 * @param {String} [title]
 * @api public
 */

module.exports = function(msg, title){
  // TODO: icon
  growl(msg, { title: title });
};