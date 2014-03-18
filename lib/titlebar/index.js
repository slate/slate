
/**
 * Module dependencies.
 */

var dom = require('dom');
var gui = node('nw.gui');
var win = gui.Window.get();

/**
 * Close the window.
 */

dom('#close-window').on('click', function(){
  win.close();
});

/**
 * Minimize the window.
 */

dom('#minimize-window').on('click', function(){
  win.minimize();
});

/**
 * Maximize the window.
 */

dom('#maximize-window').on('click', function(){
  win.maximize();
});

/**
 * Fullscreen.
 */

dom('#fullscreen-window').on('click', function(){
  win.toggleFullscreen();
});

