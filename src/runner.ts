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
    constructor(private options: IRunnerOptions,
                private outputStream: NodeJS.WritableStream) { }

    public run(onComplete: (status: number) => void) {
        if (this.options.version) {
            const scriptHelpPkgJson = Package.getPackageJson(process.mainModule.filename);
            const scriptHelpPkg = new Package(scriptHelpPkgJson);
            this.outputStream.write(scriptHelpPkg.version + "\n");
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