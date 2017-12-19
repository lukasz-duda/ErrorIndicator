/// <reference path="../References.js" />

var dateProvider = new DateProvider();
var errorIndicator = new ErrorIndicator(browser);
new BackgroundListener(dateProvider, browser, errorIndicator);