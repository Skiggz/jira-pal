var _ = require('underscore');
var JiraFields = require('./fields.js');
module.exports = function JiraIssue(dataObject) {

    this.id = _.has(dataObject, 'id') ? dataObject.id : null;
    this.expand = _.has(dataObject, 'expand') ? dataObject.expand : null;
    // JIRA calls the ID linked url "self"
    this.url = _.has(dataObject, 'self') ? dataObject.self : null;
    this.key = _.has(dataObject, 'key') ? dataObject.key : null;
    this.fields = _.has(dataObject, 'fields') ? new JiraFields(dataObject.fields) : null;

};