define(["github/model/User"], function(User) {
    return User.inherit("github.model.Me", {
        isUniqueModel: true
    });

});