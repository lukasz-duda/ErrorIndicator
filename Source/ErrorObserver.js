/// <reference path="../References.js" />

function ErrorObserver(window, browser) {
    var me = this;
    me.window = window;
    me.browser = browser;

    me.window.addEventListener('error', function (event) {
        var error = new ErrorDetails(
            event.message,
            event.filename,
            event.lineno,
            event.colno);

        me.addError(error);
    });

    me.addError = function (error) {
        var action = { name: 'addError', args: error };
        me.browser.runtime.sendMessage(action);
    };

    me.handleConsoleError = me.window.console.error;

    me.addUserError = function (message) {
        var userError = new UserErrorDetails(message);
        me.addError(userError);
        me.handleConsoleError(message);
    };

    exportFunction(me.addUserError, window.console, { defineAs: 'error' });
}