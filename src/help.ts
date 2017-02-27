import { Package } from "./package";
import * as chalk from "chalk";

export class Help {
    private readonly helpMessageKey = "help-message";
    private readonly columnify = require("columnify");
    private readonly TAB_WIDTH = 4;
    private readonly MAX_WIDTH = 80;

    constructor(private pkg: Package,
                private outputStream: NodeJS.WritableStream) { }

    public write() {
        this.writeHeader();

        if (!this.pkg.isFiltered) {
            this.writeSummary();
        }

        this.out();
    }

    private out(message: string = "", tabs = 0, style?: chalk.ChalkChain) {
        this.outputStream.write(
            Array(tabs * this.TAB_WIDTH + 1).join(" ") +
            (style ? style(message) : message) + "\n");
    }

    private writeSummary() {
        this.out("Running NPM Scripts", 0, chalk.red);
        this.out("Usage:", 0, chalk.bold);
        this.out(chalk.yellow("npm run <command>") + " where <command> is one of:", 1);
        this.out();
        let opt1 = { showHeaders: false, config: { key: { minWidth: this.TAB_WIDTH - 1 }, value: { maxWidth: this.MAX_WIDTH - this.TAB_WIDTH - 1 } } };
        this.out(this.columnify({"": this.pkg.scriptKeys.join(", ")}, opt1));
        this.out();
        this.out();
        this.out("Getting Help for Scripts", 0, chalk.red);
        let opt2 = { showHeaders: false, config: { key: { maxWidth: this.MAX_WIDTH }, value: { maxWidth: 0 } } };
        this.out(this.columnify({"For a detailed explanation of each <command>, set a filter or specify a specific command.": ""}, opt2));
        this.out();
        this.out("Usage:", 0, chalk.bold);
        this.out("npm run help <options>", 1, chalk.yellow);
        this.out();
        this.out("Options:", 0, chalk.bold);
        this.out(chalk.yellow("-f, --filter") + "\t test", 1);
        this.out(chalk.yellow("-k, --key") + "\t\t test", 1);
        this.out(chalk.yellow("-v, --version") + "\t test", 1);
        this.out();
        this.out("Examples:", 0, chalk.bold);
        this.out("npm run help -f buil", 1, chalk.yellow);
        this.out("npm run help -k test", 1, chalk.yellow);
        this.out();
    }

    private writeHeader() {
        this.out(`Help provided by "script-help"...`, 0, chalk.gray);
        this.out();

        const helpMessage = this.pkg.scriptHelp[this.helpMessageKey];
        if (helpMessage) {
            if (typeof helpMessage !== "string") {
                throw new Error(`Attribute "help-message" in the "scriptHelp" section of your "package.json" (or in the separate "scripthelp.json") must have a string value.`);
            }

            this.out(<string>helpMessage);
            this.out();
        }
    }
}