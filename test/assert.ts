/* tslint:disable */
declare namespace NodeJS {
    interface Global {
        assert: Chai.Assert;
        should: Chai.Should;
    }
}

const _chai = require("chai");
const assert: Chai.Assert = _chai.assert;
global.assert = assert;

const should: Chai.Should = _chai.should();
global.should = should;
/* tslint:enable */