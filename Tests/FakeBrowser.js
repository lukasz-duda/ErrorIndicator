/// <reference path="../References.js" />

function FakeBrowser() {
    var me = this;

    me.senderTab = function (tabId) {
        me.runtime.senderTabId = tabId;
    };

    me.activateTab = function (tabId) {
        var activeInfo = { tabId: tabId };
        me.tabs.onActivatedListener(activeInfo);
    };

    me.reloadTab = function (tabId) {
        var changeInfo = { status: 'loading' };
        me.tabs.onUpdatedListener(tabId, changeInfo);
    };

    me.updateTab = function (tabId) {
        var changeInfo = { status: 'complete' };
        me.tabs.onUpdatedListener(tabId, changeInfo);
    };

    me.removeTab = function (tabId) {
        me.tabs.onRemovedListener(tabId);
    };

    me.tabs = {
        onActivatedListener: null,

        onUpdatedListener: null,

        onRemovedListener: null,

        onActivated: {
            addListener: function (listener) {
                me.tabs.onActivatedListener = listener;
            }
        },

        onUpdated: {
            addListener: function (listener) {
                me.tabs.onUpdatedListener = listener;
            }
        },

        onRemoved: {
            addListener: function (listener) {
                me.tabs.onRemovedListener = listener;
            }
        }
    };

    me.runtime = {
        messageListener: null,

        senderTabId: 1,

        onMessage: {
            addListener: function (listener) {
                me.runtime.messageListener = listener;
            }
        },

        sendMessage: function (message) {
            var sender = {
                tab: { id: me.runtime.senderTabId }
            };

            return new FakeSynchronousPromise(function (resolve, reject) {
                me.runtime.messageListener(message, sender, resolve);
            });
        }
    };

    me.browserAction = {
        iconDetails: null,

        badgeTextDetails: null,

        titleDetails: null,

        setIcon: function (iconDetails) {
            me.browserAction.iconDetails = iconDetails;
        },

        getIcon: function () {
            return me.browserAction.iconDetails;
        },

        setBadgeText: function (badgeTextDetails) {
            fakeBrowser.browserAction.badgeTextDetails = badgeTextDetails;
        },

        getBadgeText: function () {
            return fakeBrowser.browserAction.badgeTextDetails;
        },

        setTitle: function (titleDetails) {
            fakeBrowser.browserAction.titleDetails = titleDetails;
        },

        getTitle: function () {
            return fakeBrowser.browserAction.titleDetails;
        }
    };

    me.i18n = {
        getMessage: function (messageName, substitusion) {
            var substitutionText = substitusion || '';
            return messageName + substitutionText + "Translation";
        }
    };

    me.storage = {
        local: {
            items: {},

            get: function () {
                return new FakeSynchronousPromise(function (resolve, reject) {
                    resolve(me.storage.local.items);
                });
            },

            set: function (items) {
                return new FakeSynchronousPromise(function (resolve, reject) {
                    me.storage.local.items = items;
                    resolve();
                });
            }
        }
    };
};