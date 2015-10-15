var _ = require('underscore');
var _s = require('underscore.string');
var print = require('../core/print');
var meQueryOrSearch = require('../util/me-query-or-search');
var selectIssue = require('../util/select-issue');
var api = require('../core/api');
var vim = require('../util/vim');
var transformMentions = require('../util/transform-mentions');

function comment(issueKey) {
    var header = '\n# Please enter your comment and then save and quit. \n' +
        '# These lines and everything below them will be discarded.\n';
    vim(header, true).then(function(result) {
        var comments = transformMentions(_s.trim(result.contents.replace(/#.*/g, '')))
        api.comment(issueKey, comments)
            .then(
            function(r) {
                print.success('Your comment has been posted to ' + issueKey);
            },
            function(e) {
                print.error('There was a problem posting your comment ' + e ? e.message : '');
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
