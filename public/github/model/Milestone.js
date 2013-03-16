define(["js/data/Model", "js/data/Collection"], function(Model, Collection) {
    return Model.inherit("github.model.Milestone", {

        schema: {
            title: String,
            number: Number,

            open_issues: Number,
            closed_issues: Number

        },

        idField: "number"

    });
});