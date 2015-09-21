var _ = require('underscore');
module.exports = function JiraStatusCategory(dataObject) {

    var self = this;
    this.id = _.has(dataObject, 'id') ? dataObject.id : null;
    // JIRA resource navigating named "self" but want to avoid self confusion
    this.resource = _.has(dataObject, 'self') ? dataObject.self : null;
    this.name = _.has(dataObject, 'name') ? dataObject.name : null;
    this.colorName = _.has(dataObject, 'colorName') ? dataObject.colorName : null;
    this.key = _.has(dataObject, 'key') ? dataObject.key : null;

};