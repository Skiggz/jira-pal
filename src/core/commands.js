/*
* Commands are functions that can be called from the command line
*
* Bypass login requirement by adding this to the end of your module declaration
*
*   `module.exports.requiresLogin = false;`
*
* Add a help description by adding this to the end of your module declaration
*
*   `module.exports.moduleDescription = 'This command will knock your socks off!';`
*
* Add extra help description by adding a function that prints details
* about your command when help << your command name>> is called
*
* this can also be a string, and it will just print it
*
*   `module.exports.moduleDescriptionExtra = function() { print more stuff }`
*   `module.exports.moduleDescriptionExtra = 'I am a longer description'`
* */
var fs = require('fs');
var _ = require('underscore');
var _s = require('underscore.string');
var print = require('../core/print');
var commands = {};
/*
 * Initialize available commands and reference them
 * */
_.each(fs.readdirSync(__dirname + '/../commands'), function(filename) {
    var name = filename.replace(/\.js$/i, '');
    try {
        commands[name] = require(_s.sprintf('%s/../commands/%s', __dirname, name));
    } catch (e) {
        print.fail(_s.sprintf('Could not load command %s because %s', name, e && e.message));
    }
});

module.exports = commands;