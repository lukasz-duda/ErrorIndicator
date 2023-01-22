var fakeWindow = null;
var fakeBrowser = null;
var pageObserver = null;
var dateProvider = null;
var errorIndicator = null
var reportContainer = null;
var report = null;

QUnit.module('error indicator', {
    beforeEach: function () {
        fakeBrowser = new FakeBrowser();
        fakeWindow = new FakeWindow();
        dateProvider = new DateProviderStub();
        setUpNewIndicator();
        activateTab(1);
    }
});

setUpNewIndicator = function () {
    pageObserver = new PageObserver(fakeWindow, fakeBrowser);
    errorIndicator = new ErrorIndicator(fakeBrowser);
    var backgroundListener = new BackgroundListener(dateProvider, fakeBrowser, errorIndicator);
    reportContainer = document.getElementById('qunit-fixture');
    report = new Report(reportContainer, fakeBrowser);
}

function activateTab(tabId) {
    fakeBrowser.activateTab(tabId);
}

QUnit.test('adds error to report', function (assert) {
    fakeWindow.onerror('message 1', 'source 1', 1, 2);

    report.show();

    var errorList = reportContainer.getElementsByClassName('error-list');
    assert.equal(errorList.length, 1);
    var listItems = errorList[0].querySelectorAll('.error-list-item');
    assert.equal(listItems.length, 1);
    assertErrorListItem(assert, listItems[0], 'source 1:1:2', 'message 1');
});

function assertErrorListItem(assert, listItem, expectedSource, expectedMessage) {
    var errorSource = listItem.querySelector('.error-source');
    assert.equal(errorSource.textContent, expectedSource);
    var errorMessage = listItem.querySelector('.error-message');
    assert.equal(errorMessage.textContent, expectedMessage);
}

QUnit.test('adds errors to report', function (assert) {
    fakeWindow.onerror('message 1', 'source 1', 1, 2);
    fakeWindow.onerror('message 2', 'source 2', 3, 4);

    report.show();

    var errorList = reportContainer.getElementsByClassName('error-list');
    assert.equal(errorList.length, 1);
    var listItems = errorList[0].querySelectorAll('.error-list-item');
    assert.equal(listItems.length, 2);
    assertErrorListItem(assert, listItems[0], 'source 1:1:2', 'message 1');
    assertErrorListItem(assert, listItems[1], 'source 2:3:4', 'message 2');
});

QUnit.test('removes errors from report', function (assert) {
    simulateError();
    simulateError();

    report.show();
    report.removeErrors();

    var errorList = reportContainer.getElementsByClassName('error-list');
    assert.equal(errorList[0].childNodes.length, 0);
});

QUnit.test('without error source defined shows empty source', function (assert) {
    fakeWindow.onerror('message 1');

    report.show();

    var listItem = reportContainer.querySelector('.error-list-item');
    var errorSource = listItem.querySelector('.error-source');
    assert.equal(errorSource.textContent, '');
});

QUnit.test('indicates error', function (assert) {
    simulateError();

    assertErrorIcon(assert);
});

function assertErrorIcon(assert) {
    assertIcon(assert, 'icons/error.svg');
}

function assertIcon(assert, iconPath) {
    var iconDetails = fakeBrowser.browserAction.getIcon();
    assert.equal(iconDetails.path, iconPath);
    assert.equal(iconDetails.tabId, fakeBrowser.tabs.activeTabId);
}

function simulateError() {
    fakeWindow.onerror('message 1', 'source 1', 1, 2);
}

QUnit.test('shows error count', function (assert) {
    simulateError();
    simulateError();

    assertBadgeText(assert, '2');
});

function assertBadgeText(assert, expectedText) {
    var badgeTextDetails = fakeBrowser.browserAction.getBadgeText();
    assert.equal(badgeTextDetails.text, expectedText);
    assert.equal(badgeTextDetails.tabId, fakeBrowser.tabs.activeTabId);
}

