'use strict'

class IP {
  constructor(ip, mask) {
    this.ip = ip;
    this.mask = mask;
  }
}

const parseIP = (ad) => isValidV4(ad) ? createIPv4(ad) : isValidV6(ad) ? createIPv6(ad) : new Error ("This is not valid address");

const isValidV4 = (address) => {
  if(address.includes('.') && address.includes('/')) {
    const re = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}$/;
    if(address.search(re) === 0) return true;
  }
  return false;
}

const createIPv4 = (address) => {
  const add = address.split('/');
  add[0] = add[0].split('.');
  return new IP(...add);
}

const ipToInt = ({ip}) => {
  const nums = ip.map(n => parseInt(n,10));
  if(nums.includes(NaN)) throw Error('Wrong IPv4 format');
  return nums.reduce((res, item) => (res << 8) + item);
}

const ipToBinary = ({ip}) => {
  const bin = [];
  for (let part of ip) {
    part = parseInt(part).toString(2).padStart(8,"0");       
    bin.push(part);  
  }
  return bin.join('.');
}

const ipToDotQoud = ({ip}) => {
  return ip.join('.');
}

const BITS_V4 = 32;
const BYTES_v4 = 4;

const maskToBinary = ({mask}) => {
  let num = parseInt(mask, 10);
  let bin = '';
  if(num > BITS_V4 || num < 1) throw new Error('Wrong mask');
  for(let i = 1; i <= BITS_V4; i++) {
    if(num !== 0)  {
      bin += '1';
      num--;
    } else bin += '0'
    if(i % 8 === 0 && i !== BITS_V4) bin += '.';
  }
  return bin;
}

const maskToDotQoud = ({mask}) => {
  const binMask = maskToBinary({mask}).split('.');
  for(let i = 0; i < BYTES_v4; i++) {
    binMask[i] = parseInt(binMask[i], 2);
  }
  return binMask.join('.');
}

const getNetwork = ({ip, mask}) => {
  const ipNum = ip.map(part => parseInt(part));
  const maskNum = maskToDotQoud({mask}).split('.').map(part => parseInt(part));
  const res = [];
  for(let i = 0; i < BYTES_v4; i++) {
    res.push(ipNum[i] & maskNum[i]);
  }
  return res.join('.');
}

const PRIVATE_IP = [
  ['10.0.0.0', '8'],
  ['172.16.0.0', '12'],
  ['192.168.0.0', '16'],
]

const isPrivate = ({ip, mask}) => {
  for(const net of PRIVATE_IP) {
    const netmask = net[1];
    const network = getNetwork({ip, mask:netmask});
    if(network === net[0] && parseInt(mask) >= parseInt(netmask)) return true;
  }
  return false;
}

const LOCAL = ['169.254.0.0','16'];
  
const isLocal = ({ip, mask}) => {
  const netmask = LOCAL[1];
  const network = getNetwork({ip, mask:netmask});
  if(network === LOCAL[0] && parseInt(mask) >= parseInt(netmask)) return true;
  return false;
}

const LOOPBACK = ['127.0.0.0', '8'];

const isLoopBack = ({ip, mask}) => {
  const netmask = LOOPBACK[1];
  const network = getNetwork({ip, mask:netmask});
  if(network === LOOPBACK[0] && parseInt(mask) >= parseInt(netmask)) return true;
  return false;
}

const MULTICAST = ['224.0.0.0', '4'];

const isMulticast = ({ip, mask}) => {
  const netmask = MULTICAST[1];
  const network = getNetwork({ip, mask:netmask});
  if(network === MULTICAST[0] && parseInt(mask) >= parseInt(netmask)) return true;
  return false;
}

const isBroadcast = ({ip, mask}) => {
  const binIP = ipToBinary({ip}).split('.').join('');
  for(let i = mask; i < BITS_V4; i++) {
    if(binIP[i] === '0') return false;
  }
  return true;
}

const toBroadcast = ({ip, mask}) => {
  if(isBroadcast({ip, mask})) return ip.join('.');
  const binIP = ipToBinary({ip}).split('.');
  const maskBit = Math.floor(mask / 8);
  let len = mask % 8;
  let res;
  const broadIP = [];
  for(let i = maskBit; i < 4; i++) {
    res = '';
    if (i === maskBit) res = binIP[i].slice(0, len);
    binIP[i] = res.padEnd(8,"1");
  }
  for(let value of binIP) {
    broadIP.push(parseInt(value, 2));
  }
  return broadIP.join('.');
}

const isValidV6 = (address) => {
  return true;
}

const createIPv6 = (address) => {
  const add = address.split('/');
  const mask = add[1];
  const parts = add[0].split(':');
  if(parts.length < 8 && parts.includes('')){

  }
  return new IP(parts, mask);
}

const ip6ToInt = ({ip}) => {
  const nums = ip.map(n => BigInt(parseInt(n,16)));
  if(nums.includes(NaN)) throw Error('Wrong IPv6 format');
  return nums.reduce((res, item) => (res << 16n) + item, 0n);
}

const ip6ToBinary = ({ip}) => {
  const bin = [];
  for (let part of ip) {
    part = parseInt(part, 16).toString(2).padStart(16,"0");       
    bin.push(part);  
  }
  return bin.join(':');
}

const ip6ToColonHex = ({ip}) => {
  return ip.join(':');
}

const BITS_V6 = 128;
const BYTES_v6 = 16;
const OCTETS_v6 = 32

const prefixToBinary = ({mask}) => {
  let num = parseInt(mask, 10);
  let bin = '';
  if(num >= BITS_V6 || num < 1) throw new Error('Wrong mask');
  for(let i = 1; i <= num; i++){
    bin += '1';
    if(i % BYTES_v6 === 0) bin += ':';
  }
  for(let i = num + 1; i <= BITS_V6; i++){
    bin += '0';
    if(i % BYTES_v6 === 0 && i !== BITS_V6) bin += ':';
  }
  return bin;
}

const prefixToColonHex = ({mask}) => {
  let nums = '';
  const bin = [];
  const res = [];
  for(let i = 1; i <= BITS_V6; i++) {
    if(i <= mask) nums += '1';
    else nums += '0';
    if(i % 4 === 0) {
      bin.push(nums);
      nums = '';
    }
  }
  for(let i = 0; i < 32; i++) {
    let num = bin[i];
    nums += parseInt(num, 2).toString(16);
    if(i % 4 === 3) {
      res.push(nums);
      nums = '';
    }
  }
  return res.join(':');
}

// const a = parseIP('220.255.255.255/8');
// const binIP = ipToBinary(a);
// const intIP = ipToInt(a);
// const dotip = ipToDotQoud(a);
// const binMask = maskToBinary(a);
// const mask = maskToDotQoud(a);
// const network = getNetwork(a);
// const priv = isPrivate(a);
// const localip = isLocal(a);
// const loop = isLoopBack(a); 
// const multi = isMulticast(a);
// const broad = toBroadcast(a);
//const isb = isBroadcast(a);
//console.log(a, binIP, intIP, dotip, binMask, mask, network, priv, localip, loop, multi, broad, isb); 
// const b = parseIP('1:f:ff:f2f:f:abf:0:188/54');
// const intIP6 = ip6ToInt(b);
// const bin6IP = ip6ToBinary(b);
// const colon6 = ip6ToColonHex(b);
// const mask6 = prefixToBinary(b);
// const m6 = prefixToColonHex(b);
// console.log(b, intIP6, bin6IP, colon6, mask6, m6);