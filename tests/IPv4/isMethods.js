'use strict';

const { createIP, assert } = require('../needs');

const testsIs = [
  ['10.0.0.0/8', [true, false, false, false, false], 'Private1'],
  ['172.16.0.0/12', [true, false, false, false, false], 'Private2'],
  ['192.168.0.0/16', [true, false, false, false, false], 'Private3'],
  ['0.0.0.0/24', [false, false, false, false, false], 'Four 0'],
  ['127.0.0.1/24', [false, false, true, false, false], 'Loopback'],
  ['255.255.255.255/24', [false, false, false, false, true], 'Broadcast'],
  ['192.168.200.1/24', [false, false, false, false, false], 'Random add'],
  ['224.0.0.0/4', [false, false, false, true, false], 'Multicast'],
  ['169.254.0.0/16', [false, true, false, false, false], 'Local'],
  ['123.4.5.6/20', [false, false, false, false, false], 'Random ip'],
];

const methods = [
  'isPrivate',
  'isLocal',
  'isLoopBack',
  'isMulticast',
  'isBroadcast',
];

const results = [];
for (const test of testsIs) {
  const [par, expected, name] = test;
  const ip = createIP(par);
  const result = [
    ip.isPrivate(),
    ip.isLocal(),
    ip.isLoopBack(),
    ip.isMulticast(),
    ip.isBroadcast(),
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
