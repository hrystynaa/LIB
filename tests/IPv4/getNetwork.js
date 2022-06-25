'use strict';

const { createIP, assert } = require('../needs');

const testsGetNet = [
  ['0.0.0.0/24', '0.0.0.0', 'Four 0 mask 24'],
  ['127.0.0.1/8', '127.0.0.0', 'Loopback'],
  ['255.255.255.255/12', '255.240.0.0', 'Four 255 mask 12'],
  ['192.168.200.1/32', '192.168.200.1', 'Random adres mask 32'],
];

const results = [];
for (const test of testsGetNet) {
  const [par, expected, name] = test;
  const ip = createIP(par);
  const result = ip.getNetwork();
  try {
    assert.equal(
      result,
      expected,
      `Error in test "${name}" for method "getNetwork"`
    );
  } catch (err) {
    const { message, operator } = err;
    results.push({ message, par, expected, result, operator });
  }
}
if (results[0]) console.table(results);
