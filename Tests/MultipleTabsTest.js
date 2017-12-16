/// <reference path="../References.js" />

QUnit.test('shows error count in active tab', function (assert) {
    simulateTabError(1);
    activateTab(2)
    simulateTabError(2);
    simulateTabError(2);

    assertBadgeText(assert, '2');
});

function simulateTabError(tabId) {
    fakeBrowser.senderTab(tabId);
    simulateError();
}

QUnit.test('no errors in new tab', function (assert) {
    simulateTabError(1);
    activateTab(2);

    assertBadgeText(assert, '');
});

QUnit.test('no errors reported in new tab', function (assert) {
    simulateTabError(1);
    activateTab(2);

    var report = errorIndicator.getReport();
    assert.notOk(report.hasError);
    assert.equal(report.errorsCount, 0)
    assert.equal(report.errors.length, 0);
});

QUnit.test('tab refresh removes tab errors', function (assert) {
    simulateTabError(1);
    activateTab(2);
    simulateTabError(2);
    reloadTab(2);

    assert.equal(errorIndicator.tabErrorsCount(), 0);
    assertBadgeText(assert, '');
});

function reloadTab(tabId) {
    fakeBrowser.reloadTab(tabId);
}

QUnit.test('tab refresh doesn\'t remove different tab\'s errros', function (assert) {
    simulateTabError(1);
    activateTab(2);
    simulateTabError(2);
    reloadTab(2);

    assert.ok(errorIndicator.hasErrors());
});

QUnit.test('tab update doesn\'t remove it\'s errors', function (assert) {
    simulateTabError(1);
    updateTab(1);

    assert.ok(errorIndicator.hasTabErrors());
});

function updateTab(tabId) {
    fakeBrowser.updateTab(tabId);
}

QUnit.test('remove errors button removes tab errors only', function (assert) {
    simulateTabError(1);
    activateTab(2);
    simulateTabError(2);
    report.show();
    var removeErrorsButton = reportContainer.querySelector('.remove-errors-button');

    removeErrorsButton.click();

    assert.notOk(errorIndicator.hasTabErrors());
    assert.ok(errorIndicator.hasErrors());
    assertNoRemoveErrorsButton(assert);
});