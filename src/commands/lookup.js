var api = require('../core/api');
var _ = require('underscore');
var print = require('../core/print');
var colors = require('colors/safe');
var getIssues = require('../util/issues');

module.exports = function() {
    var query = api.queryBuilder().search;
    for (var i = 0; i < arguments.length; i++) {
        query.raw(arguments[i]);
    }
    getIssues(query).then(function(issues) {
        var rows = [];
        _.each(issues, function(issue) {
            rows.push(
                [
                    issue.project(),
                    issue.key,
                    issue.typeColored(),
                    issue.assignee(),
                    colors.green(issue.summary()),
                    issue.status()
                ]);
        });
        print.table([ 'Project', 'ID', 'Type', 'Assignee', 'Summary', 'Status' ], rows, {
            thin: true,
            colors: ['blue']
        });
    }, function(error) {
        print.log('Failed to make request', error);
        throw error;
    });
};

module.exports.moduleDescription = 'Raw jira search using JQL statements';
module.exports.moduleDescriptionExtra = 'Raw jira search. Example: jira-pal lookup assignee = mycoworker';