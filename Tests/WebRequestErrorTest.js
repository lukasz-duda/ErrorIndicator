/// <reference path="../References.js" />

QUnit.test('with error HTTP status for web request in active tab, increments errors count',
    function (assert) {
        webRequestInTab(1, 401);
        webRequestInTab(1, 404);
        webRequestInTab(1, 403);
        webRequestInTab(1, 500);
        webRequestInTab(1, 503);

        assert.equal(errorIndicator.tabErrorsCount(), 5);
    });

function webRequestInTab(tabId, statusCode, url) {
    fakeBrowser.webRequestCompleted({
        tabId: tabId,
        statusCode: statusCode,
        statusLine: 'HTTP/1.1 ' + statusCode,
        url: url
    });
}

QUnit.test('with HTTP status indicating no error, doesn\'t add error',
    function (assert) {
        webRequestInTab(1, 200);
        webRequestInTab(1, 304);
        webRequestInTab(1, 302);

        assert.notOk(errorIndicator.hasErrors());
    });

QUnit.test('with unspecified tab, doesn\'t add error', function (assert) {
    webRequestInTab(-1, 404);

    assert.notOk(errorIndicator.hasErrors());
});

QUnit.test('with request from different tab, doesn\'t indicate errors in active tab',
    function (assert) {
        webRequestInTab(2, 404);

        assert.notOk(errorIndicator.hasTabErrors());
    });