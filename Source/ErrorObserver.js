/// <reference path="../References.js" />

function ErrorObserver(window, browser) {
    var me = this;
    me.window = window;
    me.browser = browser;

    me.addError = function (error) {
        var action = { name: 'addError', args: error };
        me.browser.runtime.sendMessage(action);
    }

    me.window.addEventListener('error', function (event) {
        var error = new ErrorDetails(
            event.message,
            event.filename,
            event.lineno,
            event.colno);

        me.addError(error);
    });
}