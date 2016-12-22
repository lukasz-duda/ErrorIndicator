/// <reference path="../References.js" />

function ErrorDetails(message, source, lineNumber, columnNumber) {
    this.messageType = 'error';
    this.message = message;
    this.source = source;
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;
}