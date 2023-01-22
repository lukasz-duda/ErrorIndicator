QUnit.test('window focus change updates error count', function (assert) {
    simulateTabError(1);
    activateTab(2);

    focusWindowWithTab(1);

    assertBadgeText(assert, '1');
});

function focusWindowWithTab(tabId) {
    fakeBrowser.focusWindowWithTab(tabId);
}

QUnit.test('window focus change updates icon', function (assert) {
    simulateTabError(1);
    activateTab(2);

    focusWindowWithTab(1);

    assertErrorIcon(assert);
});