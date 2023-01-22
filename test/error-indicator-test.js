let fakeWindow = null;
let fakeBrowser = null;
let pageObserver = null;
let dateProvider = null;
let errorIndicator = null
let reportContainer = null;
let report = null;
let options = null;
let optionsContainer = null;

QUnit.module('error indicator', {
    beforeEach: function () {
        fakeWindow = new FakeWindow();
        fakeBrowser = new FakeBrowser();
        dateProvider = new DateProviderStub();
        setUpNewIndicator();
        activateTab(1);
    }
});

setUpNewIndicator = function () {
    pageObserver = new PageObserver(fakeWindow, fakeBrowser);
    errorIndicator = new ErrorIndicator(fakeBrowser);
    new BackgroundListener(dateProvider, fakeBrowser, errorIndicator);
    const testContainer = document.getElementById('qunit-fixture');
    reportContainer = document.createElement('div');
    testContainer.appendChild(reportContainer)
    report = new Report(reportContainer, fakeBrowser);
    optionsContainer = document.createElement('div');
    testContainer.appendChild(optionsContainer)
    options = new Options(optionsContainer, fakeBrowser);
}

function activateTab(tabId) {
    fakeBrowser.activateTab(tabId);
}

QUnit.test('adds error to report', function (assert) {
    fakeWindow.onerror('message 1', 'source 1', 1, 2);

    report.show();

    const errorList = reportContainer.getElementsByClassName('error-list');
    assert.equal(errorList.length, 1);
    const listItems = errorList[0].querySelectorAll('.error-list-item');
    assert.equal(listItems.length, 1);
    assertErrorListItem(assert, listItems[0], 'source 1:1:2', 'message 1');
});

function assertErrorListItem(assert, listItem, expectedSource, expectedMessage) {
    const errorSource = listItem.querySelector('.error-source');
    assert.equal(errorSource.textContent, expectedSource);
    const errorMessage = listItem.querySelector('.window-error-message');
    assert.equal(errorMessage.textContent, expectedMessage);
}

QUnit.test('adds errors to report', function (assert) {
    fakeWindow.onerror('message 1', 'source 1', 1, 2);
    fakeWindow.onerror('message 2', 'source 2', 3, 4);

    report.show();

    const errorList = reportContainer.getElementsByClassName('error-list');
    assert.equal(errorList.length, 1);
    const listItems = errorList[0].querySelectorAll('.error-list-item');
    assert.equal(listItems.length, 2);
    assertErrorListItem(assert, listItems[0], 'source 1:1:2', 'message 1');
    assertErrorListItem(assert, listItems[1], 'source 2:3:4', 'message 2');
});

QUnit.test('removes errors from report', function (assert) {
    simulateWindowError();
    simulateWindowError();

    report.show();
    report.removeErrors();

    const errorList = reportContainer.getElementsByClassName('error-list');
    assert.equal(errorList[0].childNodes.length, 0);
});

QUnit.test('without error source defined shows empty source', function (assert) {
    fakeWindow.onerror('message 1');

    report.show();

    const listItem = reportContainer.querySelector('.error-list-item');
    const errorSource = listItem.querySelector('.error-source');
    assert.equal(errorSource.textContent, '');
});

QUnit.test('indicates error', function (assert) {
    simulateWindowError();

    assertErrorIcon(assert);
});

function assertErrorIcon(assert) {
    assertIcon(assert, 'icons/error.svg');
}

function assertIcon(assert, iconPath) {
    const iconDetails = fakeBrowser.browserAction.getIcon();
    assert.equal(iconDetails.path, iconPath);
    assert.equal(iconDetails.tabId, fakeBrowser.tabs.activeTabId);
}

function simulateWindowError() {
    fakeWindow.onerror('message 1', 'source 1', 1, 2);
}

QUnit.test('shows error count', function (assert) {
    simulateWindowError();
    simulateWindowError();

    assertBadgeText(assert, '2');
});

function assertBadgeText(assert, expectedText) {
    const badgeTextDetails = fakeBrowser.browserAction.getBadgeText();
    assert.equal(badgeTextDetails.text, expectedText);
    assert.equal(badgeTextDetails.tabId, fakeBrowser.tabs.activeTabId);
}

QUnit.test('shows remove errors button', function (assert) {
    simulateWindowError();

    report.show();

    const removeErrorsButton = reportContainer.querySelector('.remove-errors-button');
    assert.equal(removeErrorsButton.innerText, 'removeErrorsButtonTranslation');
});

QUnit.test('without errors doesn\'t show remove errors button', function (assert) {
    report.show();

    assertNoRemoveErrorsButton(assert);
});

