function ErrorIndicator(browser) {
    const me = this;
    me.browser = browser;

    me.enabled = true;
    me.ignored = [];
    me.useTabs = true;
    me.tabId = null;
    me.allErrors = [];

    me.addError = function (tabError) {
        if (me.disabled()) {
            return;
        }

        if (me.ignored.includes(tabError.messageType)) {
            return;
        }

        me.allErrors.push(tabError);
        me.refresh();
    };

    me.disabled = function () {
        return !me.enabled;
    };

    me.refresh = function () {
        const hasErrors = me.useTabs ? me.hasTabErrors() : me.hasErrors();
        if (hasErrors) {
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
        return me.errors().filter(error => error.tabId === me.tabId);
    };

    me.hasErrors = function () {
        return me.errorsCount() > 0;
    };

    me.errorsCount = function () {
        return me.errors().length;
    };

    me.errors = function () {
        return me.allErrors.filter((error) => !me.ignored.includes(error.messageType));
    };

    me.selectTab = function (tabId) {
        me.tabId = tabId;
        me.refresh();
    };

    me.removeErrors = function () {
        if (me.useTabs) {
            me.removeTabErrors();
        } else {
            me.removeAllErrors();
        }
    };

    me.removeTabErrors = function (tabId) {
        const removeFromTabId = tabId || me.tabId;
        me.allErrors = me.allErrors.filter(error => error.tabId !== removeFromTabId);
        me.refresh();
    };

    me.indicateErrors = function () {
        const count = me.useTabs ? me.tabErrorsCount() : me.errorsCount();
        me.browser.browserAction.setIcon({ path: 'icons/error.svg', tabId: me.tabId });
        const badgeTextDetails = { text: count.toString(), tabId: me.tabId };
        me.browser.browserAction.setBadgeText(badgeTextDetails);
    };

    me.hideErrors = function () {
        const iconPath = (me.enabled) ? 'icons/ok.svg' : 'icons/disabled-ok.svg';
        me.browser.browserAction.setIcon({ path: iconPath, tabId: me.tabId });
        me.browser.browserAction.setBadgeText({ text: '', tabId: me.tabId });
    };

    me.getReport = function () {
        return me.useTabs ? me.getTabReport() : me.getAllErrorsReport();
    };

    me.getTabReport = function () {
        return {
            hasError: me.hasTabErrors(),
            errorsCount: me.tabErrorsCount(),
            errors: me.tabErrors(),
            indicatorEnabled: me.enabled
        };
    };

    me.getAllErrorsReport = function () {
        return {
            hasError: me.hasErrors(),
            errorsCount: me.errorsCount(),
            errors: me.errors(),
            indicatorEnabled: me.enabled
        };
    };

    me.switchOff = function () {
        me.enabled = false;
        me.removeAllErrors();
        me.saveSettings();
    };

    me.removeAllErrors = function () {
        me.allErrors = [];
        me.refresh();
    };

    me.saveSettings = function () {
        me.browser.storage.local.set({
            enabled: me.enabled,
            ignored: me.ignored,
            useTabs: me.useTabs
        });
    };

    me.switchOn = function () {
        me.enabled = true;
        me.refresh();
        me.saveSettings();
    };

    me.ignore = function (messageTypes) {
        me.ignored = messageTypes;
        me.saveSettings();
        me.refresh();
    };

    me.reportTabErrors = function () {
        me.useTabs = true;
        me.saveSettings();
        me.refresh();
    };

    me.reportAllErrors = function () {
        me.useTabs = false;
        me.saveSettings();
        me.refresh();
    };

    me.settingsLoaded = function (settings) {
        me.enabled = (settings.enabled != null) ? settings.enabled : me.enabled;
        me.ignored = (settings.ignored != null) ? settings.ignored : me.ignored;
        me.useTabs = (settings.useTabs != null) ? settings.useTabs : me.useTabs;
        me.refresh();
    };

    const title = browser.i18n.getMessage('errorIndicatorTitle');
    me.browser.browserAction.setTitle({ title: title });
    const loadingSettings = me.browser.storage.local.get();
    loadingSettings.then(me.settingsLoaded);
}