QUnit.test('shows remove errors button', function (assert) {
    simulateError();

    report.show();

    var removeErrorsButton = reportContainer.querySelector('.remove-errors-button');
    assert.equal(removeErrorsButton.innerText, 'removeErrorsButtonTranslation');
});

QUnit.test('without errors doesn\'t show remove errors button', function (assert) {
    report.show();

    assertNoRemoveErrorsButton(assert);
});

function assertNoRemoveErrorsButton(assert) {
    var removeErrorsButton = reportContainer.querySelector('.remove-errors-button');
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
    simulateError();
    simulateError();

    report.show();
    report.removeErrors();

    assertOkIcon(assert);
    assertNoBadgeText(assert);
});

QUnit.test('translates title', function (assert) {
    var titleDetails = fakeBrowser.browserAction.getTitle();
    assert.equal(titleDetails.title, 'errorIndicatorTitleTranslation');
});

QUnit.test('shows header', function (assert) {
    simulateError();
    simulateError();

    report.show();

    var header = reportContainer.querySelector('.header-text');
    assert.equal(header.textContent, 'detectedErrorsCount2Translation');
});

QUnit.test('reports console error message as user error', function (assert) {
    fakeWindow.console.error('console error message 1');

    report.show();

    var errorList = reportContainer.getElementsByClassName('error-list');
    assert.equal(errorList.length, 1);
    var listItems = errorList[0].querySelectorAll('.error-list-item');
    assert.equal(listItems.length, 1);
    var userError = listItems[0].querySelector('.user-error-message');
    assert.equal(userError.textContent, 'console error message 1');
});

QUnit.test('doesn\'t remove default console error handler', function (assert) {
    fakeWindow.console.error('console error message 1', '2', '3');

    assert.equal(fakeWindow.consoleErrors.length, 1);
    var consoleError = fakeWindow.consoleErrors[0];
    assert.equal(consoleError.message, 'console error message 1');
    assert.equal(consoleError.substitutionString1, '2');
    assert.equal(consoleError.substitutionString2, '3');
});

QUnit.test('shows error timestamps', function (assert) {
    dateProvider.setUpNow(new Date(2000, 0, 2, 12, 3, 4));
    simulateError();
    dateProvider.setUpNow(new Date(2001, 4, 6, 13, 7, 8));
    simulateError();

    report.show();

    var errorList = reportContainer.querySelector('.error-list');
    var listItems = errorList.querySelectorAll('.error-list-item');
    assert.equal(listItems.length, 2);
    var firstErrorTime = listItems[0].querySelector('.error-time-stamp');
    assert.equal(firstErrorTime.textContent, '2000-01-02 12:03:04');
    var secondErrorTime = listItems[1].querySelector('.error-time-stamp');
    assert.equal(secondErrorTime.textContent, '2001-05-06 13:07:08');
});

QUnit.test('shows switch off button', function (assert) {
    report.show();

    assertSwitchOffButton(assert);
});

function assertSwitchOffButton(assert) {
    var switchButton = reportContainer.querySelector('.switch-button');
    assert.equal(switchButton.textContent, 'switchOffButtonTranslation')
}

QUnit.test('after switching off shows switch on button', function (assert) {
    report.show();

    report.switchOff();

    assertSwitchOnButton(assert);
});

function assertSwitchOnButton(assert) {
    var switchButton = reportContainer.querySelector('.switch-button');
    assert.equal(switchButton.textContent, 'switchOnButtonTranslation')
}

QUnit.test('after switching off and switching on shows switch off button', function (assert) {
    report.show();

    report.switchOff();
    report.switchOn();

    assertSwitchOffButton(assert);
});

QUnit.test('after switching off removes errors', function (assert) {
    simulateError();

    report.switchOff();

    var listItems = reportContainer.querySelectorAll('.error-list-item');
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

    simulateError();

    assert.notOk(errorIndicator.hasErrors());
});

QUnit.test('switch state is remembered and shared between instances', function (assert) {
    report.show();
    report.switchOff();
    setUpNewIndicator();

    report.refresh();

    assertSwitchOnButton(assert);
});