define(["js/data/RestDataSource"], function (RestDataSource) {

    return RestDataSource.inherit("github.data.GithubDataSourceClass", {

        defaults: {
            accessToken: null
        },

        getQueryParameters: function() {
            var params = this.callBase() || {};

            params["access_token"] = this.$.accessToken;

            return params;
        },

        getPathComponentsForModel: function (model) {
            var ret = this.callBase();

            if (ret && ret.length === 2 && model.isUniqueModel) {
                ret.splice(1, 1);
            }

            return ret;
        },

    });
});