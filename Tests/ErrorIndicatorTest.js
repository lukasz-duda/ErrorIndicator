/// <reference path="../References.js" />

var errorObserver = null;
var errorIndicator = null
var report = null;
var reportContainer = null;

QUnit.module('ErrorIndicator', {
    beforeEach: function () {
        errorObserver = new ErrorObserver(fakeWindow, fakeBrowser);
        errorIndicator = new ErrorIndicator(fakeBrowser);
        reportContainer = document.getElementById('qunit-fixture');
        report = new Report(reportContainer, fakeBrowser);
    }
});

QUnit.test('adds error to report', function (assert) {
    fakeWindow.onerror('message 1', 'source', 1, 2);

    report.show();

    var errorList = reportContainer.getElementsByClassName('error-list');
    assert.equal(errorList.length, 1);
    var listItems = errorList[0].childNodes;
    assert.equal(listItems.length, 1);
    assert.equal(listItems[0].textContent, 'message 1:1:2');
    assert.equal(listItems[0].nodeName, 'LI');
});

QUnit.test('adds errors to report', function (assert) {
    fakeWindow.onerror('message 1', 'source 1', 1, 2);
    fakeWindow.onerror('message 2', 'source 2', 3, 4);

    report.show();

    var errorList = reportContainer.getElementsByClassName('error-list');
    assert.equal(errorList.length, 1);
    var listItems = errorList[0].childNodes;
    assert.equal(listItems.length, 2);
    assert.equal(listItems[0].textContent, 'message 1:1:2');
    assert.equal(listItems[0].nodeName, 'LI');
    assert.equal(listItems[1].textContent, 'message 2:3:4');
    assert.equal(listItems[1].nodeName, 'LI');
});

QUnit.test('removes errors from report', function (assert) {
    fakeWindow.onerror('message 1', 'source 1', 1, 2);
    fakeWindow.onerror('message 2', 'source 2', 3, 4);

    report.show();
    report.removeErrors();

    var errorList = reportContainer.getElementsByClassName('error-list');
    assert.equal(errorList[0].childNodes.length, 0);
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

    var removeErrorsButton = reportContainer.firstChild;
    assert.equal(removeErrorsButton.innerText, 'removeErrorsButtonTranslation');
});

QUnit.test('without any error doesn\' indicate error', function (assert) {
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

QUnit.test('translate title', function (assert) {
    var titleDetails = fakeBrowser.browserAction.getTitle();
    assert.equal(titleDetails.title, 'errorIndicatorTitleTranslation');
});