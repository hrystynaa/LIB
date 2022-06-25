'use strict';

const { createIP, assert } = require('../needs');
const testsIPToNum = [
  ['::/64', 0n, 'All 0'],
  ['::1/128', 1n, 'Loopback'],
  ['f:f:f:f:f:f:f:f/64', 77885641318594292392624080437575695n, 'Eight f'],
  ['192:168:200:1::/24', 2087331859888475879920227411327713280n, 'Random ip'],
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
      `Error in test "${name}" for method "ipToInt v6"`
    );
  } catch (err) {
    const { message, operator } = err;
    results.push({ message, par, expected, result, operator });
  }
}
if (results[0]) console.table(results);
