var _ = require('underscore');
var print = require('../core/print');
var api = require('../core/api');
var meKeyOrSearch = require('../util/me-key-or-search');

function describe(keyOrId) {
    api.issue(keyOrId).then(function(response) {
        print.success('=============================================================================================');
        print.success([response.data.key, ': ', response.data.summary()].join(''));
        print.success('=============================================================================================');
        print.success('');
        print.success(response.data.description());
    });
}

module.exports = function() {
    meKeyOrSearch.apply(this, arguments)
        .then(
            describe,
            _.noop
        );
};

module.exports.moduleDescription = 'Description of an issue by key or id.';
module.exports.moduleDescriptionExtra = 'Description of the issue request by key. Ex: `jira describe XXX-123` or `jira describe 100324`.';
