define(["js/ui/View"], function (View) {

    return View.inherit("app.view.SidebarClass", {

        defaults: {
            componentClass: "sidebar",

            user: null,
            repository: null
        },

        showClosed: function () {

            var repository = this.$.repository;

            if (repository && repository.$.closedMilestones) {
                repository.$.closedMilestones.fetch();
            }

        }
    });

});