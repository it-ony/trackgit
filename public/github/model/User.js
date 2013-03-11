define(["js/data/Model", "js/data/Collection", "github/model/Repository"], function(Model, Collection, Repository) {
    return Model.inherit("github.model.User", {

        schema: {
            name: String,
            login: String,

            avatar_url: String,
            public_repos: Number,

            repositories: {
                type: Collection.of(Repository),
                key: "repos_url"
            }
        }

    });
});