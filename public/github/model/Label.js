define(["js/data/Model"], function(Model) {

    var undefined,
        statusLabelExtractor = /^(?:(\d+)\s?-)?\s*(.*)$/;

    return Model.inherit("github.model.Label", {

        schema: {
            name: String,
            color: String
        },

        defaults: {
            _name: null,
            priority: null
        },

        idField: "name",

        _commitName: function(name) {

            if (name) {
                var match = statusLabelExtractor.exec(name);
                this.set({
                    priority: match[1],
                    _name: match[2]
                });
            } else {
                this.set({
                    _name: null,
                    priority: null
                });
            }
        },

        name: function() {
            return this.$._name;
        }.onChange("_name"),

        identifyStatus: function() {
            return this.$.priority || this.$.priority == 0;
        }.onChange("_priority")
    });
});