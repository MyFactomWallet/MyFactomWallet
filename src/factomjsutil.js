// const assert = require('assert')
const BN = require('bn.js')
const crypto = require('crypto')
const createHash = require('create-hash')
const ed25519 = require('supercop.js')
const base58 = require('base-58')
const Buffer = require('safe-buffer').Buffer
const isHexPrefixed = require('is-hex-prefixed')
const stripHexPrefix = require('strip-hex-prefix')

/**
 * the factoid public address prefix
 * @var {Buffer} "5fb1"
 */
exports.FACTOID_PUBLIC_PREFIX = Buffer.from('5fb1', 'hex')

/**
 * the factoid private address prefix
 * @var {Buffer} "5fb1"
 */
exports.FACTOID_PRIVATE_PREFIX = Buffer.from('6478', 'hex')

/**
 * the entrycredit public address prefix
 * @var {Buffer} "5fb1"
 */
exports.ENTRYCREDIT_PUBLIC_PREFIX = Buffer.from('592a', 'hex')

/**
 * the entrycredit private address prefix
 * @var {Buffer} "5fb1"
 */
exports.ENTRYCREDIT_PRIVATE_PREFIX = Buffer.from('5db6', 'hex')

/**
 * the max integer that this VM can handle (a ```BN```)
 * @var {BN} MAX_INTEGER
 */
