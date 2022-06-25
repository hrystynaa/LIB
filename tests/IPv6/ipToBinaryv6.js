/* eslint-disable max-len */

'use strict';

const { createIP, assert } = require('../needs');

const testsIPToBin = [
  [
    '::/64',
    '0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000',
    'All 0',
  ],
  [
    '::1/128',
    '0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000001',
    'Loopback',
  ],
  [
    'f:f:f:f:f:f:f:f/64',
    '0000000000001111:0000000000001111:0000000000001111:0000000000001111:0000000000001111:0000000000001111:0000000000001111:0000000000001111',
    'Eight f',
  ],
  [
    '192:168:200:1::/24',
    '0000000110010010:0000000101101000:0000001000000000:0000000000000001:0000000000000000:0000000000000000:0000000000000000:0000000000000000',
    'Random ip',
  ],
];

const results = [];
for (const test of testsIPToBin) {
  const [par, expected, name] = test;
  const ip = createIP(par);
  const result = ip.ipToBinary();
  try {
    assert.equal(
      result,
      expected,
      `Error in test "${name}" for method "ipToBinary v6"`
    );
  } catch (err) {
    const { message, operator } = err;
    results.push({ message, par, expected, result, operator });
  }
}
if (results[0]) console.table(results);
