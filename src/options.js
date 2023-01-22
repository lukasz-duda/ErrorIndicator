function Options(browser) {
    const me = this;

    me.browser = browser;

    me.ignore = function (messageTypes) {
        const action = { name: 'ignore', args: messageTypes };
        me.browser.runtime.sendMessage(action);
    };
}