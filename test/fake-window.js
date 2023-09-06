function FakeWindow() {
    const me = this;

    me.errorListeners = [];

    me.addEventListener = function (type, listener) {
        if (type === 'error') {
            fakeWindow.errorListeners.push(listener);
        }
    };

    me.onerror = function (message, source, lineNumber, columnNumber) {
        for (let i = 0; i < fakeWindow.errorListeners.length; i++) {
            const errorListener = fakeWindow.errorListeners[i];

            const error = {
                message: message,
                fileName: source,
                lineNumber: lineNumber,
                columnNumber: columnNumber
            }
            const event = { error: error };
            errorListener(event);
        }
    };

    me.consoleErrors = [];

    me.console = {
        error: function (message, substitutionString1, substitutionString2) {
            const consoleError = {
                message: message,
                substitutionString1: substitutionString1,
                substitutionString2: substitutionString2
            }
            me.consoleErrors.push(consoleError);
        }
    };

    me.resetConsoleErrors = function () {
        me.consoleErrors = [];
    };
}

function exportFunction(exportedFunction, targetScope, options) {
    targetScope[options.defineAs] = exportedFunction;
}