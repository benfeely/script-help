import { IRunnerOptions, Runner } from "./runner";

// Setup the output stream correctly for the environment.
let outputStream = process.stdout;

// Process input parameters...
const argv = require("yargs")
    .alias("f", "filter")
    .alias("k", "key")
    .argv;

if (argv.help) {
    const outputString = `
script-help accepts the following commandline options:
    -c, --config:
        The location of the configuration file that tslint will use to
        determine which rules are activated and what options to provide
        to the rules.\n`;
    outputStream.write(outputString);
    process.exit(0);
}

// Setup the options.
const options: IRunnerOptions = {
    version: argv.v,
    filter: argv.f,
    key: argv.k
};

// Translate the first un-named parameter (if provided) into
// a key option.
if (argv._ && argv._.length) {
    options.key = argv._[0];
}

new Runner(options, outputStream)
    .run((status: number) => process.exit(status));