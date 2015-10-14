var BaseCache = require('../base-cache.js');
var JiraStatus = require('../../models/status.js');

function JiraStatusesCache() {

    BaseCache.prototype.constructor.apply(this, ['statuses', 'statuses.js', 'statuses', JiraStatus]);

    this.getHeader = function() {
        return [
            'Name', 'Description'
        ];
    };

    this.getRow = function(item) {
        return [
            item.name,
            item.description
        ];
    }

}

module.exports = new JiraStatusesCache();