import { MockOutputStream } from "./outputStream.mock";

import { Runner, IRunnerOptions, ExitStatus } from "../src/runner";
import { Package } from "../src/package";
import { Help } from "../src/help";

describe("Runner", () => {
    const chai = require("chai");
    const sinon = require("sinon");
    const sinonChai = require("sinon-chai");
    chai.use(sinonChai);

    const outputStream = new MockOutputStream(process.stdout);

    beforeEach(() => {
        outputStream.reset();
    });

    describe("#run()", () => {
        it(`should output version and exit with success`, () => {
            const runnerOptions: IRunnerOptions = {
                version: true
            };
            const cb = sinon.spy();

            // Intercept the request and set to a different start
            // point.  When installed via npm install, this call
            // will execute in the context of the node_module where
            // this package is installed and the process.mainModule.filename
            // will produce the desired result.
            const getPackageJson = Package.getPackageJson;
            sinon.stub(Package, "getPackageJson", () => {
                return getPackageJson(process.cwd());
            });

            // Start the instance with the supplied mocks and stub.
            new Runner(runnerOptions, <any>outputStream).run(cb);

            outputStream.messages.should.have.lengthOf(1);
            cb.should.have.been.calledWith(ExitStatus.Success);
        });

        it(`should exit with error`, () => {
            const cb = sinon.spy();

            // Intercept the request and set to a different start
            // point.  When installed via npm install, this call
            // will execute in the context of the node_module where
            // this package is installed and the process.mainModule.filename
            // will produce the desired result.
            sinon.stub(Help.prototype, "write", () => {
                throw new Error("Forced error...");
            });

            // Start the instance with the supplied mocks and stub.
            new Runner({}, <any>outputStream).run(cb);

            cb.should.have.been.calledWith(ExitStatus.Failure);
        });
    });
});