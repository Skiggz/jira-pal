var _ = require('underscore');
module.exports = function JiraIssueType(dataObject) {

    var self = this;
    this.id = _.has(dataObject, 'id') ? dataObject.id : null;
    // JIRA resource navigating named "self" but want to avoid self confusion
    this.resource = _.has(dataObject, 'self') ? dataObject.self : null;
    this.description = _.has(dataObject, 'description') ? dataObject.description : null;
    this.iconUrl = _.has(dataObject, 'iconUrl') ? dataObject.iconUrl : null;
    this.name = _.has(dataObject, 'name') ? dataObject.name : null;
    this.subtask = _.has(dataObject, 'subtask') ? dataObject.subtask : null;

    this.isBug = function() {
        return self.name === 'Bug';
    };

    this.isChore = function() {
        return self.name === 'Chore';
    };

    this.isTask = function() {
        return self.name === 'Task';
    };

    this.isFeature = function() {
        return self.name === 'Story' || self.name === 'New Feature';
    };

};