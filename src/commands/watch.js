var _ = require('underscore');
var _s = require('underscore.string');
var print = require('../core/print');
var meKeyOrSearch = require('../util/me-key-or-search');
var api = require('../core/api');
var vim = require('../util/jira-style-vim-fetch');

function watch(issueKey) {
    api.watch(issueKey)
        .then(
            function() {
                print.success('You are now watching ' + issueKey);
            },
            function(e) {
                print.fail('There was a problem watching the issue ' + e ? e.message : '');
            }
        );
}

module.exports = function() {
    meKeyOrSearch.apply(this, arguments)
        .then(
            watch,
            _.noop
        );
};

module.exports.moduleDescription = 'Watch specific issue or search with -s and select';
module.exports.moduleDescriptionExtra = 'Example: jira watch or jira watch XXX-123 or jira watch -s foobar';
