var print = require('../core/print');
var selectIssue = require('../util/select-issue');
var clipboard = require("copy-paste-no-exec");
var meQuery = require('../util/me-query');

module.exports = function(args) {
    if (args.length === 0) {
        args[0] = meQuery.toQuery();
        args.length = 1;
    }
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