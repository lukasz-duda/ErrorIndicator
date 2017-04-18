/// <reference path="../References.js" />

function ErrorIndicator(browser, dateProvider) {
    var me = this;
    me.browser = browser;
    me.dateProvider = dateProvider;

    me.errors = [];

    me.handleMessage = function (action, sender, respond) {
        var response = me[action.name](action.args);
        respond(response);
    };

    me.addError = function (errorDetails) {
        if (me.disabled()) {
            return;
        }

        var error = {
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
    }

    me.refresh = function () {
        if (me.hasErrors()) {
            me.indicateErrors();
        } else {
            me.hideErrors();
        }
    };

    me.hasErrors = function () {
        return me.errors.length > 0;
    };

    me.indicateErrors = function () {
        me.browser.browserAction.setIcon({ path: 'icons/error.svg' });
        me.browser.browserAction.setBadgeText({ text: (me.errors.length).toString() });
    };

    me.hideErrors = function () {
        me.browser.browserAction.setBadgeText({ text: '' });
        var iconPath = (me.enabled) ? 'icons/ok.svg' : 'icons/disabled-ok.svg';
        me.browser.browserAction.setIcon({ path: iconPath });
    };

    me.getReport = function () {
        return {
            hasError: me.errors.length > 0,
            errorsCount: me.errors.length,
            errors: me.errors,
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
    }

    me.enabled = true;

    me.switchOn = function () {
        me.enabled = true;
        me.refresh();
        me.saveSettings();
    };

    me.settingsLoaded = function (settings) {
        me.enabled = (settings.enabled != null) ? settings.enabled : me.enabled;
        me.refresh();
    }

    me.browser.runtime.onMessage.addListener(me.handleMessage);
    var title = browser.i18n.getMessage('errorIndicatorTitle');
    me.browser.browserAction.setTitle({ title: title });
    var loadingSettings = me.browser.storage.local.get();
    loadingSettings.then(me.settingsLoaded);
}