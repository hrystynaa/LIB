'use strict';

const { createIP, assert } = require('../needs');

const testsMaskToBin = [
  ['0.0.0.0/24', '11111111.11111111.11111111.00000000', '24'],
  ['127.0.0.1/32', '11111111.11111111.11111111.11111111', '32'],
  ['255.255.255.255/1', '10000000.00000000.00000000.00000000', '1'],
  ['192.168.200.1/15', '11111111.11111110.00000000.00000000', '15'],
];

const results = [];
for (const test of testsMaskToBin) {
  const [par, expected, name] = test;
  const ip = createIP(par);
  const result = ip.maskToBinary();
  try {
    assert.equal(
      result,
      expected,
      `Error in test "${name}" for method "maskToBinary"`
    );
  } catch (err) {
    const { message, operator } = err;
    results.push({ message, par, expected, result, operator });
  }
}
if (results[0]) console.table(results);
