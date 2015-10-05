var statuses = require('../data/jira/statuses');
var print = require('../core/print');

module.exports = function(args) {

    if (args.length > 0) {
        if (args[0].toLowerCase()[0] === 's') {
            statuses.display();
        }
    } else {
        print.info('You did not specify what you wanted to list. Do you need help? Type jira help.');
    }

};

module.exports.requiresLogin = true;
module.exports.moduleDescription = 'Lists various things. Current options: statuses';
module.exports.moduleDescriptionExtra = 'You can use the first letter of each option for speedy typing (ex: statuses -> jira list s)';