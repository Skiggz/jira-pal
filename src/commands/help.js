var print = require('../core/print');
var _ = require('underscore');
var _s = require('underscore.string');
var Table = require('cli-table');

module.exports = function() {
    // async include of commands (circular dependency)
    var commands = require('../core/commands');
    if (process.argv.length > 3) {
        var specificCommand = process.argv[3];
        if (commands[specificCommand]) {
            // if extra description is available, call it
            if (commands[specificCommand].moduleDescriptionExtra) {
                if (typeof commands[specificCommand].moduleDescriptionExtra === 'string') {
                    print.info(
                        _s.sprintf('\n\t%s command: %s\n', specificCommand, commands[specificCommand].moduleDescriptionExtra)
                    );
                } else {
                    commands[specificCommand].moduleDescriptionExtra();
                }
            } else {
                print.info(
                    _s.sprintf('\n%s command does not have any extra help information available\n', specificCommand)
                );
            }
            return;
        } else {
            print.fail(_s.sprintf('%s command not exist', specificCommand));
        }
    }
    var table = new Table({
        head: [ 'Command', 'Description' ],
        colWidths: [ 30, 120 ]
    });
    _.each(commands, function(mod, command) {
        table.push([command || '', mod.moduleDescription || '']);
    });
    print.info('Thanks for using JIRA Pal, available commands are:');
    print.log(table.toString());
    print.info('Use [node src/jira.js help command-name] to get more details on certain commands\n');
    print.info('\tExample: jira help login\n');
};

// unecessary but added to be explicit
module.exports.requiresLogin = false;
module.exports.moduleDescription = 'Display list of commands and what they do.';
