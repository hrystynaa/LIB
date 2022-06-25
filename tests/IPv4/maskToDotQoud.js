'use strict';

const { createIP, assert } = require('../needs');

const testsMaskToDQ = [
  ['0.0.0.0/24', '255.255.255.0', '24'],
  ['127.0.0.1/32', '255.255.255.255', '32'],
  ['255.255.255.255/1', '128.0.0.0', '1'],
  ['192.168.200.1/15', '255.254.0.0', '15'],
];

const results = [];
for (const test of testsMaskToDQ) {
  const [par, expected, name] = test;
  const ip = createIP(par);
  const result = ip.maskToDotQoud();
  try {
    assert.equal(
      result,
      expected,
      `Error in test "${name}" for method "maskToDotQoud"`
    );
  } catch (err) {
    const { message, operator } = err;
    results.push({ message, par, expected, result, operator });
  }
}
if (results[0]) console.table(results);
