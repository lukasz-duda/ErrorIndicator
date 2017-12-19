/// <reference path="../References.js" />

function BackgroundListener(browser, errorIndicator) {
    var me = this;
    me.browser = browser;
    me.errorIndicator = errorIndicator;

    me.onMessage = function (action, sender, respond) {
        var response = me[action.name](action.args, sender);
        respond(response);
    };

    me.addError = function (errorDetails, sender) {
        me.errorIndicator.addError(errorDetails, sender.tab.id);
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

    me.browser.runtime.onMessage.addListener(me.onMessage);
    me.browser.tabs.onActivated.addListener(me.onTabActivated);
    me.browser.tabs.onRemoved.addListener(me.onTabRemoved);
    me.browser.tabs.onUpdated.addListener(me.onTabUpdated);
}