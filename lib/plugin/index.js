
/**
 * Module dependencies.
 */

var Builder = node('component-builder');
var dom = require('dom');
var path = node('path');
var fs = node('fs');

module.exports = Plugin;

function Plugin(opts) {
  this.name = opts.name;
  this.log = opts.log;
  this.core = -1 == this.name.indexOf('/');
}

Plugin.prototype.load = function(fn){
  fn = fn || function(){};
  var name = this.name;
  var log = this.log;
  var self = this;
  
  var dir = 'plugins/' + name;
  log.debug('loading plugin %s from %s', name, dir);

  var builder = new Builder(dir);
  builder.addLookup('lib');
  builder.copyAssetsTo('build');
  builder.build(function(err, res){
    if (err) {
      log.error('failed to build plugin "%s"', name);
      alert('failed to load plugin "' + name + '": ' + err);
      return;
    }

    if (res.css) self.addStyle(res.css);
    fn();
  });
};

Plugin.prototype.addStyle = function(str){
  var style = dom('<style>');
  style.html(str);
  style.appendTo('head');
};