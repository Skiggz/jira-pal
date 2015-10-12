var meQuery = require('./me-query');
var api = require('../core/api');

module.exports = function() {
    var query;
    if (arguments.length === 0) {
        query = meQuery();
    } else {
        query = api.queryBuilder().search;
        var search = '';
        for (var i = 0; i < arguments.length; i++) {
            search += ' ' + arguments[i];
        }
        query.fields.text().contains(search);
    }
    return query;
};