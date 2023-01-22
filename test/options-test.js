QUnit.test('ignored window error, doesn\'t report window error', function (assert) {
    options.ignore(['window-error']);

    simulateWindowError();

    assert.notOk(errorIndicator.hasErrors());
});

QUnit.test('ignored window error, after restart doesn\'t report window error', function (assert) {
    options.ignore(['window-error']);
    setUpNewIndicator();

    simulateWindowError();

    assert.notOk(errorIndicator.hasErrors());
});

QUnit.test('ignores web error, doesn\'t report web error', function (assert) {
    options.ignore(['web-error']);

    simulateWebError();

    assert.notOk(errorIndicator.hasErrors());
});

function simulateWebError() {
    webRequestInTab(1, 404);
}

QUnit.test('ignored web error, after restart doesn\'t report web error', function (assert) {
    options.ignore(['web-error']);
    setUpNewIndicator();

    simulateWebError();

    assert.notOk(errorIndicator.hasErrors());
});

QUnit.test('ignores console error, doesn\'t report console error', function (assert) {
    options.ignore(['console-error']);

    simulateConsoleError();

    assert.notOk(errorIndicator.hasErrors());
});

function simulateConsoleError() {
    fakeWindow.console.error('console error message');
}

QUnit.test('ignored web error, reports console error', function (assert) {
    options.ignore(['web--error']);

    simulateConsoleError();

    assert.ok(errorIndicator.hasErrors());

});

QUnit.test('ignored web error, reports window error', function (assert) {
    options.ignore(['web-error']);

    simulateWindowError();

    assert.ok(errorIndicator.hasErrors());

});