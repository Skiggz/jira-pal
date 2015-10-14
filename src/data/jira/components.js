var BaseCache = require('../base-cache.js');
var _ = require('underscore');

function JiraComponentsCache() {

    BaseCache.prototype.constructor.apply(this, ['components', 'components.js', 'allComponents']);

    this.getHeader = function() {
        return [
            'Project', 'Components'
        ];
    };

    this.getRow = function(item) {
        var components = _.map(item.components, function(component) {
            return component.name;
        });
        return [
            item.key,
            components.join(',')
        ];
    }

}

module.exports = new JiraComponentsCache();