define(["js/data/Model", "js/data/Collection", "github/model/Issue", "github/model/User", "github/model/Milestone", "js/data/Query", "github/model/Label"], function (Model, Collection, Issue, User, Milestone, Query, Label) {
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
            issues: Collection.of(Issue),
            milestones: Collection.of(Milestone),
            labels: Collection.of(Label)
        },

        defaults: {
            openMilestones: null,
            closedMilestones: null
        },

        _commitMilestones: function (milestones) {

            if (!milestones) {
                return;
            }

            this.set({
                openMilestones: milestones.query(Query.query().eql("state", "open")),
                closedMilestones: milestones.query(Query.query().eql("state", "closed"))
            });
        },

        idField: "name"

    });
});