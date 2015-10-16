var _ = require('underscore');
var JiraUser = require('./user');
module.exports = function JiraComponent(dataObject) {

    var self = this;
    this.id = _.has(dataObject, 'id') ? dataObject.id : null;
    // JIRA resource navigating named "self" but want to avoid self confusion
    this.resource = _.has(dataObject, 'self') ? dataObject.self : null;
    this.author = _.has(dataObject, 'author') ? new JiraUser(dataObject.author) : null;
    this.updateAuthor = _.has(dataObject, 'updateAuthor') ? new JiraUser(dataObject.updateAuthor) : null;
    this.body = _.has(dataObject, 'body') ? dataObject.body : null;
    this.created = _.has(dataObject, 'created') ? dataObject.created : null;
    this.updated = _.has(dataObject, 'updated') ? dataObject.updated : null;

};