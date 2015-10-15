var _ = require('underscore');
var print = require('../core/print');
var api = require('../core/api');

module.exports = function(keyOrId, all) {
    /*
    * Until we have a nice flag system for flags
    * passed in + values, make this easy to
    * use -a in any order for now. Pretty  hacky
    * but only a couple lines. Will add some
    * support for better, natural flagging, later
    * */
    if (keyOrId === '-a') {
        keyOrId = all;
        all = '-a';
    }
    if (!keyOrId) {
        print.fail('Issue key or ID required');
    } else {
        api.issue(keyOrId).then(function(response) {
            if (all === '-a') {
                print.success(
                    JSON.stringify(response.data, null, 2)
                );
            } else {
                print.success(
                    // try to make json succinct by removing likely unuseful keys
                    JSON.stringify(_.omit(response.data, 'expand', 'resource'), null, 2)
                );
            }
        });
    }

};

module.exports.moduleDescription = 'List everything about an issue by key or id.';
module.exports.moduleDescriptionExtra = 'JSON Representation of the issue request by key. Ex: `jira issue XXX-123` or `jira issue 100324`. Use flag -a to include all fields. Ex: `jira issue XXX-123 -a`';
