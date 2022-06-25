'use strict';

const { createIP, assert } = require('../needs');

const testsIPToCH = [
  ['::/64', '0000:0000:0000:0000:0000:0000:0000:0000', 'All 0'],
  ['::1/128', '0000:0000:0000:0000:0000:0000:0000:0001', 'Loopback'],
  ['f:f:f:f:f:f:f:f/64', '000f:000f:000f:000f:000f:000f:000f:000f', 'Eight f'],
  [
    '192:168:200:1::/24',
    '0192:0168:0200:0001:0000:0000:0000:0000',
    'Random ip',
  ],
];

const results = [];
for (const test of testsIPToCH) {
  const [par, expected, name] = test;
  const ip = createIP(par);
  const result = ip.ipToColonHex();
  try {
    assert.equal(
      result,
      expected,
      `Error in test "${name}" for method "ipToColonHex v6"`
    );
  } catch (err) {
    const { message, operator } = err;
    results.push({ message, par, expected, result, operator });
  }
}
if (results[0]) console.table(results);
