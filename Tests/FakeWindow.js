/// <reference path="../References.js" />

function FakeWindow() {
    var me = this;

    me.errorListeners = [];

    me.addEventListener = function (type, listener) {
        if (type == 'error') {
            fakeWindow.errorListeners.push(listener);
        }
    };

    me.onerror = function (message, source, lineNumber, columnNumber) {
        for (var i = 0; i < fakeWindow.errorListeners.length; i++) {
            var errorListener = fakeWindow.errorListeners[i];
            var event = {
                message: message,
                filename: source,
                lineno: lineNumber,
                colno: columnNumber
            }
            errorListener(event);
        }
    };

    me.consoleErrors = [];

    me.console = {
        error: function (message) {
            me.consoleErrors.push(message);
        }
    }
}