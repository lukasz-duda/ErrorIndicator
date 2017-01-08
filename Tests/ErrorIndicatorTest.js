﻿/// <reference path="../References.js" />

var fakeWindow = null;
var fakeBrowser = null;
var errorObserver = null;
var dateProvider = null;
var errorIndicator = null
var reportContainer = null;
var report = null;

QUnit.module('ErrorIndicator', {
    beforeEach: function () {
        fakeWindow = new FakeWindow();
        fakeBrowser = new FakeBrowser();
        errorObserver = new ErrorObserver(fakeWindow, fakeBrowser);
        dateProvider = new DateProviderStub();
        errorIndicator = new ErrorIndicator(fakeBrowser, dateProvider);
        reportContainer = document.getElementById('qunit-fixture');
        report = new Report(reportContainer, fakeBrowser);
    }
});

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
    fakeWindow.onerror('message 1', 'source 1', 1, 2);
    fakeWindow.onerror('message 2', 'source 2', 3, 4);

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
    fakeWindow.onerror('message 1', 'source 1', 1, 2);

    var iconDetails = fakeBrowser.browserAction.getIcon();
    assert.equal(iconDetails.path, 'icons/error.svg');
});

QUnit.test('shows error count', function (assert) {
    fakeWindow.onerror('message 1', 'source 1', 1, 2);
    fakeWindow.onerror('message 2', 'source 2', 3, 4);

    var badgeTextDetails = fakeBrowser.browserAction.getBadgeText();
    assert.equal(badgeTextDetails.text, '2');
});

QUnit.test('shows remove errors button', function (assert) {
    fakeWindow.onerror('message 1', 'source 1', 1, 2);

    report.show();

    var removeErrorsButton = reportContainer.querySelector('.remove-errors-button');
    assert.equal(removeErrorsButton.innerText, 'removeErrorsButtonTranslation');
});

QUnit.test('without errors doesn\'t show remove errors button', function (assert) {
    report.show();

    var removeErrorsButton = reportContainer.querySelector('.remove-errors-button');
    assert.equal(null, removeErrorsButton);
});

QUnit.test('without any error doesn\'t indicate error', function (assert) {
    var iconDetails = fakeBrowser.browserAction.getIcon();
    assert.equal(iconDetails.path, 'icons/ok.svg');
    var badgeTextDetails = fakeBrowser.browserAction.getBadgeText();
    assert.equal(badgeTextDetails.text, '');
});

QUnit.test('after errors removed doesn\'t indicate error', function (assert) {
    fakeWindow.onerror('message 1', 'source 1', 1, 2);
    fakeWindow.onerror('message 2', 'source 2', 3, 4);

    report.show();
    report.removeErrors();

    var iconDetails = fakeBrowser.browserAction.getIcon();
    assert.equal(iconDetails.path, 'icons/ok.svg');
    var badgeTextDetails = fakeBrowser.browserAction.getBadgeText();
    assert.equal(badgeTextDetails.text, '');
});

QUnit.test('translates title', function (assert) {
    var titleDetails = fakeBrowser.browserAction.getTitle();
    assert.equal(titleDetails.title, 'errorIndicatorTitleTranslation');
});

QUnit.test('shows header', function (assert) {
    fakeWindow.onerror('message 1', 'source 1', 1, 2);
    fakeWindow.onerror('message 2', 'source 2', 3, 4);

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
    fakeWindow.onerror('message 1', 'source 1', 1, 2);
    dateProvider.setUpNow(new Date(2001, 4, 6, 13, 7, 8));
    fakeWindow.console.error('console error message 1');

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

    var switchButton = reportContainer.querySelector('.switch-button');
    assert.equal(switchButton.textContent, 'switchOffButtonTranslation')
});

QUnit.test('after switching off shows switch on button', function (assert) {
    report.show();

    report.switchOff();

    var switchButton = reportContainer.querySelector('.switch-button');
    assert.equal(switchButton.textContent, 'switchOnButtonTranslation')
});