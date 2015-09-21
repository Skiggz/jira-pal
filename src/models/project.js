var _ = require('underscore');
module.exports = function JiraProject(dataObject) {

    var self = this;
    this.id = _.has(dataObject, 'id') ? dataObject.id : null;
    // JIRA resource navigating named "self" but want to avoid self confusion
    this.resource = _.has(dataObject, 'self') ? dataObject.self : null;
    this.name = _.has(dataObject, 'name') ? dataObject.name : null;
    this.key = _.has(dataObject, 'key') ? dataObject.key : null;
    this.avatar = _.has(dataObject, 'avatarUrls') && _.has(dataObject.avatarUrls, '48x48') ?
        dataObject.avatarUrls['48x48'] : null;

};