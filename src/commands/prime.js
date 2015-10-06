var print = require('../core/print');
var statuses = require('../data/jira/statuses');
module.exports = function() {
    statuses.list().then(function() {
        print.success('Primed statuses cache');
    }, function(e) {
        print.fail('Priming statues cache failed. ' + e ? e.message : '');
    });
};

module.exports.requiresLogin = false;
module.exports.moduleDescription = 'Populates local caches for various JIRA information for your JIRA setup.';
module.exports.moduleDescriptionExtra =
    'Many of jira-pals commands take arguments that are specific to your JIRA projects, like statues etc.. ' +
    'When referencing these in commands, the cache will populate by itself, but you can run it ahead of time ' +
    'to make future calls faster.';