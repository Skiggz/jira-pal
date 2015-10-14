var statuses = require('../data/jira/statuses');
var priorities = require('../data/jira/priorities');
var projects = require('../data/jira/projects');
var print = require('../core/print');

module.exports = function() {

    if (arguments.length > 0) {
        var command = arguments[0].toLowerCase();
        if (command === 'status' || command === 'statuses') {
            statuses.display();
        } else if (command === 'priority' || command === 'priorities') {
            priorities.display();
        } else if (command === 'project' || command === 'projects') {
            projects.display();
        } else {
            print.info(command + ' not found.');
        }
    } else {
        print.info('You did not specify what you wanted to list. Do you need help? Type jira help.');
    }

};

module.exports.requiresLogin = true;
module.exports.moduleDescription = 'Lists various things. Current options: status,priority,project';
module.exports.moduleDescriptionExtra = 'Current options: status,priority,project';