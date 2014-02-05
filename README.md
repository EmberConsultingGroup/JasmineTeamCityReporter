Jasmine TeamCity Reporter
=======================

Jasmine 2.0 TeamCity Reporter


To use, in your spec runner code add the following code

```Javascript
var TeamcityReporter = jasmineRequire.TeamcityReporter();
window.teamcityReporter = new TeamcityReporter();
jasmine.getEnv().addReporter(window.teamcityReporter);
```
