define(["js/data/Model"], function(Model) {
    return Model.inherit("github.model.Label", {

        schema: {
            name: String,
            color: String
        },

        idField: "name"
    });
});