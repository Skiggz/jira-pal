/*
* Pull down my stories
* */
var api = require('../core/api');
var settings = require('../data/settings');
var _s = require('underscore.string');
var _ = require('underscore');
var print = require('../core/print');
var JiraIssue = require('../models/issue');
module.exports = function() {
    api.search(
        api.queryBuilder().search.fields.assignee().equals(settings.username)
    ).then(function(response) {
        var issues = [];
        _.each(JSON.parse(response.payload).issues, function(issueJson) {
            issues.push(new JiraIssue(issueJson));
        });
        var rows = [];
        _.each(issues, function(issue) {
            rows.push([issue.key, issue.type(), issue.summary()]);
        });
        print.table([ 'ID', 'Type', 'Summary' ], rows, {
            thin: true,
            colors: ['blue']
        });
    }, function(error) {
        print.log('Failed to make request', error);
        throw error;
    });
};