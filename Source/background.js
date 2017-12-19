/// <reference path="../References.js" />

var dateProvider = new DateProvider();
var errorIndicator = new ErrorIndicator(browser, dateProvider);
new BackgroundListener(browser, errorIndicator);