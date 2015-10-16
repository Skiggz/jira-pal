/*
* Pull down my stories
* */
var _ = require('underscore');
var settings = require('../data/settings');
var print = require('../core/print');
var colors = require('colors/safe');
var api = require('../core/api');
var meQueryOrSearch = require('../util/me-query-or-search');

module.exports = function() {
    var query = meQueryOrSearch.apply(this, _.toArray(arguments));
    if (arguments.length > 0) {
        query = query.and().fields.assignee().equals(settings.gett.username);
        if (settings.gett.orderByDefault) {
            query.orderBy(settings.gett.orderByDefault)
        }
        if (settings.gett.useActiveSprintsForMeCommand) {
            query.inOpenSprints();
        }
    }
    api.search(query).then(function(response) {
        var issues = response.data;
        var rows = [];
        _.each(issues, function(issue) {
            rows.push(
                [
                    issue.key,
                    issue.typeColored(),
                    colors.green(issue.summary()),
                    issue.status()
                ]);
        });
        print.table([ 'ID', 'Type', 'Summary', 'Status' ], rows, {
            thin: true,
            colors: ['blue']
        });
    }, function(error) {
        print.log('Failed to make request', error);
    });
};

module.exports.moduleDescription = 'Lists your stories based on your defaultMeStatuses setting. Run init to set this.';