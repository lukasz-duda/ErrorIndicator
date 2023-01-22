function ErrorIndicator(browser) {
    const me = this;
    me.browser = browser;

    me.enabled = true;
    me.tabId = null;
    me.allErrors = [];

    me.addError = function (tabError) {
        if (me.disabled()) {
            return;
        }

        me.allErrors.push(tabError);
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
        const tabErrors = [];

        for (let i = 0; i < me.allErrors.length; i++) {
            const error = me.allErrors[i];
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
    };

    me.selectTab = function (tabId) {
        me.tabId = tabId;
        me.refresh();
    };

    me.removeTabErrors = function (tabId) {
        const removeFromTabId = tabId || me.tabId;
        const remainingErrors = [];

        for (let i = 0; i < me.allErrors.length; i++) {
            const error = me.allErrors[i];
            if (error.tabId != removeFromTabId) {
                remainingErrors.push(error);
            }
        }

        me.allErrors = remainingErrors;
        me.refresh();
    };

    me.indicateErrors = function () {
        me.browser.browserAction.setIcon({ path: 'icons/error.svg', tabId: me.tabId });
        const badgeTextDetails = { text: me.tabErrorsCount().toString(), tabId: me.tabId };
        me.browser.browserAction.setBadgeText(badgeTextDetails);
    };

    me.hideErrors = function () {
        const iconPath = (me.enabled) ? 'icons/ok.svg' : 'icons/disabled-ok.svg';
        me.browser.browserAction.setIcon({ path: iconPath, tabId: me.tabId });
        me.browser.browserAction.setBadgeText({ text: '', tabId: me.tabId });
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

    const title = browser.i18n.getMessage('errorIndicatorTitle');
    me.browser.browserAction.setTitle({ title: title });
    const loadingSettings = me.browser.storage.local.get();
    loadingSettings.then(me.settingsLoaded);
}