/// <reference path="../References.js" />

function TabError(details) {
    this.tabId = details.tabId;
    this.message = details.message;
    this.messageType = details.messageType;
    this.timeStamp = details.timeStamp;
    this.source = details.source;
    this.lineNumber = details.lineNumber;
    this.columnNumber = details.columnNumber;
}