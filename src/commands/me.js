/*
* Pull down my stories
* */
var _s = require('underscore.string');
var _ = require('underscore');
var settings = require('../data/settings');
var api = require('../core/api');
var print = require('../core/print');
var getIssues = require('../util/issues');
var meQuery = require('../util/me-query');

module.exports = function() {
    var query = meQuery();
    getIssues(query.toQuery()).then(function(issues) {
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
        throw error;
    });
};

module.exports.moduleDescription = 'Lists your stories based on your defaultMeStatuses setting. Run init to set this.';