exports.MAX_INTEGER = new BN('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16)

/**
 * 2^256 (a ```BN```)
 * @var {BN} TWO_POW256
 */
exports.TWO_POW256 = new BN('10000000000000000000000000000000000000000000000000000000000000000', 16)

/**
 * [`BN`](https://github.com/indutny/bn.js)
 * @var {Function}
 */
exports.BN = BN

/**
 * Checks if the address satisfies the prefix and checksum
 * @param {String} address The human readable address
 * @return {Boolean}
 */
function isValidAddress (address) {
  try {
    var add = base58.decode(address)
    if (add.length !== 38) {
      return false
    }

    switch (address.substring(0, 2)) {
      case 'Fs':
        break
      case 'FA':
        break
      case 'Es':
        break
      case 'EC':
        break
      default:
        return false
    }

    var checksum = sha256d(copyBuffer(add, 0, 34))
    if (bufferToHex(copyBuffer(checksum, 0, 4)) === bufferToHex(copyBuffer(add, 34, 38))) {
      return true
    }
  } catch (err) {
    console.log(err)
    return false
  }

  return false
}

/**
 * Returns the factom human readable address for a factoid public.
 * @param {Buffer} key The 32 byte buffer of the key
 * @return {String} "Fa..."
 */
function publicFactoidKeyToHumanAddress (key) {
  return keyToAddress(key, 'FA')
}

/**
 * Returns the factom human readable address for a factoid secret.
 * @param {Buffer} key The 32 byte buffer of the key
 * @return {String} "Fa..."
 */
function privateFactoidKeyToHumanAddress (key) {
  return keyToAddress(key, 'Fs')
}

/**
 * Returns the factom human readable address for a entry credit public.
 * @param {Buffer} key The 32 byte buffer of the key
 * @return {String} "Ec..."
 */
function publicECKeyToHumanAddress (key) {
  return keyToAddress(key, 'EC')
}

/**
 * Returns the factom human readable address for a entry credit secret.
 * @param {Buffer} key The 32 byte buffer of the key
 * @return {String} "Es..."
 */
function privateECKeyToHumanAddress (key) {
  return keyToAddress(key, 'Es')
}

/**
 * Returns the factom human readable address for a key.
 * @param {Buffer} key The 32 byte buffer of the key
 * @param {String} prefix FA, Fs, EC, or Es
 * @return {String}
 */
function keyToAddress (pubKey, prefix) {
  if (pubKey.length !== 32) {
    throw new Error('pubkey must be 32 bytes')
  }

  pubKey = toBuffer(pubKey)
  var address
  switch (prefix) {
    case 'FA':
      address = Buffer.concat([exports.FACTOID_PUBLIC_PREFIX, keyToRCD(pubKey)])
      break
    case 'Fs':
      address = Buffer.concat([exports.FACTOID_PRIVATE_PREFIX, pubKey])
      break
    case 'EC':
      address = Buffer.concat([exports.ENTRYCREDIT_PUBLIC_PREFIX, keyToRCD(pubKey)])
      break
    case 'Es':
      address = Buffer.concat([exports.ENTRYCREDIT_PRIVATE_PREFIX, pubKey])
      break
    default:
      address = Buffer.concat([exports.FACTOID_PUBLIC_PREFIX, pubKey])
  }
  var checksum = sha256d(address)
  return base58.encode(Buffer.concat([address, checksum.slice(0, 4)]))
}

/**
 * Returns the rcd for a given public key. Type 1
 * @param {Buffer} key The 32 byte buffer of the key
 * @return {Buffer} rcd
 */
function keyToRCD (key) {
  return sha256d(Buffer.concat([Buffer.from('01', 'hex'), key]))
}

/**
 * Returns the factom public key of a given private key
 * @param {Buffer} privateKey A private key must be 256 bits wide
 * @return {Buffer}
 */
function privateKeyToPublicKey (privateKey) {
  if (privateKey.length !== 32) {
    throw new Error('expect length 32')
  }
  privateKey = toBuffer(privateKey)
  var keypair = ed25519.createKeyPair(privateKey)
  return keypair.publicKey
}

/**
 * ed25519 sign
 * @param {Buffer} msg
 * @param {Buffer} privateKey
 * @return {Buffer} signature
 */
function edsign (msg, publickey, privateKey) {
  return ed25519.sign(msg, publickey, privateKey)
}

function privateHumanAddressStringToPrivate (address) {
  if (isValidAddress(address) && address.substring(0, 2) === 'Fs') {
    var fulladd = base58.decode(address)
    var key = copyBuffer(fulladd, 2, 34)
    return key
  }
  throw new Error('invalid address')
}

/**
 * Generates a new random private key.
 * @return {Buffer}
 */
function randomPrivateKey (from, nonce) {
  return crypto.randomBytes(32)
}

/**
 * Validate 25519 signature
 * @method isValidSignature
 * @param {Buffer} msg
 * @param {Buffer} sig
 * @param {Buffer} pubkey
 * @return {Boolean}
 */
function isValidSignature (msg, sig, pubkey) {
  return ed25519.Verify(sig, msg, pubkey)
}

/*
 *
 *    Utility Functions
 *
 */

/**
 * Returns a buffer filled with 0s
 * @method zeros
 * @param {Number} bytes  the number of bytes the buffer should be
 * @return {Buffer}
 */
function zeros (bytes) {
  return Buffer.allocUnsafe(bytes).fill(0)
}

/**
 * Left Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
 * Or it truncates the beginning if it exceeds.
 * @method lsetLength
 * @param {Buffer|Array} msg the value to pad
 * @param {Number} length the number of bytes the output should be
 * @param {Boolean} [right=false] whether to start padding form the left or right
 * @return {Buffer|Array}
 */
function setLengthLeft (msg, length, right) {
  var buf = zeros(length)
  msg = toBuffer(msg)
  if (right) {
    if (msg.length < length) {
      msg.copy(buf)
      return buf
    }
    return msg.slice(0, length)
  } else {
    if (msg.length < length) {
      msg.copy(buf, length - msg.length)
      return buf
    }
    return msg.slice(-length)
  }
}

function setLength (msg, length, right) {
  return setLengthLeft(msg, length, right)
}

/**
 * Right Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
 * Or it truncates the beginning if it exceeds.
 * @param {Buffer|Array} msg the value to pad
 * @param {Number} length the number of bytes the output should be
 * @return {Buffer|Array}
 */
function setLengthRight (msg, length) {
  return setLength(msg, length, true)
}

/**
 * Trims leading zeros from a `Buffer` or an `Array`
 * @param {Buffer|Array|String} a
 * @return {Buffer|Array|String}
 */
function unpad (a) {
  a = stripHexPrefix(a)
  var first = a[0]
  while (a.length > 0 && first.toString() === '0') {
    a = a.slice(1)
    first = a[0]
  }
  return a
}
/**
 * Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.
 * @param {*} v the value
 */
function toBuffer (v) {
  if (!Buffer.isBuffer(v)) {
    if (Array.isArray(v)) {
      v = Buffer.from(v)
    } else if (typeof v === 'string') {
      if (isHexString(v)) {
        v = Buffer.from(padToEven(stripHexPrefix(v)), 'hex')
      } else {
        v = Buffer.from(v)
      }
    } else if (typeof v === 'number') {
      v = intToBuffer(v)
    } else if (v === null || v === undefined) {
      v = Buffer.allocUnsafe(0)
    } else if (v.toArray) {
      // converts a BN to a Buffer
      v = Buffer.from(v.toArray())
    } else {
      throw new Error('invalid type')
    }
  }
  return v
}

function copyBuffer (buf, from, to) {
  var copy = Buffer.from(buf)
  copy = copy.slice(from, to)
  return copy
}

/**
 * Converts a `Buffer` to a `Number`
 * @param {Buffer} buf
 * @return {Number}
 * @throws If the input number exceeds 53 bits.
 */
function bufferToInt (buf) {
  return new BN(toBuffer(buf)).toNumber()
}

/**
 * Converts a `Buffer` into a hex `String`
 * @param {Buffer} buf
 * @return {String}
 */
function bufferToHex (buf) {
  buf = toBuffer(buf)
  return '0x' + buf.toString('hex')
}

/**
 * Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.
 * @param {Buffer} num
 * @return {BN}
 */
function fromSigned (num) {
  return new BN(num).fromTwos(256)
}

/**
 * Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.
 * @param {BN} num
 * @return {Buffer}
 */
function toUnsigned (num) {
  return Buffer.from(num.toTwos(256).toArray())
}

/**
 * Creates SHA256 hash of the input
 * @param {Buffer|Array|String|Number} a the input data
 * @return {Buffer}
 */
function sha256 (a) {
  a = toBuffer(a)
  return createHash('sha256').update(a).digest()
}

/**
 * Creates SHA256D hash of the input
 * @param {Buffer|Array|String|Number} a the input data
 * @return {Buffer}
 */
function sha256d (a) {
  return sha256(sha256(a))
}

/**
 * Adds "0x" to a given `String` if it does not already start with "0x"
 * @param {String} str
 * @return {String}
 */
function addHexPrefix (str) {
  if (typeof str !== 'string') {
    return str
  }

  return isHexPrefixed(str) ? str : '0x' + str
}

/**
 * Converts a `Buffer` or `Array` to JSON
 * @param {Buffer|Array} ba
 * @return {Array|String|null}
 */
function baToJSON (ba) {
  if (Buffer.isBuffer(ba)) {
    return '0x' + ba.toString('hex')
  } else if (ba instanceof Array) {
    var array = []
    for (var i = 0; i < ba.length; i++) {
      array.push(baToJSON(ba[i]))
    }
    return array
  }
}

/**
 * Pads a `String` to have an even length
 * @param {String} value
 * @return {String} output
 */
function padToEven (value) {
  var a = value; // eslint-disable-line

  if (typeof a !== 'string') {
    throw new Error(`[ethjs-util] while padding to even, value must be string, is currently ${typeof a}, while padToEven.`)
  }

  if (a.length % 2) {
    a = `0${a}`
  }

  return a
}

/**
 * Is the string a hex string.
 *
 * @method check if string is hex string of specific length
 * @param {String} value
 * @param {Number} length
 * @returns {Boolean} output the string is a hex string
 */
function isHexString (value, length) {
  if (typeof (value) !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false
  }

  if (length && value.length !== 2 + 2 * length) { return false }

  return true
}

/**
 * Converts an `Number` to a `Buffer`
 * @param {Number} i
 * @return {Buffer}
 */
function intToBuffer (i) {
  const hex = intToHex(i)

  return new Buffer(hex.slice(2), 'hex')
}

/**
 * Converts a `Number` into a hex `String`
 * @param {Number} i
 * @return {String}
 */
function intToHex (i) {
  var hex = i.toString(16); // eslint-disable-line

  return `0x${padToEven(hex)}`
}

module.exports = {
  baToJSON,
  isValidSignature,
  randomPrivateKey,
  keyToRCD,
  privateKeyToPublicKey,
  edsign,
  keyToAddress,
  privateFactoidKeyToHumanAddress,
  publicECKeyToHumanAddress,
  privateECKeyToHumanAddress,
  publicFactoidKeyToHumanAddress,
  privateHumanAddressStringToPrivate,
  sha256,
  sha256d,
  isValidAddress,
  zeros,
  setLengthLeft,
  setLengthRight,
  unpad,
  toBuffer,
  copyBuffer,
  bufferToInt,
  bufferToHex,
  setLength,
  fromSigned,
  toUnsigned,
  intToBuffer,
  intToHex,
  addHexPrefix

}
