function DateProviderStub() {
    const me = this;

    me.timeStamp = new Date(2000, 0, 1, 12, 13, 14);

    me.setUpNow = function (timeStamp) {
        me.timeStamp = timeStamp;
    };

    me.now = function () {
        return me.timeStamp;
    };
}