define(["app/module/ModuleBase", "github/model/User", "js/data/DataSource", "flow"], function(ModuleBase, User, DataSource, flow) {

    return ModuleBase.inherit("app.module.OverviewClass", {

        defaults: {
            user: null
        },

        inject: {
            dataSource: DataSource
        },

        start: function(callback, routeContext) {

            var self = this;

            self.set("user", null);

            flow()
                .seq("user", function(cb) {

                    var userName = routeContext.params[0];

                    if (self.$.user && self.$.user.$.login !== userName) {
                        self.set("user", null);
                    }

                    var user = self.$.dataSource.createEntity(User, userName);
                    user.fetch(null, cb);

                    return user;
                })
                .seq(function() {
                    self.set("user", this.vars.user);
                })
                .exec(function(err) {
                    err && console.error(err);
                    callback && callback();
                });
        }

    });
});