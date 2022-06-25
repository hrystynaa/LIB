/* eslint-disable max-len */
'use strict';

const { createIP, assert } = require('../needs');

const testsPrefToBin = [
  [
    '::/64',
    '1111111111111111:1111111111111111:1111111111111111:1111111111111111:0000000000000000:0000000000000000:0000000000000000:0000000000000000',
    '64',
  ],
  [
    '::1/128',
    '1111111111111111:1111111111111111:1111111111111111:1111111111111111:1111111111111111:1111111111111111:1111111111111111:1111111111111111:',
    '128',
  ],
  [
    'f:f:f:f:f:f:f:f/53',
    '1111111111111111:1111111111111111:1111111111111111:1111100000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000',
    '53',
  ],
  [
    '192:168:200:1::/24',
    '1111111111111111:1111111100000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000',
    '24',
  ],
];

const results = [];
for (const test of testsPrefToBin) {
  const [par, expected, name] = test;
  const ip = createIP(par);
  const result = ip.prefixToBinary();
  try {
    assert.equal(
      result,
      expected,
      `Error in test "${name}" for method "prefixToBinary"`
    );
  } catch (err) {
    const { message, operator } = err;
    results.push({ message, par, expected, result, operator });
  }
}
if (results[0]) console.table(results);
