/// <reference path="../References.js" />

function ErrorIndicator(browser, dateProvider) {
    var me = this;
    me.browser = browser;
    me.dateProvider = dateProvider;

    me.enabled = true;
    me.tabId = null;
    me.allErrors = [];

    me.addError = function (errorDetails, sender) {
        if (me.disabled()) {
            return;
        }

        var error = {
            tabId: sender.tab.id,
            message: errorDetails.message,
            messageType: errorDetails.messageType,
            timeStamp: me.dateProvider.now(),
            source: errorDetails.source,
            lineNumber: errorDetails.lineNumber,
            columnNumber: errorDetails.columnNumber
        };
        me.allErrors.push(error);
        me.refresh();
    };

    me.disabled = function () {
        return !me.enabled;
    };

    me.refresh = function () {
        if (me.hasTabErrors()) {
            me.indicateErrors();
        } else {
            me.hideErrors();
        }
    };

    me.hasTabErrors = function () {
        return me.tabErrorsCount() > 0;
    };

    me.tabErrorsCount = function () {
        return me.tabErrors().length;
    };

    me.tabErrors = function () {
        var tabErrors = [];

        for (var i = 0; i < me.allErrors.length; i++) {
            var error = me.allErrors[i];
            if (error.tabId == me.tabId) {
                tabErrors.push(error);
            }
        }

        return tabErrors;
    };

    me.hasErrors = function () {
        return me.errorsCount() > 0;
    };

    me.errorsCount = function () {
        return me.errors().length;
    };

    me.errors = function () {
        return me.allErrors;
    }

    me.onTabActivated = function (activeInfo) {
        me.tabId = activeInfo.tabId;
        me.refresh();
    };

    me.onTabRemoved = function (tabId, changeInfo, tabInfo) {
        me.removeTabErrors(tabId);
    };

    me.removeTabErrors = function (tabId) {
        var removeFromTabId = tabId || me.tabId;
        var remainingErrors = [];

        for (var i = 0; i < me.allErrors.length; i++) {
            var error = me.allErrors[i];
            if (error.tabId != removeFromTabId) {
                remainingErrors.push(error);
            }
        }

        me.allErrors = remainingErrors;
        me.refresh();
    };

    me.onTabUpdated = function (tabId, changeInfo, tabInfo) {
        var tabReloaded = changeInfo.status == 'loading';
        if (tabReloaded) {
            me.removeTabErrors(tabId);
        }
    };

    me.onMessage = function (action, sender, respond) {
        var response = me[action.name](action.args, sender);
        respond(response);
    };

    me.indicateErrors = function () {
        me.browser.browserAction.setIcon({ path: 'icons/error.svg' });
        me.browser.browserAction.setBadgeText({ text: me.tabErrorsCount().toString() });
    };

    me.hideErrors = function () {
        me.browser.browserAction.setBadgeText({ text: '' });
        var iconPath = (me.enabled) ? 'icons/ok.svg' : 'icons/disabled-ok.svg';
        me.browser.browserAction.setIcon({ path: iconPath });
    };

    me.getReport = function () {
        return {
            hasError: me.hasTabErrors(),
            errorsCount: me.tabErrorsCount(),
            errors: me.tabErrors(),
            indicatorEnabled: me.enabled
        };
    };

    me.switchOff = function () {
        me.enabled = false;
        me.removeErrors();
        me.saveSettings();
    };

    me.removeErrors = function () {
        me.allErrors = [];
        me.refresh();
    };

    me.saveSettings = function () {
        me.browser.storage.local.set({ enabled: me.enabled });
    };

    me.switchOn = function () {
        me.enabled = true;
        me.refresh();
        me.saveSettings();
    };

    me.settingsLoaded = function (settings) {
        me.enabled = (settings.enabled != null) ? settings.enabled : me.enabled;
        me.refresh();
    };

    me.browser.runtime.onMessage.addListener(me.onMessage);
    me.browser.tabs.onActivated.addListener(me.onTabActivated);
    me.browser.tabs.onRemoved.addListener(me.onTabRemoved);
    me.browser.tabs.onUpdated.addListener(me.onTabUpdated);
    var title = browser.i18n.getMessage('errorIndicatorTitle');
    me.browser.browserAction.setTitle({ title: title });
    var loadingSettings = me.browser.storage.local.get();
    loadingSettings.then(me.settingsLoaded);
}