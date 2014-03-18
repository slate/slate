
/**
 * Module dependencies.
 */

var humanize = require('humanize-keys');
var minstache = node('minstache');
var dom = require('dom');
var key = require('k');

// templates

var shortcut = require('./shortcut.html');
var dialog = require('./dialog.html');

// compile

shortcut = minstache.compile(shortcut);
dialog = minstache.compile(dialog);

/**
 * Expose `Shortcuts` singleton.
 */

module.exports = new Shortcuts;

/**
 * Initialize a new shortcuts manager.
 *
 * @api public
 */

function Shortcuts() {
  this.key = key(document.body);
  this.bindings = {};
}

/**
 * Bind `keys` to `fn` with a description.
 *
 * @param {String} keys
 * @param {String} desc
 * @param {Function} fn
 * @api public
 */

Shortcuts.prototype.bind = function(keys, desc, fn){
  this.bindings[keys] = {
    keys: keys,
    desc: desc,
    fn: fn
  };

  this.key(keys, fn);
};

/**
 * Render the shortcuts template.
 *
 * @api public
 */

Shortcuts.prototype.render = function(){
  var bindings = this.bindings;

  var shortcuts = Object.keys(bindings).map(function(keys){
    var bind = bindings[keys];
    // TODO: lame... move to a component
    bind.binding = keys.split(' ').map(function(key){
      if ('+' == key) return key;
      return '<em>' + humanize(key) + '</em>';
    }).join(' ');

    return shortcut(bind);
  }).join('\n');

  var html = dialog({ shortcuts: shortcuts });
  return dom(html);
};

/**
 * Toggle display of the dialog.
 *
 * @api public
 */

Shortcuts.prototype.toggle = function(){
  if (this.showing) this.hide()
  else this.show();
};

/**
 * Show the dialog.
 *
 * @api public
 */

Shortcuts.prototype.show = function(){
  if (this.showing) return;
  var el = this.el = this.render();
  var self = this;

  this.showing = true;

  el.on('click', '#dialog-close', function(e){
    e.preventDefault();
    self.hide();
  });

  dom('body')
  .addClass('showing-dialog')
  .append(el)
};

/**
 * Hide the dialog.
 *
 * @api public
 */

Shortcuts.prototype.hide = function(){
  this.showing = false;
  dom('body').removeClass('showing-dialog');
  this.el.remove();
};