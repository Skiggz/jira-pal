var print = require('../core/print');
var _ = require('underscore');
var Table = require('cli-table');

module.exports = function() {
    // async include of commands (circular dependency)
    var commands = require('../core/commands');
    var table = new Table({
        head: [ 'Command', 'Description' ],
        colWidths: [ 30, 120 ]
    });
    _.each(commands, function(mod, command) {
        table.push([command, mod.moduleDescription]);
    });
    print.info('Thanks for using JIRA Pal, available commands are:');
    print.log(table.toString());
    print.info('Use [jira help command-name] to get more details on certain commands\n');
    print.info('\tExample: jira help login\n');
};

// unecessary but added to be explicit
module.exports.requiresLogin = false;
module.exports.moduleDescription = 'Display list of commands and what they do.';
