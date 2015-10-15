var _ = require('underscore');
/*
* Not sure yet how much of these will be used outside of rapid board
* so until they are needed I just put them in this file.
* If you need one of these, properly move it to it's own file
* */
function JiraRapidViewStatistics(dataObject) {
    this.rapidViewId = _.has(dataObject, 'id') ? dataObject.id : null;
    this.fieldConfigured = _.has(dataObject, 'fieldConfigured') ? dataObject.fieldConfigured : null;
    this.typeId = _.has(dataObject, 'typeId') ? dataObject.typeId : null;
    this.name = _.has(dataObject, 'name') ? dataObject.name : null;
}

function JiraIssueDetails(dataObject) {

    this.key = _.has(dataObject, 'key') ? dataObject.key : null;
    this.type = _.has(dataObject, 'typeName') ? dataObject.typeName : null;
    this.priority = _.has(dataObject, 'priorityName') ? dataObject.priorityName : null;
    this.summary = _.has(dataObject, 'summary') ? dataObject.summary : null;
    this.statusId = _.has(dataObject, 'statusId') ? dataObject.statusId : null;
    this.statusName = _.has(dataObject, 'statusName') ? dataObject.statusName : null;
    this.assignee = _.has(dataObject, 'assignee') ? dataObject.assignee : null;
    this.assigneeName = _.has(dataObject, 'assigneeName') ? dataObject.assigneeName : null;
}

function JiraSprint(dataObject) {
    this.rapidViewId = _.has(dataObject, 'rapidViewId') ? dataObject.rapidViewId : null;
    this.id = _.has(dataObject, 'id') ? dataObject.id : null;
    this.sequence = _.has(dataObject, 'sequence') ? dataObject.sequence : null;
    this.name = _.has(dataObject, 'name') ? dataObject.name : null;
    this.state = _.has(dataObject, 'state') ? dataObject.state : null;
    this.linkedPagesCount = _.has(dataObject, 'linkedPagesCount') ? dataObject.linkedPagesCount : null;
    this.startDate = _.has(dataObject, 'startDate') ? dataObject.startDate : null;
    this.endDate = _.has(dataObject, 'endDate') ? dataObject.endDate : null;
    this.completeDate = _.has(dataObject, 'completeDate') ? dataObject.completeDate : null;
    this.remoteLinks = _.has(dataObject, 'remoteLinks') ? dataObject.remoteLinks : null;
    this.daysRemaining = _.has(dataObject, 'daysRemaining') ? dataObject.daysRemaining : null;
}

function JiraSprintData(dataObject) {
    this.rapidViewId = _.has(dataObject, 'rapidViewId') ? dataObject.rapidViewId : null;
    this.sprints = _.has(dataObject, 'sprints') ? _.map(dataObject.sprints, function(s) {
        return new JiraSprint(s);
    }) : null;
    this.canManageSprints = _.has(dataObject, 'canManageSprints') ? dataObject.canManageSprints : null;
}

function JiraEtagData(dataObject) {
    this.rapidViewId = _.has(dataObject, 'rapidViewId') ? dataObject.rapidViewId : null;
    this.issueCount = _.has(dataObject, 'issueCount') ? dataObject.issueCount : null;
    this.lastUpdated = _.has(dataObject, 'lastUpdated') ? dataObject.lastUpdated : null;
    this.quickFilters = _.has(dataObject, 'quickFilters') ? dataObject.quickFilters : [];
    this.sprints = _.has(dataObject, 'sprints') ? dataObject.sprints : [];
    this.etag = _.has(dataObject, 'etag') ? dataObject.etag : null;
}

function JiraIssueData(dataObject) {
    this.rapidViewId = _.has(dataObject, 'rapidViewId') ? dataObject.rapidViewId : null;
    this.activeFilters = _.has(dataObject, 'activeFilters') ? dataObject.activeFilters : [];
    this.issues = _.has(dataObject, 'issues') ? _.map(dataObject.issues, function(issue) {
        return new JiraIssueDetails(issue);
    }) : null;
}

function JiraOrderData(dataObject) {
    // todo - did not need at time, nothing interesting here at least right now
}

function JiraRapidBoardCoumn(dataObject) {
    this.id = _.has(dataObject, 'id') ? dataObject.id : null;
    this.name = _.has(dataObject, 'name') ? dataObject.name : null;
    this.statusIds = _.has(dataObject, 'statusIds') ? dataObject.statusIds : [];
    this.statisticsFieldValue = _.has(dataObject, 'statisticsFieldValue') ? dataObject.statisticsFieldValue : null;
}

function JiraRapidBoardColumnData(dataObject) {
    this.rapidViewId = _.has(dataObject, 'rapidViewId') ? dataObject.rapidViewId : null;
    this.columns = _.has(dataObject, 'columns') ? _.map(dataObject.columns, function(c) {
        return new JiraRapidBoardCoumn(c);
    }) : null;
}

module.exports = function JiraRapidView(dataObject) {

    this.rapidViewId = _.has(dataObject, 'rapidViewId') ? dataObject.rapidViewId : null;
    this.statistics = _.has(dataObject, 'statistics') ? new JiraRapidViewStatistics(dataObject.statistics) : null;
    this.columnsData = _.has(dataObject, 'columnsData') ? new JiraRapidBoardColumnData(dataObject.columnsData) : null;
    this.issuesData = _.has(dataObject, 'issuesData') ? new JiraIssueData(dataObject.issuesData) : null;
    //this.orderData = _.has(dataObject, 'orderData') ? new JiraOrderData(dataObject.orderData) : null;
    this.sprintsData = _.has(dataObject, 'sprintsData') ? new JiraSprintData(dataObject.sprintsData) : null;
    this.etagData = _.has(dataObject, 'etagData') ? new JiraEtagData(dataObject.etagData) : null;

};