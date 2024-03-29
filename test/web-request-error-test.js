﻿QUnit.test('with error HTTP status for web request in active tab, increments errors count',
    function (assert) {
        webRequestInTab(1, 401);
        webRequestInTab(1, 404);
        webRequestInTab(1, 403);
        webRequestInTab(1, 500);
        webRequestInTab(1, 503);

        assert.equal(errorIndicator.tabErrorsCount(), 5);
    });

QUnit.test('with HTTP status indicating no error, doesn\'t add error',
    function (assert) {
        webRequestInTab(1, 200);
        webRequestInTab(1, 304);
        webRequestInTab(1, 302);

        assert.notOk(errorIndicator.hasErrors());
    });

QUnit.test('with unspecified tab, adds error', function (assert) {
    webRequestInTab(-1, 404);

    assert.ok(errorIndicator.hasErrors());
    assert.notOk(errorIndicator.hasTabErrors());
});

QUnit.test('with request from different tab, doesn\'t indicate errors in active tab',
    function (assert) {
        webRequestInTab(2, 404);

        assert.notOk(errorIndicator.hasTabErrors());
    });

QUnit.test('adds error details', function (assert) {
    webRequestInTab(2, 404, 'http://a');
    webRequestInTab(5, 503, 'http://b');

    activateTab(2);
    const tab2Error = errorIndicator.tabErrors()[0];
    assert.equal(tab2Error.message, 'HTTP/1.1 404');
    assert.equal(tab2Error.messageType, 'web-error');
    assert.equal(tab2Error.source, 'http://a');
    assert.equal(tab2Error.timeStamp, dateProvider.now());
    assert.equal(tab2Error.lineNumber, null);
    assert.equal(tab2Error.columnNumber, null);
    activateTab(5);
    const tab5Error = errorIndicator.tabErrors()[0];
    assert.equal(tab5Error.message, 'HTTP/1.1 503');
    assert.equal(tab5Error.source, 'http://b');
});

QUnit.test('report doesn\'t include empty line number', function (assert) {
    fakeWindow.onerror('message 1', 'source 1', null, null);

    report.show();

    const errorList = reportContainer.getElementsByClassName('error-list');
    assert.equal(errorList.length, 1);
    const listItems = errorList[0].querySelectorAll('.error-list-item');
    assert.equal(listItems.length, 1);
    assertErrorListItem(assert, listItems[0], 'source 1', 'message 1');
});