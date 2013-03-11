define(["js/core/Module", "github/model/User"], function(Module, User) {

    return Module.inherit("app.module.ModuleBase", {
        inject: {
            me: "me"
        }
    });

});