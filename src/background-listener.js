function BackgroundListener(dateProvider, browser, errorIndicator) {
    const me = this;
    me.dateProvider = dateProvider;
    me.browser = browser;
    me.errorIndicator = errorIndicator;

    me.onMessage = function (action, sender, respond) {
        const response = me[action.name](action.args, sender);
        respond(response);
    };

    me.addError = function (errorDetails, sender) {
        const tabError = new TabError({
            tabId: sender.tab.id,
            message: errorDetails.message,
            messageType: errorDetails.messageType,
            timeStamp: me.dateProvider.now(),
            source: errorDetails.source,
            lineNumber: errorDetails.lineNumber,
            columnNumber: errorDetails.columnNumber,
        });

        me.errorIndicator.addError(tabError);
    };

    me.getReport = function () {
        return me.errorIndicator.getReport();
    };

    me.switchOn = function () {
        me.errorIndicator.switchOn();
    };

    me.switchOff = function () {
        me.errorIndicator.switchOff();
    };

    me.ignore = function (messageTypes) {
        me.errorIndicator.ignore(messageTypes);
    };

    me.removeTabErrors = function () {
        me.errorIndicator.removeTabErrors();
    };

    me.onTabActivated = function (activeInfo) {
        me.errorIndicator.selectTab(activeInfo.tabId);
    };

    me.onTabRemoved = function (tabId, changeInfo, tabInfo) {
        me.errorIndicator.removeTabErrors(tabId);
    };

    me.onTabUpdated = function (tabId, changeInfo, tabInfo) {
        const tabReloaded = changeInfo.status == 'loading';
        if (tabReloaded) {
            me.errorIndicator.removeTabErrors(tabId);
        }
    };

    me.onWindowFocusChanged = function () {
        me.updateActiveTab();
    };

    me.webRequestCompleted = function (details) {
        const notRelatedToTab = (details.tabId == -1);
        const notHttpError = (details.statusCode < 400);

        if (notRelatedToTab || notHttpError) {
            return;
        }

        const tabError = new TabError({
            tabId: details.tabId,
            message: details.statusLine,
            messageType: 'web-error',
            source: details.url,
            timeStamp: me.dateProvider.now()
        });

        me.errorIndicator.addError(tabError);
    };

    me.updateActiveTab = function () {
        const selectTab = function (tabs) {
            const activeTab = tabs[0];
            me.errorIndicator.selectTab(activeTab.id);
        };

        const gettingActiveTab = me.browser.tabs.query({ active: true, currentWindow: true });
        gettingActiveTab.then(selectTab);
    };

    me.updateActiveTab();
    me.browser.runtime.onMessage.addListener(me.onMessage);
    me.browser.tabs.onActivated.addListener(me.onTabActivated);
    me.browser.tabs.onRemoved.addListener(me.onTabRemoved);
    me.browser.tabs.onUpdated.addListener(me.onTabUpdated);
    me.browser.windows.onFocusChanged.addListener(me.onWindowFocusChanged);
    me.browser.webRequest.onCompleted.addListener(me.webRequestCompleted, { urls: ['<all_urls>'] });
}