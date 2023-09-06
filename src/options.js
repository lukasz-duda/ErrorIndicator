function Options(container, browser) {
    const me = this;

    me.browser = browser;
    me.container = container;

    me.errorTypes = ['web', 'console', 'window'];

    me.ignore = function (messageTypes) {
        const action = { name: 'ignore', args: messageTypes };
        me.browser.runtime.sendMessage(action);
    };

    me.updateIgnored = function () {
        const ignored = []
        me.errorTypes.forEach(errorType => {
            if (document.getElementById(errorType).checked) {
                ignored.push(errorType + '-error');
            }
        });
        me.ignore(ignored);
    };

    me.reportTabErrors = function () {
        const action = { name: 'reportTabErrors' };
        me.browser.runtime.sendMessage(action);
    };

    me.reportAllErrors = function () {
        const action = { name: 'reportAllErrors' };
        me.browser.runtime.sendMessage(action);
    };

    me.settingsLoaded = function (settings) {
        const tabErrors = settings.useTabs ?? true;
        document.getElementById('tabErrors').checked = tabErrors;
        document.getElementById('allErrors').checked = !tabErrors;

        const ignored = settings.ignored ?? [];
        me.errorTypes.forEach(errorType => {
            document.getElementById(errorType).checked = ignored.includes(errorType + '-error');
        });
    };

    me.show = function () {
        me.addReport(me.container);
        me.addIgnoredErrors(me.container);
    };

    me.addReport = function (container) {
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.innerText = me.browser.i18n.getMessage('report');
        me.addReportKind('tabErrors', me.reportTabErrors, fieldset);
        me.addReportKind('allErrors', me.reportAllErrors, fieldset);
        fieldset.appendChild(legend);
        container.appendChild(fieldset);
    };

    me.addReportKind = function (reportKindId, onClick, fieldset) {
        const label = document.createElement('label');
        label.innerText = me.browser.i18n.getMessage(reportKindId);
        const radioButton = document.createElement('input');
        radioButton.id = reportKindId;
        radioButton.type = 'radio';
        radioButton.name = 'reportKind';
        radioButton.onclick = onClick;
        label.appendChild(radioButton);
        fieldset.appendChild(label);
    };

    me.addIgnoredErrors = function (container) {
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.innerText = me.browser.i18n.getMessage('ignoreErrorsTitle');
        fieldset.appendChild(legend);
        me.errorTypes.forEach(errorType => me.addIgnoredErrorType(errorType, fieldset));
        container.appendChild(fieldset);
    };

    me.addIgnoredErrorType = function (errorType, fieldset) {
        const label = document.createElement('label');
        const startUpperCaseErrorType = errorType.charAt(0).toUpperCase() + errorType.slice(1);
        const messageId = `ignore${startUpperCaseErrorType}ErrorLabel`;
        label.innerText = me.browser.i18n.getMessage(messageId)
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = errorType;
        checkbox.onclick = me.updateIgnored;
        label.appendChild(checkbox);
        fieldset.appendChild(label);
        const newLine = document.createElement('br');
        fieldset.appendChild(newLine);
    };

    me.show();
    const loadingSettings = me.browser.storage.local.get();
    loadingSettings.then(me.settingsLoaded);
}