import { Package } from "../src/package";
import { Help } from "../src/help";
import { MockOutputStream } from "./outputStream.mock";

describe("Help", () => {
    const pkg = new Package(require("./config/test1/package.json"));
    const outputStream = new MockOutputStream(process.stdout);
    const help = new Help(pkg, <any>outputStream);

    beforeEach(() => {
        outputStream.reset();
    });

    it(`should not err`, () => {
        should.not.Throw(() => help.write());
    });

    it(`should log to console`, () => {
        help.write();
        outputStream.messages.should.have.lengthOf(4);
    });
});