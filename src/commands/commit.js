var _ = require('underscore');
var print = require('../core/print');
var selectIssue = require('../util/select-issue');
var meQueryOrSearch = require('../util/me-query-or-search');
var proc = require('child_process');
var fs = require('fs');

module.exports = function() {
    selectIssue(meQueryOrSearch.apply(this, _.toArray(arguments)), true).then(function(issues) {
        if (!issues || !issues.length) {
            print.info('No stories found or selected');
            return;
        }
        var prefill = '# Enter shift+D then "i" to begin (if using vim). Thanks for using jira-pal!\n\n';
        _.each(issues, function(issue) {
            prefill += '\n* ' + issue.key;
        });
        process.stdout.write('\033c');
        var git = proc.spawn('git', ['commit', '-e', '-m', prefill], {
            stdio: 'inherit'
        });
    }, function(e) {
        print.fail('Failed to fetch issues ' + e ? e.message : '');
    });
};

module.exports.moduleDescription = 'Select stories (via jira me) to include in your git commit';
module.exports.moduleDescriptionExtra = 'Opens vim editor to type a commit. This (surprisingly) requires vim, and may explode if you do not have it.';
