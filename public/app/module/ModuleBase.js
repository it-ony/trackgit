define(["js/core/Module", "app/model/Context"], function(Module, Context) {

    return Module.inherit("app.module.ModuleBase", {
        inject: {
            context: Context,
            me: "me"
        }
    });

});