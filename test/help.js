'use strict';

const runHelp = require('../');
const test = require('tape');

test('proof of concept test', t => {
  const res = runHelp.test();
  t.equal(res, true);

  t.end();
});