import { Package } from "./package";
import { Help } from "./help";

export interface IRunnerOptions {
    version?: boolean;
    filter?: string;
    key?: string;
}

export enum ExitStatus {
    Success,
    Failure
}

export class Runner {
    constructor(private options: IRunnerOptions,
                private outputStream: NodeJS.WritableStream) { }

    public run(onComplete: (status: number) => void) {
        if (this.options.version) {
            const scriptHelpPkgJson = Package.getPackageJson(process.mainModule.filename);
            const scriptHelpPkg = new Package(scriptHelpPkgJson);
            this.outputStream.write(scriptHelpPkg.version + "\n");
            onComplete(ExitStatus.Success);
            return;
        }

        try {
            const pkg = new Package();

            // Optionally set up the keys that will be included in the help.
            if (this.options.filter || this.options.key) {
                pkg.setScriptKeys(this.options.filter, this.options.key);
            }

            const help = new Help(pkg, this.outputStream);
            help.write();

            onComplete(ExitStatus.Success);
        } catch (error) {
            this.outputStream.write(error.message);
            onComplete(ExitStatus.Failure);
        }
    }
}