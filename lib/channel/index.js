
/**
 * Module dependencies.
 */

var relative = require('relative-date');
var scrollTo = require('scroll-to');
var minstache = node('minstache');
var Emitter = require('emitter');
var Spinner = require('spinner');
var events = require('events');
var offset = require('offset');
var dom = require('dom');

// focused channel

var focused;

// templates

var channel = require('./channel.html');
var message = require('./message.html');

// compile

channel = minstache.compile(channel);
message = minstache.compile(message);

/**
 * Expose `Channel`.
 */

module.exports = Channel;

/**
 * Module dependencies.
 */

function Channel(obj) {
  // TODO: View boilerplate
  for (var k in obj) this[k] = obj[k];
  this.el = dom(channel(this));
  this.events = events(this.el.get(0), this);
  this.events.bind('click');
  this.messages = this.el.find('tbody');
  this.client.on('message', this.onmessage.bind(this));
  this.client.on('join', this.onjoin.bind(this));
  this.client.on('quit', this.onquit.bind(this));

  // TODO: hooks... or make it a plugin, make it a component
  // and only update those which are in view
  var self = this;
  setInterval(function(){
    dom('table tr .date').each(function(td){
      var ts = +td.attr('data-timestamp');

      var date = relative(ts);

      if (date) date += ' ago'
      else date = 'just now';

      td.find('span').text(date);
    });
  }, 2000);
}

/**
 * Mixin `Emitter`.
 */

Emitter(Channel.prototype);

/**
 * Handle channel clicks.
 *
 * @api private
 */

Channel.prototype.onclick = function(){
  this.focus();
  this.scrollIntoView();
};

/**
 * Handle joins:
 *
 * - add join message
 *
 * @api private
 */

Channel.prototype.onjoin = function(e){
  if (e.channel != this.name) return;

  // self
  if (e.nick == this.client.me) {
    this.emit('joined');
    this.el.removeClass('joining');
    return;
  }

  // others
  this.addMessage({
    classes: ['join'],
    nick: 'join',
    message: e.nick + ' joined',
    date: new Date
  });
};

/**
 * Handle quits:
 *
 * - add quit message
 *
 * @api private
 */

Channel.prototype.onquit = function(e){
  if (e.channel != this.name) return;

  this.addMessage({
    classes: ['quit'],
    nick: 'quit',
    message: e.nick + ' quit: ' + e.message,
    date: new Date
  });
};

/**
 * Handle messages:
 *
 * - add message to the log
 *
 * @api private
 */

Channel.prototype.onmessage = function(e){
  if (e.to != this.name) return;

  this.addMessage({
    nick: e.from,
    message: e.message,
    date: new Date
  });
}

/**
 * Add a notice `msg`.
 *
 * @param {String} msg
 * @api public
 */

Channel.prototype.addNotice = function(msg){
  this.addMessage({
    classes: ['notice'],
    nick: 'notice',
    message: msg,
    date: new Date
  });
};

/**
 * Add a generic `msg` to the log.
 *
 * - `classes` optional array of classames
 * - `message` the message string
 * - `date` message date
 * - `nick` nickname
 *
 * @param {Object} msg
 * @api public
 */

Channel.prototype.addMessage = function(msg){
  msg.classes = msg.classes || [];
  msg.classes = msg.classes.join(' ');
  msg.timestamp = +msg.date;
  this.messages.append(message(msg));
  this.scrollToBottom();
};

/**
 * Scroll the channel log to the bottom.
 *
 * @api public
 */

Channel.prototype.scrollToBottom = function(){
  this.el.find('.channel-log').get(0).scrollTop = 9e9;
};

/**
 * Focus the channel.
 *
 * Any active channel is blurred.
 *
 * @api public
 */

Channel.prototype.focus = function(){
  this.focused = true;
  this.emit('focus');
  this.el.addClass('focused');
  if (focused && focused != this) focused.blur();
  focused = this;
};

/**
 * Blur the channel.
 *
 * @api public
 */

Channel.prototype.blur = function(){
  this.focused = false;
  this.emit('blur');
  this.el.removeClass('focused');
  focused = null;
};

/**
 * Join the channel.
 *
 * @api public
 */

Channel.prototype.join = function(){
  this.client.join(this.name);
  this.el.addClass('joining');
  this.addSpinner();
  this.once('join', this.removeSpinner);
};

/**
 * Scroll into view.
 *
 * @api public
 */

Channel.prototype.scrollIntoView = function(){
  var o = offset(this.el.get(0));
  scrollTo(0, o.top - 60, { duration: 1200 });
};

/**
 * Add a spinner.
 *
 * TODO: this is lame, should be done
 * with stylesheets only or a theme script.
 *
 * @api private
 */

Channel.prototype.addSpinner = function(){
  var s = this.spinner = new Spinner;
  s.size(20);
  this.el.append(s.el);
  this.once('joined', this.removeSpinner.bind(this));
};

/**
 * Remove the spinner.
 *
 * @api private
 */

Channel.prototype.removeSpinner = function(){
  dom(this.spinner.el).remove();
};