
var gui = node('nw.gui');

var menu = module.exports = new gui.Menu({ type: 'menubar' });

menu.append(new gui.MenuItem({ type: 'normal', label: 'Test' }));
menu.append(new gui.MenuItem({ type: 'normal', label: 'Some' }));
menu.append(new gui.MenuItem({ type: 'normal', label: 'Stuff' }));