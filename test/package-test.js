'use strict';

const scriptHelp = require('../');
const test = require('tape');

test('utility log function should return true', t => {
  console.dir(scriptHelp);
  const res = scriptHelp.test();
  t.equal(res, true);

  t.end();
});