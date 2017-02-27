import { Package, IScriptHelp } from "./package";
import * as chalk from "chalk";

export class Help {
    private readonly helpMessageKey = "help-message";
    private readonly cliUi = require("cliui");

    private readonly TAB_WIDTH = 4;
    private readonly MAX_WIDTH = 80;

    // Chalk styles
    head = chalk.underline;

    constructor(private pkg: Package,
                private outputStream: NodeJS.WritableStream) { }

    public write() {
        this.writeHeader();

        if (!this.pkg.isFiltered) {
            this.writeSummary();
        } else {
            this.pkg.scriptKeys.forEach(key => {
                this.writeDetail(key, this.pkg.scripts[key], this.pkg.scriptHelp[key]);
            });
        }

        this.out();
    }

    private out(message: string = "", tabs = 0, style?: chalk.ChalkChain) {
        this.outputStream.write(
            Array(tabs * this.TAB_WIDTH + 1).join(" ") +
            (style ? style(message) : message) + "\n");
    }

    private writeSummary() {
        const ui = this.cliUi({ width: this.MAX_WIDTH });

        ui.div(this.head(`Running NPM Scripts`));
        ui.div();
        ui.div(`Usage:`);
        ui.div(
            { text: chalk.yellow(`npm run <command>`) + ` where <command> is one of:\n\n` + this.pkg.scriptKeys.join(", "),
              padding: [0, 0, 0, 4] }
        );
        ui.div();
        ui.div(
            { text: `Need more help?  Try: ` + chalk.yellow(`npm run help build`) + ` or any other <command>`,
              padding: [0, 0, 0, 4] }
        );
        ui.div();
        ui.div(this.head(`Getting Help for Scripts`));
        ui.div();
        ui.div(`For a detailed explanation of each <command>, set a filter or specify a specific command.`);
        ui.div();
        ui.div(`Usage:`);
        ui.div(
            { text: chalk.yellow(`npm run help <command>`),
              padding: [0, 0, 0, 4] }
        );
        ui.div(
            { text: chalk.yellow(`npm run help <options>`),
              padding: [0, 0, 0, 4] }
        );
        ui.div();
        ui.div(`Options:`);
        ui.div(
            { text: chalk.yellow.dim(`<command>\n`) + chalk.yellow.dim(`-f, --filter`),
              padding: [0, 0, 0, 4],
              width: 26 },
            { text: chalk.white(`Show detailed help for each <command> that matches the filter.`) }
        );
        ui.div();
        ui.div(
            { text: chalk.yellow.dim(`-k, --key`),
              padding: [0, 0, 0, 4],
              width: 26 },
            { text: `Show detailed help for the <command> matching the provided key.` }
        );
        ui.div();
        ui.div(
            { text: chalk.yellow.dim(`-v, --version`),
              padding: [0, 0, 0, 4],
              width: 26 },
            { text: `Show the version of ScriptHelp that is being used.` }
        );
        ui.div();
        ui.div(`Examples:`);
        ui.div(
            { text: chalk.yellow.dim(`npm run help test`),
              padding: [0, 0, 0, 4],
              width: 26 },
            { text: `Preferred` }
        );
        ui.div(
            { text: chalk.yellow.dim(`npm run help -f buil`),
              padding: [0, 0, 0, 4],
              width: 26 },
            { text: `` }
        );
        ui.div(
            { text: chalk.yellow.dim(`npm run help -k test`),
              padding: [0, 0, 0, 4],
              width: 26 },
            { text: `` }
        );
        ui.div();

        this.out(ui);
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

    private writeDetail(key: string, script: string, scriptHelp?: IScriptHelp | string) {
        const ui = this.cliUi({ width: this.MAX_WIDTH });

        // Determine if a scriptHelp object was provided for this script and is valid.
        if (!scriptHelp || typeof scriptHelp === "string") {
            ui.div(this.head(`Help for "${key}" Script`));
            ui.div();

            ui.div(`Usage:`);
            ui.div(
                { text: chalk.yellow(`npm run ${key}`),
                  padding: [0, 0, 0, 4] },
                { text: script }
            );

        } else if (typeof scriptHelp !== "string") {
            ui.div(this.head(`Help for "${scriptHelp.name}" Script`));
            ui.div();

            if (scriptHelp.description) {
                ui.div(scriptHelp.description);
                ui.div();
            }

            if (scriptHelp.usage && scriptHelp.usage.length) {
                ui.div(`Usage:`);
                const w = Math.max(... scriptHelp.usage.map(use => typeof use === "string" ? use.length : use.use.length)) + 6;
                scriptHelp.usage.forEach(use => {
                    ui.div(
                        { text: chalk.yellow.dim(typeof use === "string" ? use : use.use),
                        padding: [0, 0, 0, 4],
                        width: w + 4 },
                        { text: chalk.white(typeof use === "string" ? "" : use.note) }
                    );
                    ui.div();
                });
            }

            if (scriptHelp.options && scriptHelp.options.length) {
                ui.div(`Options:`);
                const w = Math.max(... scriptHelp.options.map(opt => typeof opt === "string" ? opt.length : opt.option.length)) + 6;
                scriptHelp.options.forEach(opt => {
                    ui.div(
                        { text: chalk.yellow.dim(typeof opt === "string" ? opt : opt.option),
                        padding: [0, 0, 0, 4],
                        width: w },
                        { text: chalk.white(typeof opt === "string" ? opt : opt.note) }
                    );
                    ui.div();
                });
            }

            if (scriptHelp.examples && scriptHelp.examples.length) {
                ui.div(`Examples:`);
                const w = Math.max(... scriptHelp.examples.map(ex => typeof ex === "string" ? ex.length : ex.example.length)) + 6;
                scriptHelp.examples.forEach(ex => {
                    ui.div(
                        { text: chalk.yellow.dim(typeof ex === "string" ? ex : ex.example),
                        padding: [0, 0, 0, 4],
                        width: w },
                        { text: chalk.white(typeof ex === "string" ? ex : ex.note) }
                    );
                    ui.div();
                });
            }

            if (scriptHelp.tips && scriptHelp.tips.length) {
                ui.div(`Tips:`);
                scriptHelp.tips.forEach(tip => {
                    ui.div(
                        { text: tip,
                        padding: [0, 0, 0, 4] }
                    );
                    ui.div();
                });
            }
        }

        this.out(ui);
    }
}