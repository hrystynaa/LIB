'use strict';

const { createIP, assert } = require('../needs');

const testsIPToBroadcast = [
  ['0.0.0.0/24', '0.0.0.255', 'Four 0'],
  ['127.0.0.1/24', '127.0.0.255', 'Loopback'],
  ['255.255.255.255/24', '255.255.255.255', 'Broadcast'],
  ['192.168.200.1/24', '192.168.200.255', 'Random ip'],
];

const results = [];
for (const test of testsIPToBroadcast) {
  const [par, expected, name] = test;
  const ip = createIP(par);
  const result = ip.toBroadcast();
  try {
    assert.equal(
      result,
      expected,
      `Error in test "${name}" for method "toBroadcast"`
    );
  } catch (err) {
    const { message, operator } = err;
    results.push({ message, par, expected, result, operator });
  }
}
if (results[0]) console.table(results);
