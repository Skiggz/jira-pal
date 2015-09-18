/*
* Help setup settings-override.js for the first time
* */
var print = require('../core/print');
var fs = require('fs');
var _s = require('underscore.string');

/*
* Settings to populate from responses
* */
var settings = {};

var complete = function() {
    var settingsJSON = JSON.stringify(settings, null, 2);
    print.ask(
        print.question('confirm', 'write', _s.sprintf('Write these settings to ../data/settings-override.js?\n\n%s\n\n', settingsJSON))
    ).then(function(answers) {
        if (answers.write) {
            // write settings to file
            try {
                fs.writeFileSync(__dirname + '/../data/settings-override.js', _s.sprintf('module.exports = %s;\n', settingsJSON));
            } catch (e) {
                print.fail(_s.sprintf('Writing settings failed because: %s', e && e.message));
            }
            print.success('\nSettings updated.\n');
        } else {
            print.info('\nSettings were NOT updated.\n');
        }
    });
};

module.exports = function() {
    /*
     * Create settings-override.js from answers
     * */
    print.ask(
        print.question('confirm', 'colors', 'Would you like to use colored terminal output?'),
        print.question('input', 'username', 'Please enter your jira username (optional)'),
        print.question('input', 'defaultCommand', 'Input a default command if you do not want "help" to be the default.'),
        print.question('confirm', 'credentials', 'Are you ok with using the default credentials file location?')
            .defaultTo('help')
    ).then(function(answers) {
            settings.colors = answers.colors;
            if (!answers.username) {
                print.info('NOTE: Leaving your jira username blank or inaccurate will limit functionality!');
            }
            settings.username = answers.username;
            if (answers.defaultCommand) {
                settings.defaultCommand = answers.defaultCommand;
            }
            if (!answers.credentials) {
                print.ask(
                    print.question('input', 'filename', 'Please enter the location where you would like to store our base64 credentials')
                        .validIf(function(input) {
                            return !input || fs.existsSync(input) || ('File' + input + 'does not exist. Enter nothing to fallback to default.');
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