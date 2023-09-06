QUnit.test('ignored window error, doesn\'t report window error', function (assert) {
    ignoreWindowError();

    simulateWindowError();

    assert.notOk(errorIndicator.hasErrors());
});

function ignoreWindowError() {
    const ignoreWindow = document.getElementById('window');
    ignoreWindow.click();
}

QUnit.test('ignored window error, after restart doesn\'t report window error', function (assert) {
    ignoreWindowError();
    setUpNewIndicator();

    simulateWindowError();

    assert.notOk(errorIndicator.hasErrors());
});

QUnit.test('ignored web error, doesn\'t report web error', function (assert) {
    ignoreWebError();

    simulateWebError();

    assert.notOk(errorIndicator.hasErrors());
});

function ignoreWebError() {
    const ignoreWeb = document.getElementById('web');
    ignoreWeb.click();
}

function simulateWebError() {
    webRequestInTab(1, 404);
}

QUnit.test('ignored web error, after restart doesn\'t report web error', function (assert) {
    ignoreWebError();
    setUpNewIndicator();

    simulateWebError();

    assert.notOk(errorIndicator.hasErrors());
});

QUnit.test('ignored console error, doesn\'t report console error', function (assert) {
    ignoreConsoleError();

    simulateConsoleError();

    assert.notOk(errorIndicator.hasErrors());
});

function ignoreConsoleError() {
    const ignoreConsole = document.getElementById('console');
    ignoreConsole.click();
}

QUnit.test('ignored window or web error, reports console error', function (assert) {
    ignoreWebError();
    ignoreWindowError();

    simulateConsoleError();

    assert.ok(errorIndicator.hasErrors());

});

QUnit.test('ignored web or console error, reports window error', function (assert) {
    ignoreWebError();
    ignoreConsoleError();

    simulateWindowError();

    assert.ok(errorIndicator.hasErrors());
});

QUnit.test('ignored console or window error, reports web error', function (assert) {
    ignoreConsoleError();
    ignoreWindowError();

    simulateWebError();

    assert.ok(errorIndicator.hasErrors());
});

QUnit.test('window error then ignore window error, hides error', function (assert) {
    simulateWindowError()
    ignoreWindowError();

    assertReportsNoError(assert);
});

QUnit.test('window error then check and uncheck ignore window error, shows error', function (assert) {
    simulateWindowError();
    ignoreWindowError();
    ignoreWindowError();

    assertReportsError(assert);
});