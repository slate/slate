
/**
 * Module dependencies.
 */

var store = require('store');

/**
 * Expose `Settings`.
 */

module.exports = new Settings;

/**
 * Initialize a new localStorage-backed settings object.
 *
 * TODO: auto-save on change
 * TODO: or add helper methods
 * TODO: validate children on save
 *
 * @api public
 */

function Settings() {
  var obj = store('slate:settings') || {};
  for (var k in obj) this[k] = obj[k];
  this.connections = this.connections || [];
}

/**
 * Save settings.
 *
 * @api public
 */

Settings.prototype.save = function(){
  store('slate:settings', this);
};