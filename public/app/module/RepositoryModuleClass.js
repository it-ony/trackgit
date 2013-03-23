define(["app/module/ModuleBase", "github/model/User", "js/data/DataSource", "flow", "js/data/Query", "js/core/List"], function (ModuleBase, User, DataSource, flow, Query, List) {

    return ModuleBase.inherit("app.module.RepositoryModuleClass", {

        defaults: {
            user: null,
            repository: null,
            milestone: null,

            openMilestones: null,
            closedMilestones: null,

            openIssues: null,
            closedIssues: null,

            statusLabels: List,
            labels: List,

            columns: List
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

//        openIssues: function () {
//            if (this.$.openIssues) {
//                return (new List(this.$.openIssues.toArray())).query(new Query().eql("label", 33));
//            }
//            return null;
//        }.onChange('openIssues'),
//
//        closedIssues: function () {
//            if (this.$.repository && this.$.repository.$.issues) {
//                return this.$.repository.$.issues.query(new Query().eql("state", "closed"));
//            }
//            return null;
//        }.on(['repository', 'change:issues']),
//
//        bugIssues: function () {
//            if (this.$.repository && this.$.repository.$.issues) {
//                return this.$.repository.$.issues.query(new Query().in("labels", ["Bug"]));
//            }
//            return null;
//        }.on(['repository', 'change:issues']),


        title: function () {
            var title = "Issues for " + this.get("user.login") + "/" + this.get("repository.name"),
                milestone = this.$.milestone;

            if (milestone) {
                title += " - " + milestone.$.title;
            } else {
                title += " - Backlog"
            }

            return title
        }.onChange("milestone", "user", "repository"),

        showRepository: function (routeContext, userName, repositoryName) {

            var self = this,
                dataSource = this.$.dataSource,
                runsInBrowser = this.runsInBrowser(),
                labels;

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
                .seq("labels", function (cb) {
                    this.vars.repository.$.labels.fetch(null, cb);
                })
                .par(function () {

                    var labels = [],
                        statusLabels = [],
                        statusLabelNames = [],
                        columns = [];

                    this.vars.labels.each(function (label) {
                        var isStatusLabel = label.identifyStatus();
                        (isStatusLabel ? statusLabels : labels).push(label);

                        if (isStatusLabel) {
                            statusLabelNames.push(label.$.name);
                        }
                    });

                    // sort the status labels
                    statusLabels.sort(function (a, b) {
                        return (a.$.priority - b.$.priority);
                    });

                    self.$.labels.reset(labels);
                    self.$.statusLabels.reset(labels);

                    columns.push({
                        title: "open",
                        source: "openIssues",
                        query: new Query()
                            .eql("state", "open")
                            .not(function (where) {
                                where.in("labels", statusLabelNames)
                            })
                    });

                    for (var i = 0; i < statusLabels.length; i++) {
                        var statusLabel = statusLabels[i];
                        columns.push({
                            title: statusLabel.name(),
                            source: "openIssues",
                            query: new Query()
                                .eql("state", "open")
                                .in("labels", [statusLabel.$.name])
                        });
                    }

                    columns.push({
                        title: "closed",
                        source: "closedIssues",
                        query: new Query()
                            .eql("state", "closed")
                    });

                    self.$.columns.reset(columns);
                }, function (cb) {

                    if (runsInBrowser) {
                        cb();
                        cb = null;
                    }

                    self.set('openMilestones', this.vars.repository.$.milestones.query(Query.query().eql("state", "open")));
                    self.$.openMilestones.fetch(null, cb);
                })
                .exec(function (err) {
                    err && console.error(err);
                    routeContext.callback(err);
                });
        }.async(),

        loadMilestone: function(routeContext, milestoneId) {

            var self = this;

            flow()
                .seq("milestone", function (cb) {
                    if (milestoneId) {
                        var milestone = self.$.repository.$.milestones.createItem(milestoneId);
                        milestone.fetch(null, function (err) {
                            var m = err ? null : milestone;
                            cb(null, m);
                        });
                    } else {
                        cb(null, null);
                    }
                })
                .par({
                    openIssues: function(cb) {
                        var issues = self.$.repository.$.issues.query(
                            Query.query()
                                .eql("state", "open")
                                .eql("milestone", milestoneId ? milestoneId : "none")
                        );

                        issues.fetch(null, cb);
                    },
                    closedIssues: function(cb) {

                        var issues = self.$.repository.$.issues.query(
                            Query.query()
                                .eql("state", "closed")
                                .eql("milestone", milestoneId ? milestoneId : "none")
                        );

                        issues.fetch(null, cb);
                    }
                })
                .exec(function(err, results) {
                    self.set(results);

                    console.log("load milestone completed");
                    err && console.error(err);
                    routeContext.callback(err)
                });

        }.async(),

        issues: function(column) {
            var source = this.$[column.source];
            return column.query.filterItems(source.$items);
        }.onChange("milestone"),

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