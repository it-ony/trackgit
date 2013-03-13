define(["js/data/RestDataSource", "js/data/DataSource", "js/data/Model", "underscore", "js/data/Collection"], function (RestDataSource, DataSource, Model, _, Collection) {

    var Processor = DataSource.Processor.inherit("github.data.GitHubDataSourceClass.Processor", {

        _getValueForKey: function (data, key, schemaType, schemaDefinition) {

            if (schemaDefinition && schemaDefinition.key) {
                key = schemaDefinition.key;
            }

            if (_.isString(data) && schemaType.classof(Model)) {
                return {
                    id: data.split("/").pop(),
                    url: data
                }
            }

            var referenceKey = key + "_url";
            if (schemaType.classof(Collection)) {
                return {
                    url: data[referenceKey]
                };
            }

            if (schemaType.classof(Model)) {
                if (data[referenceKey]) {
                    return data[referenceKey];
                }
            }

            return this.callBase();
        }

    });

    var GithubDataSourceClass = RestDataSource.inherit("github.data.GithubDataSourceClass", {

        defaults: {
            accessToken: null,
            determinateContextAttribute: false,
        },

        $defaultProcessorFactory: Processor,

        getQueryParameters: function () {
            var params = this.callBase() || {};
            params["access_token"] = this.$.accessToken;
            return params;
        },

        _getPagingParameterForCollectionPage: function (collectionPage) {
            return {
                page: collectionPage.$pageIndex + 1,
                per_page: collectionPage.$limit
            }
        },

        _buildUriForResource: function (resource) {
            if (resource.$.url) {
                var url = resource.$.url;

                url = url.substr(this.$.endPoint.length + 1);

                if (resource instanceof Collection) {
                    url = url.replace(/\{[^}]+\}/, "");
                } else if (resource instanceof Model) {
                    url = url.replace("{/" + resource.idKey + "}", "/" + resource.identifier());
                }

                return [this.$.gateway, url].join("/");
            }

            return this.callBase();
        },

        _resourcePathToUri: function(resourcePath, resource) {

            var r = /users\/([^/]+)\/repos\/([^/]+)/;
            var path = this.callBase(resourcePath);

            if (r.test(path)) {
                // github api is inconsistent at this point
                // fetching the list of repositories via /user/{login}/repos
                // but fetching the repository via /repos/{repositoryName}

                path = path.replace(r, "repos/$1/$2");
            }

            return path;

        },

        getPathComponentsForModel: function (model) {
            var ret = this.callBase();

            if (ret && ret.length === 2 && model.isUniqueModel) {
                ret.splice(1, 1);
            }

            return ret;
        },

        extractListData: function (collectionPage, payload, options, xhr) {
            return payload;
        },

        extractListMetaData: function (collectionPage, payload, options, xhr) {
            var link = xhr.getResponseHeader("Link");

            if (link) {
                var match = /page=(\d+)&per_page=(\d+)>;\s?rel="last"/.exec(link);
                if (match) {
                    var lastPage = parseInt(match[1]);
                    var itemsPerPage = parseInt(match[2]);

                    if (!isNaN(lastPage) && !isNaN(itemsPerPage)) {

                        return {
                            count: lastPage * itemsPerPage
                        };
                    }
                }

            } else {
                return {
                    count: payload.length
                };
            }

        }
    });

    GithubDataSourceClass.Processor = Processor;

    return GithubDataSourceClass;
});