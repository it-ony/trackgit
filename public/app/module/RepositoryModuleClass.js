define(["app/module/ModuleBase", "github/model/User", "js/data/DataSource", "flow"], function (ModuleBase, User, DataSource, flow) {

    return ModuleBase.inherit("app.module.RepositoryModuleClass", {

        defaults: {
            user: null,
            repository: null
        },

        inject: {
            dataSource: DataSource
        },

        start: function () {
            this.set({
                user: null,
                repository: null
            });

            this.callBase();
        },

        defaultRoute: function(routeContext) {
            routeContext.navigate(routeContext.fragment + "/board");
        },

        showRepository: function(routerContext, userName, repositoryName) {

            var self = this,
                dataSource = this.$.dataSource;

            flow()
                .seq("user", function(cb) {
                    var user = dataSource.createEntity(User, userName);
                    self.set("user", user);

                    user.fetch(null, cb);
                })
                .seq("repository", function(cb) {
                    var user = this.vars.user,
                        repository = user.$.repositories.createItem(repositoryName);

                    self.set("repository", repository);

                    repository.fetch(null, cb);
                })
                .exec(function(err) {
                    err && console.error(err);
                    routerContext.callback(err);
                });
        }

    });
});