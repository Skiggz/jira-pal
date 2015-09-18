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
    print.log('New settings', settings);
};

module.exports = function() {
    /*
     * Create settings-override.js from answers
     * */
    print.ask(
        print.question('confirm', 'colors', 'Would you like to use colored terminal output?'),
        print.question('input', 'username', 'Please enter your jira username\n\n    Leaving this blank or inaccurate may limit functionality!'),
        print.question('confirm', 'credentials', 'Are you ok with using the default credentials file location?')
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