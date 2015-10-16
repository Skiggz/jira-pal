var _ = require('underscore');
var JiraStatusCategory = require('./status-category');

function JiraTo(dataObject) {

    // JIRA resource navigating named "self" but want to avoid self confusion
    this.resource = _.has(dataObject, 'self') ? dataObject.self : null;
    this.id = _.has(dataObject, 'id') ? dataObject.id : null;
    this.name = _.has(dataObject, 'name') ? dataObject.name : null;
    this.description = _.has(dataObject, 'description') ? dataObject.description : null;
    this.iconUrl = _.has(dataObject, 'iconUrl') ? dataObject.iconUrl : null;
    this.statusCategory = _.has(dataObject, 'statusCategory') ? new JiraStatusCategory(dataObject.statusCategory) : null;

}

function JiraFieldSummary(name, dataObject) {

    this.fieldName = name;
    this.name = _.has(dataObject, 'name') ? dataObject.name : null;
    this.required = _.has(dataObject, 'required') ? dataObject.required : null;
    this.schema = _.has(dataObject, 'schema') ? new JiraFieldSchema(dataObject.schema) : null;
    this.hasDefaultValue = _.has(dataObject, 'hasDefaultValue') ? dataObject.hasDefaultValue : null;
    this.operations = _.has(dataObject, 'operations') ? dataObject.operations : [];
    this.allowedValues = _.has(dataObject, 'allowedValues') ? dataObject.allowedValues : [];

}

module.exports = function JiraTransition(dataObject) {

    this.id = _.has(dataObject, 'id') ? dataObject.id : null;
    this.name = _.has(dataObject, 'name') ? dataObject.name : null;
    this.to = _.has(dataObject, 'to') ? new JiraTo(dataObject.to) : null;
    this.fields = _.has(dataObject, 'fields') ? _.map(dataObject.fields, function(summary, fieldName) {
        return new JiraFieldSummary(fieldName, summary);
    }) : null;

};