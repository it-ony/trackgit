define(["js/data/Model", "js/data/Collection", "github/model/Issue", "github/model/User", "github/model/MileStone", "js/data/Query"], function (Model, Collection, Issue, User, MileStone, Query) {
    return Model.inherit("github.model.Repository", {

        schema: {
            name: String,
            description: String,
            full_name: String,

//            owner: "github.model.User",

            "private": Boolean,
            fork: Boolean,
            html_url: String,

            has_issues: Boolean,
            open_issues: Number,
            issues: Collection.of(Issue),
            mileStones: Collection.of(MileStone)
        },

        defaults: {
            openMileStones: null,
            closedMileStones: null
        },

        _commitMileStones: function (mileStones) {

            if (!mileStones) {
                return;
            }

            this.set({
                openMileStones: mileStones.query(Query.query().eql("status", "open")),
                closedMileStones: mileStones.query(Query.query().eql("status", "closed"))
            });
        },

        idField: "name"

    });
});