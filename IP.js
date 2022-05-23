'use strict'

class IPv4 {
  constructor(ip, mask) {
    this.ip = ip;
    this.mask = mask;
  }
}
  
const createIPv4 = (address) => {
  const add = address.split('/');
  add[0] = add[0].split('.');
  return new IPv4(...add);
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

const createIPv6 = (address) => {

}

const a = parseIP('123.4.5.6/23');
const binIP = ipToBinary(a);
const intIP = ipToInt(a);
const strIP = ipToString(a);
const binMask = maskToBinary(a);
const mask = maskToDotQoud(a);
const network = getNetwork(a);
console.log(a, binIP, intIP, strIP, binMask, mask, network); 