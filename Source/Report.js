/// <reference path="../References.js" />

function Report(container, browser) {
    var me = this;
    me.container = container;
    me.browser = browser;

    me.show = function () {
        var action = { name: 'getReport' };
        var sending = me.browser.runtime.sendMessage(action);
        sending.then(me.reportErrors);
    };

    me.reportErrors = function (report) {
        me.showHeader(report.errorsCount);
        me.showErrors(report.errors);
        me.showFooter(report);
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
        me.addErrorTimeStamp(listItemText, error);
        me.addErrorSource(listItemText, error);

        listItem.appendChild(listItemText);
    };

    me.makeListItemText = function () {
        var listItemText = document.createElement('DIV');
        listItemText.classList.add('text');
        return listItemText;
    };

    me.addErrorMessage = function (listItemText, error) {
        var errorMessage = document.createElement('DIV');
        var messageClass = error.messageType + '-message';
        errorMessage.classList.add(messageClass);
        errorMessage.textContent = error.message;
        listItemText.appendChild(errorMessage);
    };

    me.addErrorTimeStamp = function (listItemText, error) {
        var errorTimeStamp = document.createElement('DIV');
        errorTimeStamp.classList.add('error-time-stamp');
        errorTimeStamp.textContent = me.formatTimeStamp(error.timeStamp);
        listItemText.appendChild(errorTimeStamp);
    };

    me.formatTimeStamp = function (timeStamp) {
        var year = timeStamp.getFullYear();
        var month = me.zeroPadded(timeStamp.getMonth() + 1);
        var day = me.zeroPadded(timeStamp.getDate());
        var hour = me.zeroPadded(timeStamp.getHours());
        var minute = me.zeroPadded(timeStamp.getMinutes());
        var second = me.zeroPadded(timeStamp.getSeconds());

        return year + '-' + month + '-' + day
            + ' ' + hour + ':' + minute + ':' + second;
    }

    me.zeroPadded = function (value) {
        return (value < 10) ? '0' + value : value.toString();
    };

    me.addErrorSource = function (listItemText, error) {
        var errorSource = document.createElement('DIV');
        errorSource.classList.add('error-source');
        errorSource.textContent = me.formatErrorSource(error);
        listItemText.appendChild(errorSource);
    };

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

    me.showFooter = function (report) {
        var footer = me.makeFooter();

        if (report.hasError) {
            me.addRemoveErrorsButton(footer);
        }

        if (report.indicatorEnabled) {
            me.addSwitchOffButton(footer);
        } else {
            me.addSwitchOnButton(footer);
        }

        me.container.appendChild(footer);
    };

    me.makeFooter = function () {
        var footer = document.createElement('DIV');
        footer.classList.add('panel-section');
        footer.classList.add('panel-section-footer');
        return footer;
    };

    me.addSwitchOffButton = function (footer) {
        var switchButton = me.makeSwitchButton()
        switchButton.innerText = me.browser.i18n.getMessage('switchOffButton');
        switchButton.onclick = me.switchOff;
        footer.appendChild(switchButton);
    };

    me.makeSwitchButton = function () {
        var switchButton = document.createElement('DIV');
        switchButton.classList.add('panel-section-footer-button');
        switchButton.classList.add('switch-button');
        return switchButton;
    };

    me.switchOff = function () {
        var action = { name: 'switchOff' };
        var sending = browser.runtime.sendMessage(action);
        sending.then(me.refresh)
    };

    me.addSwitchOnButton = function (footer) {
        var switchButton = me.makeSwitchButton();
        switchButton.innerText = me.browser.i18n.getMessage('switchOnButton');
        switchButton.onclick = me.switchOn;
        footer.appendChild(switchButton);
    };

    me.switchOn = function () {
        var action = { name: 'switchOn' };
        var sending = browser.runtime.sendMessage(action);
        sending.then(me.refresh)
    }

    me.addRemoveErrorsButton = function (footer) {
        var removeErrorsButton = document.createElement('DIV');
        removeErrorsButton.classList.add('panel-section-footer-button');
        removeErrorsButton.classList.add('remove-errors-button');
        removeErrorsButton.classList.add('default');
        removeErrorsButton.innerText = me.browser.i18n.getMessage('removeErrorsButton');
        removeErrorsButton.onclick = me.removeErrors;
        footer.appendChild(removeErrorsButton);
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