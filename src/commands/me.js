/*
* Pull down my stories
* */
var api = require('../core/api');
var settings = require('../data/settings');
var _s = require('underscore.string');
var _ = require('underscore');
var print = require('../core/print');
var JiraIssue = require('../models/issue');
var colors = require('colors/safe');

var colorType = function(issue) {
    if (issue.isBug()) {
        return colors.red(issue.type());
    } else if (issue.isFeature()) {
        return colors.yellow(issue.type());
    } else if (issue.isChore()) {
        return colors.gray(issue.type());
    } else if (issue.isTask()) {
        return colors.blue(issue.type());
    } else {
        return issue.type();
    }
};

module.exports = function() {
    var query = api.queryBuilder().search.fields.assignee().equals(settings.username);
    if (settings.defaultMeStatuses) {
        query.and().fields.status().in(settings.defaultMeStatuses);
    }
    api.search(query).then(function(response) {
        var issues = [];
        _.each(JSON.parse(response.payload).issues, function(issueJson) {
            issues.push(new JiraIssue(issueJson));
        });
        var rows = [];
        _.each(issues, function(issue) {
            rows.push(
                [
                    issue.key,
                    colorType(issue),
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