const dateProvider = new DateProvider();
const errorIndicator = new ErrorIndicator(browser);
new BackgroundListener(dateProvider, browser, errorIndicator);