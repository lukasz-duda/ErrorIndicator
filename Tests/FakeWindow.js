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

            var error = {
                message: message,
                fileName: source,
                lineNumber: lineNumber,
                columnNumber: columnNumber
            }
            var event = { error: error };
            errorListener(event);
        }
    };

    me.consoleErrors = [];

    me.console = {
        error: function (message, substitutionString1, substitutionString2) {
            var consoleError = {
                message: message,
                substitutionString1: substitutionString1,
                substitutionString2: substitutionString2
            }
            me.consoleErrors.push(consoleError);
        }
    }
}

function exportFunction(exportedFunction, targetScope, options) {
    targetScope[options.defineAs] = exportedFunction;
}