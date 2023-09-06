function assertReportsError(assert) {
    const report = errorIndicator.getReport();
    assert.equal(report.errorsCount, 1);
    assert.equal(report.errors.length, 1);
    assert.ok(report.hasError);
    assertErrorIcon(assert);
    assertBadgeText(assert, '1');
}

function assertReportsNoError(assert) {
    const report = errorIndicator.getReport();
    assert.equal(report.errorsCount, 0);
    assert.equal(report.errors.length, 0);
    assert.notOk(report.hasError);
    assertOkIcon(assert);
    assertNoBadgeText(assert);
}

function assertErrorIcon(assert) {
    assertIcon(assert, 'icons/error.svg');
}

function assertIcon(assert, iconPath) {
    const iconDetails = fakeBrowser.browserAction.getIcon();
    assert.equal(iconDetails.path, iconPath);
    assert.equal(iconDetails.tabId, fakeBrowser.tabs.activeTabId);
}

function assertOkIcon(assert) {
    assertIcon(assert, 'icons/ok.svg');
}

function assertBadgeText(assert, expectedText) {
    const badgeTextDetails = fakeBrowser.browserAction.getBadgeText();
    assert.equal(badgeTextDetails.text, expectedText);
    assert.equal(badgeTextDetails.tabId, fakeBrowser.tabs.activeTabId);
}

function assertNoBadgeText(assert) {
    assertBadgeText(assert, '');
}

function assertOneError(assert) {
    assertErrorsCount(assert, 1);
}

function assertErrorsCount(assert, expectedCount) {
    assert.equal(errorIndicator.errorsCount(), expectedCount);
    assert.equal(errorIndicator.errors().length, expectedCount);
}

function assertNoErrors(assert) {
    assertErrorsCount(assert, 0);
}