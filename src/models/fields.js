var _ = require('underscore');
var JiraIssueType = require('./issue-type.js');
var JiraUser = require('./user.js');
var JiraProject = require('./project.js');
var JiraPriority = require('./priority.js');
var JiraResolution = require('./resolution.js');
var JiraVotes = require('./votes.js');
var JiraStatus = require('./status.js');


module.exports = function JiraFields(dataObject) {

    this.summary = _.has(dataObject, 'summary') ? dataObject.summary : null;
    this.issuetype = _.has(dataObject, 'issuetype') ? new JiraIssueType(dataObject.issuetype) : null;
    this.creator = _.has(dataObject, 'creator') ? new JiraUser(dataObject.creator) : null;
    this.project = _.has(dataObject, 'project') ? new JiraProject(dataObject.project) : null;
    this.reporter = _.has(dataObject, 'reporter') ? new JiraUser(dataObject.reporter) : null;
    this.priority = _.has(dataObject, 'priority') ? new JiraPriority(dataObject.priority) : null;
    this.resolution = _.has(dataObject, 'resolution') ? new JiraResolution(
        _.extend(dataObject.resolution, { date:  _.has(dataObject, 'resolutiondate') ? dataObject.resolutiondate : null})
    ) : null;
    this.labels = _.has(dataObject, 'labels') ? dataObject.labels : null;
    this.votes = _.has(dataObject, 'votes') ? new JiraVotes(dataObject.votes) : null;
    this.assignee = _.has(dataObject, 'assignee') ? new JiraUser(dataObject.assignee) : null;
    this.updated = _.has(dataObject, 'updated') ? new Date(dataObject.updated) : null;
    this.status = _.has(dataObject, 'status') ? new JiraStatus(dataObject.status) : null;
    this.description = _.has(dataObject, 'description') ? dataObject.description : null;

};
