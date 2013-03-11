define(["js/data/Model"], function(Model) {
    return Model.inherit("app.model.Context", {
        defaults: {
            user: null,
            repository: null
        }
    });
});