function assertNoRemoveErrorsButton(assert) {
    const removeErrorsButton = reportContainer.querySelector('.remove-errors-button');
    assert.equal(null, removeErrorsButton);
}

QUnit.test('without any error doesn\'t indicate error', function (assert) {
    assertOkIcon(assert);
    assertNoBadgeText(assert);
});

function assertOkIcon(assert) {
    assertIcon(assert, 'icons/ok.svg');
}

function assertNoBadgeText(assert) {
    assertBadgeText(assert, '');
}

QUnit.test('after errors removed doesn\'t indicate error', function (assert) {
    simulateWindowError();
    simulateWindowError();

    report.show();
    report.removeErrors();

    assertOkIcon(assert);
    assertNoBadgeText(assert);
});

QUnit.test('translates title', function (assert) {
    const titleDetails = fakeBrowser.browserAction.getTitle();
    assert.equal(titleDetails.title, 'errorIndicatorTitleTranslation');
});

QUnit.test('shows header', function (assert) {
    simulateWindowError();
    simulateWindowError();

    report.show();

    const header = reportContainer.querySelector('.header-text');
    assert.equal(header.textContent, 'detectedErrorsCount2Translation');
});

QUnit.test('reports console error message as console error', function (assert) {
    fakeWindow.console.error('console error message 1');

    report.show();

    const errorList = reportContainer.getElementsByClassName('error-list');
    assert.equal(errorList.length, 1);
    const listItems = errorList[0].querySelectorAll('.error-list-item');
    assert.equal(listItems.length, 1);
    const consoleError = listItems[0].querySelector('.console-error-message');
    assert.equal(consoleError.textContent, 'console error message 1');
});

QUnit.test('doesn\'t remove default console error handler', function (assert) {
    fakeWindow.console.error('console error message 1', '2', '3');

    assert.equal(fakeWindow.consoleErrors.length, 1);
    const consoleError = fakeWindow.consoleErrors[0];
    assert.equal(consoleError.message, 'console error message 1');
    assert.equal(consoleError.substitutionString1, '2');
    assert.equal(consoleError.substitutionString2, '3');
});

QUnit.test('shows error timestamps', function (assert) {
    dateProvider.setUpNow(new Date(2000, 0, 2, 12, 3, 4));
    simulateWindowError();
    dateProvider.setUpNow(new Date(2001, 4, 6, 13, 7, 8));
    simulateWindowError();

    report.show();

    const errorList = reportContainer.querySelector('.error-list');
    const listItems = errorList.querySelectorAll('.error-list-item');
    assert.equal(listItems.length, 2);
    const firstErrorTime = listItems[0].querySelector('.error-time-stamp');
    assert.equal(firstErrorTime.textContent, '2000-01-02 12:03:04');
    const secondErrorTime = listItems[1].querySelector('.error-time-stamp');
    assert.equal(secondErrorTime.textContent, '2001-05-06 13:07:08');
});

QUnit.test('shows switch off button', function (assert) {
    report.show();

    assertSwitchOffButton(assert);
});

function assertSwitchOffButton(assert) {
    const switchButton = reportContainer.querySelector('.switch-button');
    assert.equal(switchButton.textContent, 'switchOffButtonTranslation')
}

QUnit.test('after switching off shows switch on button', function (assert) {
    report.show();

    report.switchOff();

    assertSwitchOnButton(assert);
});

function assertSwitchOnButton(assert) {
    const switchButton = reportContainer.querySelector('.switch-button');
    assert.equal(switchButton.textContent, 'switchOnButtonTranslation')
}

QUnit.test('after switching off and switching on shows switch off button', function (assert) {
    report.show();

    report.switchOff();
    report.switchOn();

    assertSwitchOffButton(assert);
});

QUnit.test('after switching off removes errors', function (assert) {
    simulateWindowError();

    report.switchOff();

    const listItems = reportContainer.querySelectorAll('.error-list-item');
    assert.equal(listItems.length, 0);
    assertNoBadgeText(assert);
});

QUnit.test('after switching off changes icon to disabled', function (assert) {
    report.switchOff();

    assertIcon(assert, 'icons/disabled-ok.svg');
});

QUnit.test('after switching off and on shows changes icon to enabled', function (assert) {
    report.switchOff();
    report.switchOn();

    assertOkIcon(assert);
});

QUnit.test('after switching off new errors are ignored', function (assert) {
    report.switchOff();

    simulateWindowError();

    assert.notOk(errorIndicator.hasErrors());
});

QUnit.test('switch state is remembered and shared between instances', function (assert) {
    report.show();
    report.switchOff();
    setUpNewIndicator();

    report.refresh();

    assertSwitchOnButton(assert);
});