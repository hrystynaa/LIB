'use strict';

const { createIP, assert } = require('../needs');

const testsPrefixToCH = [
  ['::/64', 'ffff:ffff:ffff:ffff:0000:0000:0000:0000', '64'],
  ['::1/128', 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', '128'],
  ['f:f:f:f:f:f:f:f/53', 'ffff:ffff:ffff:f800:0000:0000:0000:0000', '53'],
  ['192:168:200:1::/24', 'ffff:ff00:0000:0000:0000:0000:0000:0000', '24'],
];

const results = [];
for (const test of testsPrefixToCH) {
  const [par, expected, name] = test;
  const ip = createIP(par);
  const result = ip.prefixToColonHex();
  try {
    assert.equal(
      result,
      expected,
      `Error in test "${name}" for method "prefixToColonHex v6"`
    );
  } catch (err) {
    const { message, operator } = err;
    results.push({ message, par, expected, result, operator });
  }
}
if (results[0]) console.table(results);
