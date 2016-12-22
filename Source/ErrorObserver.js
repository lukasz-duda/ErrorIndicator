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

    me.consoleErrorHandler = me.window.console.error;

    me.newConsoleErrorHandler = function (message) {
        var error = new WarningDetails(message);
        me.addError(error);
        me.consoleErrorHandler(message);
    };

    exportFunction(me.newConsoleErrorHandler, window.console, { defineAs: 'error' });
}