QUnit.test('all errors report, another tab error, shows error',
    function (assert) {
        reportAllErrors();
        simulateTabError(1);
        activateTab(2);

        assertReportsError(assert);
    });

QUnit.test('all errors report, after restart, another tab error, shows error',
    function (assert) {
        reportAllErrors();
        setUpNewIndicator();
        simulateTabError(1);
        activateTab(2);

        assertReportsError(assert);
    });

QUnit.test('tab errors report, another tab error, shows no error',
    function (assert) {
        reportTabErrors();
        simulateTabError(1);
        activateTab(2);

        assertReportsNoError(assert);
    });

QUnit.test('tab errors report, after restart, another tab error, shows no error',
    function (assert) {
        reportTabErrors();
        setUpNewIndicator();
        simulateTabError(1);
        activateTab(2);

        assertReportsNoError(assert);
    });

QUnit.test('all errors report, unspecified tab error, shows error',
    function (assert) {
        reportAllErrors();
        unspecifiedTabError();

        assertReportsError(assert);
    });

QUnit.test('tab errors report, unspecified tab error, doesn\'t show error',
    function (assert) {
        reportTabErrors();
        unspecifiedTabError();

        assertReportsNoError(assert);
    });

QUnit.test('unspecified tab error then switch to all errors report, shows error',
    function (assert) {
        unspecifiedTabError();
        reportAllErrors();

        assertReportsError(assert);
    });

QUnit.test('all errors report, another tab error, remove errors, removes error',
    function (assert) {
        reportAllErrors();
        simulateTabError(2);

        removeErrors();

        assertNoErrors(assert);
    });

QUnit.test('all errors report, another tab error, remove errors, removes error',
    function (assert) {
        reportTabErrors();
        simulateTabError(2);

        removeErrors();

        assertOneError(assert);
    });