'use strict';

const { createIP, assert } = require('../needs');

const testsIs = [
  [
    '2001:0db8:85a3:0000:0000:8a2e:0370:7334/3',
    [false, false, true, true],
    'Global1',
  ],
  ['3000:16:0:0:abc:ffff::/3', [false, false, true, true], 'Global2'],
  ['::/24', [false, false, false, true], 'All 0'],
  ['::1/128', [true, false, false, false], 'Loopback'],
  ['ffff::/9', [false, true, false, true], 'Multicast'],
  ['fe80::/64', [false, false, false, true], 'LinkLocal'],
  ['192:168:200:1::/64', [false, false, false, false], 'Random ip'],
];

const methods = ['isLoopBack', 'isMulticast', 'isGlobal', 'isLinkLocal'];

const results = [];
for (const test of testsIs) {
  const [par, expected, name] = test;
  const ip = createIP(par);
  const result = [
    ip.isLoopback(),
    ip.isMulticast(),
    ip.isGlobal(),
    ip.isLinkLocal(),
  ];

  for (let i = 0; i < result.length; i++) {
    const res = result[i];
    const exp = expected[i];
    try {
      assert.equal(
        res,
        exp,
        `Error in test "${name}" for method "${methods[i]}"`
      );
    } catch (err) {
      const { message, operator } = err;
      results.push({ message, par, exp, res, operator });
    }
  }
}
if (results[0]) console.table(results);
