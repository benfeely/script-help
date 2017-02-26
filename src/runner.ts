import { Package } from "./package";

export interface IRunnerOptions {
    /**
     * Whether to show the current TSLint version.
     */
    version?: boolean;
    filter?: string;
    key?: string;
}

export class Runner {
    public static VERSION = "1.0.0";

    constructor(private options: IRunnerOptions,
                private outputStream: NodeJS.WritableStream) { }

    public run(onComplete: (status: number) => void) {
        if (this.options.version) {
            this.outputStream.write(Runner.VERSION + "\n");
            onComplete(0);
            return;
        }

        try {
            this.outputStream.write("Starting script help...");
            const pkg = new Package();
            const scriptKeys = pkg.getScriptKeys(this.options.filter, this.options.key);

            console.log("Script Keys: ", JSON.stringify(scriptKeys));
        } catch (error) {
            console.error(error.message);
            onComplete(1);
        }
    }
}