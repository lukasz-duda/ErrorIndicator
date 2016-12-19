/// <reference path="../References.js" />

var fakeBrowser = {
    runtime: {
        messageListener: null,

        onMessage: {
            addListener: function (listener) {
                fakeBrowser.runtime.messageListener = listener;
            }
        },

        sendMessage: function (message) {
            var sender = null;

            return new FakeSynchronousPromise(function (resolve, reject) {
                fakeBrowser.runtime.messageListener(message, sender, resolve);
            });
        }
    },

    browserAction: {
        iconDetails: null,

        badgeTextDetails: null,

        titleDetails: null,

        setIcon: function (iconDetails) {
            fakeBrowser.browserAction.iconDetails = iconDetails;
        },

        getIcon: function () {
            return fakeBrowser.browserAction.iconDetails;
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
    },

    i18n: {
        getMessage: function (messageName, substitusion) {
            var substitutionText = substitusion || '';
            return messageName + substitutionText + "Translation";
        }
    }
};