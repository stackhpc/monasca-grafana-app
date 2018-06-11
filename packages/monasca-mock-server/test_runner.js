const Jasmine = require("jasmine")
const JasminConsoleReporter = require('jasmine-console-reporter');

// configure jasmin
var jasmine = new Jasmine();
jasmine.loadConfigFile('spec/support/jasmine.json');

// setup console reporters
var jasmin_console_reporter = new JasminConsoleReporter({
    colors: 1,           // (0|false)|(1|true)|2
    cleanStack: 1,       // (0|false)|(1|true)|2|3
    verbosity: 4,        // (0|false)|1|2|(3|true)|4
    listStyle: 'indent', // "flat"|"indent"
    activity: false,     // boolean or string ("dots"|"star"|"flip"|"bouncingBar"|...)
    emoji: true,
    beep: true
})

// initialize and execute
jasmine.env.clearReporters();
jasmine.addReporter(jasmin_console_reporter);
jasmine.execute();