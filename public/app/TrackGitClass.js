define(["js/core/Application", "flow", "github/model/Me", "github/model/User", "app/model/Context"], function (Application, flow, Me, User, Context) {

        return Application.inherit({

            defaults: {
                me: null,
                context: Context
            },

            start:function (parameter, callback) {

                parameter = parameter || {};

                var self = this,
                    injection = this.$.injection,
                    githubDataSource = this.$.githubDataSource,
                    me,
                    context = this.$.context;

                injection.addInstance(context);

                githubDataSource.set("accessToken", parameter.accessToken);

                flow()
                    .seq(function(cb) {
                        me = githubDataSource.createEntity(Me);
                        me.fetch(null, cb);
                    })
                    .seq(function(cb) {
                        me = githubDataSource.createEntity(User, me.$.login);
                        me.fetch(null, cb);
                    })
                    .seq(function() {
                        self.set("me", me);
                        injection.addInstance("me", me);
                    })
                    .exec(function(err) {
                        if (err) {
                            callback && callback(err);
                        } else {
                            self.start.baseImplementation.call(self, parameter, callback);
                        }
                    });

            }
        });
    }
);