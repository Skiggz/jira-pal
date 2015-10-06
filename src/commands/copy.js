var print = require('../core/print');
var selectIssue = require('../util/select-issue');
var clipboard = require("copy-paste");

module.exports = function(args) {
    selectIssue(args).then(function(issue) {
        if (!issue) {
            print.info('No stories matched your search criteria');
            return;
        }
        clipboard.copy(issue.key, function() {
            print.info('Copied story ID ' + issue.key + ' to your clipboard.');
        });
    }, function(e) {
        print.fail('Failed to fetch issues ' + e ? e.message : '');
    });
};

module.exports.moduleDescription = 'Copy a selected story key (id) to your clipboard';