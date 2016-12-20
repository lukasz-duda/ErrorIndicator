/// <reference path="../References.js" />

function Report(container, browser) {
    var me = this;
    me.container = container;
    me.browser = browser;

    me.show = function () {
        var action = { name: 'getErrors' };
        var sending = me.browser.runtime.sendMessage(action);
        sending.then(me.reportErrors);
    }

    me.reportErrors = function (errors) {
        var errorsCount = errors.length;

        me.showHeader(errorsCount);
        me.showErrors(errors);

        var hasErrors = errorsCount > 0;
        if (hasErrors) {
            me.showRemoveErrorsButton();
        }
    }

    me.showHeader = function (errorsCount) {
        var headerSection = document.createElement('DIV');
        headerSection.classList.add('panel-section');
        headerSection.classList.add('panel-section-header');

        var headerIcon = document.createElement('DIV');
        headerIcon.classList.add('icon-section-header');
        headerSection.appendChild(headerIcon);

        var headerText = document.createElement('DIV');
        headerText.classList.add('header-text');
        headerText.classList.add('text-section-header');
        headerText.textContent = me.browser.i18n.getMessage('indicatedErrorsCount', errorsCount);
        headerSection.appendChild(headerText);

        me.container.appendChild(headerSection);
    }

    me.showErrors = function (errors) {
        var errorList = document.createElement('DIV');
        errorList.classList.add('panel-section');
        errorList.classList.add('panel-section-list');
        errorList.classList.add('error-list');

        for (var i = 0; i < errors.length; i++) {
            var error = errors[i];
            me.showError(errorList, error);
        }

        me.container.appendChild(errorList);
    }

    me.showError = function (errorList, error) {
        var listItem = document.createElement('DIV');
        listItem.classList.add('error-list-item');
        listItem.classList.add('panel-list-item');

        var listItemIcon = document.createElement('DIV');
        listItemIcon.classList.add('icon');
        listItem.appendChild(listItemIcon);

        var listItemText = document.createElement('DIV');
        listItemText.classList.add('text');

        var errorMessage = document.createElement('DIV');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = error.message;
        listItemText.appendChild(errorMessage);

        var errorSource = document.createElement('DIV');
        errorSource.classList.add('error-source');
        errorSource.textContent = me.formatErrorSource(error);
        listItemText.appendChild(errorSource);
        listItem.appendChild(listItemText);

        var shortcut = document.createElement('DIV');
        shortcut.classList.add('text-shortcut');
        listItem.appendChild(shortcut);

        errorList.appendChild(listItem);
    }

    me.formatErrorSource = function (error) {
        var delimiter = ':';
        return error.source + delimiter + error.lineNumber + delimiter + error.columnNumber;
    }

    me.showRemoveErrorsButton = function () {
        var footer = document.createElement('DIV');
        footer.classList.add('panel-section');
        footer.classList.add('panel-section-footer');

        var removeErrorsButton = document.createElement('DIV');
        removeErrorsButton.classList.add('panel-section-footer-button');
        removeErrorsButton.classList.add('remove-errors-button');
        removeErrorsButton.innerText = me.browser.i18n.getMessage('removeErrorsButton');
        removeErrorsButton.onclick = me.removeErrors;
        footer.appendChild(removeErrorsButton);

        me.container.appendChild(footer);
    }

    me.removeErrors = function () {
        var action = { name: 'removeErrors' };
        var sending = browser.runtime.sendMessage(action);
        sending.then(me.refresh)
    }

    me.refresh = function () {
        me.clearContainer();
        me.show();
    }

    me.clearContainer = function () {
        while (me.container.firstChild) {
            me.container.removeChild(me.container.firstChild);
        }
    }
}