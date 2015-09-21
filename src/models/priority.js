var _ = require('underscore');
module.exports = function JiraPriority(dataObject) {

    var self = this;
    this.id = _.has(dataObject, 'id') ? dataObject.id : null;
    // JIRA resource navigating named "self" but want to avoid self confusion
    this.resource = _.has(dataObject, 'self') ? dataObject.self : null;
    this.name = _.has(dataObject, 'name') ? dataObject.name : null;
    this.iconUrl = _.has(dataObject, 'iconUrl') ? dataObject.iconUrl : null;

};