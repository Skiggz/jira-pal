var print = require('../core/print');
var Promise = require('bluebird');
var statuses = require('../data/jira/statuses');
var priorities = require('../data/jira/priorities');
module.exports = function() {
    Promise.all(
        statuses.list(),
        priorities.list()
    ).then(function() {
        print.success('Primed caches');
    }, function(e) {
        print.fail('Priming cache failed. ' + e ? e.message : '');
    });
};

module.exports.moduleDescription = 'Populates local caches for various JIRA information for your JIRA setup.';
module.exports.moduleDescriptionExtra =
    'Many of jira-pals commands take arguments that are specific to your JIRA projects, like statues etc.. ' +
    'When referencing these in commands, the cache will populate by itself, but you can run it ahead of time ' +
    'to make future calls faster.';