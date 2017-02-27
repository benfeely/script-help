import { IPackageJson, IScriptHelpJson, Package } from "../src/package";

describe("Package", () => {
    const path = require("path");
    const test2 = path.resolve("./test/config/test2");

    describe("should instantiate from local package.json", () => {
        it(`with scripts`, () => {
            const keys = Object.keys(new Package()).length;
            keys.should.have.above(0);
        });
    });

    describe("should instantiate from mock package.json", () => {
        const packageJson: IPackageJson = require("./config/test1/package.json");
        const packageJsonScriptCount = Object.keys(packageJson.scripts).length;
        const packageJsonScriptHelpCount = Object.keys(packageJson.scriptHelp).length;
        const pkg = new Package(packageJson);

        it(`with ${packageJsonScriptCount} script keys`, () => {
            const keys = Object.keys(pkg.scripts);
            keys.should.have.lengthOf(packageJsonScriptCount);
        });

        it(`with ${packageJsonScriptHelpCount} scriptHelp keys`, () => {
            const keys = Object.keys(pkg.scriptHelp);
            keys.should.have.lengthOf(packageJsonScriptHelpCount);
        });

        describe("and #setScriptKeys()", () => {
            it(`should have ${packageJsonScriptCount} script keys`, () => {
                const keys = pkg.setScriptKeys();
                keys.should.have.lengthOf(packageJsonScriptCount);
            });

            it(`should have 2 script keys for filter parameter "build"`, () => {
                const keys = pkg.setScriptKeys("build");
                keys.should.have.lengthOf(2);
            });

            it(`should have 1 script key for key parameter "build".`, () => {
                const keys = pkg.setScriptKeys("", "build");
                keys.should.have.lengthOf(1);
            });

            it(`should throw "script key not found..." error`, () => {
                should.Throw(() => pkg.setScriptKeys("", "build2"));
            });
        });

        describe("and #scriptKeys", () => {
            it(`should have ${packageJsonScriptCount} script keys`, () => {
                pkg.setScriptKeys();
                const keys = pkg.scriptKeys;
                keys.should.have.lengthOf(packageJsonScriptCount);
            });
        });
    });

    describe("should instantiate from mock scripthelp.json", () => {
        const packageJson: IPackageJson = require("./config/test2/package.json");
        const packageJsonScriptCount = Object.keys(packageJson.scripts).length;
        const scriptHelpJson: IScriptHelpJson = require("./config/test2/scripthelp.json");
        const scriptHelpJsonKeyCount = Object.keys(scriptHelpJson).length;
        const pkg = new Package(packageJson, scriptHelpJson);

        it(`with ${packageJsonScriptCount} script keys`, () => {
            const keys = Object.keys(pkg.scripts);
            keys.should.have.lengthOf(packageJsonScriptCount);
        });

        it(`with ${scriptHelpJsonKeyCount} scriptHelp keys`, () => {
            const keys = Object.keys(pkg.scriptHelp);
            keys.should.have.lengthOf(scriptHelpJsonKeyCount);
        });
    });

    describe("#getPackageJson()", () => {
        it(`should return object from mock package.json`, () => {
            const pkgJson = Package.getPackageJson(test2);
            pkgJson.should.have.property("name");
        });

        it(`should throw "Unable to locate package.json..." error`, () => {
            should.Throw(() => Package.getPackageJson("//"));
        });
    });

    describe("#getScriptHelpJson()", () => {
        it(`should return object from mock scripthelp.json`, () => {
            const hlpJson = Package.getScriptHelpJson(test2);
            hlpJson.should.have.property("test");
        });

        it(`should throw "ScriptHelp not defined..." error`, () => {
            should.Throw(() => Package.getScriptHelpJson("//"));
        });
    });
});
