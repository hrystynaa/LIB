'use strict';

const { createIP, assert } = require('../needs');
const testsIPToNum = [
  ['0.0.0.0/24', 0, 'Four 0'],
  ['127.0.0.1/24', 2130706433, 'Loopback'],
  ['255.255.255.255/24', -1, 'Four 255'],
  ['192.168.200.1/24', -1062680575, 'Negative'],
];

const results = [];
for (const test of testsIPToNum) {
  const [par, expected, name] = test;
  const ip = createIP(par);
  const result = ip.ipToInt();
  try {
    assert.equal(
      result,
      expected,
      `Error in test "${name}" for method "ipToInt"`
    );
  } catch (err) {
    const { message, operator } = err;
    results.push({ message, par, expected, result, operator });
  }
}
if (results[0]) console.table(results);
