var _ = require('underscore');
var JiraIssueType = require('./issue-type.js');
module.exports = function JiraFields(dataObject) {

    this.summary = _.has(dataObject, 'summary') ? dataObject.summary : null;
    this.issuetype = _.has(dataObject, 'issuetype') ? new JiraIssueType(dataObject.issuetype) : null;

};