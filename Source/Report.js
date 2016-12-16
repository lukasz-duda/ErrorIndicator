/// <reference path="../References.js" />

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
        var positionDelimiter = ':';
        listItem.innerText = error.message
            + positionDelimiter + error.lineNumber
            + positionDelimiter + error.columnNumber;
        errorList.appendChild(listItem);
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