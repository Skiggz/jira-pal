var _ = require('underscore');
module.exports = function LabelSuggestion(dataObject) {

    var self = this;
    this.token = _.has(dataObject, 'token') ? dataObject.token : null;
    this.suggestions = _.has(dataObject, 'suggestions') ? _.map(dataObject.suggestions, function(suggestion) {
        return suggestion.label;
    }) : null;
};