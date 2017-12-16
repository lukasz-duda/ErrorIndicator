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

    assertBadgeText(assert, '0');
});

QUnit.test('no errors reported in new tab', function (assert) {
    simulateTabError(1);
    activateTab(2);

    var report = errorIndicator.getReport();
    assert.notOk(report.hasError);
    assert.equal(report.errorsCount, 0)
    assert.equal(report.errors.length, 0);
});