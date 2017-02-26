import findup = require("findup-sync");
import * as fs from "fs";

export interface IPackageJson {
    name: string;
    scripts: { [email: string]: string; };
    version: string;
}

export class Package implements IPackageJson {
    public name: string;
    public scripts: { [email: string]: string; };
    public version: string;

    constructor(packageJson?: IPackageJson) {
        if (!packageJson) {
            packageJson = Package.getPackageJson();
        }

        this.name = packageJson.name;
        this.scripts = packageJson.scripts;
        this.version = packageJson.version;
    }

    public static getPackageJson(start?: string): IPackageJson {
        // Find closest package.json file (safer than cwd + package.json).
        const options = {
            nocase: true,
            cwd: start || process.cwd()
        };
        let filePath = findup("package.json", options);

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