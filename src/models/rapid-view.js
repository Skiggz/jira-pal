var _ = require('underscore');
module.exports = function JiraRapidView(dataObject) {

    this.id = _.has(dataObject, 'id') ? dataObject.id : null;
    this.name = _.has(dataObject, 'name') ? dataObject.name : null;
    this.canEdit = _.has(dataObject, 'canEdit') ? dataObject.canEdit : null;
    this.sprintSupportEnabled = _.has(dataObject, 'sprintSupportEnabled') ? dataObject.sprintSupportEnabled : null;
    this.showDaysInColumn = _.has(dataObject, 'showDaysInColumn') ? dataObject.showDaysInColumn : null;

};