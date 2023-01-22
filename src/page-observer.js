function PageObserver(window, browser) {
    const me = this;
    me.window = window;
    me.browser = browser;

    me.window.addEventListener('error', function (event) {
        const eventError = event.error;
        const error = new ErrorDetails(
            eventError.message,
            eventError.fileName,
            eventError.lineNumber,
            eventError.columnNumber);

        me.addError(error);
    });

    me.addError = function (error) {
        const action = { name: 'addError', args: error };
        me.browser.runtime.sendMessage(action);
    };

    me.handleConsoleError = me.window.console.error;

    me.addUserError = function (message) {
        const userError = new UserErrorDetails(message);
        me.addError(userError);

        const args = Array.from(arguments);
        me.handleConsoleError.apply(this, args);
    };

    exportFunction(me.addUserError, window.console, { defineAs: 'error' });
}