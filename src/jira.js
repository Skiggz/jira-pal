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
* Some commands to not require login, list those here
* and it won't prompt for login if those commands are
* specified
* */

var ANNONYMOUS_COMMANDS = [ 'login', 'logout', 'init' ];
// default command is help, and avoids index out of bounds errors
var command = process.argv.length > 2 ? process.argv[2] : 'help';

if (ANNONYMOUS_COMMANDS.indexOf(command) === -1) {
    /*
     * Check to see if the credentials module exists, if not
     * create it.
     * */
    if (!fs.exists(settings.credentialsFileLocation)) {
        commands.logout();
    }

    var creds = require(settings.credentialsFileLocation.replace(/\.js$/, ''));

    var updateApi = function(credentials) {
        /*
         * Logged in. Now execute the command they requested
         *
         * Always update the http client with the current credentials
         * */
        api.init(credentials);
    };

    if (creds === null) {
        print.ask(
            print.question('input', 'username', 'JIRA Login'),
            print.question('password', 'username', 'JIRA Password')
        ).then(function(answer) {
                updateApi(
                    commands.login(answer.username, answer.password)
                );
            });
    } else {
        updateApi(creds);
    }
}
