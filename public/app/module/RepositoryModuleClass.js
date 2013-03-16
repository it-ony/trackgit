define(["app/module/ModuleBase", "github/model/User", "js/data/DataSource", "flow", "js/data/Query", "js/core/List"], function (ModuleBase, User, DataSource, flow, Query, List) {


    return ModuleBase.inherit("app.module.RepositoryModuleClass", {

        defaults: {
            user: null,
            repository: null,
            openMilestones: null,
            closedMilestones: null,
            openIssues: null,
            queryList: List
        },

        inject: {
            dataSource: DataSource
        },

        start: function () {
            this.set({
                user: null,
                repository: null
            });

            this.$.queryList.reset([
                new Query().eql("state", "open")
            ]);

            this.callBase();
        },

        _getMilestones: function (state) {
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

        openIssues: function () {
            if (this.$.openIssues) {
                return (new List(this.$.openIssues.toArray())).query(new Query().eql("label",33));
            }
            return null;
        }.onChange('openIssues'),

        closedIssues: function () {
            if (this.$.repository && this.$.repository.$.issues) {
                return this.$.repository.$.issues.query(new Query().eql("state", "closed"));
            }
            return null;
        }.on(['repository', 'change:issues']),

        bugIssues: function () {
            if (this.$.repository && this.$.repository.$.issues) {
                return this.$.repository.$.issues.query(new Query().in("labels", ["Bug"]));
            }
            return null;
        }.on(['repository', 'change:issues']),


        showRepository: function (routerContext, userName, repositoryName) {

            var self = this,
                dataSource = this.$.dataSource,
                runsInBrowser = this.runsInBrowser();

            flow()
                .seq("user", function (cb) {
                    var user = dataSource.createEntity(User, userName);
                    self.set("user", user);

                    user.fetch(null, cb);
                })
                .seq("repository", function (cb) {
                    var user = this.vars.user,
                        repository = user.$.repositories.createItem(repositoryName);

                    self.set("repository", repository);

                    repository.fetch(null, cb);
                })
                .par(function (cb) {

                    if (runsInBrowser) {
                        cb();
                        cb = null;
                    }

                    self.set('openMilestones', this.vars.repository.$.milestones.query(Query.query().eql("state", "open")));

                    self.$.openMilestones.fetch(null, cb);
                },
                function (cb) {
                    self.$.repository.$.labels.fetch(null, cb);
                },
                function (cb) {
                    self.$.repository.$.issues.query(new Query().eql("state", "open")).fetch(null, function (err, collection) {
                        self.set('openIssues', collection);
                    });
                })
                .exec(function (err) {
                    err && console.error(err);
                    routerContext.callback(err);
                });
        },

        showClosed: function () {
            var closedMilestones = this.$.repository.$.milestones.query(Query.query().eql("state", "closed"));
            var self = this;
            closedMilestones.fetch(null, function (err) {
                if (!err) {
                    self.set('closedMilestones', closedMilestones);
                }
            });
        }

    });
});