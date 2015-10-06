var print = require('../core/print');
var selectIssue = require('../util/select-issue');
var clipboard = require("copy-paste");

module.exports = function(args) {
    selectIssue(args).then(function(issue) {
        clipboard.copy(issue.key, function() {
            print.info('Copied story ID ' + issue.key + ' to your clipboard.');
        });
    }, function(e) {
        print.fail('Failed to fetch issues ' + e ? e.message : '');
    });
};