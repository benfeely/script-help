import { Package } from "../src/package";
import { Help } from "../src/help";
import { MockOutputStream } from "./outputStream.mock";

describe("Help", () => {
    const outputStream = new MockOutputStream(process.stdout);
    let pkg: Package;
    let help: Help;

    beforeEach(() => {
        outputStream.reset();
        outputStream.dump();

        pkg = new Package(require("./config/test1/package.json"));
        help = new Help(pkg, <any>outputStream);
    });

    it(`should not err`, () => {
        should.not.Throw(() => help.write());
    });

    it(`should log to console`, () => {
        help.write();
        outputStream.messages.should.have.lengthOf(6);
    });

    it(`should log summary to console`, () => {
        help.write();
        outputStream.messages.should.have.lengthOf(6);
    });

    it(`should log detail (with basic help) to console`, () => {
        // Apply a filter to get the detail output.
        pkg.setScriptKeys(null, "test");

        help.write();
        outputStream.messages.should.have.lengthOf(6);
    });

    it(`should log detail (with expanded help) to console`, () => {
        // Apply a filter to get the detail output.
        pkg.setScriptKeys(null, "build");

        help.write();
        outputStream.messages.should.have.lengthOf(6);
    });

    it(`should err for invalid "help-message"`, () => {
        // Apply a filter to get the detail output.
        pkg.scriptHelp["help-message"] = {};

        should.Throw(() => help.write());
    });
});