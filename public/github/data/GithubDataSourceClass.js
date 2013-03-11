define(["js/data/RestDataSource", "js/data/DataSource", "js/data/Model", "underscore", "js/data/Collection"], function (RestDataSource, DataSource, Model, _, Collection) {

    var Processor = DataSource.Processor.inherit("github.data.GitHubDataSourceClass.Processor", {

        _getValueForKey: function (data, key, schemaType, schemaDefinition) {

            if (schemaDefinition && schemaDefinition.key) {
                key = schemaDefinition.key;
            }

            if (_.isString(data) && schemaType.classof(Model)) {
                return {
                    id: data.split("/").pop(),
                    href: data
                }
            }

            if (schemaType.classof(Collection) && _.isString(data[key])) {
                return {
                    href: data[key]
                };
            }

            if (schemaType.classof(Model)) {
                var referenceKey = key + "_url";
                if (data[referenceKey]) {
                    return data[referenceKey];
                }
            }

            return this.callBase();
        }

    });

    var GithubDataSourceClass = RestDataSource.inherit("github.data.GithubDataSourceClass", {

        defaults: {
            accessToken: null
        },

        $defaultProcessorFactory: Processor,

        getQueryParameters: function() {
            var params = this.callBase() || {};
            params["access_token"] = this.$.accessToken;
            return params;
        },

        getPathComponentsForModel: function (model) {

            if (model.constructor.name === "github.model.User" && model.$.id === "me") {
                return ["user"];
            }

            return this.callBase();
        }
    });

    GithubDataSourceClass.Processor = Processor;

    return GithubDataSourceClass;
});