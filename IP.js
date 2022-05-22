'use strict'

class IPv4 {
  constructor(add, mask, port = 0) {
    this.addr = add;
    this.maskk = mask;
    this.port = port;
  }
  
  getAddress() {
    return this.addr.join('.');
  }

  getMask() {
    return this.maskk.join('.');
  }

  getNetwork() {
    const n = toBinary();
    for(let i = 0; i < n.length; i++) {
      
    }

  }

  toBinary() {
    const bin = [];
    for (let num of this.addr) {
      num = parseInt(num);
      num = num.toString(2).padStart(8,"0");
      bin.push(num);
    }
    //bin = bin.join('.');
    return bin.join('.');
  }

  toString() {
    return this.addr.join('.');
  }
}
const createIPv4 = (address) => {
  const add = address.split('/');
  const addr = add[0].split('.');
  const mask = maskToBinary(add[1]);
  return new IPv4(addr,mask);
}

const maskToBinary = (val) => {
  const mask = ['','','',''];
  if(val >= 32 || val < 1) {
  }
  for(let i = 0; i < 4; i++) {
    let bit = 8;
    while(bit > 0) {
      if(val !== 0)  {
        mask[i] += '1';
        val--;
      } else mask[i] += '0'
        bit--; 
    }
  }
  return mask;
}

const binaryToNumb = (mask) => {
  const maskk = [];
  for(let str of mask) {
    str = parseInt(str, 2);
    maskk.push(str);
  }
  return maskk;
}

const createIPv6 = (address) => {

}

const toBinary = (add) => {
  const ad = add.split('.');
  console.log(ad);
  let bin = [];
  for (let num of ad) {
    num = parseInt(num);
    console.log(num);
    num = num.toString(2).padStart(8,"0");
    bin.push(num);
  }
  bin = bin.join('.');
  return bin
}

const networkV4 = (address, mask) => {
  
}


const ipAd = (add) => {
    const address = add.split('/');
    
}

const parseIP = (ad) => ad.includes('.') ? createIPv4(ad) : createIPv6(ad);

const aaaa = parseIP('123.3.4.2/24');
console.log(aaaa);
console.log((aaaa.toBinary()));
console.log("hola")
console.log(binaryToNumb(maskToBinary(24)));