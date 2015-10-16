var Promise = require('bluebird');
var _ = require('underscore');
var _s = require('underscore.string');
var print = require('../core/print');
var api = require('../core/api');
var meKeyOrSearch = require('../util/me-key-or-search');
var moment = require('moment');

function describe(keyOrId, includeComments) {
    Promise.join(
        api.issue(keyOrId),
        includeComments ? api.comments(keyOrId) : new Promise(function(r) { r(); }),
        function(issueResponse, commentsResponse) {
            print.table(
                [ _s.sprintf('%s : %s', issueResponse.data.key, issueResponse.data.summary()) ],
                [
                    [ issueResponse.data.description() ]
                ],
                {
                    widths: [ 150 ]
                }
            );
            print.success('');
            if (commentsResponse) {
                _.each(commentsResponse.data, function(comment) {
                    print.table(
                        [ comment.author.displayName, _s.sprintf('(%s)', moment(comment.created).format('MMM Do YYYY, h:mm:ss a'))],
                        [
                            [ '', comment.body ]
                        ],
                        {
                            widths: [ 20, 140 ]
                        }
                    );
                });
                print.success('');
            }
        }
    );
}

module.exports = function() {
    var includeComments = false;
    var args = _.toArray(arguments);
    var ix = args.indexOf('-c');
    if (ix > -1) {
        includeComments = true;
        args.splice(ix, 1);
    }
    meKeyOrSearch.apply(this, args)
        .then(
            function(key) {
                describe(key, includeComments);
            },
            _.noop
        );
};

module.exports.moduleDescription = 'Description of an issue by key or id. Flag -c to include comments.';
module.exports.moduleDescriptionExtra = 'Description of the issue request by key. Ex: `jira describe XXX-123` or `jira describe 100324`. Use -c to include comments.';
