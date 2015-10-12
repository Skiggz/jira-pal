var settings = require('../data/settings');
var api = require('../core/api');

module.exports = function() {
    var query = api.queryBuilder().search.fields.assignee().equals(settings.username);
    if (settings.defaultMeStatuses) {
        query.and().fields.status().in(settings.defaultMeStatuses);
    }
    return query;
};