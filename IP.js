'use strict'

class IP {
  constructor(ip, mask) {
    this.ip = ip;
    this.mask = mask;
  }
}
  
const createIPv4 = (address) => {
  const add = address.split('/');
  add[0] = add[0].split('.');
  return new IP(...add);
}

const parseIP = (ad) => ad.includes('.') ? createIPv4(ad) : createIPv6(ad);//must be isValidate function

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

const ipToString = ({ip}) => {
  const str = ip.map(s => s.toString());
  return str.join('.');
}

const ipToDotQoud = ({ip}) => {
  return ip.join('.');
}

const maskToBinary = ({mask}) => {
  let num = parseInt(mask, 10);
  let bin = '';
  if(num >= 32 || num < 1) throw new Error('Wrong mask');
  for(let i = 1; i <= 32; i++) {
    if(num !== 0)  {
      bin += '1';
      num--;
    } else bin += '0'
    if(i % 8 === 0 && i !== 32) bin += '.';
  }
  return bin;
}

const maskToDotQoud = ({mask}) => {
  const a = maskToBinary({mask}).split('.');
  for(let i = 0; i < 4; i++) {
    a[i] = parseInt(a[i], 2);
  }
  return a.join('.');
}

const getNetwork = ({ip, mask}) => {
  const i = ip.map(part => parseInt(part));
  const m = maskToDotQoud({mask}).split('.').map(part => parseInt(part));
  const res = [];
  for(let j = 0; j < 4; j++) {
    res.push(i[j] & m[j]);
  }
  return res.join('.');
}

const privateIP = [
  ['10.0.0.0', '8'],
  ['172.16.0.0', '12'],
  ['192.168.0.0', '16'],
]

const isPrivate = (ip) => {
  const network = getNetwork(ip);
  const address = [network, ip.mask];
  let res = true;
  for(const value of local){
    for(let i = 0; i < address.length; i++){
      res = res && address[i] === value[i];
    }
  res = true;
  }
  return res;
}

const local = ['169.254.0.0','16'];
  
const isLocal = (ip) => {
  const network = getNetwork(ip);
  const address = [network, ip.mask];
  let res = true;
  for(const value of local){
  res = res && address.includes(value);
  }
  return res;
}

const loopBack = ['127.0.0.0', '8'];

const isLoopBack = (ip) => {
  const network = getNetwork(ip);
  const address = [network, ip.mask];
  let res = true;
  for(const value of loopBack){
  res = res && address.includes(value);
  }
  return res;
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

const ipToColonHex = ({ip}) => {
  return ip.join(':');
}

const mask6ToBinary = ({mask}) => {
  let num = parseInt(mask, 10);
  let bin = '';
  if(num >= 128 || num < 1) throw new Error('Wrong mask');
  for(let i = 1; i <= num; i++){
    bin += '1';
    if(i % 16 === 0) bin += ':';
  }
  for(let i = num + 1; i <= 128; i++){
    bin += '0';
    if(i % 16 === 0 && i !== 128) bin += ':';
  }
  // for(let i = 1; i <= 128; i++) {
  //   if(num !== 0)  {
  //     bin += '1';
  //     num--;
  //   } else bin += '0'
  //   if(i % 16 === 0 && i !== 128) bin += ':';
  // }
  return bin;
}

const maskToHex = ({mask}) => {
  
}


const a = parseIP('10.2.2.202/8');
const binIP = ipToBinary(a);
const intIP = ipToInt(a);
const strIP = ipToString(a);
const binMask = maskToBinary(a);
const mask = maskToDotQoud(a);
const network = getNetwork(a);
const priv = isPrivate(a);
const localip = isLocal(a);
const loop = isLoopBack(a); 
console.log(a, binIP, intIP, strIP, binMask, mask, network, priv, localip, loop); 
const b = parseIP('1:f:ff:f2f:f:abf:0:188/64');
const intIP6 = ip6ToInt(b);
const bin6IP = ip6ToBinary(b);
const colon6 = ipToColonHex(b);
const mask6 = mask6ToBinary(b);
console.log(b, intIP6, bin6IP, colon6, mask6);