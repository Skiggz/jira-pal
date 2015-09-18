var fs = require('fs');
var _ = require('underscore');
var _s = require('underscore.string');
var print = require('./core/print');
var settings = require('./data/settings');
var api = require('./core/api');
var commands = require('./core/commands');

// default command is help, and avoids index out of bounds errors
var command = process.argv.length > 2 ? process.argv[2] : settings.defaultCommand;

if (!commands[command]) {
    command = 'help';
    print.fail(_s.sprintf('Command "%s" not found.', command));
}

var runCommand = function() {
    commands[command]();
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
if (commands[command].requiresLogin === false) {
    /*
     * Check to see if the credentials module exists, if not
     * create it.
     * */
    if (!fs.exists(settings.credentialsFileLocation)) {
        commands.logout();
    }

    var creds = require(settings.credentialsFileLocation.replace(/\.js$/, ''));

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
} else {
    runCommand();
}
