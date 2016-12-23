/// <reference path="../References.js" />

function ErrorObserver(window, browser) {
    var me = this;
    me.window = window;
    me.browser = browser;

    me.window.addEventListener('error', function (event) {
        var eventError = event.error;
        var error = new ErrorDetails(
            eventError.message,
            eventError.fileName,
            eventError.lineNumber,
            eventError.columnNumber);

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
        var args = Array.from(arguments);
        me.handleConsoleError.apply(this, args);
    };

    exportFunction(me.addUserError, window.console, { defineAs: 'error' });
}