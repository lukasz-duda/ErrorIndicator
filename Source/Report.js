﻿/// <reference path="../References.js" />

function Report(container, browser) {
    var me = this;
    me.container = container;
    me.browser = browser;

    me.show = function () {
        var action = { name: 'getErrors' };
        var sending = me.browser.runtime.sendMessage(action);
        sending.then(me.reportErrors);
    };

    me.reportErrors = function (errors) {
        var errorsCount = errors.length;

        me.showHeader(errorsCount);
        me.showErrors(errors);

        var hasErrors = errorsCount > 0;
        if (hasErrors) {
            me.showRemoveErrorsButton();
        }
    };

    me.showHeader = function (errorsCount) {
        var headerSection = me.makeHeaderSection();

        me.addHeaderIcon(headerSection);
        me.addHeaderText(headerSection, errorsCount)

        me.container.appendChild(headerSection);
    };

    me.makeHeaderSection = function () {
        var headerSection = document.createElement('DIV');
        headerSection.classList.add('panel-section');
        headerSection.classList.add('panel-section-header');
        return headerSection;
    }

    me.addHeaderIcon = function (headerSection) {
        var headerIcon = document.createElement('DIV');
        headerIcon.classList.add('icon-section-header');
        headerSection.appendChild(headerIcon);
    }

    me.addHeaderText = function (headerSection, errorsCount) {
        var headerText = document.createElement('DIV');
        headerText.classList.add('header-text');
        headerText.classList.add('text-section-header');
        headerText.textContent = me.browser.i18n.getMessage('detectedErrorsCount', errorsCount);
        headerSection.appendChild(headerText);
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
    };

    me.showError = function (errorList, error) {
        var listItem = me.makeErrorListItem();

        me.addErrorIcon(listItem);
        me.addErrorText(listItem, error);
        me.addErrorShortcut(listItem);

        errorList.appendChild(listItem);
    };

    me.makeErrorListItem = function () {
        var listItem = document.createElement('DIV');
        listItem.classList.add('error-list-item');
        listItem.classList.add('panel-list-item');
        return listItem;
    };

    me.addErrorIcon = function (listItem) {
        var listItemIcon = document.createElement('DIV');
        listItemIcon.classList.add('icon');
        listItem.appendChild(listItemIcon);
    };

    me.addErrorText = function (listItem, error) {
        var listItemText = me.makeListItemText();

        me.addErrorMessage(listItemText, error);
        me.addErrorSource(listItemText, error);

        listItem.appendChild(listItemText);
    };

    me.makeListItemText = function () {
        var listItemText = document.createElement('DIV');
        listItemText.classList.add('text');
        return listItemText;
    }

    me.addErrorMessage = function (listItemText, error) {
        var errorMessage = document.createElement('DIV');
        var messageClass = error.messageType + '-message';
        errorMessage.classList.add(messageClass);
        errorMessage.textContent = error.message;
        listItemText.appendChild(errorMessage);
    }

    me.addErrorSource = function (listItemText, error) {
        var errorSource = document.createElement('DIV');
        errorSource.classList.add('error-source');
        errorSource.textContent = me.formatErrorSource(error);
        listItemText.appendChild(errorSource);
    }

    me.formatErrorSource = function (error) {
        var delimiter = ':';
        var hasErrorSource = (error.source != null);
        var errorSourceDescription = error.source + delimiter + error.lineNumber + delimiter + error.columnNumber;
        return (hasErrorSource) ? errorSourceDescription : '';
    };

    me.addErrorShortcut = function (listItem) {
        var shortcut = document.createElement('DIV');
        shortcut.classList.add('text-shortcut');
        listItem.appendChild(shortcut);
    };

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
    };

    me.removeErrors = function () {
        var action = { name: 'removeErrors' };
        var sending = browser.runtime.sendMessage(action);
        sending.then(me.refresh)
    };

    me.refresh = function () {
        me.clearContainer();
        me.show();
    };

    me.clearContainer = function () {
        while (me.container.firstChild) {
            me.container.removeChild(me.container.firstChild);
        }
    };
}