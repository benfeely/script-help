import findup = require("findup-sync");
import * as fs from "fs";

export interface IPackageJson {
    name: string;
    scripts: { [email: string]: string; };
    scriptHelp: IScriptHelpJson;
    version: string;
}

export interface IScriptHelpJson {
    [email: string]: IScriptHelp | string;
}

export interface IScriptHelp {
    name?: string;
    description?: string;
    usage?: [{ use: string, note: string } | string];
    options?: [{ option: string, note: string } | string];
    examples?: [{ example: string, note: string } | string];
    tips?: [string];
}

export class Package implements IPackageJson {
    public name: string;
    public scripts: { [script: string]: string; };
    private _scriptKeys: string[];
    private _isFiltered: boolean;
    public scriptHelp: { [script: string]: IScriptHelp | string; };
    public version: string;

    constructor(packageJson?: IPackageJson, scriptHelpJson?: IScriptHelpJson) {
        // If packageJson is not passed in, look it up internally
        // starting with the current working directory.
        if (!packageJson) {
            packageJson = Package.getPackageJson();
        }
        this.name = packageJson.name;
        this.scripts = packageJson.scripts;
        this.version = packageJson.version;

        // If scriptHelpJson is not passed in, look for it within
        // packageJson OR look it up internally starting with the
        // current working directory.
        if (!scriptHelpJson) {
            scriptHelpJson = packageJson.scriptHelp || Package.getScriptHelpJson();
        }
        this.scriptHelp = scriptHelpJson;

        // Set the initial values for script keys (will include all keys).
        this.setScriptKeys();
    }

    public get scriptKeys(): string[] {
        return this._scriptKeys;
    }

    public get isFiltered(): boolean {
        return this._isFiltered;
    }

    public setScriptKeys(filter?: string, key?: string): string[] {
        this._isFiltered = false;

        // Determine if a valid single key was requested.
        if (key) {
            // Ensure the key exists.
            if (!this.scripts[key]) {
                throw new Error(`The script key "${key}" was not found.`);
            }

            this._scriptKeys = [key];
            this._isFiltered = true;
        } else {
            // Return an array of [filtered] keys.
            this._scriptKeys = Object.keys(this.scripts);
            if (filter) {
                const regExp = new RegExp(filter);
                this._scriptKeys = this._scriptKeys.filter(key => regExp.test(key));
                this._isFiltered = true;
            }
        }

        return this._scriptKeys;
    }

    public static getPackageJson(start?: string): IPackageJson {
        // Find closest package.json file (safer than cwd + package.json).
        const options = {
            nocase: true,
            cwd: start || process.cwd()
        };
        let filePath = findup("package.json", options);

        if (filePath == null || !fs.existsSync(filePath)) {
            throw new Error(`Unable to locate "package.json" file.`);
        }

        return require(filePath);
    }

    public static getScriptHelpJson(start?: string): IScriptHelpJson {
        // Lookup scripthelp locally, next to package.json if it is not
        // included as a node within package.json.
        const options = {
            nocase: true,
            cwd: start || process.cwd()
        };
        let filePath = findup("scripthelp.json", options);

        if (filePath == null || !fs.existsSync(filePath)) {
            throw new Error(`ScriptHelp not defined within "package.json" and unable to locate "scripthelp.json" file in the root path.`);
        }

        return require(filePath);
    }
}