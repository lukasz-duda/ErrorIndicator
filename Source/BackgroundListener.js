/// <reference path="../References.js" />

function BackgroundListener(dateProvider, browser, errorIndicator) {
    var me = this;
    me.dateProvider = dateProvider;
    me.browser = browser;
    me.errorIndicator = errorIndicator;

    me.onMessage = function (action, sender, respond) {
        var response = me[action.name](action.args, sender);
        respond(response);
    };

    me.addError = function (errorDetails, sender) {
        var tabError = new TabError({
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
        var tabReloaded = changeInfo.status == 'loading';
        if (tabReloaded) {
            me.errorIndicator.removeTabErrors(tabId);
        }
    };

    me.webRequestCompleted = function (details) {
        if (details.tabId == -1 || details.statusCode < 400) {
            return;
        }

        var tabError = new TabError({
            tabId: details.tabId
        });

        me.errorIndicator.addError(tabError);
    };

    me.browser.runtime.onMessage.addListener(me.onMessage);
    me.browser.tabs.onActivated.addListener(me.onTabActivated);
    me.browser.tabs.onRemoved.addListener(me.onTabRemoved);
    me.browser.tabs.onUpdated.addListener(me.onTabUpdated);
    me.browser.webRequest.onCompleted.addListener(me.webRequestCompleted, { urls: ['<all_urls>'] });
}