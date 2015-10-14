var statuses = require('../data/jira/statuses');
var priorities = require('../data/jira/priorities');
var print = require('../core/print');

module.exports = function() {

    if (arguments.length > 0) {
        var command = arguments[0].toLowerCase()[0];
        if (command === 's') {
            statuses.display();
        } else if (command === 'p') {
            priorities.display();
        } else {
            print.info(command + ' not found.');
        }
    } else {
        print.info('You did not specify what you wanted to list. Do you need help? Type jira help.');
    }

};

module.exports.requiresLogin = true;
module.exports.moduleDescription = 'Lists various things. Current options: statuses,priorities';
module.exports.moduleDescriptionExtra = 'You can use the first letter of each option for speedy typing (ex: statuses -> jira list s)';