/// <reference path="../References.js" />

function ErrorIndicator(browser, dateProvider) {
    var me = this;
    me.browser = browser;
    me.dateProvider = dateProvider;
    me.tabId = null;

    me.errors = [];

    me.tabActivated = function (activeInfo) {
        me.tabId = activeInfo.tabId;
        me.refresh();
    };

    me.browser.tabs.onActivated.addListener(me.tabActivated);

    me.handleUpdated = function (tabId, changeInfo, tabInfo) {
        if (changeInfo.status == 'loading') {
            me.removeTabErrors(tabId);
            me.refresh();
        }
    };

    me.removeTabErrors = function (tabId) {
        var remainingErrors = [];

        for (var i = 0; i < me.errors.length; i++) {
            var error = me.errors[i];
            if (error.tabId != me.tabId) {
                remainingErrors.push(error);
            }
        }

        me.errors = remainingErrors;
    };

    me.browser.tabs.onUpdated.addListener(me.handleUpdated);

    me.handleMessage = function (action, sender, respond) {
        var response = me[action.name](action.args, sender);
        respond(response);
    };

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
        me.errors.push(error);
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

    me.hasErrors = function () {
        return me.errors.length > 0;
    };

    me.indicateErrors = function () {
        me.browser.browserAction.setIcon({ path: 'icons/error.svg' });
        me.browser.browserAction.setBadgeText({ text: me.tabErrorsCount().toString() });
    };

    me.tabErrorsCount = function () {
        return me.tabErrors().length;
    };

    me.tabErrors = function () {
        var tabErrors = [];

        for (var i = 0; i < me.errors.length; i++) {
            var error = me.errors[i];
            if (error.tabId == me.tabId) {
                tabErrors.push(error);
            }
        }

        return tabErrors;
    };

    me.hideErrors = function () {
        me.browser.browserAction.setBadgeText({ text: '' });
        var iconPath = (me.enabled) ? 'icons/ok.svg' : 'icons/disabled-ok.svg';
        me.browser.browserAction.setIcon({ path: iconPath });
    };

    me.getReport = function () {
        return {
            hasError: me.tabErrorsCount() > 0,
            errorsCount: me.tabErrorsCount(),
            errors: me.tabErrors(),
            indicatorEnabled: me.enabled
        };
    };

    me.removeErrors = function () {
        me.errors = [];
        me.refresh();
    };

    me.switchOff = function () {
        me.enabled = false;
        me.removeErrors();
        me.saveSettings();
    };

    me.saveSettings = function () {
        me.browser.storage.local.set({ enabled: me.enabled });
    };

    me.enabled = true;

    me.switchOn = function () {
        me.enabled = true;
        me.refresh();
        me.saveSettings();
    };

    me.settingsLoaded = function (settings) {
        me.enabled = (settings.enabled != null) ? settings.enabled : me.enabled;
        me.refresh();
    };

    me.browser.runtime.onMessage.addListener(me.handleMessage);
    var title = browser.i18n.getMessage('errorIndicatorTitle');
    me.browser.browserAction.setTitle({ title: title });
    var loadingSettings = me.browser.storage.local.get();
    loadingSettings.then(me.settingsLoaded);
}