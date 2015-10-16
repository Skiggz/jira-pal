var _ = require('underscore');
var _s = require('underscore.string');
var print = require('../core/print');
var meKeyOrSearch = require('../util/me-key-or-search');
var api = require('../core/api');
var vim = require('../util/jira-style-vim-fetch');

function comment(issueKey) {
    var header = [
        'Please enter your comment and then save and quit.',
        'Empty comments will be discarded and cancelled.'
    ];
    vim(header).then(function(comments) {
        if (!comments) {
            print.fail('No comment provided');
        } else {
            print.success(comments);
            print.ask(
                print.question('confirm', 'post', 'Post the above comment to ' + issueKey + '?')
            ).then(function(answer) {
                if (answer.post) {
                    api.comment(issueKey, comments)
                        .then(
                        function(r) {
                            print.success('Your comment has been posted to ' + issueKey);
                        },
                        function(e) {
                            print.error('There was a problem posting your comment ' + e ? e.message : '');
                        }
                    );
                } else {
                    print.fail('Comment cancelled');
                }
            });
        }
    });
}

module.exports = function() {
    meKeyOrSearch.apply(this, arguments)
        .then(
            comment,
            _.noop
        );
};

module.exports.moduleDescription = 'Comment on specific issue or search with -s and select, then enter in comments.';
module.exports.moduleDescriptionExtra = 'Example: jira comment or jira comment XXX-123 or jira comment -s foobar, then enter in comments.';
