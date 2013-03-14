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

        _getMileStones: function(state) {
            state = state || "open";

            var ret = [],
                mileStones = this.get("repository.mileStones");

            if (mileStones) {
                for (var i = 0; i < mileStones.$items.length; i++) {
                    if (mileStones.$items[i].$.state === state) {
                        ret.push(mileStones.$items[i]);
                    }
                }
            }

            return ret;

        },

        openMileStones: function() {
            return this._getMileStones("open");
        }.on(["repository.mileStones", "*"]),

        showRepository: function(routerContext, userName, repositoryName) {

            var self = this,
                dataSource = this.$.dataSource,
                runsInBrowser = this.runsInBrowser();

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
                .seq("milestones", function(cb) {

                    if (runsInBrowser) {
                        cb();
                        cb = null;
                    }

//                    this.vars.repository.$.mileStones.fetch(null, cb);
                    this.vars.repository.$.openMileStones.fetch(null, cb);
                    this.vars.repository.$.closedMileStones.fetch(null, cb);
                })
                .exec(function(err) {
                    err && console.error(err);
                    routerContext.callback(err);
                });
        }

    });
});