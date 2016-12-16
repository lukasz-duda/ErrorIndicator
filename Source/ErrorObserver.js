/// <reference path="../References.js" />

function ErrorObserver(window, browser) {
    var me = this;
    me.window = window;
    me.browser = browser;

    me.addError = function (error) {
        var action = { name: 'addError', args: error };
        me.browser.runtime.sendMessage(action);
    }

    me.window.onerror = function (message, source, lineNumber, columnNumber) {
        var error = new ErrorDetails(message, source, lineNumber, columnNumber);
        me.addError(error);
    }
}