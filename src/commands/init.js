/*
* Help setup settings-override.js for the first time
* */
var print = require('../core/print');
var fs = require('fs');
var _s = require('underscore.string');
var _ = require('underscore');

/*
* Settings to populate from responses
* */
var settings = {};

var complete = function() {
    var settingsJSON = JSON.stringify(settings, null, 2);
    // cannot depend on settings yet since we are sort of making them, so this is hard coded for now
    var location = (process.env['JIRA_PAL_HOME'] || process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']) + '/.jira-pal/settings-override.js';
    print.ask(
        print.question(
            'confirm',
            'write',
            _s.sprintf('Write these settings to %s?\n\n%s\n\n', location,settingsJSON)
        )
    ).then(function(answers) {
        if (answers.write) {
            // write settings to file
            try {
                fs.writeFileSync(location, settingsJSON);
            } catch (e) {
                print.fail(_s.sprintf('Writing settings failed because: %s', e && e.message));
            }
            print.success('\nSettings updated.\n');
        } else {
            print.info('\nSettings were NOT updated.\n');
        }
        print.info('Init complete. It is suggested, but not necessary that you run `jira prime` (the prime command) to prime your jira caches. Enjoy.');
    });
};

module.exports = function() {
    /*
     * Create settings-override.js from answers
     * */
    print.ask(
        print.question('confirm', 'colors', 'Would you like to use colored terminal output?'),
        print.question('input', 'url', 'Please enter your jira domain (jira.my-domain.com)')
                .validIf(function(input) {
                    return input ? true : 'You must specify a domain. Do not prepend protocols, https will always be used.';
                }),
        print.question('input', 'username', 'Please enter your jira username (optional)'),
        print.question('input', 'defaultCommand', 'Input a default command if you do not want "help" to be the default. (Suggested: me)'),
        print.question('input', 'defaultMeStatuses', 'Input default statuses for jira me command (CSV)').defaultTo('In Progress')
    ).then(function(answers) {
            settings.url = answers.url.replace(/\/+$/, ''); // replace trailing slashes
            settings.colors = answers.colors;
            if (!answers.username) {
                print.info('NOTE: Leaving your jira username blank or inaccurate will limit functionality!');
            }
            settings.username = answers.username;
            if (answers.defaultCommand) {
                settings.defaultCommand = answers.defaultCommand;
            }
            if (answers.defaultMeStatuses) {
                settings.defaultMeStatuses = _.map(answers.defaultMeStatuses.split(','), function(status) {
                    return _s.trim(status);
                });
            }
            complete();
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