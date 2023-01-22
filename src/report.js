function Report(container, browser) {
    const me = this;
    me.container = container;
    me.browser = browser;

    me.show = function () {
        const action = { name: 'getReport' };
        const sending = me.browser.runtime.sendMessage(action);
        sending.then(me.reportErrors);
    };

    me.reportErrors = function (report) {
        me.showHeader(report.errorsCount);
        me.showErrors(report.errors);
        me.showFooter(report);
    };

    me.showHeader = function (errorsCount) {
        const headerSection = me.makeHeaderSection();

        me.addHeaderIcon(headerSection);
        me.addHeaderText(headerSection, errorsCount)

        me.container.appendChild(headerSection);
    };

    me.makeHeaderSection = function () {
        const headerSection = document.createElement('DIV');
        headerSection.classList.add('panel-section');
        headerSection.classList.add('panel-section-header');
        return headerSection;
    };

    me.addHeaderIcon = function (headerSection) {
        const headerIcon = document.createElement('DIV');
        headerIcon.classList.add('icon-section-header');
        headerSection.appendChild(headerIcon);
    };

    me.addHeaderText = function (headerSection, errorsCount) {
        const headerText = document.createElement('DIV');
        headerText.classList.add('header-text');
        headerText.classList.add('text-section-header');
        headerText.textContent = me.browser.i18n.getMessage('detectedErrorsCount', errorsCount);
        headerSection.appendChild(headerText);
    };

    me.showErrors = function (errors) {
        const errorList = document.createElement('DIV');
        errorList.classList.add('panel-section');
        errorList.classList.add('panel-section-list');
        errorList.classList.add('error-list');

        for (let i = 0; i < errors.length; i++) {
            const error = errors[i];
            me.showError(errorList, error);
        }

        me.container.appendChild(errorList);
    };

    me.showError = function (errorList, error) {
        const listItem = me.makeErrorListItem();

        me.addErrorIcon(listItem);
        me.addErrorText(listItem, error);
        me.addErrorShortcut(listItem);

        errorList.appendChild(listItem);
    };

    me.makeErrorListItem = function () {
        const listItem = document.createElement('DIV');
        listItem.classList.add('error-list-item');
        listItem.classList.add('panel-list-item');
        return listItem;
    };

    me.addErrorIcon = function (listItem) {
        const listItemIcon = document.createElement('DIV');
        listItemIcon.classList.add('icon');
        listItem.appendChild(listItemIcon);
    };

    me.addErrorText = function (listItem, error) {
        const listItemText = me.makeListItemText();

        me.addErrorMessage(listItemText, error);
        me.addErrorTimeStamp(listItemText, error);
        me.addErrorSource(listItemText, error);

        listItem.appendChild(listItemText);
    };

    me.makeListItemText = function () {
        const listItemText = document.createElement('DIV');
        listItemText.classList.add('text');
        return listItemText;
    };

    me.addErrorMessage = function (listItemText, error) {
        const errorMessage = document.createElement('DIV');
        const messageClass = error.messageType + '-message';
        errorMessage.classList.add(messageClass);
        errorMessage.textContent = error.message;
        listItemText.appendChild(errorMessage);
    };

    me.addErrorTimeStamp = function (listItemText, error) {
        const errorTimeStamp = document.createElement('DIV');
        errorTimeStamp.classList.add('error-time-stamp');
        errorTimeStamp.textContent = me.formatTimeStamp(error.timeStamp);
        listItemText.appendChild(errorTimeStamp);
    };

    me.formatTimeStamp = function (timeStamp) {
        const year = timeStamp.getFullYear();
        const month = me.zeroPadded(timeStamp.getMonth() + 1);
        const day = me.zeroPadded(timeStamp.getDate());
        const hour = me.zeroPadded(timeStamp.getHours());
        const minute = me.zeroPadded(timeStamp.getMinutes());
        const second = me.zeroPadded(timeStamp.getSeconds());

        return year + '-' + month + '-' + day
            + ' ' + hour + ':' + minute + ':' + second;
    };

    me.zeroPadded = function (value) {
        return (value < 10) ? '0' + value : value.toString();
    };

    me.addErrorSource = function (listItemText, error) {
        const errorSource = document.createElement('DIV');
        errorSource.classList.add('error-source');
        errorSource.textContent = me.formatErrorSource(error);
        listItemText.appendChild(errorSource);
    };

    me.formatErrorSource = function (error) {
        const hasNoErrorSource = (error.source == null);
        if (hasNoErrorSource) {
            return '';
        }

        const delimiter = ':';
        const hasLineNumber = (error.lineNumber != null);

        return (hasLineNumber) ?
            error.source + delimiter + error.lineNumber + delimiter + error.columnNumber :
            error.source;
    };

    me.addErrorShortcut = function (listItem) {
        const shortcut = document.createElement('DIV');
        shortcut.classList.add('text-shortcut');
        listItem.appendChild(shortcut);
    };

    me.showFooter = function (report) {
        const footer = me.makeFooter();

        if (report.indicatorEnabled) {
            me.addSwitchOffButton(footer);
        } else {
            me.addSwitchOnButton(footer);
        }

        if (report.hasError) {
            me.addRemoveErrorsButton(footer);
        }

        me.container.appendChild(footer);
    };

    me.makeFooter = function () {
        const footer = document.createElement('DIV');
        footer.classList.add('panel-section');
        footer.classList.add('panel-section-footer');
        return footer;
    };

    me.addSwitchOffButton = function (footer) {
        const switchButton = me.makeSwitchButton()
        switchButton.innerText = me.browser.i18n.getMessage('switchOffButton');
        switchButton.onclick = me.switchOff;
        footer.appendChild(switchButton);
    };

    me.makeSwitchButton = function () {
        const switchButton = document.createElement('DIV');
        switchButton.classList.add('panel-section-footer-button');
        switchButton.classList.add('switch-button');
        return switchButton;
    };

    me.switchOff = function () {
        const action = { name: 'switchOff' };
        const sending = browser.runtime.sendMessage(action);
        sending.then(me.refresh)
    };

    me.addSwitchOnButton = function (footer) {
        const switchButton = me.makeSwitchButton();
        switchButton.innerText = me.browser.i18n.getMessage('switchOnButton');
        switchButton.onclick = me.switchOn;
        footer.appendChild(switchButton);
    };

    me.switchOn = function () {
        const action = { name: 'switchOn' };
        const sending = browser.runtime.sendMessage(action);
        sending.then(me.refresh)
    };

    me.addRemoveErrorsButton = function (footer) {
        const removeErrorsButton = document.createElement('DIV');
        removeErrorsButton.classList.add('panel-section-footer-button');
        removeErrorsButton.classList.add('remove-errors-button');
        removeErrorsButton.classList.add('default');
        removeErrorsButton.innerText = me.browser.i18n.getMessage('removeErrorsButton');
        removeErrorsButton.onclick = me.removeErrors;
        footer.appendChild(removeErrorsButton);
    };

    me.removeErrors = function () {
        const action = { name: 'removeTabErrors' };
        const sending = browser.runtime.sendMessage(action);
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