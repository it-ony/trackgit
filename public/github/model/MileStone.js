define(["js/data/Model", "js/data/Collection", "github/model/Label"], function(Model, Collection, Label) {
    return Model.inherit("github.model.MileStone", {

        schema: {
            title: String,
            number: Number,

            labels: Collection.of(Label)

        },

        idField: "number"
    });
});