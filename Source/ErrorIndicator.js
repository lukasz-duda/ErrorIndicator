/// <reference path="../References.js" />

function ErrorIndicator(browser) {
    var me = this;
    me.browser = browser;

    me.errors = [];

    me.handleMessage = function (action, sender, respond) {
        var response = me[action.name](action.args);
        respond(response);
    }

    me.addError = function (error) {
        me.errors.push(error);
        me.refresh();
    }

    me.refresh = function () {
        if (me.hasErrors()) {
            me.indicateErrors();
        } else {
            me.hideErrors();
        }
    }

    me.hasErrors = function () {
        return me.errors.length > 0;
    }

    me.indicateErrors = function () {
        me.browser.browserAction.setIcon({ path: 'icons/error.svg' });
        me.browser.browserAction.setBadgeText({ text: (me.errors.length).toString() });
    }

    me.hideErrors = function () {
        me.browser.browserAction.setIcon({ path: 'icons/ok.svg' });
        me.browser.browserAction.setBadgeText({ text: '' });
    }

    me.getErrors = function () {
        return me.errors;
    }

    me.removeErrors = function () {
        me.errors = [];
        me.refresh();
    }

    me.browser.runtime.onMessage.addListener(me.handleMessage);
    var title = browser.i18n.getMessage('errorIndicatorTitle');
    me.browser.browserAction.setTitle({ title: title });
    me.refresh();
}