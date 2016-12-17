﻿/// <reference path="../References.js" />

function Report(container, browser) {
    var me = this;
    me.container = container;
    me.browser = browser;

    me.show = function () {
        me.showRemoveErrorsButton();
        var action = { name: 'getErrors' };
        var sending = me.browser.runtime.sendMessage(action);
        sending.then(me.showErrors);
    }

    me.showRemoveErrorsButton = function () {
        var removeErrorsButton = document.createElement('button');
        removeErrorsButton.innerText = me.browser.i18n.getMessage('removeErrorsButton');
        removeErrorsButton.onclick = me.removeErrors;
        me.container.appendChild(removeErrorsButton);
    }

    me.showErrors = function (errors) {
        var errorList = document.createElement('OL');
        errorList.classList.add('error-list');

        for (var i = 0; i < errors.length; i++) {
            var error = errors[i];
            me.addError(errorList, error);
        }

        me.container.appendChild(errorList);
    }

    me.addError = function (errorList, error) {
        var listItem = document.createElement('LI');

        var errorMessage = document.createElement('SPAN');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = error.message;
        listItem.appendChild(errorMessage);

        var errorSource = document.createElement('SPAN');
        errorSource.classList.add('error-source');
        errorSource.textContent = me.formatErrorSource(error);
        listItem.appendChild(errorSource);

        errorList.appendChild(listItem);
    }

    me.formatErrorSource = function (error) {
        var delimiter = ':';
        return error.source + delimiter + error.lineNumber + delimiter + error.columnNumber;
    }

    me.removeErrors = function () {
        var action = { name: 'removeErrors' };
        browser.runtime.sendMessage(action);
        var errorList = me.container.querySelector('OL');
        while (errorList.firstChild) {
            errorList.removeChild(errorList.firstChild);
        }
    }
}