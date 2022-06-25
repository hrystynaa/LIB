'use strict';

const { createIP, assert } = require('../needs');

const testsIPToDQ = [
  ['0.0.0.0/24', '0.0.0.0', 'Four 0'],
  ['127.0.0.1/24', '127.0.0.1', 'Loopback'],
  ['255.255.255.255/24', '255.255.255.255', 'Four 255'],
  ['192.168.200.1/24', '192.168.200.1', 'Random ip'],
];

const results = [];
for (const test of testsIPToDQ) {
  const [par, expected, name] = test;
  const ip = createIP(par);
  const result = ip.ipToDotQoud();
  try {
    assert.equal(
      result,
      expected,
      `Error in test "${name}" for method "ipToDotQoud"`
    );
  } catch (err) {
    const { message, operator } = err;
    results.push({ message, par, expected, result, operator });
  }
}
if (results[0]) console.table(results);
