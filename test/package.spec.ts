// import { Rule } from "../src/rules/eoflineRule";
// import { TestUtils } from "./lint";
import { IPackageJson, Package } from "../src/package";

describe("Package", () => {
    const packageJson: IPackageJson = require("./config/package.test1.json");
    const packageJsonScriptCount = Object.keys(packageJson.scripts).length;
    const pkg = new Package(packageJson);

    it(`should have ${packageJsonScriptCount} scripts`, () => {
        const keys = Object.keys(pkg.scripts);
        keys.should.have.lengthOf(packageJsonScriptCount);
    });

    describe("#getScriptKeys()", () => {
        it(`should have ${packageJsonScriptCount} script keys`, () => {
            const keys = pkg.getScriptKeys();
            keys.should.have.lengthOf(packageJsonScriptCount);
        });

        it(`should have 2 script keys for filter parameter "build"`, () => {
            const keys = pkg.getScriptKeys("build");
            keys.should.have.lengthOf(2);
        });

        it(`should have 1 script key for key parameter "build".`, () => {
            const keys = pkg.getScriptKeys("", "build");
            keys.should.have.lengthOf(1);
        });
    });
});
