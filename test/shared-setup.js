const fakeWindow = new FakeWindow();
const fakeBrowser = new FakeBrowser();
new PageObserver(fakeWindow, fakeBrowser);
const dateProvider = new DateProviderStub();

let errorIndicator = null
let reportContainer = null;
let report = null;
let optionsContainer = null;
let options = null;

function resetWindow() {
    fakeWindow.resetConsoleErrors();
}

function resetBrowser() {
    fakeBrowser.resetSettings();
}

function setUpNewIndicator() {
    errorIndicator = new ErrorIndicator(fakeBrowser);
    new BackgroundListener(dateProvider, fakeBrowser, errorIndicator);
    const testContainer = document.getElementById('qunit-fixture');
    testContainer.innerHTML = '';
    reportContainer = document.createElement('div');
    testContainer.appendChild(reportContainer)
    report = new Report(reportContainer, fakeBrowser);
    optionsContainer = document.createElement('div');
    testContainer.appendChild(optionsContainer)
    options = new Options(optionsContainer, fakeBrowser);
}

function activateTab(tabId) {
    fakeBrowser.activateTab(tabId);
}

function simulateWindowError() {
    fakeWindow.onerror('message 1', 'source 1', 1, 2);
}

function simulateConsoleError() {
    fakeWindow.console.error('console error message');
}

function simulateTabError(tabId) {
    fakeBrowser.senderTab(tabId);
    simulateWindowError();
}

function unspecifiedTabError() {
    webRequestInTab(-1, 404);
}

function webRequestInTab(tabId, statusCode, url) {
    fakeBrowser.webRequestCompleted({
        tabId: tabId,
        statusCode: statusCode,
        statusLine: 'HTTP/1.1 ' + statusCode,
        url: url
    });
}

function reportAllErrors() {
    const allErrors = document.getElementById('allErrors');
    allErrors.click();
}

function reportTabErrors() {
    const tabErrors = document.getElementById('tabErrors');
    tabErrors.click();
}

function removeErrors() {
    report.show();
    report.removeErrors();
}