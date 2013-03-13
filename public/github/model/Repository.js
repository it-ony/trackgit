define(["js/data/Model", "js/data/Collection", "github/model/Issue", "github/model/User"], function(Model, Collection, Issue, User) {
    return Model.inherit("github.model.Repository", {

        schema: {
            name: String,
            description: String,
            full_name: String,

            owner: "github.model.User",

            "private": Boolean,
            fork: Boolean,
            html_url: String,

            has_issues: Boolean,
            open_issues: Number,
            issues: Collection.of(Issue)
        },

        idField: "name"

    });
});