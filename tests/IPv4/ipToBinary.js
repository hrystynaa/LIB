'use strict';

const { createIP, assert } = require('../needs');

const testsIPToBin = [
  ['0.0.0.0/24', '00000000.00000000.00000000.00000000', 'Four 0'],
  ['127.0.0.1/24', '01111111.00000000.00000000.00000001', 'Loopback'],
  ['255.255.255.255/24', '11111111.11111111.11111111.11111111', 'Four 255'],
  ['192.168.200.1/24', '11000000.10101000.11001000.00000001', 'Random ip'],
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
      `Error in test "${name}" for method "ipToBinary"`
    );
  } catch (err) {
    const { message, operator } = err;
    results.push({ message, par, expected, result, operator });
  }
}
if (results[0]) console.table(results);
