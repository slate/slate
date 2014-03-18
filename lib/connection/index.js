
/**
 * Module dependencies.
 */

var Channel = require('channel');
var irc = node('slate-irc');
var net = node('net');

/**
 * Expose `Connection`.
 */

exports = module.exports = Connection;

/**
 * Expose menu.
 */

exports.menu = require('./menu');

/**
 * Initialize a new connection.
 *
 * @param {Object} opts
 * @api public
 */

function Connection(opts) {
  for (var k in opts) this[k] = opts[k];
  this.channels = {};
}

/**
 * Focus the previous channel.
 *
 * @api public
 */

Connection.prototype.focusPrevChannel = function(){
  // current
  var keys = Object.keys(this.channels);
  var i = keys.indexOf(this.focused.name);

  // bounds
  i = Math.max(0, i - 1);

  // focus
  var key = keys[i];
  this.log.debug('focus prev %s', key);
  this.channels[key].focus();
};

/**
 * Focus the next channel.
 *
 * @api public
 */

Connection.prototype.focusNextChannel = function(){
  // current
  var keys = Object.keys(this.channels);
  var i = keys.indexOf(this.focused.name);

  // bounds
  i = Math.min(keys.length - 1, i + 1);

  // focus
  var key = keys[i];
  this.log.debug('focus next %s', key);
  this.channels[key].focus();
};

/**
 * Peform connection.
 *
 * @api public
 */

Connection.prototype.connect = function(){
  var self = this;

  this.stream = net.connect({
    port: this.port,
    host: this.host
  });

  this.client = irc(this.stream);

  this.client.on('names', function(e){
    // TODO: handle forwarding
    self.log.debug('%s %s names', e.names.length, e.channel);
    // TODO: lame...
    self.channels[e.channel].names = e.names;
    self.channels[e.channel].emit('change names');
    // TODO: only when joining
    // TODO: strip self
    if (e.names.length < 10) {
      self.channels[e.channel].addNotice('joined ' + e.names.join(', '));
    } else {
      self.channels[e.channel].addNotice('joined ' + e.names.length + ' users');
    }
  });

  this.client.on('data', function(msg){
    self.log.debug(msg.string);
  });

  this.authenticate();
};

/**
 * Authenticate with the server.
 *
 * @api public
 */

Connection.prototype.authenticate = function(){
  if (this.password) {
    this.log.info('connect with password');
    this.client.pass(this.password);
  }

  // TODO: load chan settings
  // TODO: show loading state
  this.log.info('connect as nick: %s', this.nickname);
  this.log.info('connect as name: %s', this.username);
  this.log.info('connect as real: %s', this.realname);
  this.client.nick(this.nickname);
  this.client.user(this.username, this.realname);
};

/**
 * Join `chan`.
 *
 * @param {String} chan
 * @return {Channel}
 * @api public
 */

Connection.prototype.join = function(chan){
  var self = this;
  chan = chan.toLowerCase();

  // TODO: reactive?
  this.log.info('join %s', chan);
  // TODO: save settings

  chan = new Channel({
    client: this.client,
    connection: this,
    name: chan
  });

  this.channels[chan.name] = chan;

  chan.el.appendTo('#channels'); // TODO: move

  chan.on('focus', function(){
    self.focused = chan;
    // TODO: lame
    Connection.focusedChannel = chan;
    Connection.focused = self;
  });

  chan.focus();
  chan.join();

  return chan;
};

/**
 * Send `msg` to `target`.
 *
 * @param {String} target
 * @param {String} msg
 * @api public
 */

Connection.prototype.send = function(target, msg){
  this.log.info('send %s `%s`', target, msg);
  this.client.send(target, msg);

  // TODO: reactive, for nick changes
  this.focused.addMessage({
    nick: this.client.me,
    message: msg,
    date: new Date
  });
};