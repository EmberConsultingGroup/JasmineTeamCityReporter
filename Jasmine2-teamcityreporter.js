// JavaScript source code
//USAGE:
//            var TeamcityReporter = jasmineRequire.TeamcityReporter();
//            window.teamcityReporter = new TeamcityReporter();
//            jasmine.getEnv().addReporter(window.teamcityReporter);


function getJasmineRequireObj() {
    if (typeof module !== "undefined" && module.exports) {
        return exports;
    } else {
        window.jasmineRequire = window.jasmineRequire || {};
        return window.jasmineRequire;
    }
}

getJasmineRequireObj().teamcityReporter = function (jRequire, j$) {
    j$.TeamcityReporter = jRequire.TeamcityReporter();
};


getJasmineRequireObj().TeamcityReporter = function () {

    function TeamcityReporter() {

        var specCount,
          failureCount;

        this.started = false;
        this.finished = false;

        this.jasmineStarted = function () {
            this.started = true;
            specCount = 0;
            failureCount = 0;
            print("##teamcity[progressStart 'Running Jasmine Tests']");
        };


        this.jasmineDone = function () {
            this.finished = true;
            print("##teamcity[progressFinish 'Running Jasmine Tests']");
        };

        this.suiteStarted = function (suite) {
            print("##teamcity[testSuiteStarted name='" + escapeTeamcityString(suite.fullName) + "']");
        };

        this.suiteDone = function (suite) {
            print("##teamcity[testSuiteFinished name='" + escapeTeamcityString(suite.fullName) + "']");
        };

        this.specStarted = function (spec) {
            print("##teamcity[testStarted name='" + escapeTeamcityString(spec.description) + "' captureStandardOutput='true']");
        };

        this.specDone = function (result) {
            specCount++;
            if (result.status == "failed") {
                failureCount++;
                var resultItems = result.failedExpectations;
                for (var i = 0; i < resultItems.length; i++) {
                    var resultSpec = resultItems[i];
                    print("##teamcity[testFailed type='" + resultSpec.matcherName + "' expected='" + resultSpec.expected + "' actual='" + resultSpec.actual + "'  name='" + escapeTeamcityString(result.description) + "' message='|[FAILED|] " + resultSpec.message + "' details='" + escapeTeamcityString(resultSpec.stack) + "']");
                }
            }
            print("##teamcity[testFinished name='" + escapeTeamcityString(result.description) + "']");
        };


        return this;

        function print(out) {
            console.log(out);
        }

        function escapeTeamcityString(message) {
            if (!message) {
                return "";
            }

            return message.replace(/\|/g, "||")
                          .replace(/\'/g, "|'")
                          .replace(/\n/g, "|n")
                          .replace(/\r/g, "|r")
                          .replace(/\u0085/g, "|x")
                          .replace(/\u2028/g, "|l")
                          .replace(/\u2029/g, "|p")
                          .replace(/\[/g, "|[")
                          .replace(/]/g, "|]");
        }

    };

    return TeamcityReporter;
};