define(["github/model/User"], function(User) {
    return User.inherit("github.model.Me", {

        // no collection, but also not a model like /users/me
        isUniqueModel: true
    });
});