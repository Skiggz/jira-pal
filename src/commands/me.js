/*
* Pull down my stories
* */
var _s = require('underscore.string');
var _ = require('underscore');
var print = require('../core/print');
var colors = require('colors/safe');
var getIssues = require('../util/issues');

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
    getIssues().then(function(issues) {
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