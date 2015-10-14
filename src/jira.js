// make sure to require settings first and foremost
var settings = require('./data/settings');
var fs = require('fs');
var _ = require('underscore');
var _s = require('underscore.string');
var print = require('./core/print');
var api = require('./core/api');
var commands = require('./core/commands');

// default command is help, and avoids index out of bounds errors
var command = process.argv.length > 2 ? process.argv[2] : settings.gett.defaultCommand;

if (!commands[command]) {
    print.fail(_s.sprintf('Command "%s" not found.', command));
    command = 'help';
}

/*
* Create arguments for commands excluding
* node and the script call
* */
var args = _.toArray(process.argv).slice(3);
var runCommand = function() {
    commands[command].apply(this, args);
};

/*
* Update login with credentials
* */
var updateApi = function(credentials) {
    /*
     * Logged in. Now execute the command they requested
     *
     * Always update the http client with the current credentials
     * */
    api.init(credentials);
    runCommand();
};

// commands can specify to not require login (MUST specify false though)
if (commands[command].requiresLogin !== false) {
    /*
     * Check to see if the credentials module exists, if not
     * create it.
     * */
    var location = settings.credsLocation();
    if (!fs.existsSync(location)) {
        commands.logout();
    }

    var creds = require(location.replace(/\.js$/, ''));

    if (creds === null) {
        commands.login().then(function(newCreds) {
            updateApi(newCreds);
        }, _.noop);
    } else {
        updateApi(creds);
    }
} else {
    runCommand();
}
