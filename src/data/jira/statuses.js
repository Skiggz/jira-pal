var BaseCache = require('../base-cache.js');

function JiraStatusesCache() {

    BaseCache.prototype.constructor.apply(this, ['statuses', 'statuses.js', 'statuses']);

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