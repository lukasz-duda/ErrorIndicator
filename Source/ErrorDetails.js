/// <reference path="../References.js" />

function ErrorDetails(message, source, lineNumber, columnNumber) {
    this.message = message;
    this.source = source;
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;
}