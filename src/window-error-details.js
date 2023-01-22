function WindowErrorDetails(message, source, lineNumber, columnNumber) {
    this.messageType = 'window-error';
    this.message = message;
    this.source = source;
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;
}