define(["require", "js/core/Module", "app/model/Context"], function(require, Module, Context) {

    return Module.inherit("app.module.ModuleBase", {
        inject: {
            context: Context,
            me: "me"
        },

        ctor: function() {
            this.$windowCache = {};
            this.callBase();
        },

        createWindow: function(windowClass, attributes, callback) {
            var self = this;

            require([windowClass], function (windowFactory) {
                callback && callback(null, self.createComponent(windowFactory, attributes));
            }, callback);
        },

        createCachedWindow: function (windowClass, attributes, callback) {

            var self = this;

            if (this.$windowCache[windowClass]) {
                callback(null, this.$windowCache[windowClass]);
            } else {
                this.createWindow(windowClass, attributes, function(err, window) {

                    if (!err) {
                        self.$windowCache[windowClass] = window;
                    }

                    callback && callback(err, window);
                });
            }
        }

    });

});