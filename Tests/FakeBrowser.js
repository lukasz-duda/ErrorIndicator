/// <reference path="../References.js" />

function FakeBrowser() {
    var me = this;

    me.runtime = {
        messageListener: null,

        onMessage: {
            addListener: function (listener) {
                me.runtime.messageListener = listener;
            }
        },

        sendMessage: function (message) {
            var sender = null;

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