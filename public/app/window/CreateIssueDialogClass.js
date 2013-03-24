define(["xaml!js/ui/Dialog", "js/core/I18n"], function(Dialog, I18n) {
    return Dialog.inherit("app.window.CreateIssueDialogClass", {
        defaults: {
            issue: null,
            title: "{i18n.t('issue.dialog.title')}",
            size: "wide"
        },

        inject: {
            i18n: I18n
        }
    });
});