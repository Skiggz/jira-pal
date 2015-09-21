/*
* Pull down my stories
* */
var api = require('../core/api');
var settings = require('../data/settings');
var _s = require('underscore.string');
var print = require('../core/print');
module.exports = function() {
    api.search(
        api.queryBuilder()
            .search.query(_s.sprintf('assignee = %s', settings.username))
    ).then(function(response) {
        print.log(response);
    }, function(error) {
        print.log('Failed to make request', error);
        throw error;
    });
};