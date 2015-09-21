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
        _.each(JSON.parse(response.payload).issues, function(issueJson) {
            print.log(
                new JiraIssue(issueJson)
            );
        });
    }, function(error) {
        print.log('Failed to make request', error);
        throw error;
    });
};