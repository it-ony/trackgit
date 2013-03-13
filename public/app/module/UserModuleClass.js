define(["app/module/ModuleBase", "github/model/User", "js/data/DataSource", "flow"], function (ModuleBase, User, DataSource, flow) {

    return ModuleBase.inherit("app.module.OverviewClass", {

        defaults: {
            user: null,
            repos: null
        },

        inject: {
            dataSource: DataSource
        },

        start: function () {
            this.set("user", null);
            this.callBase();
        },

        showUser: function (routeContext, userName) {

            var self = this;

            flow()
                .seq("user", function (cb) {
                    var user = self.$.dataSource.createEntity(User, userName);
                    user.fetch(null, cb);

                    return user;
                })
                .seq(function () {
                    self.set("user", this.vars.user);
                })
                .seq(function(){
                    self.$.user.$.repositories.fetch(null, function (err, collection) {
                        self.set('repos', collection);
                        collection.at(7).fetch(null, function(err, repo){
                            repo.$.issues.fetch(null, function(err, issues){
                                issues.at(0).fetch(null, function(err, issue){
                                    console.log(issue);
                                });
                            });
                        });
                    });
                })
                .exec(function (err) {
                    err && console.error(err);
                    routeContext.callback(err);
                });
        }

    });
});