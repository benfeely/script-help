import findup = require("findup-sync");
import * as fs from "fs";

export interface IPackageJson {
    scripts: { [email: string]: string; };
}

export class Package implements IPackageJson {
    public scripts: { [email: string]: string; };

    constructor(packageJson?: IPackageJson) {
        if (packageJson) {
            this.scripts = packageJson.scripts;
        } else {
            this.scripts = Package.getPackageJson().scripts;
        }
    }

    public static getPackageJson(): IPackageJson {
        // Find closest package.json file (safer than cwd + package.json).
        let filePath = findup("package.json", { nocase: true });

        if (filePath == null || !fs.existsSync(filePath)) {
            throw new Error(`Unable to locate "package.json" file.`)
        }

        return require(filePath);
    }

    public getScriptKeys(filter?: string, key?: string): string[] {
        // Determine if a valid single key was requested.
        if (key) {
            // Ensure the key exists.
            if (!this.scripts[key]) {
                throw new Error(`The script key "${key}" was not found.`);
            }

            return [key];
        }

        // Return an array of [filtered] keys.
        let keys = Object.keys(this.scripts);
        if (filter) {
            const regExp = new RegExp(filter);
            return keys.filter(key => regExp.test(key));
        }

        return keys;
    }
}