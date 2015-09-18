var fs = require('fs');
var _ = require('underscore');
var _s = require('underscore.string');
var print = require('./core/print');
var settings = require('./data/settings');
var api = require('./core/api');
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

/*
 * Check to see if the credentials module exists, if not
 * create it.
 * */
if (!fs.exists(settings.credentialsFileLocation)) {
    print.info('Initial login, creating creds file');
    commands.logout();
}

var creds = require(settings.credentialsFileLocation.replace(/\.js$/, ''));

if (creds === null) {
    print.info('You should log in');
} else {
    print.info('Hi there', creds);
}

/*
 * Logged in. Now execute the command they requested
 *
 * Always update the http client with the current credentials
 * */

api.init(creds);