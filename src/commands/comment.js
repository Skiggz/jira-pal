var _ = require('underscore');
var _s = require('underscore.string');
var print = require('../core/print');
var meQueryOrSearch = require('../util/me-query-or-search');
var settings = require('../data/settings');
var selectIssue = require('../util/select-issue');
var api = require('../core/api');

function comment(issueKey) {
    print.ask(
        print.question('input', 'comment', 'Comment')
    ).then(function(answers) {
        api.comment(issueKey, answers.comment)
            .then(
                function(r) {
                    console.log('Your comment has been posted to', issueKey);
                },
                function(e) {
                    console.error('There was a problem posting your comment', e);
                }
            );
    });
}

module.exports = function() {
    var args = Array.prototype.slice.call(arguments),
        searchOrKey = args.shift();

    if(!searchOrKey || searchOrKey == '-s') {
        selectIssue(meQueryOrSearch.apply(this, _.toArray(arguments))).then(function(issue) {
            if (!issue) {
                print.info('No stories matched your search criteria');
                return;
            }
            
            comment(issue.key);
        }, function(e) {
            print.fail('Failed to fetch issues ' + e ? e.message : '');
        });
    } else {
        comment(searchOrKey);
    }
};

module.exports.moduleDescription = 'Comment on specific issue or search with -s and select, then enter in comments.';
module.exports.moduleDescriptionExtra = 'Example: jira comment or jira comment XXX-123 or jira comment -s foobar, then enter in comments.';
