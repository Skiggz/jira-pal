var _ = require('underscore');
var JiraStatusCategory = require('./status-category.js');
module.exports = function JiraPriority(dataObject) {

    var self = this;
    this.id = _.has(dataObject, 'id') ? dataObject.id : null;
    // JIRA resource navigating named "self" but want to avoid self confusion
    this.resource = _.has(dataObject, 'self') ? dataObject.self : null;
    this.name = _.has(dataObject, 'name') ? dataObject.name : null;
    this.description = _.has(dataObject, 'description') ? dataObject.description : null;
    this.iconUrl = _.has(dataObject, 'iconUrl') ? dataObject.iconUrl : null;
    this.statusCategory = _.has(dataObject, 'statusCategory') ?
        new JiraStatusCategory(dataObject.statusCategory) : null;

};