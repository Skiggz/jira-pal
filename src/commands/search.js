/*
 * Search for stories, either with me defaults
 * or by using text contains [ search ]
 * */
var _s = require('underscore.string');
var _ = require('underscore');
var print = require('../core/print');
var colors = require('colors/safe');
var meQueryOrSearch = require('../util/me-query-or-search');
var api = require('../core/api');

module.exports = function() {
    api.search(meQueryOrSearch.apply(this, _.toArray(arguments))).then(function(response) {
        var issues = response.data;
        var rows = [];
        _.each(issues, function(issue) {
            rows.push(
                [
                    issue.key,
                    issue.typeColored(),
                    issue.assignee(),
                    colors.green(issue.summary()),
                    issue.status()
                ]);
        });
        print.table([ 'ID', 'Type', 'Assignee', 'Summary', 'Status' ], rows, {
            thin: true,
            colors: ['blue']
        });
    }, function(error) {
        print.log('Failed to make request', error);
        throw error;
    });
};

module.exports.moduleDescription = 'Search for stories with text containing all args passed in. See lookup for advanced search options';