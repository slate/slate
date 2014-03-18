
/**
 * Module dependencies.
 */

var dom = require('dom');
var gui = node('nw.gui');

/**
 * Window.
 */

var win = gui.Window.get();

/**
 * Handle window focus.
 */

win.on('focus', function(){
  dom('body').removeClass('blur').addClass('focus');
});

/**
 * Handle window blur.
 */

win.on('blur', function(){
  dom('body').removeClass('focus').addClass('blur');
});