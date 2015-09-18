var fs = require('fs');
var _ = require('underscore');
var _s = require('underscore.string');
var print = require('./core/print');
var settings = require('./data/settings');
var commands = {};
/*
* Initialize available commands and reference them
* */
_.each(fs.readdirSync(__dirname + '/commands'), function(filename) {
    var name = filename.replace(/\.js$/i, '');
    try {
        commands[name] = require(_s.sprintf('%s/commands/%s', __dirname, name));
    } catch (e) {
        print.fail(_s.sprintf('Could not load command %s because %s', name, e && e.message));
    }
});
