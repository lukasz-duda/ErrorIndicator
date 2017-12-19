/// <reference path="../References.js" />

QUnit.test(
    'with error HTTP status for web request in active tab, increments errors count',
    function (assert) {
        webRequestInTab(1, 401, 'http://a');
        webRequestInTab(1, 404, 'http://b');
        webRequestInTab(1, 503, 'http://c');

        assert.equal(errorIndicator.tabErrorsCount(), 3);
    });

function webRequestInTab(tabId, statusCode, url) {
    fakeBrowser.webRequestCompleted({
        tabId: tabId,
        statusCode: statusCode,
        statusLine: 'HTTP/1.1 ' + statusCode,
        url: url
    });
}