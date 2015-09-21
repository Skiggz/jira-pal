var _ = require('underscore');
module.exports = function JiraVotes(dataObject) {

    var self = this;
    this.votes = _.has(dataObject, 'votes') ? dataObject.votes : null;
    // JIRA resource navigating named "self" but want to avoid self confusion
    this.resource = _.has(dataObject, 'self') ? dataObject.self : null;
    this.hasVoted = _.has(dataObject, 'hasVoted') ? dataObject.hasVoted : null;

};