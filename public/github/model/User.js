define(["js/data/Model"], function(Model) {
    return Model.inherit("github.model.User", {

        schema: {
            name: String,
            login: String,

            avatar_url: String,
            public_repos: Number

        }

    });
});