define(["js/data/Model"], function(Model) {
    return Model.inherit("github.model.Repository", {

        schema: {
            name: String,
            description: String,
            full_name: String,

            "private": Boolean,
            fork: false,
            html_url: String,

            has_issues: Boolean,
            open_issues: Number
        }

    });
});