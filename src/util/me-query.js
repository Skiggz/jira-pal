var settings = require('../data/settings');
var api = require('../core/api');

module.exports = function() {
    var query = api.queryBuilder().search.fields.assignee().equals(settings.gett.username);
    if (settings.gett.defaultMeStatuses) {
        query.and().fields.status().in(settings.gett.defaultMeStatuses);
    }
    if (settings.gett.orderByDefault) {
        query.orderBy(settings.gett.orderByDefault)
    }
    return query;
};