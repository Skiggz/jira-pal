// make sure to require settings first and foremost to setup
var settings = require('./data/settings');
var Promise = require('bluebird');
var fs = require('fs');
var _ = require('underscore');
var _s = require('underscore.string');
var print = require('./core/print');
var api = require('./core/api');
var login = require('./commands/login');
var logout = require('./commands/logout');

// bluebird setup
Promise.onPossiblyUnhandledRejection(function(reason) {
    var why = reason && reason.message;
    // lots of api calls may 401/403 so we can consider this something to ignore
    if (why !== 'Unauthorized') {
        // otherwise, suggest that we maybe report the error
        print.fail(
            [
                'Unhandled failure. Error message: ',
                why,
                '. You may consider reporting an issue to https://github.com/Skiggz/jira-pal/issues'
            ].join('')
        );
    }
});

// default command is help, and avoids index out of bounds errors
var command = process.argv.length > 2 ? process.argv[2] : settings.gett.defaultCommand;
var commands = _.map(fs.readdirSync(__dirname + '/commands'), function(filename) {
    return filename.replace(/\.js$/, '');
});
if (commands.indexOf(command) === -1) {
    print.fail(_s.sprintf('Command "%s" not found.', command));
    command = 'help';
}

var commandFn = require('./commands/' + command);

/*
* Create arguments for commands excluding
* node and the script call
* */
var args = _.toArray(process.argv).slice(3);
var runCommand = function() {
    commandFn.apply(this, args);
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
if (commandFn.requiresLogin !== false) {
    /*
     * Check to see if the credentials module exists, if not
     * create it.
     * */
    var location = settings.credsLocation();
    if (!fs.existsSync(location)) {
        logout();
    }

    var creds = require(location.replace(/\.js$/, ''));

    if (creds === null) {
        login().then(function(newCreds) {
            updateApi(newCreds);
        }, _.noop);
    } else {
        updateApi(creds);
    }
} else {
    runCommand();
}
