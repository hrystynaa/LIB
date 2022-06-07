'use strict'

const BITS_V4 = 32;
const BYTES_v4 = 4;
const LOCAL = ['169.254.0.0','16'];
const LOOPBACK = ['127.0.0.0', '8'];
const MULTICAST = ['224.0.0.0', '4'];
const PRIVATE_IP = [
  ['10.0.0.0', '8'],
  ['172.16.0.0', '12'],
  ['192.168.0.0', '16'],
]
const BITS_V6 = 128;
const OCTETS_V6 = 32;
const BYTES_V6 = 16;
const COLONS_V6 = 8;
const MULTICAST_V6 = ['ff00', '8'];
const GLOBAL_V6 = ['001', '3'];
const LOOPBACK_V6 = ['1', '128'];
const LINK_LOCAL = ['fe80:0:0:0', '64'];


class IPv4 {
  constructor(ip, mask) {
    this.ip = ip;
    this.mask = mask;
  }
  
  ipToInt() {
    const nums = this.ip.map(n => parseInt(n,10));
    if(nums.includes(NaN)) throw Error('Wrong IPv4 format');
    return nums.reduce((res, item) => (res << 8) + item);
  }
  
  ipToBinary() {
    const bin = [];
    for (let part of this.ip) {
      part = parseInt(part).toString(2).padStart(8,"0");       
      bin.push(part);  
    }
    return bin.join('.');
  }

  ipToDotQoud() {
    return this.ip.join('.');
  }

