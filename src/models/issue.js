var _ = require('underscore');
var JiraFields = require('./fields.js');
var colors = require('colors/safe');
module.exports = function JiraIssue(dataObject) {

    var self = this;
    this.id = _.has(dataObject, 'id') ? dataObject.id : null;
    this.expand = _.has(dataObject, 'expand') ? dataObject.expand : null;
    // JIRA resource navigating named "self" but want to avoid self confusion
    this.resource = _.has(dataObject, 'self') ? dataObject.self : null;
    this.key = _.has(dataObject, 'key') ? dataObject.key : null;
    this.fields = _.has(dataObject, 'fields') ? new JiraFields(dataObject.fields) : null;

    this.type = function() {
        if (self.fields && self.fields.issuetype && self.fields.issuetype.name) {
            return self.fields.issuetype.name;
        }
        return 'Unknown';
    };

    this.summary = function() {
        if (self.fields && self.fields.summary) {
            return self.fields.summary;
        }
        return '';
    };

    this.status = function() {
        if (self.fields && self.fields.status) {
            return self.fields.status.name;
        }
        return '?';
    };

    this.assignee = function() {
        if (self.fields && self.fields.assignee) {
            return self.fields.assignee.displayName || '?';
        }
        return '?';
    };

    this.typeColored = function() {
        if (self.isBug()) {
            return colors.red(self.type());
        } else if (self.isFeature()) {
            return colors.yellow(self.type());
        } else if (self.isChore()) {
            return colors.gray(self.type());
        } else if (self.isTask()) {
            return colors.blue(self.type());
        } else {
            return self.type();
        }
    };

    this.isBug = function() {
        return self.fields && self.fields.issuetype && self.fields && self.fields.issuetype.isBug();
    };

    this.isChore = function() {
        return self.fields && self.fields.issuetype && self.fields && self.fields.issuetype.isChore();
    };

    this.isTask = function() {
        return self.fields && self.fields.issuetype && self.fields && self.fields.issuetype.isTask();
    };

    this.isFeature = function() {
        return self.fields && self.fields.issuetype && self.fields && self.fields.issuetype.isFeature();
    };

};