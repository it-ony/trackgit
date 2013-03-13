define(["app/module/ModuleBase", "github/model/User", "js/data/DataSource", "flow"], function (ModuleBase, User, DataSource, flow) {

    return ModuleBase.inherit("app.module.UserModuleClass", {

        defaults: {
            user: null
        },

        inject: {
            dataSource: DataSource
        },

        start: function () {
            this.set("user", null);
            this.callBase();
        },

        showUser: function (routeContext, userName) {

            var self = this,
                repositories;

            flow()
                .seq("user", function (cb) {
                    var user = self.$.dataSource.createEntity(User, userName);
                    user.fetch(null, cb);
                })
                .seq(function (cb) {
                    var user = this.vars.user;
                    self.set("user", user);

                    repositories = user.$.repositories;
                    repositories.fetch(null, cb);
                })
                .exec(function (err) {
                    err && console.error(err);
                    routeContext.callback(err);
                });
        }

    });
});