  maskToBinary() {
    let num = parseInt(this.mask, 10);
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

  maskToDotQoud() {
    const binMask = this.maskToBinary().split('.');
    for(let i = 0; i < BYTES_v4; i++) {
      binMask[i] = parseInt(binMask[i], 2);
    }
    return binMask.join('.');
  }

  getNetwork() {
    const ipNum = this.ip.map(part => parseInt(part));
    const maskNum = this.maskToDotQoud().split('.').map(part => parseInt(part));
    const res = [];
    for(let i = 0; i < BYTES_v4; i++) {
      res.push(ipNum[i] & maskNum[i]);
    }
    return res.join('.');
  }

  isPrivate() {
    for(const net of PRIVATE_IP) {
      const netmask = net[1];
      const network = this.getNetwork();
      if(network === net[0] && parseInt(mask) >= parseInt(netmask)) return true;
    }
    return false;
  }

  isLocal() {
    const netmask = LOCAL[1];
    const network = this.getNetwork();
    if(network === LOCAL[0] && parseInt(this.mask) >= parseInt(netmask)) return true;
    return false;
  }

  isLoopBack() {
    const netmask = LOOPBACK[1];
    const network = this.getNetwork();
    if(network === LOOPBACK[0] && parseInt(this.mask) >= parseInt(netmask)) return true;
    return false;
  }

  isMulticast() {
    const netmask = MULTICAST[1];
    const network = this.getNetwork();
    if(network === MULTICAST[0] && parseInt(this.mask) >= parseInt(netmask)) return true;
    return false;
  }

  isBroadcast() {
    const binIP = this.ipToBinary().split('.').join('');
    for(let i = this.mask; i < BITS_V4; i++) {
      if(binIP[i] === '0') return false;
    }
    return true;
  }

  toBroadcast() {
    if(this.isBroadcast()) return this.ip.join('.');
    const binIP = this.ipToBinary().split('.');
    const maskBit = Math.floor(this.mask / 8);
    let len = this.mask % 8;
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
}

class IPv6 {
  constructor(ip, mask) {
    this.ip = ip;
    this.mask = mask;
  }

  ipToInt() {
    const nums = this.ip.map(n => BigInt(parseInt(n,16)));
    if(nums.includes(NaN)) throw Error('Wrong IPv6 format');
    return nums.reduce((res, item) => (res << 16n) + item, 0n);
  }

  ipToBinary() {
    const bin = [];
    for (let part of this.ip) {
      part = parseInt(part, 16).toString(2).padStart(16,"0");       
      bin.push(part);  
    }
    return bin.join(':');
  }

  ipToColonHex() {
    return this.ip.join(':');
  }

  prefixToBinary() {
    let num = parseInt(this.mask, 10);
    let bin = '';
    if(num > BITS_V6 || num < 1) throw new Error('Wrong mask');
    for(let i = 1; i <= num; i++){
      bin += '1';
      if(i % BYTES_V6 === 0) bin += ':';
    }
    for(let i = num + 1; i <= BITS_V6; i++){
      bin += '0';
      if(i % BYTES_V6 === 0 && i !== BITS_V6) bin += ':';
    }
    return bin;
  }

  prefixToColonHex() {
    let nums = '';
    const bin = [];
    const res = [];
    for(let i = 1; i <= BITS_V6; i++) {
      if(i <= this.mask) nums += '1';
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

  getNetwork() {
    const ipNum = this.ip.map(part => parseInt(part, 16));
    const maskNum = this.prefixToColonHex().split(':').map(part => parseInt(part, 16));
    const net = [];
    for(let i = 0; i < COLONS_V6; i++) {
      net.push(ipNum[i] & maskNum[i]);
    }
    const res = net.map(num => num.toString(16).padStart(4, "0"));
      for(let i = res.length - 1; i >= 0; i--) {
      if(parseInt(res[i], 16) !== 0) { 
        res.splice(i+1);
        res.push(":");
      }
    }
    return res.join(':'); 
  }

  isMulticast() {
    const part = parseInt(this.ip[0],16);
    const mpart = parseInt(MULTICAST_V6[0], 16);
    if(part >= mpart && parseInt(this.mask) >= parseInt(MULTICAST_V6[1])) {
      return true;
    }
    return false;
  }

  isGlobal() {
    const part = this.ipToBinary().slice(0,3);
    if(part === GLOBAL_V6[0] && parseInt(this.mask) >= parseInt(GLOBAL_V6[1])) return true;
    return false;
  }

  isLoopback() {
    const nums = this.ip.map(part => parseInt(part, 16));
    if(parseInt(this.mask) === parseInt(LOOPBACK_V6[1])) {
      const sum = nums.reduce((prev, item) => item + prev, 0);
      if(sum === 1) return true;
    }
    return false;
  }

  isLinkLocal() {
    const link = LINK_LOCAL[0].split(':');
    //const nums = this.ip.slice(0,4);
    let res = true;
    if(parseInt(this.mask) >= parseInt(LINK_LOCAL[1])) {
      for( let i = 0; i < 4; i++) {
        res = res && parseInt(link[i], 16) === parseInt(this.ip[i], 16);
      }
    }
    return res;
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
  return new IPv4(...add);
}

const isValidV6 = (address) => {
  let res = true;
  res = res && address.includes(':') && address.includes('/');
  const re = /[0-9a-f]{0,4}\:[0-9a-f]{0,4}\:[0-9a-f]{0,4}\:[0-9a-f]{0,4}\:[0-9a-f]{0,4}\:[0-9a-f]{0,4}\:[0-9a-f]{0,4}\:[0-9a-f]{0,4}\/\d{1,3}$/;
  res = res && address.search(re) === 0;
  if(address.includes('::')) {
    res = res && address.includes('::') && address.indexOf('::') === address.lastIndexOf('::');
  }
  return res;
}

const createIPv6 = (address) => {
  const add = address.split('/');
  const mask = add[1];
  const parts = add[0].split(':');
  if(parts.length < 8 && parts.includes('')){
    const i = indexOf('::');
    parts.splice(i, 1, '0000');
    while(parts.length < 8) {
      i++;
      parts.splice(i, 0, '0000');
    }
  }
  const ip = parts.map(part => part.padStart(4, "0"));
  return new IPv6(ip, mask);
}

const a = parseIP('220.255.255.255/8');
const binIP = a.ipToBinary();
const intIP = a.ipToInt();
const dotip = a.ipToDotQoud();
const binMask = a.maskToBinary();
const mask = a.maskToDotQoud();
const network = a.getNetwork();
const priv = a.isPrivate();
const localip = a.isLocal();
const loop = a.isLoopBack(); 
const multi = a.isMulticast();
const broad = a.toBroadcast();
const isb = a.isBroadcast();
console.log(a, binIP, intIP, dotip, binMask, mask, network, priv, localip, loop, multi, broad, isb); 
const b = parseIP('fe80:000:0:0:0:0:0:1/64');
const intIP6 = b.ipToInt();
const bin6IP = b.ipToBinary();
const colon6 = b.ipToColonHex();
const mask6 = b.prefixToBinary();
const m6 = b.prefixToColonHex();
const net6 = b.getNetwork();
const mul6 = b.isMulticast();
const glob6 = b.isGlobal();
const loopbackv6 = b.isLoopback();
const link = b.isLinkLocal();
console.log(b, intIP6, bin6IP, colon6, mask6, m6, net6, mul6, glob6, loopbackv6, link);