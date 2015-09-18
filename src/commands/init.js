/*
* Help setup settings-override.js for the first time
* */
var print = require('../core/print');
var fs = require('fs');

/*
* Settings to populate from responses
* */
var settings = {};

var complete = function() {
    print.success('Consider adding this to your pass profile for ease of use');
    print.success('\n\talias jira=\'/abs/path/to/node /abs/path/to/src/jira.js\'\n');
    print.log('New settings', settings);
};

module.exports = function() {
    /*
     * Create settings-override.js from answers
     * */
    print.ask(
        print.question('confirm', 'colors', 'Would you like to use colored terminal output?'),
        print.question('input', 'username', 'Please enter your jira username\n\nLeaving this blank or inaccurate may limit functionality!\n'),
        print.question('confirm', 'credentials', 'Are you ok with using the default credentials file location?'),
        print.question('input', 'defaultCommand', 'Input a default command if you do not want "help" to be the default.')
            .defaultTo('help')
    ).then(function(answers) {
            settings.colors = answers.colors;
            settings.username = answers.username;
            if (!answers.credentials) {
                print.ask(
                    print.question('input', 'filename', 'Please enter the location where you would like to store our base64 credentials')
                        .validIf(function(input) {
                            return fs.existsSync(input) || ('File' + input + 'does not exist. Enter nothing to fallback to default.');
                        })
                ).then(function(secondAnswers) {
                        if (secondAnswers.filename) {
                            settings.credentialsFileLocation = secondAnswers.filename;
                        }
                        complete();
                    })
            } else {
                complete();
            }
        });
};

module.exports.requiresLogin = false;
module.exports.moduleDescription = 'Prompts you to update all settings overrides you may be interested in.';
module.exports.moduleDescriptionExtra = function() {
    /*
    * mostly showing that you can set a function do to stuff on help
    * */
    print.info('The initialization script will prompt you for various inputs ' +
        'that update your settings-override.js for you changing various behavior ' +
        'of the application for normal use.');
};