define(["js/data/Model","github/model/User"], function(Model, User){

    return Model.inherit('github.model.Issue', {
        schema: {
            assignee: "github.model.User"
        },
        idField: "number",

        labelNames: function () {
            return this.$.labels ? _.map(this.$.labels, function (el) {
                return el.name;
            }) : [];
        }
    });

});