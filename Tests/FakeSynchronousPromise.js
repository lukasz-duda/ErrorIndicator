/// <reference path="../References.js" />

function FakeSynchronousPromise(executor) {
    var me = this;
    me.result = null;

    me.resolve = function (result) {
        me.result = result;
    }

    executor(me.resolve);


    me.then = function (onFulfilled) {
        onFulfilled(me.result);
    }
}