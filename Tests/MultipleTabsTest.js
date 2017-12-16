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