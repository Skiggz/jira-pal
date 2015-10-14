var _ = require('underscore');
module.exports = function JiraComponent(dataObject) {

    var self = this;
    this.id = _.has(dataObject, 'id') ? dataObject.id : null;
    // JIRA resource navigating named "self" but want to avoid self confusion
    this.resource = _.has(dataObject, 'self') ? dataObject.self : null;
    this.name = _.has(dataObject, 'name') ? dataObject.name : null;
    this.description = _.has(dataObject, 'description') ? dataObject.description : null;
    this.projectKey = _.has(dataObject, 'project') ? dataObject.project : null;
    this.projectId = _.has(dataObject, 'projectId') ? dataObject.projectId : null;

};