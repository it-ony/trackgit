define(["js/core/Application", "flow", "github/model/Me"], function (Application, flow, Me) {

        return Application.inherit({

            defaults: {
                me: null
            },

            start:function (parameter, callback) {

                parameter = parameter || {};

                var self = this,
                    injection = this.$.injection,
                    githubDataSource = this.$.githubDataSource,
                    me;

                githubDataSource.set("accessToken", parameter.accessToken);

                me = githubDataSource.createEntity(Me, "me");
                injection.addInstance(me);
                this.set("me", me);

                flow()
                    .seq(function(cb) {
                        me.fetch(null, cb);
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