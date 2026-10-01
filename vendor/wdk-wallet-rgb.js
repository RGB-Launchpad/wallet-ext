// Bundled from @darkhorse-wallet/wdk-wallet-rgb. Apache-2.0. Do not edit; see NOTICE.
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "node_modules/base64-js/index.js"(exports) {
    "use strict";
    init_buffer_shim();
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    var i;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b642) {
      var len2 = b642.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b642.indexOf("=");
      if (validLen === -1) validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b642) {
      var lens = getLens(b642);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b642, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b642) {
      var tmp;
      var lens = getLens(b642);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b642, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b642.charCodeAt(i2)] << 18 | revLookup[b642.charCodeAt(i2 + 1)] << 12 | revLookup[b642.charCodeAt(i2 + 2)] << 6 | revLookup[b642.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b642.charCodeAt(i2)] << 2 | revLookup[b642.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b642.charCodeAt(i2)] << 10 | revLookup[b642.charCodeAt(i2 + 1)] << 4 | revLookup[b642.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
        );
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
        );
      }
      return parts.join("");
    }
  }
});

// node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "node_modules/ieee754/index.js"(exports) {
    init_buffer_shim();
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    };
  }
});

// node_modules/buffer/index.js
var require_buffer = __commonJS({
  "node_modules/buffer/index.js"(exports) {
    "use strict";
    init_buffer_shim();
    var base64 = require_base64_js();
    var ieee754 = require_ieee754();
    var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports.Buffer = Buffer3;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        const arr = new Uint8Array(1);
        const proto = { foo: function() {
          return 42;
        } };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer3.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this)) return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer3.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this)) return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      }
      const buf = new Uint8Array(length);
      Object.setPrototypeOf(buf, Buffer3.prototype);
      return buf;
    }
    function Buffer3(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        }
        return allocUnsafe(arg);
      }
      return from(arg, encodingOrOffset, length);
    }
    Buffer3.poolSize = 8192;
    function from(value, encodingOrOffset, length) {
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
      }
      if (value == null) {
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof value === "number") {
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      }
      const valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer3.from(valueOf, encodingOrOffset, length);
      }
      const b = fromObject(value);
      if (b) return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
      }
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    Buffer3.from = function(value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    };
    Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer3, Uint8Array);
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer3.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer3.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer3.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer3.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      const length = byteLength(string, encoding) | 0;
      let buf = createBuffer(length);
      const actual = buf.write(string, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike(array) {
      const length = array.length < 0 ? 0 : checked(array.length) | 0;
      const buf = createBuffer(length);
      for (let i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }
      return buf;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
      }
      return fromArrayLike(arrayView);
    }
    function fromArrayBuffer(array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      let buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array);
      } else if (length === void 0) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      }
      Object.setPrototypeOf(buf, Buffer3.prototype);
      return buf;
    }
    function fromObject(obj) {
      if (Buffer3.isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf = createBuffer(len);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }
    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length | 0;
    }
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer3.alloc(+length);
    }
    Buffer3.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer3.prototype;
    };
    Buffer3.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array)) a = Buffer3.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array)) b = Buffer3.from(b, b.offset, b.byteLength);
      if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      }
      if (a === b) return 0;
      let x = a.length;
      let y = b.length;
      for (let i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    Buffer3.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer3.concat = function concat(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer3.alloc(0);
      }
      let i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      const buffer = Buffer3.allocUnsafe(length);
      let pos = 0;
      for (i = 0; i < list.length; ++i) {
        let buf = list[i];
        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer.length) {
            if (!Buffer3.isBuffer(buf)) buf = Buffer3.from(buf);
            buf.copy(buffer, pos);
          } else {
            Uint8Array.prototype.set.call(
              buffer,
              buf,
              pos
            );
          }
        } else if (!Buffer3.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer, pos);
        }
        pos += buf.length;
      }
      return buffer;
    };
    function byteLength(string, encoding) {
      if (Buffer3.isBuffer(string)) {
        return string.length;
      }
      if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
      }
      if (typeof string !== "string") {
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
        );
      }
      const len = string.length;
      const mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0) return 0;
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
            return utf8ToBytes(string).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes(string).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      let loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding) encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.prototype._isBuffer = true;
    function swap(b, n, m) {
      const i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    Buffer3.prototype.swap16 = function swap16() {
      const len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (let i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer3.prototype.swap32 = function swap32() {
      const len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (let i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer3.prototype.swap64 = function swap64() {
      const len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (let i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer3.prototype.toString = function toString2() {
      const length = this.length;
      if (length === 0) return "";
      if (arguments.length === 0) return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
    Buffer3.prototype.equals = function equals(b) {
      if (!Buffer3.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
      if (this === b) return true;
      return Buffer3.compare(this, b) === 0;
    };
    Buffer3.prototype.inspect = function inspect() {
      let str = "";
      const max = exports.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max) str += " ... ";
      return "<Buffer " + str + ">";
    };
    if (customInspectSymbol) {
      Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
    }
    Buffer3.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer3.from(target, target.offset, target.byteLength);
      }
      if (!Buffer3.isBuffer(target)) {
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
        );
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target) return 0;
      let x = thisEnd - thisStart;
      let y = end - start;
      const len = Math.min(x, y);
      const thisCopy = this.slice(thisStart, thisEnd);
      const targetCopy = target.slice(start, end);
      for (let i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
      if (buffer.length === 0) return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length - 1;
      }
      if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
      if (byteOffset >= buffer.length) {
        if (dir) return -1;
        else byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
      }
      if (typeof val === "string") {
        val = Buffer3.from(val, encoding);
      }
      if (Buffer3.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1;
      let arrLength = arr.length;
      let valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      let i;
      if (dir) {
        let foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          let found = true;
          for (let j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
          }
          if (found) return i;
        }
      }
      return -1;
    }
    Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string, offset, length) {
      offset = Number(offset) || 0;
      const remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      const strLen = string.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      let i;
      for (i = 0; i < length; ++i) {
        const parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length);
    }
    function base64Write(buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length);
    }
    function ucs2Write(buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }
    Buffer3.prototype.write = function write(string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === void 0) encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      const remaining = this.length - offset;
      if (length === void 0 || length > remaining) length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding) encoding = "utf8";
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer3.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      const res = [];
      let i = start;
      while (i < end) {
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    var MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      const len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      let res = "";
      let i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      const len = buf.length;
      if (!start || start < 0) start = 0;
      if (!end || end < 0 || end > len) end = len;
      let out = "";
      for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      const bytes = buf.slice(start, end);
      let res = "";
      for (let i = 0; i < bytes.length - 1; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res;
    }
    Buffer3.prototype.slice = function slice(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start) end = start;
      const newBuf = this.subarray(start, end);
      Object.setPrototypeOf(newBuf, Buffer3.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
      if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      let val = this[offset + --byteLength2];
      let mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
      const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
      return BigInt(lo) + (BigInt(hi) << BigInt(32));
    });
    Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
      return (BigInt(hi) << BigInt(32)) + BigInt(lo);
    });
    Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let i = byteLength2;
      let mul = 1;
      let val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128)) return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
      return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
    });
    Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = (first << 24) + // Overflow
      this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
    });
    Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, true, 23, 4);
    };
    Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, false, 23, 4);
    };
    Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, true, 52, 8);
    };
    Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max, min) {
      if (!Buffer3.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
    }
    Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let mul = 1;
      let i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    function wrtBigUInt64LE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      return offset;
    }
    function wrtBigUInt64BE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset + 7] = lo;
      lo = lo >> 8;
      buf[offset + 6] = lo;
      lo = lo >> 8;
      buf[offset + 5] = lo;
      lo = lo >> 8;
      buf[offset + 4] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset + 3] = hi;
      hi = hi >> 8;
      buf[offset + 2] = hi;
      hi = hi >> 8;
      buf[offset + 1] = hi;
      hi = hi >> 8;
      buf[offset] = hi;
      return offset + 8;
    }
    Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = 0;
      let mul = 1;
      let sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      let sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
      if (value < 0) value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };
    Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0) value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function checkIEEE754(buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
      if (offset < 0) throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer3.isBuffer(target)) throw new TypeError("argument should be a Buffer");
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start;
      if (end === start) return 0;
      if (target.length === 0 || this.length === 0) return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
      if (end < 0) throw new RangeError("sourceEnd out of bounds");
      if (end > this.length) end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      const len = end - start;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, end),
          targetStart
        );
      }
      return len;
    };
    Buffer3.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          const code = val.charCodeAt(0);
          if (encoding === "utf8" && code < 128 || encoding === "latin1") {
            val = code;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      } else if (typeof val === "boolean") {
        val = Number(val);
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val) val = 0;
      let i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
        const len = bytes.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    };
    var errors = {};
    function E(sym, getMessage, Base) {
      errors[sym] = class NodeError extends Base {
        constructor() {
          super();
          Object.defineProperty(this, "message", {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true
          });
          this.name = `${this.name} [${sym}]`;
          this.stack;
          delete this.name;
        }
        get code() {
          return sym;
        }
        set code(value) {
          Object.defineProperty(this, "code", {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        }
        toString() {
          return `${this.name} [${sym}]: ${this.message}`;
        }
      };
    }
    E(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(name) {
        if (name) {
          return `${name} is outside of buffer bounds`;
        }
        return "Attempt to access memory outside buffer bounds";
      },
      RangeError
    );
    E(
      "ERR_INVALID_ARG_TYPE",
      function(name, actual) {
        return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
      },
      TypeError
    );
    E(
      "ERR_OUT_OF_RANGE",
      function(str, range, input) {
        let msg = `The value of "${str}" is out of range.`;
        let received = input;
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        }
        msg += ` It must be ${range}. Received ${received}`;
        return msg;
      },
      RangeError
    );
    function addNumericalSeparator(val) {
      let res = "";
      let i = val.length;
      const start = val[0] === "-" ? 1 : 0;
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }
      return `${val.slice(0, i)}${res}`;
    }
    function checkBounds(buf, offset, byteLength2) {
      validateNumber(offset, "offset");
      if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
        boundsError(offset, buf.length - (byteLength2 + 1));
      }
    }
    function checkIntBI(value, min, max, buf, offset, byteLength2) {
      if (value > max || value < min) {
        const n = typeof min === "bigint" ? "n" : "";
        let range;
        if (byteLength2 > 3) {
          if (min === 0 || min === BigInt(0)) {
            range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
          } else {
            range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
          }
        } else {
          range = `>= ${min}${n} and <= ${max}${n}`;
        }
        throw new errors.ERR_OUT_OF_RANGE("value", range, value);
      }
      checkBounds(buf, offset, byteLength2);
    }
    function validateNumber(value, name) {
      if (typeof value !== "number") {
        throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
      }
    }
    function boundsError(value, length, type) {
      if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
      }
      if (length < 0) {
        throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
      }
      throw new errors.ERR_OUT_OF_RANGE(
        type || "offset",
        `>= ${type ? 1 : 0} and <= ${length}`,
        value
      );
    }
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2) return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function utf8ToBytes(string, units) {
      units = units || Infinity;
      let codePoint;
      const length = string.length;
      let leadSurrogate = null;
      const bytes = [];
      for (let i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            } else if (i + 1 === length) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0) break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0) break;
          bytes.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0) break;
          bytes.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0) break;
          bytes.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    function asciiToBytes(str) {
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      let c, hi, lo;
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    function blitBuffer(src, dst, offset, length) {
      let i;
      for (i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
      }
      return i;
    }
    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    var hexSliceLookupTable = (function() {
      const alphabet = "0123456789abcdef";
      const table = new Array(256);
      for (let i = 0; i < 16; ++i) {
        const i16 = i * 16;
        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j];
        }
      }
      return table;
    })();
    function defineBigIntMethod(fn) {
      return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
    }
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
  }
});

// examples/browser/buffer-shim.js
var import_buffer;
var init_buffer_shim = __esm({
  "examples/browser/buffer-shim.js"() {
    "use strict";
    import_buffer = __toESM(require_buffer(), 1);
  }
});

// node_modules/@noble/hashes/crypto.js
var require_crypto = __commonJS({
  "node_modules/@noble/hashes/crypto.js"(exports) {
    "use strict";
    init_buffer_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.crypto = void 0;
    exports.crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
  }
});

// node_modules/@noble/hashes/utils.js
var require_utils = __commonJS({
  "node_modules/@noble/hashes/utils.js"(exports) {
    "use strict";
    init_buffer_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wrapXOFConstructorWithOpts = exports.wrapConstructorWithOpts = exports.wrapConstructor = exports.Hash = exports.nextTick = exports.swap32IfBE = exports.byteSwapIfBE = exports.swap8IfBE = exports.isLE = void 0;
    exports.isBytes = isBytes;
    exports.anumber = anumber;
    exports.abytes = abytes;
    exports.ahash = ahash;
    exports.aexists = aexists;
    exports.aoutput = aoutput;
    exports.u8 = u8;
    exports.u32 = u32;
    exports.clean = clean;
    exports.createView = createView;
    exports.rotr = rotr;
    exports.rotl = rotl;
    exports.byteSwap = byteSwap;
    exports.byteSwap32 = byteSwap32;
    exports.bytesToHex = bytesToHex;
    exports.hexToBytes = hexToBytes;
    exports.asyncLoop = asyncLoop;
    exports.utf8ToBytes = utf8ToBytes;
    exports.bytesToUtf8 = bytesToUtf8;
    exports.toBytes = toBytes;
    exports.kdfInputToBytes = kdfInputToBytes;
    exports.concatBytes = concatBytes;
    exports.checkOpts = checkOpts;
    exports.createHasher = createHasher;
    exports.createOptHasher = createOptHasher;
    exports.createXOFer = createXOFer;
    exports.randomBytes = randomBytes;
    var crypto_1 = require_crypto();
    function isBytes(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    function anumber(n) {
      if (!Number.isSafeInteger(n) || n < 0)
        throw new Error("positive integer expected, got " + n);
    }
    function abytes(b, ...lengths) {
      if (!isBytes(b))
        throw new Error("Uint8Array expected");
      if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
    }
    function ahash(h) {
      if (typeof h !== "function" || typeof h.create !== "function")
        throw new Error("Hash should be wrapped by utils.createHasher");
      anumber(h.outputLen);
      anumber(h.blockLen);
    }
    function aexists(instance, checkFinished = true) {
      if (instance.destroyed)
        throw new Error("Hash instance has been destroyed");
      if (checkFinished && instance.finished)
        throw new Error("Hash#digest() has already been called");
    }
    function aoutput(out, instance) {
      abytes(out);
      const min = instance.outputLen;
      if (out.length < min) {
        throw new Error("digestInto() expects output buffer of length at least " + min);
      }
    }
    function u8(arr) {
      return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    function u32(arr) {
      return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    }
    function clean(...arrays) {
      for (let i = 0; i < arrays.length; i++) {
        arrays[i].fill(0);
      }
    }
    function createView(arr) {
      return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    function rotr(word, shift) {
      return word << 32 - shift | word >>> shift;
    }
    function rotl(word, shift) {
      return word << shift | word >>> 32 - shift >>> 0;
    }
    exports.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    function byteSwap(word) {
      return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
    }
    exports.swap8IfBE = exports.isLE ? (n) => n : (n) => byteSwap(n);
    exports.byteSwapIfBE = exports.swap8IfBE;
    function byteSwap32(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = byteSwap(arr[i]);
      }
      return arr;
    }
    exports.swap32IfBE = exports.isLE ? (u) => u : byteSwap32;
    var hasHexBuiltin = /* @__PURE__ */ (() => (
      // @ts-ignore
      typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
    ))();
    var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex(bytes) {
      abytes(bytes);
      if (hasHexBuiltin)
        return bytes.toHex();
      let hex = "";
      for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
      }
      return hex;
    }
    var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    function asciiToBase16(ch) {
      if (ch >= asciis._0 && ch <= asciis._9)
        return ch - asciis._0;
      if (ch >= asciis.A && ch <= asciis.F)
        return ch - (asciis.A - 10);
      if (ch >= asciis.a && ch <= asciis.f)
        return ch - (asciis.a - 10);
      return;
    }
    function hexToBytes(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      if (hasHexBuiltin)
        return Uint8Array.fromHex(hex);
      const hl = hex.length;
      const al = hl / 2;
      if (hl % 2)
        throw new Error("hex string expected, got unpadded hex of length " + hl);
      const array = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex[hi] + hex[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
      }
      return array;
    }
    var nextTick = async () => {
    };
    exports.nextTick = nextTick;
    async function asyncLoop(iters, tick, cb) {
      let ts = Date.now();
      for (let i = 0; i < iters; i++) {
        cb(i);
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick)
          continue;
        await (0, exports.nextTick)();
        ts += diff;
      }
    }
    function utf8ToBytes(str) {
      if (typeof str !== "string")
        throw new Error("string expected");
      return new Uint8Array(new TextEncoder().encode(str));
    }
    function bytesToUtf8(bytes) {
      return new TextDecoder().decode(bytes);
    }
    function toBytes(data) {
      if (typeof data === "string")
        data = utf8ToBytes(data);
      abytes(data);
      return data;
    }
    function kdfInputToBytes(data) {
      if (typeof data === "string")
        data = utf8ToBytes(data);
      abytes(data);
      return data;
    }
    function concatBytes(...arrays) {
      let sum = 0;
      for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        abytes(a);
        sum += a.length;
      }
      const res = new Uint8Array(sum);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
      }
      return res;
    }
    function checkOpts(defaults, opts) {
      if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
        throw new Error("options should be object or undefined");
      const merged = Object.assign(defaults, opts);
      return merged;
    }
    var Hash = class {
    };
    exports.Hash = Hash;
    function createHasher(hashCons) {
      const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
      const tmp = hashCons();
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = () => hashCons();
      return hashC;
    }
    function createOptHasher(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    function createXOFer(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    exports.wrapConstructor = createHasher;
    exports.wrapConstructorWithOpts = createOptHasher;
    exports.wrapXOFConstructorWithOpts = createXOFer;
    function randomBytes(bytesLength = 32) {
      if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
        return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
      }
      if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
        return Uint8Array.from(crypto_1.crypto.randomBytes(bytesLength));
      }
      throw new Error("crypto.getRandomValues must be defined");
    }
  }
});

// node_modules/@noble/hashes/_md.js
var require_md = __commonJS({
  "node_modules/@noble/hashes/_md.js"(exports) {
    "use strict";
    init_buffer_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SHA512_IV = exports.SHA384_IV = exports.SHA224_IV = exports.SHA256_IV = exports.HashMD = void 0;
    exports.setBigUint64 = setBigUint64;
    exports.Chi = Chi;
    exports.Maj = Maj;
    var utils_ts_1 = require_utils();
    function setBigUint64(view, byteOffset, value, isLE) {
      if (typeof view.setBigUint64 === "function")
        return view.setBigUint64(byteOffset, value, isLE);
      const _32n = BigInt(32);
      const _u32_max = BigInt(4294967295);
      const wh = Number(value >> _32n & _u32_max);
      const wl = Number(value & _u32_max);
      const h = isLE ? 4 : 0;
      const l = isLE ? 0 : 4;
      view.setUint32(byteOffset + h, wh, isLE);
      view.setUint32(byteOffset + l, wl, isLE);
    }
    function Chi(a, b, c) {
      return a & b ^ ~a & c;
    }
    function Maj(a, b, c) {
      return a & b ^ a & c ^ b & c;
    }
    var HashMD = class extends utils_ts_1.Hash {
      constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.buffer = new Uint8Array(blockLen);
        this.view = (0, utils_ts_1.createView)(this.buffer);
      }
      update(data) {
        (0, utils_ts_1.aexists)(this);
        data = (0, utils_ts_1.toBytes)(data);
        (0, utils_ts_1.abytes)(data);
        const { view, buffer, blockLen } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = (0, utils_ts_1.createView)(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            continue;
          }
          buffer.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
            this.pos = 0;
          }
        }
        this.length += data.length;
        this.roundClean();
        return this;
      }
      digestInto(out) {
        (0, utils_ts_1.aexists)(this);
        (0, utils_ts_1.aoutput)(out, this);
        this.finished = true;
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        (0, utils_ts_1.clean)(this.buffer.subarray(pos));
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          pos = 0;
        }
        for (let i = pos; i < blockLen; i++)
          buffer[i] = 0;
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = (0, utils_ts_1.createView)(out);
        const len = this.outputLen;
        if (len % 4)
          throw new Error("_sha2: outputLen should be aligned to 32bit");
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
          throw new Error("_sha2: outputLen bigger than state");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length;
        to.pos = pos;
        if (length % blockLen)
          to.buffer.set(buffer);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
    };
    exports.HashMD = HashMD;
    exports.SHA256_IV = Uint32Array.from([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    exports.SHA224_IV = Uint32Array.from([
      3238371032,
      914150663,
      812702999,
      4144912697,
      4290775857,
      1750603025,
      1694076839,
      3204075428
    ]);
    exports.SHA384_IV = Uint32Array.from([
      3418070365,
      3238371032,
      1654270250,
      914150663,
      2438529370,
      812702999,
      355462360,
      4144912697,
      1731405415,
      4290775857,
      2394180231,
      1750603025,
      3675008525,
      1694076839,
      1203062813,
      3204075428
    ]);
    exports.SHA512_IV = Uint32Array.from([
      1779033703,
      4089235720,
      3144134277,
      2227873595,
      1013904242,
      4271175723,
      2773480762,
      1595750129,
      1359893119,
      2917565137,
      2600822924,
      725511199,
      528734635,
      4215389547,
      1541459225,
      327033209
    ]);
  }
});

// node_modules/@noble/hashes/_u64.js
var require_u64 = __commonJS({
  "node_modules/@noble/hashes/_u64.js"(exports) {
    "use strict";
    init_buffer_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toBig = exports.shrSL = exports.shrSH = exports.rotrSL = exports.rotrSH = exports.rotrBL = exports.rotrBH = exports.rotr32L = exports.rotr32H = exports.rotlSL = exports.rotlSH = exports.rotlBL = exports.rotlBH = exports.add5L = exports.add5H = exports.add4L = exports.add4H = exports.add3L = exports.add3H = void 0;
    exports.add = add;
    exports.fromBig = fromBig;
    exports.split = split;
    var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
    var _32n = /* @__PURE__ */ BigInt(32);
    function fromBig(n, le = false) {
      if (le)
        return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
      return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
    }
    function split(lst, le = false) {
      const len = lst.length;
      let Ah = new Uint32Array(len);
      let Al = new Uint32Array(len);
      for (let i = 0; i < len; i++) {
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
      }
      return [Ah, Al];
    }
    var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
    exports.toBig = toBig;
    var shrSH = (h, _l, s) => h >>> s;
    exports.shrSH = shrSH;
    var shrSL = (h, l, s) => h << 32 - s | l >>> s;
    exports.shrSL = shrSL;
    var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
    exports.rotrSH = rotrSH;
    var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
    exports.rotrSL = rotrSL;
    var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
    exports.rotrBH = rotrBH;
    var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
    exports.rotrBL = rotrBL;
    var rotr32H = (_h, l) => l;
    exports.rotr32H = rotr32H;
    var rotr32L = (h, _l) => h;
    exports.rotr32L = rotr32L;
    var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
    exports.rotlSH = rotlSH;
    var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
    exports.rotlSL = rotlSL;
    var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
    exports.rotlBH = rotlBH;
    var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
    exports.rotlBL = rotlBL;
    function add(Ah, Al, Bh, Bl) {
      const l = (Al >>> 0) + (Bl >>> 0);
      return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
    }
    var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
    exports.add3L = add3L;
    var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
    exports.add3H = add3H;
    var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
    exports.add4L = add4L;
    var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
    exports.add4H = add4H;
    var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
    exports.add5L = add5L;
    var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
    exports.add5H = add5H;
    var u64 = {
      fromBig,
      split,
      toBig,
      shrSH,
      shrSL,
      rotrSH,
      rotrSL,
      rotrBH,
      rotrBL,
      rotr32H,
      rotr32L,
      rotlSH,
      rotlSL,
      rotlBH,
      rotlBL,
      add,
      add3L,
      add3H,
      add4L,
      add4H,
      add5H,
      add5L
    };
    exports.default = u64;
  }
});

// node_modules/@noble/hashes/sha2.js
var require_sha2 = __commonJS({
  "node_modules/@noble/hashes/sha2.js"(exports) {
    "use strict";
    init_buffer_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha512_224 = exports.sha512_256 = exports.sha384 = exports.sha512 = exports.sha224 = exports.sha256 = exports.SHA512_256 = exports.SHA512_224 = exports.SHA384 = exports.SHA512 = exports.SHA224 = exports.SHA256 = void 0;
    var _md_ts_1 = require_md();
    var u64 = require_u64();
    var utils_ts_1 = require_utils();
    var SHA256_K = /* @__PURE__ */ Uint32Array.from([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
    var SHA256 = class extends _md_ts_1.HashMD {
      constructor(outputLen = 32) {
        super(64, outputLen, 8, false);
        this.A = _md_ts_1.SHA256_IV[0] | 0;
        this.B = _md_ts_1.SHA256_IV[1] | 0;
        this.C = _md_ts_1.SHA256_IV[2] | 0;
        this.D = _md_ts_1.SHA256_IV[3] | 0;
        this.E = _md_ts_1.SHA256_IV[4] | 0;
        this.F = _md_ts_1.SHA256_IV[5] | 0;
        this.G = _md_ts_1.SHA256_IV[6] | 0;
        this.H = _md_ts_1.SHA256_IV[7] | 0;
      }
      get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
      }
      // prettier-ignore
      set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
          const W15 = SHA256_W[i - 15];
          const W2 = SHA256_W[i - 2];
          const s0 = (0, utils_ts_1.rotr)(W15, 7) ^ (0, utils_ts_1.rotr)(W15, 18) ^ W15 >>> 3;
          const s1 = (0, utils_ts_1.rotr)(W2, 17) ^ (0, utils_ts_1.rotr)(W2, 19) ^ W2 >>> 10;
          SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
        }
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
          const sigma1 = (0, utils_ts_1.rotr)(E, 6) ^ (0, utils_ts_1.rotr)(E, 11) ^ (0, utils_ts_1.rotr)(E, 25);
          const T1 = H + sigma1 + (0, _md_ts_1.Chi)(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
          const sigma0 = (0, utils_ts_1.rotr)(A, 2) ^ (0, utils_ts_1.rotr)(A, 13) ^ (0, utils_ts_1.rotr)(A, 22);
          const T2 = sigma0 + (0, _md_ts_1.Maj)(A, B, C) | 0;
          H = G;
          G = F;
          F = E;
          E = D + T1 | 0;
          D = C;
          C = B;
          B = A;
          A = T1 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
      }
      roundClean() {
        (0, utils_ts_1.clean)(SHA256_W);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        (0, utils_ts_1.clean)(this.buffer);
      }
    };
    exports.SHA256 = SHA256;
    var SHA224 = class extends SHA256 {
      constructor() {
        super(28);
        this.A = _md_ts_1.SHA224_IV[0] | 0;
        this.B = _md_ts_1.SHA224_IV[1] | 0;
        this.C = _md_ts_1.SHA224_IV[2] | 0;
        this.D = _md_ts_1.SHA224_IV[3] | 0;
        this.E = _md_ts_1.SHA224_IV[4] | 0;
        this.F = _md_ts_1.SHA224_IV[5] | 0;
        this.G = _md_ts_1.SHA224_IV[6] | 0;
        this.H = _md_ts_1.SHA224_IV[7] | 0;
      }
    };
    exports.SHA224 = SHA224;
    var K512 = /* @__PURE__ */ (() => u64.split([
      "0x428a2f98d728ae22",
      "0x7137449123ef65cd",
      "0xb5c0fbcfec4d3b2f",
      "0xe9b5dba58189dbbc",
      "0x3956c25bf348b538",
      "0x59f111f1b605d019",
      "0x923f82a4af194f9b",
      "0xab1c5ed5da6d8118",
      "0xd807aa98a3030242",
      "0x12835b0145706fbe",
      "0x243185be4ee4b28c",
      "0x550c7dc3d5ffb4e2",
      "0x72be5d74f27b896f",
      "0x80deb1fe3b1696b1",
      "0x9bdc06a725c71235",
      "0xc19bf174cf692694",
      "0xe49b69c19ef14ad2",
      "0xefbe4786384f25e3",
      "0x0fc19dc68b8cd5b5",
      "0x240ca1cc77ac9c65",
      "0x2de92c6f592b0275",
      "0x4a7484aa6ea6e483",
      "0x5cb0a9dcbd41fbd4",
      "0x76f988da831153b5",
      "0x983e5152ee66dfab",
      "0xa831c66d2db43210",
      "0xb00327c898fb213f",
      "0xbf597fc7beef0ee4",
      "0xc6e00bf33da88fc2",
      "0xd5a79147930aa725",
      "0x06ca6351e003826f",
      "0x142929670a0e6e70",
      "0x27b70a8546d22ffc",
      "0x2e1b21385c26c926",
      "0x4d2c6dfc5ac42aed",
      "0x53380d139d95b3df",
      "0x650a73548baf63de",
      "0x766a0abb3c77b2a8",
      "0x81c2c92e47edaee6",
      "0x92722c851482353b",
      "0xa2bfe8a14cf10364",
      "0xa81a664bbc423001",
      "0xc24b8b70d0f89791",
      "0xc76c51a30654be30",
      "0xd192e819d6ef5218",
      "0xd69906245565a910",
      "0xf40e35855771202a",
      "0x106aa07032bbd1b8",
      "0x19a4c116b8d2d0c8",
      "0x1e376c085141ab53",
      "0x2748774cdf8eeb99",
      "0x34b0bcb5e19b48a8",
      "0x391c0cb3c5c95a63",
      "0x4ed8aa4ae3418acb",
      "0x5b9cca4f7763e373",
      "0x682e6ff3d6b2b8a3",
      "0x748f82ee5defb2fc",
      "0x78a5636f43172f60",
      "0x84c87814a1f0ab72",
      "0x8cc702081a6439ec",
      "0x90befffa23631e28",
      "0xa4506cebde82bde9",
      "0xbef9a3f7b2c67915",
      "0xc67178f2e372532b",
      "0xca273eceea26619c",
      "0xd186b8c721c0c207",
      "0xeada7dd6cde0eb1e",
      "0xf57d4f7fee6ed178",
      "0x06f067aa72176fba",
      "0x0a637dc5a2c898a6",
      "0x113f9804bef90dae",
      "0x1b710b35131c471b",
      "0x28db77f523047d84",
      "0x32caab7b40c72493",
      "0x3c9ebe0a15c9bebc",
      "0x431d67c49c100d4c",
      "0x4cc5d4becb3e42b6",
      "0x597f299cfc657e2a",
      "0x5fcb6fab3ad6faec",
      "0x6c44198c4a475817"
    ].map((n) => BigInt(n))))();
    var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
    var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
    var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
    var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
    var SHA512 = class extends _md_ts_1.HashMD {
      constructor(outputLen = 64) {
        super(128, outputLen, 16, false);
        this.Ah = _md_ts_1.SHA512_IV[0] | 0;
        this.Al = _md_ts_1.SHA512_IV[1] | 0;
        this.Bh = _md_ts_1.SHA512_IV[2] | 0;
        this.Bl = _md_ts_1.SHA512_IV[3] | 0;
        this.Ch = _md_ts_1.SHA512_IV[4] | 0;
        this.Cl = _md_ts_1.SHA512_IV[5] | 0;
        this.Dh = _md_ts_1.SHA512_IV[6] | 0;
        this.Dl = _md_ts_1.SHA512_IV[7] | 0;
        this.Eh = _md_ts_1.SHA512_IV[8] | 0;
        this.El = _md_ts_1.SHA512_IV[9] | 0;
        this.Fh = _md_ts_1.SHA512_IV[10] | 0;
        this.Fl = _md_ts_1.SHA512_IV[11] | 0;
        this.Gh = _md_ts_1.SHA512_IV[12] | 0;
        this.Gl = _md_ts_1.SHA512_IV[13] | 0;
        this.Hh = _md_ts_1.SHA512_IV[14] | 0;
        this.Hl = _md_ts_1.SHA512_IV[15] | 0;
      }
      // prettier-ignore
      get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
      }
      // prettier-ignore
      set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4) {
          SHA512_W_H[i] = view.getUint32(offset);
          SHA512_W_L[i] = view.getUint32(offset += 4);
        }
        for (let i = 16; i < 80; i++) {
          const W15h = SHA512_W_H[i - 15] | 0;
          const W15l = SHA512_W_L[i - 15] | 0;
          const s0h = u64.rotrSH(W15h, W15l, 1) ^ u64.rotrSH(W15h, W15l, 8) ^ u64.shrSH(W15h, W15l, 7);
          const s0l = u64.rotrSL(W15h, W15l, 1) ^ u64.rotrSL(W15h, W15l, 8) ^ u64.shrSL(W15h, W15l, 7);
          const W2h = SHA512_W_H[i - 2] | 0;
          const W2l = SHA512_W_L[i - 2] | 0;
          const s1h = u64.rotrSH(W2h, W2l, 19) ^ u64.rotrBH(W2h, W2l, 61) ^ u64.shrSH(W2h, W2l, 6);
          const s1l = u64.rotrSL(W2h, W2l, 19) ^ u64.rotrBL(W2h, W2l, 61) ^ u64.shrSL(W2h, W2l, 6);
          const SUMl = u64.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
          const SUMh = u64.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
          SHA512_W_H[i] = SUMh | 0;
          SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        for (let i = 0; i < 80; i++) {
          const sigma1h = u64.rotrSH(Eh, El, 14) ^ u64.rotrSH(Eh, El, 18) ^ u64.rotrBH(Eh, El, 41);
          const sigma1l = u64.rotrSL(Eh, El, 14) ^ u64.rotrSL(Eh, El, 18) ^ u64.rotrBL(Eh, El, 41);
          const CHIh = Eh & Fh ^ ~Eh & Gh;
          const CHIl = El & Fl ^ ~El & Gl;
          const T1ll = u64.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
          const T1h = u64.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
          const T1l = T1ll | 0;
          const sigma0h = u64.rotrSH(Ah, Al, 28) ^ u64.rotrBH(Ah, Al, 34) ^ u64.rotrBH(Ah, Al, 39);
          const sigma0l = u64.rotrSL(Ah, Al, 28) ^ u64.rotrBL(Ah, Al, 34) ^ u64.rotrBL(Ah, Al, 39);
          const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
          const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
          Hh = Gh | 0;
          Hl = Gl | 0;
          Gh = Fh | 0;
          Gl = Fl | 0;
          Fh = Eh | 0;
          Fl = El | 0;
          ({ h: Eh, l: El } = u64.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
          Dh = Ch | 0;
          Dl = Cl | 0;
          Ch = Bh | 0;
          Cl = Bl | 0;
          Bh = Ah | 0;
          Bl = Al | 0;
          const All = u64.add3L(T1l, sigma0l, MAJl);
          Ah = u64.add3H(All, T1h, sigma0h, MAJh);
          Al = All | 0;
        }
        ({ h: Ah, l: Al } = u64.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = u64.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = u64.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = u64.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = u64.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = u64.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = u64.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = u64.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
      }
      roundClean() {
        (0, utils_ts_1.clean)(SHA512_W_H, SHA512_W_L);
      }
      destroy() {
        (0, utils_ts_1.clean)(this.buffer);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    };
    exports.SHA512 = SHA512;
    var SHA384 = class extends SHA512 {
      constructor() {
        super(48);
        this.Ah = _md_ts_1.SHA384_IV[0] | 0;
        this.Al = _md_ts_1.SHA384_IV[1] | 0;
        this.Bh = _md_ts_1.SHA384_IV[2] | 0;
        this.Bl = _md_ts_1.SHA384_IV[3] | 0;
        this.Ch = _md_ts_1.SHA384_IV[4] | 0;
        this.Cl = _md_ts_1.SHA384_IV[5] | 0;
        this.Dh = _md_ts_1.SHA384_IV[6] | 0;
        this.Dl = _md_ts_1.SHA384_IV[7] | 0;
        this.Eh = _md_ts_1.SHA384_IV[8] | 0;
        this.El = _md_ts_1.SHA384_IV[9] | 0;
        this.Fh = _md_ts_1.SHA384_IV[10] | 0;
        this.Fl = _md_ts_1.SHA384_IV[11] | 0;
        this.Gh = _md_ts_1.SHA384_IV[12] | 0;
        this.Gl = _md_ts_1.SHA384_IV[13] | 0;
        this.Hh = _md_ts_1.SHA384_IV[14] | 0;
        this.Hl = _md_ts_1.SHA384_IV[15] | 0;
      }
    };
    exports.SHA384 = SHA384;
    var T224_IV = /* @__PURE__ */ Uint32Array.from([
      2352822216,
      424955298,
      1944164710,
      2312950998,
      502970286,
      855612546,
      1738396948,
      1479516111,
      258812777,
      2077511080,
      2011393907,
      79989058,
      1067287976,
      1780299464,
      286451373,
      2446758561
    ]);
    var T256_IV = /* @__PURE__ */ Uint32Array.from([
      573645204,
      4230739756,
      2673172387,
      3360449730,
      596883563,
      1867755857,
      2520282905,
      1497426621,
      2519219938,
      2827943907,
      3193839141,
      1401305490,
      721525244,
      746961066,
      246885852,
      2177182882
    ]);
    var SHA512_224 = class extends SHA512 {
      constructor() {
        super(28);
        this.Ah = T224_IV[0] | 0;
        this.Al = T224_IV[1] | 0;
        this.Bh = T224_IV[2] | 0;
        this.Bl = T224_IV[3] | 0;
        this.Ch = T224_IV[4] | 0;
        this.Cl = T224_IV[5] | 0;
        this.Dh = T224_IV[6] | 0;
        this.Dl = T224_IV[7] | 0;
        this.Eh = T224_IV[8] | 0;
        this.El = T224_IV[9] | 0;
        this.Fh = T224_IV[10] | 0;
        this.Fl = T224_IV[11] | 0;
        this.Gh = T224_IV[12] | 0;
        this.Gl = T224_IV[13] | 0;
        this.Hh = T224_IV[14] | 0;
        this.Hl = T224_IV[15] | 0;
      }
    };
    exports.SHA512_224 = SHA512_224;
    var SHA512_256 = class extends SHA512 {
      constructor() {
        super(32);
        this.Ah = T256_IV[0] | 0;
        this.Al = T256_IV[1] | 0;
        this.Bh = T256_IV[2] | 0;
        this.Bl = T256_IV[3] | 0;
        this.Ch = T256_IV[4] | 0;
        this.Cl = T256_IV[5] | 0;
        this.Dh = T256_IV[6] | 0;
        this.Dl = T256_IV[7] | 0;
        this.Eh = T256_IV[8] | 0;
        this.El = T256_IV[9] | 0;
        this.Fh = T256_IV[10] | 0;
        this.Fl = T256_IV[11] | 0;
        this.Gh = T256_IV[12] | 0;
        this.Gl = T256_IV[13] | 0;
        this.Hh = T256_IV[14] | 0;
        this.Hl = T256_IV[15] | 0;
      }
    };
    exports.SHA512_256 = SHA512_256;
    exports.sha256 = (0, utils_ts_1.createHasher)(() => new SHA256());
    exports.sha224 = (0, utils_ts_1.createHasher)(() => new SHA224());
    exports.sha512 = (0, utils_ts_1.createHasher)(() => new SHA512());
    exports.sha384 = (0, utils_ts_1.createHasher)(() => new SHA384());
    exports.sha512_256 = (0, utils_ts_1.createHasher)(() => new SHA512_256());
    exports.sha512_224 = (0, utils_ts_1.createHasher)(() => new SHA512_224());
  }
});

// node_modules/@noble/hashes/sha256.js
var require_sha256 = __commonJS({
  "node_modules/@noble/hashes/sha256.js"(exports) {
    "use strict";
    init_buffer_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha224 = exports.SHA224 = exports.sha256 = exports.SHA256 = void 0;
    var sha2_ts_1 = require_sha2();
    exports.SHA256 = sha2_ts_1.SHA256;
    exports.sha256 = sha2_ts_1.sha256;
    exports.SHA224 = sha2_ts_1.SHA224;
    exports.sha224 = sha2_ts_1.sha224;
  }
});

// node_modules/@noble/hashes/sha512.js
var require_sha512 = __commonJS({
  "node_modules/@noble/hashes/sha512.js"(exports) {
    "use strict";
    init_buffer_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha512_256 = exports.SHA512_256 = exports.sha512_224 = exports.SHA512_224 = exports.sha384 = exports.SHA384 = exports.sha512 = exports.SHA512 = void 0;
    var sha2_ts_1 = require_sha2();
    exports.SHA512 = sha2_ts_1.SHA512;
    exports.sha512 = sha2_ts_1.sha512;
    exports.SHA384 = sha2_ts_1.SHA384;
    exports.sha384 = sha2_ts_1.sha384;
    exports.SHA512_224 = sha2_ts_1.SHA512_224;
    exports.sha512_224 = sha2_ts_1.sha512_224;
    exports.SHA512_256 = sha2_ts_1.SHA512_256;
    exports.sha512_256 = sha2_ts_1.sha512_256;
  }
});

// node_modules/@noble/hashes/hmac.js
var require_hmac = __commonJS({
  "node_modules/@noble/hashes/hmac.js"(exports) {
    "use strict";
    init_buffer_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hmac = exports.HMAC = void 0;
    var utils_ts_1 = require_utils();
    var HMAC = class extends utils_ts_1.Hash {
      constructor(hash, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        (0, utils_ts_1.ahash)(hash);
        const key = (0, utils_ts_1.toBytes)(_key);
        this.iHash = hash.create();
        if (typeof this.iHash.update !== "function")
          throw new Error("Expected instance of class which extends utils.Hash");
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54;
        this.iHash.update(pad);
        this.oHash = hash.create();
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54 ^ 92;
        this.oHash.update(pad);
        (0, utils_ts_1.clean)(pad);
      }
      update(buf) {
        (0, utils_ts_1.aexists)(this);
        this.iHash.update(buf);
        return this;
      }
      digestInto(out) {
        (0, utils_ts_1.aexists)(this);
        (0, utils_ts_1.abytes)(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
      }
      digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
      }
      _cloneInto(to) {
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
      destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
      }
    };
    exports.HMAC = HMAC;
    var hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
    exports.hmac = hmac;
    exports.hmac.create = (hash, key) => new HMAC(hash, key);
  }
});

// node_modules/@noble/hashes/pbkdf2.js
var require_pbkdf2 = __commonJS({
  "node_modules/@noble/hashes/pbkdf2.js"(exports) {
    "use strict";
    init_buffer_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pbkdf2 = pbkdf2;
    exports.pbkdf2Async = pbkdf2Async;
    var hmac_ts_1 = require_hmac();
    var utils_ts_1 = require_utils();
    function pbkdf2Init(hash, _password, _salt, _opts) {
      (0, utils_ts_1.ahash)(hash);
      const opts = (0, utils_ts_1.checkOpts)({ dkLen: 32, asyncTick: 10 }, _opts);
      const { c, dkLen, asyncTick } = opts;
      (0, utils_ts_1.anumber)(c);
      (0, utils_ts_1.anumber)(dkLen);
      (0, utils_ts_1.anumber)(asyncTick);
      if (c < 1)
        throw new Error("iterations (c) should be >= 1");
      const password = (0, utils_ts_1.kdfInputToBytes)(_password);
      const salt = (0, utils_ts_1.kdfInputToBytes)(_salt);
      const DK = new Uint8Array(dkLen);
      const PRF = hmac_ts_1.hmac.create(hash, password);
      const PRFSalt = PRF._cloneInto().update(salt);
      return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
    }
    function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
      PRF.destroy();
      PRFSalt.destroy();
      if (prfW)
        prfW.destroy();
      (0, utils_ts_1.clean)(u);
      return DK;
    }
    function pbkdf2(hash, password, salt, opts) {
      const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
      let prfW;
      const arr = new Uint8Array(4);
      const view = (0, utils_ts_1.createView)(arr);
      const u = new Uint8Array(PRF.outputLen);
      for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
        const Ti = DK.subarray(pos, pos + PRF.outputLen);
        view.setInt32(0, ti, false);
        (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
        Ti.set(u.subarray(0, Ti.length));
        for (let ui = 1; ui < c; ui++) {
          PRF._cloneInto(prfW).update(u).digestInto(u);
          for (let i = 0; i < Ti.length; i++)
            Ti[i] ^= u[i];
        }
      }
      return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
    }
    async function pbkdf2Async(hash, password, salt, opts) {
      const { c, dkLen, asyncTick, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
      let prfW;
      const arr = new Uint8Array(4);
      const view = (0, utils_ts_1.createView)(arr);
      const u = new Uint8Array(PRF.outputLen);
      for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
        const Ti = DK.subarray(pos, pos + PRF.outputLen);
        view.setInt32(0, ti, false);
        (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
        Ti.set(u.subarray(0, Ti.length));
        await (0, utils_ts_1.asyncLoop)(c - 1, asyncTick, () => {
          PRF._cloneInto(prfW).update(u).digestInto(u);
          for (let i = 0; i < Ti.length; i++)
            Ti[i] ^= u[i];
        });
      }
      return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
    }
  }
});

// node_modules/bip39/src/wordlists/czech.json
var require_czech = __commonJS({
  "node_modules/bip39/src/wordlists/czech.json"(exports, module2) {
    module2.exports = [
      "abdikace",
      "abeceda",
      "adresa",
      "agrese",
      "akce",
      "aktovka",
      "alej",
      "alkohol",
      "amputace",
      "ananas",
      "andulka",
      "anekdota",
      "anketa",
      "antika",
      "anulovat",
      "archa",
      "arogance",
      "asfalt",
      "asistent",
      "aspirace",
      "astma",
      "astronom",
      "atlas",
      "atletika",
      "atol",
      "autobus",
      "azyl",
      "babka",
      "bachor",
      "bacil",
      "baculka",
      "badatel",
      "bageta",
      "bagr",
      "bahno",
      "bakterie",
      "balada",
      "baletka",
      "balkon",
      "balonek",
      "balvan",
      "balza",
      "bambus",
      "bankomat",
      "barbar",
      "baret",
      "barman",
      "baroko",
      "barva",
      "baterka",
      "batoh",
      "bavlna",
      "bazalka",
      "bazilika",
      "bazuka",
      "bedna",
      "beran",
      "beseda",
      "bestie",
      "beton",
      "bezinka",
      "bezmoc",
      "beztak",
      "bicykl",
      "bidlo",
      "biftek",
      "bikiny",
      "bilance",
      "biograf",
      "biolog",
      "bitva",
      "bizon",
      "blahobyt",
      "blatouch",
      "blecha",
      "bledule",
      "blesk",
      "blikat",
      "blizna",
      "blokovat",
      "bloudit",
      "blud",
      "bobek",
      "bobr",
      "bodlina",
      "bodnout",
      "bohatost",
      "bojkot",
      "bojovat",
      "bokorys",
      "bolest",
      "borec",
      "borovice",
      "bota",
      "boubel",
      "bouchat",
      "bouda",
      "boule",
      "bourat",
      "boxer",
      "bradavka",
      "brambora",
      "branka",
      "bratr",
      "brepta",
      "briketa",
      "brko",
      "brloh",
      "bronz",
      "broskev",
      "brunetka",
      "brusinka",
      "brzda",
      "brzy",
      "bublina",
      "bubnovat",
      "buchta",
      "buditel",
      "budka",
      "budova",
      "bufet",
      "bujarost",
      "bukvice",
      "buldok",
      "bulva",
      "bunda",
      "bunkr",
      "burza",
      "butik",
      "buvol",
      "buzola",
      "bydlet",
      "bylina",
      "bytovka",
      "bzukot",
      "capart",
      "carevna",
      "cedr",
      "cedule",
      "cejch",
      "cejn",
      "cela",
      "celer",
      "celkem",
      "celnice",
      "cenina",
      "cennost",
      "cenovka",
      "centrum",
      "cenzor",
      "cestopis",
      "cetka",
      "chalupa",
      "chapadlo",
      "charita",
      "chata",
      "chechtat",
      "chemie",
      "chichot",
      "chirurg",
      "chlad",
      "chleba",
      "chlubit",
      "chmel",
      "chmura",
      "chobot",
      "chochol",
      "chodba",
      "cholera",
      "chomout",
      "chopit",
      "choroba",
      "chov",
      "chrapot",
      "chrlit",
      "chrt",
      "chrup",
      "chtivost",
      "chudina",
      "chutnat",
      "chvat",
      "chvilka",
      "chvost",
      "chyba",
      "chystat",
      "chytit",
      "cibule",
      "cigareta",
      "cihelna",
      "cihla",
      "cinkot",
      "cirkus",
      "cisterna",
      "citace",
      "citrus",
      "cizinec",
      "cizost",
      "clona",
      "cokoliv",
      "couvat",
      "ctitel",
      "ctnost",
      "cudnost",
      "cuketa",
      "cukr",
      "cupot",
      "cvaknout",
      "cval",
      "cvik",
      "cvrkot",
      "cyklista",
      "daleko",
      "dareba",
      "datel",
      "datum",
      "dcera",
      "debata",
      "dechovka",
      "decibel",
      "deficit",
      "deflace",
      "dekl",
      "dekret",
      "demokrat",
      "deprese",
      "derby",
      "deska",
      "detektiv",
      "dikobraz",
      "diktovat",
      "dioda",
      "diplom",
      "disk",
      "displej",
      "divadlo",
      "divoch",
      "dlaha",
      "dlouho",
      "dluhopis",
      "dnes",
      "dobro",
      "dobytek",
      "docent",
      "dochutit",
      "dodnes",
      "dohled",
      "dohoda",
      "dohra",
      "dojem",
      "dojnice",
      "doklad",
      "dokola",
      "doktor",
      "dokument",
      "dolar",
      "doleva",
      "dolina",
      "doma",
      "dominant",
      "domluvit",
      "domov",
      "donutit",
      "dopad",
      "dopis",
      "doplnit",
      "doposud",
      "doprovod",
      "dopustit",
      "dorazit",
      "dorost",
      "dort",
      "dosah",
      "doslov",
      "dostatek",
      "dosud",
      "dosyta",
      "dotaz",
      "dotek",
      "dotknout",
      "doufat",
      "doutnat",
      "dovozce",
      "dozadu",
      "doznat",
      "dozorce",
      "drahota",
      "drak",
      "dramatik",
      "dravec",
      "draze",
      "drdol",
      "drobnost",
      "drogerie",
      "drozd",
      "drsnost",
      "drtit",
      "drzost",
      "duben",
      "duchovno",
      "dudek",
      "duha",
      "duhovka",
      "dusit",
      "dusno",
      "dutost",
      "dvojice",
      "dvorec",
      "dynamit",
      "ekolog",
      "ekonomie",
      "elektron",
      "elipsa",
      "email",
      "emise",
      "emoce",
      "empatie",
      "epizoda",
      "epocha",
      "epopej",
      "epos",
      "esej",
      "esence",
      "eskorta",
      "eskymo",
      "etiketa",
      "euforie",
      "evoluce",
      "exekuce",
      "exkurze",
      "expedice",
      "exploze",
      "export",
      "extrakt",
      "facka",
      "fajfka",
      "fakulta",
      "fanatik",
      "fantazie",
      "farmacie",
      "favorit",
      "fazole",
      "federace",
      "fejeton",
      "fenka",
      "fialka",
      "figurant",
      "filozof",
      "filtr",
      "finance",
      "finta",
      "fixace",
      "fjord",
      "flanel",
      "flirt",
      "flotila",
      "fond",
      "fosfor",
      "fotbal",
      "fotka",
      "foton",
      "frakce",
      "freska",
      "fronta",
      "fukar",
      "funkce",
      "fyzika",
      "galeje",
      "garant",
      "genetika",
      "geolog",
      "gilotina",
      "glazura",
      "glejt",
      "golem",
      "golfista",
      "gotika",
      "graf",
      "gramofon",
      "granule",
      "grep",
      "gril",
      "grog",
      "groteska",
      "guma",
      "hadice",
      "hadr",
      "hala",
      "halenka",
      "hanba",
      "hanopis",
      "harfa",
      "harpuna",
      "havran",
      "hebkost",
      "hejkal",
      "hejno",
      "hejtman",
      "hektar",
      "helma",
      "hematom",
      "herec",
      "herna",
      "heslo",
      "hezky",
      "historik",
      "hladovka",
      "hlasivky",
      "hlava",
      "hledat",
      "hlen",
      "hlodavec",
      "hloh",
      "hloupost",
      "hltat",
      "hlubina",
      "hluchota",
      "hmat",
      "hmota",
      "hmyz",
      "hnis",
      "hnojivo",
      "hnout",
      "hoblina",
      "hoboj",
      "hoch",
      "hodiny",
      "hodlat",
      "hodnota",
      "hodovat",
      "hojnost",
      "hokej",
      "holinka",
      "holka",
      "holub",
      "homole",
      "honitba",
      "honorace",
      "horal",
      "horda",
      "horizont",
      "horko",
      "horlivec",
      "hormon",
      "hornina",
      "horoskop",
      "horstvo",
      "hospoda",
      "hostina",
      "hotovost",
      "houba",
      "houf",
      "houpat",
      "houska",
      "hovor",
      "hradba",
      "hranice",
      "hravost",
      "hrazda",
      "hrbolek",
      "hrdina",
      "hrdlo",
      "hrdost",
      "hrnek",
      "hrobka",
      "hromada",
      "hrot",
      "hrouda",
      "hrozen",
      "hrstka",
      "hrubost",
      "hryzat",
      "hubenost",
      "hubnout",
      "hudba",
      "hukot",
      "humr",
      "husita",
      "hustota",
      "hvozd",
      "hybnost",
      "hydrant",
      "hygiena",
      "hymna",
      "hysterik",
      "idylka",
      "ihned",
      "ikona",
      "iluze",
      "imunita",
      "infekce",
      "inflace",
      "inkaso",
      "inovace",
      "inspekce",
      "internet",
      "invalida",
      "investor",
      "inzerce",
      "ironie",
      "jablko",
      "jachta",
      "jahoda",
      "jakmile",
      "jakost",
      "jalovec",
      "jantar",
      "jarmark",
      "jaro",
      "jasan",
      "jasno",
      "jatka",
      "javor",
      "jazyk",
      "jedinec",
      "jedle",
      "jednatel",
      "jehlan",
      "jekot",
      "jelen",
      "jelito",
      "jemnost",
      "jenom",
      "jepice",
      "jeseter",
      "jevit",
      "jezdec",
      "jezero",
      "jinak",
      "jindy",
      "jinoch",
      "jiskra",
      "jistota",
      "jitrnice",
      "jizva",
      "jmenovat",
      "jogurt",
      "jurta",
      "kabaret",
      "kabel",
      "kabinet",
      "kachna",
      "kadet",
      "kadidlo",
      "kahan",
      "kajak",
      "kajuta",
      "kakao",
      "kaktus",
      "kalamita",
      "kalhoty",
      "kalibr",
      "kalnost",
      "kamera",
      "kamkoliv",
      "kamna",
      "kanibal",
      "kanoe",
      "kantor",
      "kapalina",
      "kapela",
      "kapitola",
      "kapka",
      "kaple",
      "kapota",
      "kapr",
      "kapusta",
      "kapybara",
      "karamel",
      "karotka",
      "karton",
      "kasa",
      "katalog",
      "katedra",
      "kauce",
      "kauza",
      "kavalec",
      "kazajka",
      "kazeta",
      "kazivost",
      "kdekoliv",
      "kdesi",
      "kedluben",
      "kemp",
      "keramika",
      "kino",
      "klacek",
      "kladivo",
      "klam",
      "klapot",
      "klasika",
      "klaun",
      "klec",
      "klenba",
      "klepat",
      "klesnout",
      "klid",
      "klima",
      "klisna",
      "klobouk",
      "klokan",
      "klopa",
      "kloub",
      "klubovna",
      "klusat",
      "kluzkost",
      "kmen",
      "kmitat",
      "kmotr",
      "kniha",
      "knot",
      "koalice",
      "koberec",
      "kobka",
      "kobliha",
      "kobyla",
      "kocour",
      "kohout",
      "kojenec",
      "kokos",
      "koktejl",
      "kolaps",
      "koleda",
      "kolize",
      "kolo",
      "komando",
      "kometa",
      "komik",
      "komnata",
      "komora",
      "kompas",
      "komunita",
      "konat",
      "koncept",
      "kondice",
      "konec",
      "konfese",
      "kongres",
      "konina",
      "konkurs",
      "kontakt",
      "konzerva",
      "kopanec",
      "kopie",
      "kopnout",
      "koprovka",
      "korbel",
      "korektor",
      "kormidlo",
      "koroptev",
      "korpus",
      "koruna",
      "koryto",
      "korzet",
      "kosatec",
      "kostka",
      "kotel",
      "kotleta",
      "kotoul",
      "koukat",
      "koupelna",
      "kousek",
      "kouzlo",
      "kovboj",
      "koza",
      "kozoroh",
      "krabice",
      "krach",
      "krajina",
      "kralovat",
      "krasopis",
      "kravata",
      "kredit",
      "krejcar",
      "kresba",
      "kreveta",
      "kriket",
      "kritik",
      "krize",
      "krkavec",
      "krmelec",
      "krmivo",
      "krocan",
      "krok",
      "kronika",
      "kropit",
      "kroupa",
      "krovka",
      "krtek",
      "kruhadlo",
      "krupice",
      "krutost",
      "krvinka",
      "krychle",
      "krypta",
      "krystal",
      "kryt",
      "kudlanka",
      "kufr",
      "kujnost",
      "kukla",
      "kulajda",
      "kulich",
      "kulka",
      "kulomet",
      "kultura",
      "kuna",
      "kupodivu",
      "kurt",
      "kurzor",
      "kutil",
      "kvalita",
      "kvasinka",
      "kvestor",
      "kynolog",
      "kyselina",
      "kytara",
      "kytice",
      "kytka",
      "kytovec",
      "kyvadlo",
      "labrador",
      "lachtan",
      "ladnost",
      "laik",
      "lakomec",
      "lamela",
      "lampa",
      "lanovka",
      "lasice",
      "laso",
      "lastura",
      "latinka",
      "lavina",
      "lebka",
      "leckdy",
      "leden",
      "lednice",
      "ledovka",
      "ledvina",
      "legenda",
      "legie",
      "legrace",
      "lehce",
      "lehkost",
      "lehnout",
      "lektvar",
      "lenochod",
      "lentilka",
      "lepenka",
      "lepidlo",
      "letadlo",
      "letec",
      "letmo",
      "letokruh",
      "levhart",
      "levitace",
      "levobok",
      "libra",
      "lichotka",
      "lidojed",
      "lidskost",
      "lihovina",
      "lijavec",
      "lilek",
      "limetka",
      "linie",
      "linka",
      "linoleum",
      "listopad",
      "litina",
      "litovat",
      "lobista",
      "lodivod",
      "logika",
      "logoped",
      "lokalita",
      "loket",
      "lomcovat",
      "lopata",
      "lopuch",
      "lord",
      "losos",
      "lotr",
      "loudal",
      "louh",
      "louka",
      "louskat",
      "lovec",
      "lstivost",
      "lucerna",
      "lucifer",
      "lump",
      "lusk",
      "lustrace",
      "lvice",
      "lyra",
      "lyrika",
      "lysina",
      "madam",
      "madlo",
      "magistr",
      "mahagon",
      "majetek",
      "majitel",
      "majorita",
      "makak",
      "makovice",
      "makrela",
      "malba",
      "malina",
      "malovat",
      "malvice",
      "maminka",
      "mandle",
      "manko",
      "marnost",
      "masakr",
      "maskot",
      "masopust",
      "matice",
      "matrika",
      "maturita",
      "mazanec",
      "mazivo",
      "mazlit",
      "mazurka",
      "mdloba",
      "mechanik",
      "meditace",
      "medovina",
      "melasa",
      "meloun",
      "mentolka",
      "metla",
      "metoda",
      "metr",
      "mezera",
      "migrace",
      "mihnout",
      "mihule",
      "mikina",
      "mikrofon",
      "milenec",
      "milimetr",
      "milost",
      "mimika",
      "mincovna",
      "minibar",
      "minomet",
      "minulost",
      "miska",
      "mistr",
      "mixovat",
      "mladost",
      "mlha",
      "mlhovina",
      "mlok",
      "mlsat",
      "mluvit",
      "mnich",
      "mnohem",
      "mobil",
      "mocnost",
      "modelka",
      "modlitba",
      "mohyla",
      "mokro",
      "molekula",
      "momentka",
      "monarcha",
      "monokl",
      "monstrum",
      "montovat",
      "monzun",
      "mosaz",
      "moskyt",
      "most",
      "motivace",
      "motorka",
      "motyka",
      "moucha",
      "moudrost",
      "mozaika",
      "mozek",
      "mozol",
      "mramor",
      "mravenec",
      "mrkev",
      "mrtvola",
      "mrzet",
      "mrzutost",
      "mstitel",
      "mudrc",
      "muflon",
      "mulat",
      "mumie",
      "munice",
      "muset",
      "mutace",
      "muzeum",
      "muzikant",
      "myslivec",
      "mzda",
      "nabourat",
      "nachytat",
      "nadace",
      "nadbytek",
      "nadhoz",
      "nadobro",
      "nadpis",
      "nahlas",
      "nahnat",
      "nahodile",
      "nahradit",
      "naivita",
      "najednou",
      "najisto",
      "najmout",
      "naklonit",
      "nakonec",
      "nakrmit",
      "nalevo",
      "namazat",
      "namluvit",
      "nanometr",
      "naoko",
      "naopak",
      "naostro",
      "napadat",
      "napevno",
      "naplnit",
      "napnout",
      "naposled",
      "naprosto",
      "narodit",
      "naruby",
      "narychlo",
      "nasadit",
      "nasekat",
      "naslepo",
      "nastat",
      "natolik",
      "navenek",
      "navrch",
      "navzdory",
      "nazvat",
      "nebe",
      "nechat",
      "necky",
      "nedaleko",
      "nedbat",
      "neduh",
      "negace",
      "nehet",
      "nehoda",
      "nejen",
      "nejprve",
      "neklid",
      "nelibost",
      "nemilost",
      "nemoc",
      "neochota",
      "neonka",
      "nepokoj",
      "nerost",
      "nerv",
      "nesmysl",
      "nesoulad",
      "netvor",
      "neuron",
      "nevina",
      "nezvykle",
      "nicota",
      "nijak",
      "nikam",
      "nikdy",
      "nikl",
      "nikterak",
      "nitro",
      "nocleh",
      "nohavice",
      "nominace",
      "nora",
      "norek",
      "nositel",
      "nosnost",
      "nouze",
      "noviny",
      "novota",
      "nozdra",
      "nuda",
      "nudle",
      "nuget",
      "nutit",
      "nutnost",
      "nutrie",
      "nymfa",
      "obal",
      "obarvit",
      "obava",
      "obdiv",
      "obec",
      "obehnat",
      "obejmout",
      "obezita",
      "obhajoba",
      "obilnice",
      "objasnit",
      "objekt",
      "obklopit",
      "oblast",
      "oblek",
      "obliba",
      "obloha",
      "obluda",
      "obnos",
      "obohatit",
      "obojek",
      "obout",
      "obrazec",
      "obrna",
      "obruba",
      "obrys",
      "obsah",
      "obsluha",
      "obstarat",
      "obuv",
      "obvaz",
      "obvinit",
      "obvod",
      "obvykle",
      "obyvatel",
      "obzor",
      "ocas",
      "ocel",
      "ocenit",
      "ochladit",
      "ochota",
      "ochrana",
      "ocitnout",
      "odboj",
      "odbyt",
      "odchod",
      "odcizit",
      "odebrat",
      "odeslat",
      "odevzdat",
      "odezva",
      "odhadce",
      "odhodit",
      "odjet",
      "odjinud",
      "odkaz",
      "odkoupit",
      "odliv",
      "odluka",
      "odmlka",
      "odolnost",
      "odpad",
      "odpis",
      "odplout",
      "odpor",
      "odpustit",
      "odpykat",
      "odrazka",
      "odsoudit",
      "odstup",
      "odsun",
      "odtok",
      "odtud",
      "odvaha",
      "odveta",
      "odvolat",
      "odvracet",
      "odznak",
      "ofina",
      "ofsajd",
      "ohlas",
      "ohnisko",
      "ohrada",
      "ohrozit",
      "ohryzek",
      "okap",
      "okenice",
      "oklika",
      "okno",
      "okouzlit",
      "okovy",
      "okrasa",
      "okres",
      "okrsek",
      "okruh",
      "okupant",
      "okurka",
      "okusit",
      "olejnina",
      "olizovat",
      "omak",
      "omeleta",
      "omezit",
      "omladina",
      "omlouvat",
      "omluva",
      "omyl",
      "onehdy",
      "opakovat",
      "opasek",
      "operace",
      "opice",
      "opilost",
      "opisovat",
      "opora",
      "opozice",
      "opravdu",
      "oproti",
      "orbital",
      "orchestr",
      "orgie",
      "orlice",
      "orloj",
      "ortel",
      "osada",
      "oschnout",
      "osika",
      "osivo",
      "oslava",
      "oslepit",
      "oslnit",
      "oslovit",
      "osnova",
      "osoba",
      "osolit",
      "ospalec",
      "osten",
      "ostraha",
      "ostuda",
      "ostych",
      "osvojit",
      "oteplit",
      "otisk",
      "otop",
      "otrhat",
      "otrlost",
      "otrok",
      "otruby",
      "otvor",
      "ovanout",
      "ovar",
      "oves",
      "ovlivnit",
      "ovoce",
      "oxid",
      "ozdoba",
      "pachatel",
      "pacient",
      "padouch",
      "pahorek",
      "pakt",
      "palanda",
      "palec",
      "palivo",
      "paluba",
      "pamflet",
      "pamlsek",
      "panenka",
      "panika",
      "panna",
      "panovat",
      "panstvo",
      "pantofle",
      "paprika",
      "parketa",
      "parodie",
      "parta",
      "paruka",
      "paryba",
      "paseka",
      "pasivita",
      "pastelka",
      "patent",
      "patrona",
      "pavouk",
      "pazneht",
      "pazourek",
      "pecka",
      "pedagog",
      "pejsek",
      "peklo",
      "peloton",
      "penalta",
      "pendrek",
      "penze",
      "periskop",
      "pero",
      "pestrost",
      "petarda",
      "petice",
      "petrolej",
      "pevnina",
      "pexeso",
      "pianista",
      "piha",
      "pijavice",
      "pikle",
      "piknik",
      "pilina",
      "pilnost",
      "pilulka",
      "pinzeta",
      "pipeta",
      "pisatel",
      "pistole",
      "pitevna",
      "pivnice",
      "pivovar",
      "placenta",
      "plakat",
      "plamen",
      "planeta",
      "plastika",
      "platit",
      "plavidlo",
      "plaz",
      "plech",
      "plemeno",
      "plenta",
      "ples",
      "pletivo",
      "plevel",
      "plivat",
      "plnit",
      "plno",
      "plocha",
      "plodina",
      "plomba",
      "plout",
      "pluk",
      "plyn",
      "pobavit",
      "pobyt",
      "pochod",
      "pocit",
      "poctivec",
      "podat",
      "podcenit",
      "podepsat",
      "podhled",
      "podivit",
      "podklad",
      "podmanit",
      "podnik",
      "podoba",
      "podpora",
      "podraz",
      "podstata",
      "podvod",
      "podzim",
      "poezie",
      "pohanka",
      "pohnutka",
      "pohovor",
      "pohroma",
      "pohyb",
      "pointa",
      "pojistka",
      "pojmout",
      "pokazit",
      "pokles",
      "pokoj",
      "pokrok",
      "pokuta",
      "pokyn",
      "poledne",
      "polibek",
      "polknout",
      "poloha",
      "polynom",
      "pomalu",
      "pominout",
      "pomlka",
      "pomoc",
      "pomsta",
      "pomyslet",
      "ponechat",
      "ponorka",
      "ponurost",
      "popadat",
      "popel",
      "popisek",
      "poplach",
      "poprosit",
      "popsat",
      "popud",
      "poradce",
      "porce",
      "porod",
      "porucha",
      "poryv",
      "posadit",
      "posed",
      "posila",
      "poskok",
      "poslanec",
      "posoudit",
      "pospolu",
      "postava",
      "posudek",
      "posyp",
      "potah",
      "potkan",
      "potlesk",
      "potomek",
      "potrava",
      "potupa",
      "potvora",
      "poukaz",
      "pouto",
      "pouzdro",
      "povaha",
      "povidla",
      "povlak",
      "povoz",
      "povrch",
      "povstat",
      "povyk",
      "povzdech",
      "pozdrav",
      "pozemek",
      "poznatek",
      "pozor",
      "pozvat",
      "pracovat",
      "prahory",
      "praktika",
      "prales",
      "praotec",
      "praporek",
      "prase",
      "pravda",
      "princip",
      "prkno",
      "probudit",
      "procento",
      "prodej",
      "profese",
      "prohra",
      "projekt",
      "prolomit",
      "promile",
      "pronikat",
      "propad",
      "prorok",
      "prosba",
      "proton",
      "proutek",
      "provaz",
      "prskavka",
      "prsten",
      "prudkost",
      "prut",
      "prvek",
      "prvohory",
      "psanec",
      "psovod",
      "pstruh",
      "ptactvo",
      "puberta",
      "puch",
      "pudl",
      "pukavec",
      "puklina",
      "pukrle",
      "pult",
      "pumpa",
      "punc",
      "pupen",
      "pusa",
      "pusinka",
      "pustina",
      "putovat",
      "putyka",
      "pyramida",
      "pysk",
      "pytel",
      "racek",
      "rachot",
      "radiace",
      "radnice",
      "radon",
      "raft",
      "ragby",
      "raketa",
      "rakovina",
      "rameno",
      "rampouch",
      "rande",
      "rarach",
      "rarita",
      "rasovna",
      "rastr",
      "ratolest",
      "razance",
      "razidlo",
      "reagovat",
      "reakce",
      "recept",
      "redaktor",
      "referent",
      "reflex",
      "rejnok",
      "reklama",
      "rekord",
      "rekrut",
      "rektor",
      "reputace",
      "revize",
      "revma",
      "revolver",
      "rezerva",
      "riskovat",
      "riziko",
      "robotika",
      "rodokmen",
      "rohovka",
      "rokle",
      "rokoko",
      "romaneto",
      "ropovod",
      "ropucha",
      "rorejs",
      "rosol",
      "rostlina",
      "rotmistr",
      "rotoped",
      "rotunda",
      "roubenka",
      "roucho",
      "roup",
      "roura",
      "rovina",
      "rovnice",
      "rozbor",
      "rozchod",
      "rozdat",
      "rozeznat",
      "rozhodce",
      "rozinka",
      "rozjezd",
      "rozkaz",
      "rozloha",
      "rozmar",
      "rozpad",
      "rozruch",
      "rozsah",
      "roztok",
      "rozum",
      "rozvod",
      "rubrika",
      "ruchadlo",
      "rukavice",
      "rukopis",
      "ryba",
      "rybolov",
      "rychlost",
      "rydlo",
      "rypadlo",
      "rytina",
      "ryzost",
      "sadista",
      "sahat",
      "sako",
      "samec",
      "samizdat",
      "samota",
      "sanitka",
      "sardinka",
      "sasanka",
      "satelit",
      "sazba",
      "sazenice",
      "sbor",
      "schovat",
      "sebranka",
      "secese",
      "sedadlo",
      "sediment",
      "sedlo",
      "sehnat",
      "sejmout",
      "sekera",
      "sekta",
      "sekunda",
      "sekvoje",
      "semeno",
      "seno",
      "servis",
      "sesadit",
      "seshora",
      "seskok",
      "seslat",
      "sestra",
      "sesuv",
      "sesypat",
      "setba",
      "setina",
      "setkat",
      "setnout",
      "setrvat",
      "sever",
      "seznam",
      "shoda",
      "shrnout",
      "sifon",
      "silnice",
      "sirka",
      "sirotek",
      "sirup",
      "situace",
      "skafandr",
      "skalisko",
      "skanzen",
      "skaut",
      "skeptik",
      "skica",
      "skladba",
      "sklenice",
      "sklo",
      "skluz",
      "skoba",
      "skokan",
      "skoro",
      "skripta",
      "skrz",
      "skupina",
      "skvost",
      "skvrna",
      "slabika",
      "sladidlo",
      "slanina",
      "slast",
      "slavnost",
      "sledovat",
      "slepec",
      "sleva",
      "slezina",
      "slib",
      "slina",
      "sliznice",
      "slon",
      "sloupek",
      "slovo",
      "sluch",
      "sluha",
      "slunce",
      "slupka",
      "slza",
      "smaragd",
      "smetana",
      "smilstvo",
      "smlouva",
      "smog",
      "smrad",
      "smrk",
      "smrtka",
      "smutek",
      "smysl",
      "snad",
      "snaha",
      "snob",
      "sobota",
      "socha",
      "sodovka",
      "sokol",
      "sopka",
      "sotva",
      "souboj",
      "soucit",
      "soudce",
      "souhlas",
      "soulad",
      "soumrak",
      "souprava",
      "soused",
      "soutok",
      "souviset",
      "spalovna",
      "spasitel",
      "spis",
      "splav",
      "spodek",
      "spojenec",
      "spolu",
      "sponzor",
      "spornost",
      "spousta",
      "sprcha",
      "spustit",
      "sranda",
      "sraz",
      "srdce",
      "srna",
      "srnec",
      "srovnat",
      "srpen",
      "srst",
      "srub",
      "stanice",
      "starosta",
      "statika",
      "stavba",
      "stehno",
      "stezka",
      "stodola",
      "stolek",
      "stopa",
      "storno",
      "stoupat",
      "strach",
      "stres",
      "strhnout",
      "strom",
      "struna",
      "studna",
      "stupnice",
      "stvol",
      "styk",
      "subjekt",
      "subtropy",
      "suchar",
      "sudost",
      "sukno",
      "sundat",
      "sunout",
      "surikata",
      "surovina",
      "svah",
      "svalstvo",
      "svetr",
      "svatba",
      "svazek",
      "svisle",
      "svitek",
      "svoboda",
      "svodidlo",
      "svorka",
      "svrab",
      "sykavka",
      "sykot",
      "synek",
      "synovec",
      "sypat",
      "sypkost",
      "syrovost",
      "sysel",
      "sytost",
      "tabletka",
      "tabule",
      "tahoun",
      "tajemno",
      "tajfun",
      "tajga",
      "tajit",
      "tajnost",
      "taktika",
      "tamhle",
      "tampon",
      "tancovat",
      "tanec",
      "tanker",
      "tapeta",
      "tavenina",
      "tazatel",
      "technika",
      "tehdy",
      "tekutina",
      "telefon",
      "temnota",
      "tendence",
      "tenista",
      "tenor",
      "teplota",
      "tepna",
      "teprve",
      "terapie",
      "termoska",
      "textil",
      "ticho",
      "tiskopis",
      "titulek",
      "tkadlec",
      "tkanina",
      "tlapka",
      "tleskat",
      "tlukot",
      "tlupa",
      "tmel",
      "toaleta",
      "topinka",
      "topol",
      "torzo",
      "touha",
      "toulec",
      "tradice",
      "traktor",
      "tramp",
      "trasa",
      "traverza",
      "trefit",
      "trest",
      "trezor",
      "trhavina",
      "trhlina",
      "trochu",
      "trojice",
      "troska",
      "trouba",
      "trpce",
      "trpitel",
      "trpkost",
      "trubec",
      "truchlit",
      "truhlice",
      "trus",
      "trvat",
      "tudy",
      "tuhnout",
      "tuhost",
      "tundra",
      "turista",
      "turnaj",
      "tuzemsko",
      "tvaroh",
      "tvorba",
      "tvrdost",
      "tvrz",
      "tygr",
      "tykev",
      "ubohost",
      "uboze",
      "ubrat",
      "ubrousek",
      "ubrus",
      "ubytovna",
      "ucho",
      "uctivost",
      "udivit",
      "uhradit",
      "ujednat",
      "ujistit",
      "ujmout",
      "ukazatel",
      "uklidnit",
      "uklonit",
      "ukotvit",
      "ukrojit",
      "ulice",
      "ulita",
      "ulovit",
      "umyvadlo",
      "unavit",
      "uniforma",
      "uniknout",
      "upadnout",
      "uplatnit",
      "uplynout",
      "upoutat",
      "upravit",
      "uran",
      "urazit",
      "usednout",
      "usilovat",
      "usmrtit",
      "usnadnit",
      "usnout",
      "usoudit",
      "ustlat",
      "ustrnout",
      "utahovat",
      "utkat",
      "utlumit",
      "utonout",
      "utopenec",
      "utrousit",
      "uvalit",
      "uvolnit",
      "uvozovka",
      "uzdravit",
      "uzel",
      "uzenina",
      "uzlina",
      "uznat",
      "vagon",
      "valcha",
      "valoun",
      "vana",
      "vandal",
      "vanilka",
      "varan",
      "varhany",
      "varovat",
      "vcelku",
      "vchod",
      "vdova",
      "vedro",
      "vegetace",
      "vejce",
      "velbloud",
      "veletrh",
      "velitel",
      "velmoc",
      "velryba",
      "venkov",
      "veranda",
      "verze",
      "veselka",
      "veskrze",
      "vesnice",
      "vespodu",
      "vesta",
      "veterina",
      "veverka",
      "vibrace",
      "vichr",
      "videohra",
      "vidina",
      "vidle",
      "vila",
      "vinice",
      "viset",
      "vitalita",
      "vize",
      "vizitka",
      "vjezd",
      "vklad",
      "vkus",
      "vlajka",
      "vlak",
      "vlasec",
      "vlevo",
      "vlhkost",
      "vliv",
      "vlnovka",
      "vloupat",
      "vnucovat",
      "vnuk",
      "voda",
      "vodivost",
      "vodoznak",
      "vodstvo",
      "vojensky",
      "vojna",
      "vojsko",
      "volant",
      "volba",
      "volit",
      "volno",
      "voskovka",
      "vozidlo",
      "vozovna",
      "vpravo",
      "vrabec",
      "vracet",
      "vrah",
      "vrata",
      "vrba",
      "vrcholek",
      "vrhat",
      "vrstva",
      "vrtule",
      "vsadit",
      "vstoupit",
      "vstup",
      "vtip",
      "vybavit",
      "vybrat",
      "vychovat",
      "vydat",
      "vydra",
      "vyfotit",
      "vyhledat",
      "vyhnout",
      "vyhodit",
      "vyhradit",
      "vyhubit",
      "vyjasnit",
      "vyjet",
      "vyjmout",
      "vyklopit",
      "vykonat",
      "vylekat",
      "vymazat",
      "vymezit",
      "vymizet",
      "vymyslet",
      "vynechat",
      "vynikat",
      "vynutit",
      "vypadat",
      "vyplatit",
      "vypravit",
      "vypustit",
      "vyrazit",
      "vyrovnat",
      "vyrvat",
      "vyslovit",
      "vysoko",
      "vystavit",
      "vysunout",
      "vysypat",
      "vytasit",
      "vytesat",
      "vytratit",
      "vyvinout",
      "vyvolat",
      "vyvrhel",
      "vyzdobit",
      "vyznat",
      "vzadu",
      "vzbudit",
      "vzchopit",
      "vzdor",
      "vzduch",
      "vzdychat",
      "vzestup",
      "vzhledem",
      "vzkaz",
      "vzlykat",
      "vznik",
      "vzorek",
      "vzpoura",
      "vztah",
      "vztek",
      "xylofon",
      "zabrat",
      "zabydlet",
      "zachovat",
      "zadarmo",
      "zadusit",
      "zafoukat",
      "zahltit",
      "zahodit",
      "zahrada",
      "zahynout",
      "zajatec",
      "zajet",
      "zajistit",
      "zaklepat",
      "zakoupit",
      "zalepit",
      "zamezit",
      "zamotat",
      "zamyslet",
      "zanechat",
      "zanikat",
      "zaplatit",
      "zapojit",
      "zapsat",
      "zarazit",
      "zastavit",
      "zasunout",
      "zatajit",
      "zatemnit",
      "zatknout",
      "zaujmout",
      "zavalit",
      "zavelet",
      "zavinit",
      "zavolat",
      "zavrtat",
      "zazvonit",
      "zbavit",
      "zbrusu",
      "zbudovat",
      "zbytek",
      "zdaleka",
      "zdarma",
      "zdatnost",
      "zdivo",
      "zdobit",
      "zdroj",
      "zdvih",
      "zdymadlo",
      "zelenina",
      "zeman",
      "zemina",
      "zeptat",
      "zezadu",
      "zezdola",
      "zhatit",
      "zhltnout",
      "zhluboka",
      "zhotovit",
      "zhruba",
      "zima",
      "zimnice",
      "zjemnit",
      "zklamat",
      "zkoumat",
      "zkratka",
      "zkumavka",
      "zlato",
      "zlehka",
      "zloba",
      "zlom",
      "zlost",
      "zlozvyk",
      "zmapovat",
      "zmar",
      "zmatek",
      "zmije",
      "zmizet",
      "zmocnit",
      "zmodrat",
      "zmrzlina",
      "zmutovat",
      "znak",
      "znalost",
      "znamenat",
      "znovu",
      "zobrazit",
      "zotavit",
      "zoubek",
      "zoufale",
      "zplodit",
      "zpomalit",
      "zprava",
      "zprostit",
      "zprudka",
      "zprvu",
      "zrada",
      "zranit",
      "zrcadlo",
      "zrnitost",
      "zrno",
      "zrovna",
      "zrychlit",
      "zrzavost",
      "zticha",
      "ztratit",
      "zubovina",
      "zubr",
      "zvednout",
      "zvenku",
      "zvesela",
      "zvon",
      "zvrat",
      "zvukovod",
      "zvyk"
    ];
  }
});

// node_modules/bip39/src/wordlists/chinese_simplified.json
var require_chinese_simplified = __commonJS({
  "node_modules/bip39/src/wordlists/chinese_simplified.json"(exports, module2) {
    module2.exports = [
      "\u7684",
      "\u4E00",
      "\u662F",
      "\u5728",
      "\u4E0D",
      "\u4E86",
      "\u6709",
      "\u548C",
      "\u4EBA",
      "\u8FD9",
      "\u4E2D",
      "\u5927",
      "\u4E3A",
      "\u4E0A",
      "\u4E2A",
      "\u56FD",
      "\u6211",
      "\u4EE5",
      "\u8981",
      "\u4ED6",
      "\u65F6",
      "\u6765",
      "\u7528",
      "\u4EEC",
      "\u751F",
      "\u5230",
      "\u4F5C",
      "\u5730",
      "\u4E8E",
      "\u51FA",
      "\u5C31",
      "\u5206",
      "\u5BF9",
      "\u6210",
      "\u4F1A",
      "\u53EF",
      "\u4E3B",
      "\u53D1",
      "\u5E74",
      "\u52A8",
      "\u540C",
      "\u5DE5",
      "\u4E5F",
      "\u80FD",
      "\u4E0B",
      "\u8FC7",
      "\u5B50",
      "\u8BF4",
      "\u4EA7",
      "\u79CD",
      "\u9762",
      "\u800C",
      "\u65B9",
      "\u540E",
      "\u591A",
      "\u5B9A",
      "\u884C",
      "\u5B66",
      "\u6CD5",
      "\u6240",
      "\u6C11",
      "\u5F97",
      "\u7ECF",
      "\u5341",
      "\u4E09",
      "\u4E4B",
      "\u8FDB",
      "\u7740",
      "\u7B49",
      "\u90E8",
      "\u5EA6",
      "\u5BB6",
      "\u7535",
      "\u529B",
      "\u91CC",
      "\u5982",
      "\u6C34",
      "\u5316",
      "\u9AD8",
      "\u81EA",
      "\u4E8C",
      "\u7406",
      "\u8D77",
      "\u5C0F",
      "\u7269",
      "\u73B0",
      "\u5B9E",
      "\u52A0",
      "\u91CF",
      "\u90FD",
      "\u4E24",
      "\u4F53",
      "\u5236",
      "\u673A",
      "\u5F53",
      "\u4F7F",
      "\u70B9",
      "\u4ECE",
      "\u4E1A",
      "\u672C",
      "\u53BB",
      "\u628A",
      "\u6027",
      "\u597D",
      "\u5E94",
      "\u5F00",
      "\u5B83",
      "\u5408",
      "\u8FD8",
      "\u56E0",
      "\u7531",
      "\u5176",
      "\u4E9B",
      "\u7136",
      "\u524D",
      "\u5916",
      "\u5929",
      "\u653F",
      "\u56DB",
      "\u65E5",
      "\u90A3",
      "\u793E",
      "\u4E49",
      "\u4E8B",
      "\u5E73",
      "\u5F62",
      "\u76F8",
      "\u5168",
      "\u8868",
      "\u95F4",
      "\u6837",
      "\u4E0E",
      "\u5173",
      "\u5404",
      "\u91CD",
      "\u65B0",
      "\u7EBF",
      "\u5185",
      "\u6570",
      "\u6B63",
      "\u5FC3",
      "\u53CD",
      "\u4F60",
      "\u660E",
      "\u770B",
      "\u539F",
      "\u53C8",
      "\u4E48",
      "\u5229",
      "\u6BD4",
      "\u6216",
      "\u4F46",
      "\u8D28",
      "\u6C14",
      "\u7B2C",
      "\u5411",
      "\u9053",
      "\u547D",
      "\u6B64",
      "\u53D8",
      "\u6761",
      "\u53EA",
      "\u6CA1",
      "\u7ED3",
      "\u89E3",
      "\u95EE",
      "\u610F",
      "\u5EFA",
      "\u6708",
      "\u516C",
      "\u65E0",
      "\u7CFB",
      "\u519B",
      "\u5F88",
      "\u60C5",
      "\u8005",
      "\u6700",
      "\u7ACB",
      "\u4EE3",
      "\u60F3",
      "\u5DF2",
      "\u901A",
      "\u5E76",
      "\u63D0",
      "\u76F4",
      "\u9898",
      "\u515A",
      "\u7A0B",
      "\u5C55",
      "\u4E94",
      "\u679C",
      "\u6599",
      "\u8C61",
      "\u5458",
      "\u9769",
      "\u4F4D",
      "\u5165",
      "\u5E38",
      "\u6587",
      "\u603B",
      "\u6B21",
      "\u54C1",
      "\u5F0F",
      "\u6D3B",
      "\u8BBE",
      "\u53CA",
      "\u7BA1",
      "\u7279",
      "\u4EF6",
      "\u957F",
      "\u6C42",
      "\u8001",
      "\u5934",
      "\u57FA",
      "\u8D44",
      "\u8FB9",
      "\u6D41",
      "\u8DEF",
      "\u7EA7",
      "\u5C11",
      "\u56FE",
      "\u5C71",
      "\u7EDF",
      "\u63A5",
      "\u77E5",
      "\u8F83",
      "\u5C06",
      "\u7EC4",
      "\u89C1",
      "\u8BA1",
      "\u522B",
      "\u5979",
      "\u624B",
      "\u89D2",
      "\u671F",
      "\u6839",
      "\u8BBA",
      "\u8FD0",
      "\u519C",
      "\u6307",
      "\u51E0",
      "\u4E5D",
      "\u533A",
      "\u5F3A",
      "\u653E",
      "\u51B3",
      "\u897F",
      "\u88AB",
      "\u5E72",
      "\u505A",
      "\u5FC5",
      "\u6218",
      "\u5148",
      "\u56DE",
      "\u5219",
      "\u4EFB",
      "\u53D6",
      "\u636E",
      "\u5904",
      "\u961F",
      "\u5357",
      "\u7ED9",
      "\u8272",
      "\u5149",
      "\u95E8",
      "\u5373",
      "\u4FDD",
      "\u6CBB",
      "\u5317",
      "\u9020",
      "\u767E",
      "\u89C4",
      "\u70ED",
      "\u9886",
      "\u4E03",
      "\u6D77",
      "\u53E3",
      "\u4E1C",
      "\u5BFC",
      "\u5668",
      "\u538B",
      "\u5FD7",
      "\u4E16",
      "\u91D1",
      "\u589E",
      "\u4E89",
      "\u6D4E",
      "\u9636",
      "\u6CB9",
      "\u601D",
      "\u672F",
      "\u6781",
      "\u4EA4",
      "\u53D7",
      "\u8054",
      "\u4EC0",
      "\u8BA4",
      "\u516D",
      "\u5171",
      "\u6743",
      "\u6536",
      "\u8BC1",
      "\u6539",
      "\u6E05",
      "\u7F8E",
      "\u518D",
      "\u91C7",
      "\u8F6C",
      "\u66F4",
      "\u5355",
      "\u98CE",
      "\u5207",
      "\u6253",
      "\u767D",
      "\u6559",
      "\u901F",
      "\u82B1",
      "\u5E26",
      "\u5B89",
      "\u573A",
      "\u8EAB",
      "\u8F66",
      "\u4F8B",
      "\u771F",
      "\u52A1",
      "\u5177",
      "\u4E07",
      "\u6BCF",
      "\u76EE",
      "\u81F3",
      "\u8FBE",
      "\u8D70",
      "\u79EF",
      "\u793A",
      "\u8BAE",
      "\u58F0",
      "\u62A5",
      "\u6597",
      "\u5B8C",
      "\u7C7B",
      "\u516B",
      "\u79BB",
      "\u534E",
      "\u540D",
      "\u786E",
      "\u624D",
      "\u79D1",
      "\u5F20",
      "\u4FE1",
      "\u9A6C",
      "\u8282",
      "\u8BDD",
      "\u7C73",
      "\u6574",
      "\u7A7A",
      "\u5143",
      "\u51B5",
      "\u4ECA",
      "\u96C6",
      "\u6E29",
      "\u4F20",
      "\u571F",
      "\u8BB8",
      "\u6B65",
      "\u7FA4",
      "\u5E7F",
      "\u77F3",
      "\u8BB0",
      "\u9700",
      "\u6BB5",
      "\u7814",
      "\u754C",
      "\u62C9",
      "\u6797",
      "\u5F8B",
      "\u53EB",
      "\u4E14",
      "\u7A76",
      "\u89C2",
      "\u8D8A",
      "\u7EC7",
      "\u88C5",
      "\u5F71",
      "\u7B97",
      "\u4F4E",
      "\u6301",
      "\u97F3",
      "\u4F17",
      "\u4E66",
      "\u5E03",
      "\u590D",
      "\u5BB9",
      "\u513F",
      "\u987B",
      "\u9645",
      "\u5546",
      "\u975E",
      "\u9A8C",
      "\u8FDE",
      "\u65AD",
      "\u6DF1",
      "\u96BE",
      "\u8FD1",
      "\u77FF",
      "\u5343",
      "\u5468",
      "\u59D4",
      "\u7D20",
      "\u6280",
      "\u5907",
      "\u534A",
      "\u529E",
      "\u9752",
      "\u7701",
      "\u5217",
      "\u4E60",
      "\u54CD",
      "\u7EA6",
      "\u652F",
      "\u822C",
      "\u53F2",
      "\u611F",
      "\u52B3",
      "\u4FBF",
      "\u56E2",
      "\u5F80",
      "\u9178",
      "\u5386",
      "\u5E02",
      "\u514B",
      "\u4F55",
      "\u9664",
      "\u6D88",
      "\u6784",
      "\u5E9C",
      "\u79F0",
      "\u592A",
      "\u51C6",
      "\u7CBE",
      "\u503C",
      "\u53F7",
      "\u7387",
      "\u65CF",
      "\u7EF4",
      "\u5212",
      "\u9009",
      "\u6807",
      "\u5199",
      "\u5B58",
      "\u5019",
      "\u6BDB",
      "\u4EB2",
      "\u5FEB",
      "\u6548",
      "\u65AF",
      "\u9662",
      "\u67E5",
      "\u6C5F",
      "\u578B",
      "\u773C",
      "\u738B",
      "\u6309",
      "\u683C",
      "\u517B",
      "\u6613",
      "\u7F6E",
      "\u6D3E",
      "\u5C42",
      "\u7247",
      "\u59CB",
      "\u5374",
      "\u4E13",
      "\u72B6",
      "\u80B2",
      "\u5382",
      "\u4EAC",
      "\u8BC6",
      "\u9002",
      "\u5C5E",
      "\u5706",
      "\u5305",
      "\u706B",
      "\u4F4F",
      "\u8C03",
      "\u6EE1",
      "\u53BF",
      "\u5C40",
      "\u7167",
      "\u53C2",
      "\u7EA2",
      "\u7EC6",
      "\u5F15",
      "\u542C",
      "\u8BE5",
      "\u94C1",
      "\u4EF7",
      "\u4E25",
      "\u9996",
      "\u5E95",
      "\u6DB2",
      "\u5B98",
      "\u5FB7",
      "\u968F",
      "\u75C5",
      "\u82CF",
      "\u5931",
      "\u5C14",
      "\u6B7B",
      "\u8BB2",
      "\u914D",
      "\u5973",
      "\u9EC4",
      "\u63A8",
      "\u663E",
      "\u8C08",
      "\u7F6A",
      "\u795E",
      "\u827A",
      "\u5462",
      "\u5E2D",
      "\u542B",
      "\u4F01",
      "\u671B",
      "\u5BC6",
      "\u6279",
      "\u8425",
      "\u9879",
      "\u9632",
      "\u4E3E",
      "\u7403",
      "\u82F1",
      "\u6C27",
      "\u52BF",
      "\u544A",
      "\u674E",
      "\u53F0",
      "\u843D",
      "\u6728",
      "\u5E2E",
      "\u8F6E",
      "\u7834",
      "\u4E9A",
      "\u5E08",
      "\u56F4",
      "\u6CE8",
      "\u8FDC",
      "\u5B57",
      "\u6750",
      "\u6392",
      "\u4F9B",
      "\u6CB3",
      "\u6001",
      "\u5C01",
      "\u53E6",
      "\u65BD",
      "\u51CF",
      "\u6811",
      "\u6EB6",
      "\u600E",
      "\u6B62",
      "\u6848",
      "\u8A00",
      "\u58EB",
      "\u5747",
      "\u6B66",
      "\u56FA",
      "\u53F6",
      "\u9C7C",
      "\u6CE2",
      "\u89C6",
      "\u4EC5",
      "\u8D39",
      "\u7D27",
      "\u7231",
      "\u5DE6",
      "\u7AE0",
      "\u65E9",
      "\u671D",
      "\u5BB3",
      "\u7EED",
      "\u8F7B",
      "\u670D",
      "\u8BD5",
      "\u98DF",
      "\u5145",
      "\u5175",
      "\u6E90",
      "\u5224",
      "\u62A4",
      "\u53F8",
      "\u8DB3",
      "\u67D0",
      "\u7EC3",
      "\u5DEE",
      "\u81F4",
      "\u677F",
      "\u7530",
      "\u964D",
      "\u9ED1",
      "\u72AF",
      "\u8D1F",
      "\u51FB",
      "\u8303",
      "\u7EE7",
      "\u5174",
      "\u4F3C",
      "\u4F59",
      "\u575A",
      "\u66F2",
      "\u8F93",
      "\u4FEE",
      "\u6545",
      "\u57CE",
      "\u592B",
      "\u591F",
      "\u9001",
      "\u7B14",
      "\u8239",
      "\u5360",
      "\u53F3",
      "\u8D22",
      "\u5403",
      "\u5BCC",
      "\u6625",
      "\u804C",
      "\u89C9",
      "\u6C49",
      "\u753B",
      "\u529F",
      "\u5DF4",
      "\u8DDF",
      "\u867D",
      "\u6742",
      "\u98DE",
      "\u68C0",
      "\u5438",
      "\u52A9",
      "\u5347",
      "\u9633",
      "\u4E92",
      "\u521D",
      "\u521B",
      "\u6297",
      "\u8003",
      "\u6295",
      "\u574F",
      "\u7B56",
      "\u53E4",
      "\u5F84",
      "\u6362",
      "\u672A",
      "\u8DD1",
      "\u7559",
      "\u94A2",
      "\u66FE",
      "\u7AEF",
      "\u8D23",
      "\u7AD9",
      "\u7B80",
      "\u8FF0",
      "\u94B1",
      "\u526F",
      "\u5C3D",
      "\u5E1D",
      "\u5C04",
      "\u8349",
      "\u51B2",
      "\u627F",
      "\u72EC",
      "\u4EE4",
      "\u9650",
      "\u963F",
      "\u5BA3",
      "\u73AF",
      "\u53CC",
      "\u8BF7",
      "\u8D85",
      "\u5FAE",
      "\u8BA9",
      "\u63A7",
      "\u5DDE",
      "\u826F",
      "\u8F74",
      "\u627E",
      "\u5426",
      "\u7EAA",
      "\u76CA",
      "\u4F9D",
      "\u4F18",
      "\u9876",
      "\u7840",
      "\u8F7D",
      "\u5012",
      "\u623F",
      "\u7A81",
      "\u5750",
      "\u7C89",
      "\u654C",
      "\u7565",
      "\u5BA2",
      "\u8881",
      "\u51B7",
      "\u80DC",
      "\u7EDD",
      "\u6790",
      "\u5757",
      "\u5242",
      "\u6D4B",
      "\u4E1D",
      "\u534F",
      "\u8BC9",
      "\u5FF5",
      "\u9648",
      "\u4ECD",
      "\u7F57",
      "\u76D0",
      "\u53CB",
      "\u6D0B",
      "\u9519",
      "\u82E6",
      "\u591C",
      "\u5211",
      "\u79FB",
      "\u9891",
      "\u9010",
      "\u9760",
      "\u6DF7",
      "\u6BCD",
      "\u77ED",
      "\u76AE",
      "\u7EC8",
      "\u805A",
      "\u6C7D",
      "\u6751",
      "\u4E91",
      "\u54EA",
      "\u65E2",
      "\u8DDD",
      "\u536B",
      "\u505C",
      "\u70C8",
      "\u592E",
      "\u5BDF",
      "\u70E7",
      "\u8FC5",
      "\u5883",
      "\u82E5",
      "\u5370",
      "\u6D32",
      "\u523B",
      "\u62EC",
      "\u6FC0",
      "\u5B54",
      "\u641E",
      "\u751A",
      "\u5BA4",
      "\u5F85",
      "\u6838",
      "\u6821",
      "\u6563",
      "\u4FB5",
      "\u5427",
      "\u7532",
      "\u6E38",
      "\u4E45",
      "\u83DC",
      "\u5473",
      "\u65E7",
      "\u6A21",
      "\u6E56",
      "\u8D27",
      "\u635F",
      "\u9884",
      "\u963B",
      "\u6BEB",
      "\u666E",
      "\u7A33",
      "\u4E59",
      "\u5988",
      "\u690D",
      "\u606F",
      "\u6269",
      "\u94F6",
      "\u8BED",
      "\u6325",
      "\u9152",
      "\u5B88",
      "\u62FF",
      "\u5E8F",
      "\u7EB8",
      "\u533B",
      "\u7F3A",
      "\u96E8",
      "\u5417",
      "\u9488",
      "\u5218",
      "\u554A",
      "\u6025",
      "\u5531",
      "\u8BEF",
      "\u8BAD",
      "\u613F",
      "\u5BA1",
      "\u9644",
      "\u83B7",
      "\u8336",
      "\u9C9C",
      "\u7CAE",
      "\u65A4",
      "\u5B69",
      "\u8131",
      "\u786B",
      "\u80A5",
      "\u5584",
      "\u9F99",
      "\u6F14",
      "\u7236",
      "\u6E10",
      "\u8840",
      "\u6B22",
      "\u68B0",
      "\u638C",
      "\u6B4C",
      "\u6C99",
      "\u521A",
      "\u653B",
      "\u8C13",
      "\u76FE",
      "\u8BA8",
      "\u665A",
      "\u7C92",
      "\u4E71",
      "\u71C3",
      "\u77DB",
      "\u4E4E",
      "\u6740",
      "\u836F",
      "\u5B81",
      "\u9C81",
      "\u8D35",
      "\u949F",
      "\u7164",
      "\u8BFB",
      "\u73ED",
      "\u4F2F",
      "\u9999",
      "\u4ECB",
      "\u8FEB",
      "\u53E5",
      "\u4E30",
      "\u57F9",
      "\u63E1",
      "\u5170",
      "\u62C5",
      "\u5F26",
      "\u86CB",
      "\u6C89",
      "\u5047",
      "\u7A7F",
      "\u6267",
      "\u7B54",
      "\u4E50",
      "\u8C01",
      "\u987A",
      "\u70DF",
      "\u7F29",
      "\u5F81",
      "\u8138",
      "\u559C",
      "\u677E",
      "\u811A",
      "\u56F0",
      "\u5F02",
      "\u514D",
      "\u80CC",
      "\u661F",
      "\u798F",
      "\u4E70",
      "\u67D3",
      "\u4E95",
      "\u6982",
      "\u6162",
      "\u6015",
      "\u78C1",
      "\u500D",
      "\u7956",
      "\u7687",
      "\u4FC3",
      "\u9759",
      "\u8865",
      "\u8BC4",
      "\u7FFB",
      "\u8089",
      "\u8DF5",
      "\u5C3C",
      "\u8863",
      "\u5BBD",
      "\u626C",
      "\u68C9",
      "\u5E0C",
      "\u4F24",
      "\u64CD",
      "\u5782",
      "\u79CB",
      "\u5B9C",
      "\u6C22",
      "\u5957",
      "\u7763",
      "\u632F",
      "\u67B6",
      "\u4EAE",
      "\u672B",
      "\u5BAA",
      "\u5E86",
      "\u7F16",
      "\u725B",
      "\u89E6",
      "\u6620",
      "\u96F7",
      "\u9500",
      "\u8BD7",
      "\u5EA7",
      "\u5C45",
      "\u6293",
      "\u88C2",
      "\u80DE",
      "\u547C",
      "\u5A18",
      "\u666F",
      "\u5A01",
      "\u7EFF",
      "\u6676",
      "\u539A",
      "\u76DF",
      "\u8861",
      "\u9E21",
      "\u5B59",
      "\u5EF6",
      "\u5371",
      "\u80F6",
      "\u5C4B",
      "\u4E61",
      "\u4E34",
      "\u9646",
      "\u987E",
      "\u6389",
      "\u5440",
      "\u706F",
      "\u5C81",
      "\u63AA",
      "\u675F",
      "\u8010",
      "\u5267",
      "\u7389",
      "\u8D75",
      "\u8DF3",
      "\u54E5",
      "\u5B63",
      "\u8BFE",
      "\u51EF",
      "\u80E1",
      "\u989D",
      "\u6B3E",
      "\u7ECD",
      "\u5377",
      "\u9F50",
      "\u4F1F",
      "\u84B8",
      "\u6B96",
      "\u6C38",
      "\u5B97",
      "\u82D7",
      "\u5DDD",
      "\u7089",
      "\u5CA9",
      "\u5F31",
      "\u96F6",
      "\u6768",
      "\u594F",
      "\u6CBF",
      "\u9732",
      "\u6746",
      "\u63A2",
      "\u6ED1",
      "\u9547",
      "\u996D",
      "\u6D53",
      "\u822A",
      "\u6000",
      "\u8D76",
      "\u5E93",
      "\u593A",
      "\u4F0A",
      "\u7075",
      "\u7A0E",
      "\u9014",
      "\u706D",
      "\u8D5B",
      "\u5F52",
      "\u53EC",
      "\u9F13",
      "\u64AD",
      "\u76D8",
      "\u88C1",
      "\u9669",
      "\u5EB7",
      "\u552F",
      "\u5F55",
      "\u83CC",
      "\u7EAF",
      "\u501F",
      "\u7CD6",
      "\u76D6",
      "\u6A2A",
      "\u7B26",
      "\u79C1",
      "\u52AA",
      "\u5802",
      "\u57DF",
      "\u67AA",
      "\u6DA6",
      "\u5E45",
      "\u54C8",
      "\u7ADF",
      "\u719F",
      "\u866B",
      "\u6CFD",
      "\u8111",
      "\u58E4",
      "\u78B3",
      "\u6B27",
      "\u904D",
      "\u4FA7",
      "\u5BE8",
      "\u6562",
      "\u5F7B",
      "\u8651",
      "\u659C",
      "\u8584",
      "\u5EAD",
      "\u7EB3",
      "\u5F39",
      "\u9972",
      "\u4F38",
      "\u6298",
      "\u9EA6",
      "\u6E7F",
      "\u6697",
      "\u8377",
      "\u74E6",
      "\u585E",
      "\u5E8A",
      "\u7B51",
      "\u6076",
      "\u6237",
      "\u8BBF",
      "\u5854",
      "\u5947",
      "\u900F",
      "\u6881",
      "\u5200",
      "\u65CB",
      "\u8FF9",
      "\u5361",
      "\u6C2F",
      "\u9047",
      "\u4EFD",
      "\u6BD2",
      "\u6CE5",
      "\u9000",
      "\u6D17",
      "\u6446",
      "\u7070",
      "\u5F69",
      "\u5356",
      "\u8017",
      "\u590F",
      "\u62E9",
      "\u5FD9",
      "\u94DC",
      "\u732E",
      "\u786C",
      "\u4E88",
      "\u7E41",
      "\u5708",
      "\u96EA",
      "\u51FD",
      "\u4EA6",
      "\u62BD",
      "\u7BC7",
      "\u9635",
      "\u9634",
      "\u4E01",
      "\u5C3A",
      "\u8FFD",
      "\u5806",
      "\u96C4",
      "\u8FCE",
      "\u6CDB",
      "\u7238",
      "\u697C",
      "\u907F",
      "\u8C0B",
      "\u5428",
      "\u91CE",
      "\u732A",
      "\u65D7",
      "\u7D2F",
      "\u504F",
      "\u5178",
      "\u9986",
      "\u7D22",
      "\u79E6",
      "\u8102",
      "\u6F6E",
      "\u7237",
      "\u8C46",
      "\u5FFD",
      "\u6258",
      "\u60CA",
      "\u5851",
      "\u9057",
      "\u6108",
      "\u6731",
      "\u66FF",
      "\u7EA4",
      "\u7C97",
      "\u503E",
      "\u5C1A",
      "\u75DB",
      "\u695A",
      "\u8C22",
      "\u594B",
      "\u8D2D",
      "\u78E8",
      "\u541B",
      "\u6C60",
      "\u65C1",
      "\u788E",
      "\u9AA8",
      "\u76D1",
      "\u6355",
      "\u5F1F",
      "\u66B4",
      "\u5272",
      "\u8D2F",
      "\u6B8A",
      "\u91CA",
      "\u8BCD",
      "\u4EA1",
      "\u58C1",
      "\u987F",
      "\u5B9D",
      "\u5348",
      "\u5C18",
      "\u95FB",
      "\u63ED",
      "\u70AE",
      "\u6B8B",
      "\u51AC",
      "\u6865",
      "\u5987",
      "\u8B66",
      "\u7EFC",
      "\u62DB",
      "\u5434",
      "\u4ED8",
      "\u6D6E",
      "\u906D",
      "\u5F90",
      "\u60A8",
      "\u6447",
      "\u8C37",
      "\u8D5E",
      "\u7BB1",
      "\u9694",
      "\u8BA2",
      "\u7537",
      "\u5439",
      "\u56ED",
      "\u7EB7",
      "\u5510",
      "\u8D25",
      "\u5B8B",
      "\u73BB",
      "\u5DE8",
      "\u8015",
      "\u5766",
      "\u8363",
      "\u95ED",
      "\u6E7E",
      "\u952E",
      "\u51E1",
      "\u9A7B",
      "\u9505",
      "\u6551",
      "\u6069",
      "\u5265",
      "\u51DD",
      "\u78B1",
      "\u9F7F",
      "\u622A",
      "\u70BC",
      "\u9EBB",
      "\u7EBA",
      "\u7981",
      "\u5E9F",
      "\u76DB",
      "\u7248",
      "\u7F13",
      "\u51C0",
      "\u775B",
      "\u660C",
      "\u5A5A",
      "\u6D89",
      "\u7B52",
      "\u5634",
      "\u63D2",
      "\u5CB8",
      "\u6717",
      "\u5E84",
      "\u8857",
      "\u85CF",
      "\u59D1",
      "\u8D38",
      "\u8150",
      "\u5974",
      "\u5566",
      "\u60EF",
      "\u4E58",
      "\u4F19",
      "\u6062",
      "\u5300",
      "\u7EB1",
      "\u624E",
      "\u8FA9",
      "\u8033",
      "\u5F6A",
      "\u81E3",
      "\u4EBF",
      "\u7483",
      "\u62B5",
      "\u8109",
      "\u79C0",
      "\u8428",
      "\u4FC4",
      "\u7F51",
      "\u821E",
      "\u5E97",
      "\u55B7",
      "\u7EB5",
      "\u5BF8",
      "\u6C57",
      "\u6302",
      "\u6D2A",
      "\u8D3A",
      "\u95EA",
      "\u67EC",
      "\u7206",
      "\u70EF",
      "\u6D25",
      "\u7A3B",
      "\u5899",
      "\u8F6F",
      "\u52C7",
      "\u50CF",
      "\u6EDA",
      "\u5398",
      "\u8499",
      "\u82B3",
      "\u80AF",
      "\u5761",
      "\u67F1",
      "\u8361",
      "\u817F",
      "\u4EEA",
      "\u65C5",
      "\u5C3E",
      "\u8F67",
      "\u51B0",
      "\u8D21",
      "\u767B",
      "\u9ECE",
      "\u524A",
      "\u94BB",
      "\u52D2",
      "\u9003",
      "\u969C",
      "\u6C28",
      "\u90ED",
      "\u5CF0",
      "\u5E01",
      "\u6E2F",
      "\u4F0F",
      "\u8F68",
      "\u4EA9",
      "\u6BD5",
      "\u64E6",
      "\u83AB",
      "\u523A",
      "\u6D6A",
      "\u79D8",
      "\u63F4",
      "\u682A",
      "\u5065",
      "\u552E",
      "\u80A1",
      "\u5C9B",
      "\u7518",
      "\u6CE1",
      "\u7761",
      "\u7AE5",
      "\u94F8",
      "\u6C64",
      "\u9600",
      "\u4F11",
      "\u6C47",
      "\u820D",
      "\u7267",
      "\u7ED5",
      "\u70B8",
      "\u54F2",
      "\u78F7",
      "\u7EE9",
      "\u670B",
      "\u6DE1",
      "\u5C16",
      "\u542F",
      "\u9677",
      "\u67F4",
      "\u5448",
      "\u5F92",
      "\u989C",
      "\u6CEA",
      "\u7A0D",
      "\u5FD8",
      "\u6CF5",
      "\u84DD",
      "\u62D6",
      "\u6D1E",
      "\u6388",
      "\u955C",
      "\u8F9B",
      "\u58EE",
      "\u950B",
      "\u8D2B",
      "\u865A",
      "\u5F2F",
      "\u6469",
      "\u6CF0",
      "\u5E7C",
      "\u5EF7",
      "\u5C0A",
      "\u7A97",
      "\u7EB2",
      "\u5F04",
      "\u96B6",
      "\u7591",
      "\u6C0F",
      "\u5BAB",
      "\u59D0",
      "\u9707",
      "\u745E",
      "\u602A",
      "\u5C24",
      "\u7434",
      "\u5FAA",
      "\u63CF",
      "\u819C",
      "\u8FDD",
      "\u5939",
      "\u8170",
      "\u7F18",
      "\u73E0",
      "\u7A77",
      "\u68EE",
      "\u679D",
      "\u7AF9",
      "\u6C9F",
      "\u50AC",
      "\u7EF3",
      "\u5FC6",
      "\u90A6",
      "\u5269",
      "\u5E78",
      "\u6D46",
      "\u680F",
      "\u62E5",
      "\u7259",
      "\u8D2E",
      "\u793C",
      "\u6EE4",
      "\u94A0",
      "\u7EB9",
      "\u7F62",
      "\u62CD",
      "\u54B1",
      "\u558A",
      "\u8896",
      "\u57C3",
      "\u52E4",
      "\u7F5A",
      "\u7126",
      "\u6F5C",
      "\u4F0D",
      "\u58A8",
      "\u6B32",
      "\u7F1D",
      "\u59D3",
      "\u520A",
      "\u9971",
      "\u4EFF",
      "\u5956",
      "\u94DD",
      "\u9B3C",
      "\u4E3D",
      "\u8DE8",
      "\u9ED8",
      "\u6316",
      "\u94FE",
      "\u626B",
      "\u559D",
      "\u888B",
      "\u70AD",
      "\u6C61",
      "\u5E55",
      "\u8BF8",
      "\u5F27",
      "\u52B1",
      "\u6885",
      "\u5976",
      "\u6D01",
      "\u707E",
      "\u821F",
      "\u9274",
      "\u82EF",
      "\u8BBC",
      "\u62B1",
      "\u6BC1",
      "\u61C2",
      "\u5BD2",
      "\u667A",
      "\u57D4",
      "\u5BC4",
      "\u5C4A",
      "\u8DC3",
      "\u6E21",
      "\u6311",
      "\u4E39",
      "\u8270",
      "\u8D1D",
      "\u78B0",
      "\u62D4",
      "\u7239",
      "\u6234",
      "\u7801",
      "\u68A6",
      "\u82BD",
      "\u7194",
      "\u8D64",
      "\u6E14",
      "\u54ED",
      "\u656C",
      "\u9897",
      "\u5954",
      "\u94C5",
      "\u4EF2",
      "\u864E",
      "\u7A00",
      "\u59B9",
      "\u4E4F",
      "\u73CD",
      "\u7533",
      "\u684C",
      "\u9075",
      "\u5141",
      "\u9686",
      "\u87BA",
      "\u4ED3",
      "\u9B4F",
      "\u9510",
      "\u6653",
      "\u6C2E",
      "\u517C",
      "\u9690",
      "\u788D",
      "\u8D6B",
      "\u62E8",
      "\u5FE0",
      "\u8083",
      "\u7F38",
      "\u7275",
      "\u62A2",
      "\u535A",
      "\u5DE7",
      "\u58F3",
      "\u5144",
      "\u675C",
      "\u8BAF",
      "\u8BDA",
      "\u78A7",
      "\u7965",
      "\u67EF",
      "\u9875",
      "\u5DE1",
      "\u77E9",
      "\u60B2",
      "\u704C",
      "\u9F84",
      "\u4F26",
      "\u7968",
      "\u5BFB",
      "\u6842",
      "\u94FA",
      "\u5723",
      "\u6050",
      "\u6070",
      "\u90D1",
      "\u8DA3",
      "\u62AC",
      "\u8352",
      "\u817E",
      "\u8D34",
      "\u67D4",
      "\u6EF4",
      "\u731B",
      "\u9614",
      "\u8F86",
      "\u59BB",
      "\u586B",
      "\u64A4",
      "\u50A8",
      "\u7B7E",
      "\u95F9",
      "\u6270",
      "\u7D2B",
      "\u7802",
      "\u9012",
      "\u620F",
      "\u540A",
      "\u9676",
      "\u4F10",
      "\u5582",
      "\u7597",
      "\u74F6",
      "\u5A46",
      "\u629A",
      "\u81C2",
      "\u6478",
      "\u5FCD",
      "\u867E",
      "\u8721",
      "\u90BB",
      "\u80F8",
      "\u5DE9",
      "\u6324",
      "\u5076",
      "\u5F03",
      "\u69FD",
      "\u52B2",
      "\u4E73",
      "\u9093",
      "\u5409",
      "\u4EC1",
      "\u70C2",
      "\u7816",
      "\u79DF",
      "\u4E4C",
      "\u8230",
      "\u4F34",
      "\u74DC",
      "\u6D45",
      "\u4E19",
      "\u6682",
      "\u71E5",
      "\u6A61",
      "\u67F3",
      "\u8FF7",
      "\u6696",
      "\u724C",
      "\u79E7",
      "\u80C6",
      "\u8BE6",
      "\u7C27",
      "\u8E0F",
      "\u74F7",
      "\u8C31",
      "\u5446",
      "\u5BBE",
      "\u7CCA",
      "\u6D1B",
      "\u8F89",
      "\u6124",
      "\u7ADE",
      "\u9699",
      "\u6012",
      "\u7C98",
      "\u4E43",
      "\u7EEA",
      "\u80A9",
      "\u7C4D",
      "\u654F",
      "\u6D82",
      "\u7199",
      "\u7686",
      "\u4FA6",
      "\u60AC",
      "\u6398",
      "\u4EAB",
      "\u7EA0",
      "\u9192",
      "\u72C2",
      "\u9501",
      "\u6DC0",
      "\u6068",
      "\u7272",
      "\u9738",
      "\u722C",
      "\u8D4F",
      "\u9006",
      "\u73A9",
      "\u9675",
      "\u795D",
      "\u79D2",
      "\u6D59",
      "\u8C8C",
      "\u5F79",
      "\u5F7C",
      "\u6089",
      "\u9E2D",
      "\u8D8B",
      "\u51E4",
      "\u6668",
      "\u755C",
      "\u8F88",
      "\u79E9",
      "\u5375",
      "\u7F72",
      "\u68AF",
      "\u708E",
      "\u6EE9",
      "\u68CB",
      "\u9A71",
      "\u7B5B",
      "\u5CE1",
      "\u5192",
      "\u5565",
      "\u5BFF",
      "\u8BD1",
      "\u6D78",
      "\u6CC9",
      "\u5E3D",
      "\u8FDF",
      "\u7845",
      "\u7586",
      "\u8D37",
      "\u6F0F",
      "\u7A3F",
      "\u51A0",
      "\u5AE9",
      "\u80C1",
      "\u82AF",
      "\u7262",
      "\u53DB",
      "\u8680",
      "\u5965",
      "\u9E23",
      "\u5CAD",
      "\u7F8A",
      "\u51ED",
      "\u4E32",
      "\u5858",
      "\u7ED8",
      "\u9175",
      "\u878D",
      "\u76C6",
      "\u9521",
      "\u5E99",
      "\u7B79",
      "\u51BB",
      "\u8F85",
      "\u6444",
      "\u88AD",
      "\u7B4B",
      "\u62D2",
      "\u50DA",
      "\u65F1",
      "\u94BE",
      "\u9E1F",
      "\u6F06",
      "\u6C88",
      "\u7709",
      "\u758F",
      "\u6DFB",
      "\u68D2",
      "\u7A57",
      "\u785D",
      "\u97E9",
      "\u903C",
      "\u626D",
      "\u4FA8",
      "\u51C9",
      "\u633A",
      "\u7897",
      "\u683D",
      "\u7092",
      "\u676F",
      "\u60A3",
      "\u998F",
      "\u529D",
      "\u8C6A",
      "\u8FBD",
      "\u52C3",
      "\u9E3F",
      "\u65E6",
      "\u540F",
      "\u62DC",
      "\u72D7",
      "\u57CB",
      "\u8F8A",
      "\u63A9",
      "\u996E",
      "\u642C",
      "\u9A82",
      "\u8F9E",
      "\u52FE",
      "\u6263",
      "\u4F30",
      "\u848B",
      "\u7ED2",
      "\u96FE",
      "\u4E08",
      "\u6735",
      "\u59C6",
      "\u62DF",
      "\u5B87",
      "\u8F91",
      "\u9655",
      "\u96D5",
      "\u507F",
      "\u84C4",
      "\u5D07",
      "\u526A",
      "\u5021",
      "\u5385",
      "\u54AC",
      "\u9A76",
      "\u85AF",
      "\u5237",
      "\u65A5",
      "\u756A",
      "\u8D4B",
      "\u5949",
      "\u4F5B",
      "\u6D47",
      "\u6F2B",
      "\u66FC",
      "\u6247",
      "\u9499",
      "\u6843",
      "\u6276",
      "\u4ED4",
      "\u8FD4",
      "\u4FD7",
      "\u4E8F",
      "\u8154",
      "\u978B",
      "\u68F1",
      "\u8986",
      "\u6846",
      "\u6084",
      "\u53D4",
      "\u649E",
      "\u9A97",
      "\u52D8",
      "\u65FA",
      "\u6CB8",
      "\u5B64",
      "\u5410",
      "\u5B5F",
      "\u6E20",
      "\u5C48",
      "\u75BE",
      "\u5999",
      "\u60DC",
      "\u4EF0",
      "\u72E0",
      "\u80C0",
      "\u8C10",
      "\u629B",
      "\u9709",
      "\u6851",
      "\u5C97",
      "\u561B",
      "\u8870",
      "\u76D7",
      "\u6E17",
      "\u810F",
      "\u8D56",
      "\u6D8C",
      "\u751C",
      "\u66F9",
      "\u9605",
      "\u808C",
      "\u54E9",
      "\u5389",
      "\u70C3",
      "\u7EAC",
      "\u6BC5",
      "\u6628",
      "\u4F2A",
      "\u75C7",
      "\u716E",
      "\u53F9",
      "\u9489",
      "\u642D",
      "\u830E",
      "\u7B3C",
      "\u9177",
      "\u5077",
      "\u5F13",
      "\u9525",
      "\u6052",
      "\u6770",
      "\u5751",
      "\u9F3B",
      "\u7FFC",
      "\u7EB6",
      "\u53D9",
      "\u72F1",
      "\u902E",
      "\u7F50",
      "\u7EDC",
      "\u68DA",
      "\u6291",
      "\u81A8",
      "\u852C",
      "\u5BFA",
      "\u9AA4",
      "\u7A46",
      "\u51B6",
      "\u67AF",
      "\u518C",
      "\u5C38",
      "\u51F8",
      "\u7EC5",
      "\u576F",
      "\u727A",
      "\u7130",
      "\u8F70",
      "\u6B23",
      "\u664B",
      "\u7626",
      "\u5FA1",
      "\u952D",
      "\u9526",
      "\u4E27",
      "\u65EC",
      "\u953B",
      "\u5784",
      "\u641C",
      "\u6251",
      "\u9080",
      "\u4EAD",
      "\u916F",
      "\u8FC8",
      "\u8212",
      "\u8106",
      "\u9176",
      "\u95F2",
      "\u5FE7",
      "\u915A",
      "\u987D",
      "\u7FBD",
      "\u6DA8",
      "\u5378",
      "\u4ED7",
      "\u966A",
      "\u8F9F",
      "\u60E9",
      "\u676D",
      "\u59DA",
      "\u809A",
      "\u6349",
      "\u98D8",
      "\u6F02",
      "\u6606",
      "\u6B3A",
      "\u543E",
      "\u90CE",
      "\u70F7",
      "\u6C41",
      "\u5475",
      "\u9970",
      "\u8427",
      "\u96C5",
      "\u90AE",
      "\u8FC1",
      "\u71D5",
      "\u6492",
      "\u59FB",
      "\u8D74",
      "\u5BB4",
      "\u70E6",
      "\u503A",
      "\u5E10",
      "\u6591",
      "\u94C3",
      "\u65E8",
      "\u9187",
      "\u8463",
      "\u997C",
      "\u96CF",
      "\u59FF",
      "\u62CC",
      "\u5085",
      "\u8179",
      "\u59A5",
      "\u63C9",
      "\u8D24",
      "\u62C6",
      "\u6B6A",
      "\u8461",
      "\u80FA",
      "\u4E22",
      "\u6D69",
      "\u5FBD",
      "\u6602",
      "\u57AB",
      "\u6321",
      "\u89C8",
      "\u8D2A",
      "\u6170",
      "\u7F34",
      "\u6C6A",
      "\u614C",
      "\u51AF",
      "\u8BFA",
      "\u59DC",
      "\u8C0A",
      "\u51F6",
      "\u52A3",
      "\u8BEC",
      "\u8000",
      "\u660F",
      "\u8EBA",
      "\u76C8",
      "\u9A91",
      "\u4E54",
      "\u6EAA",
      "\u4E1B",
      "\u5362",
      "\u62B9",
      "\u95F7",
      "\u54A8",
      "\u522E",
      "\u9A7E",
      "\u7F06",
      "\u609F",
      "\u6458",
      "\u94D2",
      "\u63B7",
      "\u9887",
      "\u5E7B",
      "\u67C4",
      "\u60E0",
      "\u60E8",
      "\u4F73",
      "\u4EC7",
      "\u814A",
      "\u7A9D",
      "\u6DA4",
      "\u5251",
      "\u77A7",
      "\u5821",
      "\u6CFC",
      "\u8471",
      "\u7F69",
      "\u970D",
      "\u635E",
      "\u80CE",
      "\u82CD",
      "\u6EE8",
      "\u4FE9",
      "\u6345",
      "\u6E58",
      "\u780D",
      "\u971E",
      "\u90B5",
      "\u8404",
      "\u75AF",
      "\u6DEE",
      "\u9042",
      "\u718A",
      "\u7CAA",
      "\u70D8",
      "\u5BBF",
      "\u6863",
      "\u6208",
      "\u9A73",
      "\u5AC2",
      "\u88D5",
      "\u5F99",
      "\u7BAD",
      "\u6350",
      "\u80A0",
      "\u6491",
      "\u6652",
      "\u8FA8",
      "\u6BBF",
      "\u83B2",
      "\u644A",
      "\u6405",
      "\u9171",
      "\u5C4F",
      "\u75AB",
      "\u54C0",
      "\u8521",
      "\u5835",
      "\u6CAB",
      "\u76B1",
      "\u7545",
      "\u53E0",
      "\u9601",
      "\u83B1",
      "\u6572",
      "\u8F96",
      "\u94A9",
      "\u75D5",
      "\u575D",
      "\u5DF7",
      "\u997F",
      "\u7978",
      "\u4E18",
      "\u7384",
      "\u6E9C",
      "\u66F0",
      "\u903B",
      "\u5F6D",
      "\u5C1D",
      "\u537F",
      "\u59A8",
      "\u8247",
      "\u541E",
      "\u97E6",
      "\u6028",
      "\u77EE",
      "\u6B47"
    ];
  }
});

// node_modules/bip39/src/wordlists/chinese_traditional.json
var require_chinese_traditional = __commonJS({
  "node_modules/bip39/src/wordlists/chinese_traditional.json"(exports, module2) {
    module2.exports = [
      "\u7684",
      "\u4E00",
      "\u662F",
      "\u5728",
      "\u4E0D",
      "\u4E86",
      "\u6709",
      "\u548C",
      "\u4EBA",
      "\u9019",
      "\u4E2D",
      "\u5927",
      "\u70BA",
      "\u4E0A",
      "\u500B",
      "\u570B",
      "\u6211",
      "\u4EE5",
      "\u8981",
      "\u4ED6",
      "\u6642",
      "\u4F86",
      "\u7528",
      "\u5011",
      "\u751F",
      "\u5230",
      "\u4F5C",
      "\u5730",
      "\u65BC",
      "\u51FA",
      "\u5C31",
      "\u5206",
      "\u5C0D",
      "\u6210",
      "\u6703",
      "\u53EF",
      "\u4E3B",
      "\u767C",
      "\u5E74",
      "\u52D5",
      "\u540C",
      "\u5DE5",
      "\u4E5F",
      "\u80FD",
      "\u4E0B",
      "\u904E",
      "\u5B50",
      "\u8AAA",
      "\u7522",
      "\u7A2E",
      "\u9762",
      "\u800C",
      "\u65B9",
      "\u5F8C",
      "\u591A",
      "\u5B9A",
      "\u884C",
      "\u5B78",
      "\u6CD5",
      "\u6240",
      "\u6C11",
      "\u5F97",
      "\u7D93",
      "\u5341",
      "\u4E09",
      "\u4E4B",
      "\u9032",
      "\u8457",
      "\u7B49",
      "\u90E8",
      "\u5EA6",
      "\u5BB6",
      "\u96FB",
      "\u529B",
      "\u88E1",
      "\u5982",
      "\u6C34",
      "\u5316",
      "\u9AD8",
      "\u81EA",
      "\u4E8C",
      "\u7406",
      "\u8D77",
      "\u5C0F",
      "\u7269",
      "\u73FE",
      "\u5BE6",
      "\u52A0",
      "\u91CF",
      "\u90FD",
      "\u5169",
      "\u9AD4",
      "\u5236",
      "\u6A5F",
      "\u7576",
      "\u4F7F",
      "\u9EDE",
      "\u5F9E",
      "\u696D",
      "\u672C",
      "\u53BB",
      "\u628A",
      "\u6027",
      "\u597D",
      "\u61C9",
      "\u958B",
      "\u5B83",
      "\u5408",
      "\u9084",
      "\u56E0",
      "\u7531",
      "\u5176",
      "\u4E9B",
      "\u7136",
      "\u524D",
      "\u5916",
      "\u5929",
      "\u653F",
      "\u56DB",
      "\u65E5",
      "\u90A3",
      "\u793E",
      "\u7FA9",
      "\u4E8B",
      "\u5E73",
      "\u5F62",
      "\u76F8",
      "\u5168",
      "\u8868",
      "\u9593",
      "\u6A23",
      "\u8207",
      "\u95DC",
      "\u5404",
      "\u91CD",
      "\u65B0",
      "\u7DDA",
      "\u5167",
      "\u6578",
      "\u6B63",
      "\u5FC3",
      "\u53CD",
      "\u4F60",
      "\u660E",
      "\u770B",
      "\u539F",
      "\u53C8",
      "\u9EBC",
      "\u5229",
      "\u6BD4",
      "\u6216",
      "\u4F46",
      "\u8CEA",
      "\u6C23",
      "\u7B2C",
      "\u5411",
      "\u9053",
      "\u547D",
      "\u6B64",
      "\u8B8A",
      "\u689D",
      "\u53EA",
      "\u6C92",
      "\u7D50",
      "\u89E3",
      "\u554F",
      "\u610F",
      "\u5EFA",
      "\u6708",
      "\u516C",
      "\u7121",
      "\u7CFB",
      "\u8ECD",
      "\u5F88",
      "\u60C5",
      "\u8005",
      "\u6700",
      "\u7ACB",
      "\u4EE3",
      "\u60F3",
      "\u5DF2",
      "\u901A",
      "\u4E26",
      "\u63D0",
      "\u76F4",
      "\u984C",
      "\u9EE8",
      "\u7A0B",
      "\u5C55",
      "\u4E94",
      "\u679C",
      "\u6599",
      "\u8C61",
      "\u54E1",
      "\u9769",
      "\u4F4D",
      "\u5165",
      "\u5E38",
      "\u6587",
      "\u7E3D",
      "\u6B21",
      "\u54C1",
      "\u5F0F",
      "\u6D3B",
      "\u8A2D",
      "\u53CA",
      "\u7BA1",
      "\u7279",
      "\u4EF6",
      "\u9577",
      "\u6C42",
      "\u8001",
      "\u982D",
      "\u57FA",
      "\u8CC7",
      "\u908A",
      "\u6D41",
      "\u8DEF",
      "\u7D1A",
      "\u5C11",
      "\u5716",
      "\u5C71",
      "\u7D71",
      "\u63A5",
      "\u77E5",
      "\u8F03",
      "\u5C07",
      "\u7D44",
      "\u898B",
      "\u8A08",
      "\u5225",
      "\u5979",
      "\u624B",
      "\u89D2",
      "\u671F",
      "\u6839",
      "\u8AD6",
      "\u904B",
      "\u8FB2",
      "\u6307",
      "\u5E7E",
      "\u4E5D",
      "\u5340",
      "\u5F37",
      "\u653E",
      "\u6C7A",
      "\u897F",
      "\u88AB",
      "\u5E79",
      "\u505A",
      "\u5FC5",
      "\u6230",
      "\u5148",
      "\u56DE",
      "\u5247",
      "\u4EFB",
      "\u53D6",
      "\u64DA",
      "\u8655",
      "\u968A",
      "\u5357",
      "\u7D66",
      "\u8272",
      "\u5149",
      "\u9580",
      "\u5373",
      "\u4FDD",
      "\u6CBB",
      "\u5317",
      "\u9020",
      "\u767E",
      "\u898F",
      "\u71B1",
      "\u9818",
      "\u4E03",
      "\u6D77",
      "\u53E3",
      "\u6771",
      "\u5C0E",
      "\u5668",
      "\u58D3",
      "\u5FD7",
      "\u4E16",
      "\u91D1",
      "\u589E",
      "\u722D",
      "\u6FDF",
      "\u968E",
      "\u6CB9",
      "\u601D",
      "\u8853",
      "\u6975",
      "\u4EA4",
      "\u53D7",
      "\u806F",
      "\u4EC0",
      "\u8A8D",
      "\u516D",
      "\u5171",
      "\u6B0A",
      "\u6536",
      "\u8B49",
      "\u6539",
      "\u6E05",
      "\u7F8E",
      "\u518D",
      "\u63A1",
      "\u8F49",
      "\u66F4",
      "\u55AE",
      "\u98A8",
      "\u5207",
      "\u6253",
      "\u767D",
      "\u6559",
      "\u901F",
      "\u82B1",
      "\u5E36",
      "\u5B89",
      "\u5834",
      "\u8EAB",
      "\u8ECA",
      "\u4F8B",
      "\u771F",
      "\u52D9",
      "\u5177",
      "\u842C",
      "\u6BCF",
      "\u76EE",
      "\u81F3",
      "\u9054",
      "\u8D70",
      "\u7A4D",
      "\u793A",
      "\u8B70",
      "\u8072",
      "\u5831",
      "\u9B25",
      "\u5B8C",
      "\u985E",
      "\u516B",
      "\u96E2",
      "\u83EF",
      "\u540D",
      "\u78BA",
      "\u624D",
      "\u79D1",
      "\u5F35",
      "\u4FE1",
      "\u99AC",
      "\u7BC0",
      "\u8A71",
      "\u7C73",
      "\u6574",
      "\u7A7A",
      "\u5143",
      "\u6CC1",
      "\u4ECA",
      "\u96C6",
      "\u6EAB",
      "\u50B3",
      "\u571F",
      "\u8A31",
      "\u6B65",
      "\u7FA4",
      "\u5EE3",
      "\u77F3",
      "\u8A18",
      "\u9700",
      "\u6BB5",
      "\u7814",
      "\u754C",
      "\u62C9",
      "\u6797",
      "\u5F8B",
      "\u53EB",
      "\u4E14",
      "\u7A76",
      "\u89C0",
      "\u8D8A",
      "\u7E54",
      "\u88DD",
      "\u5F71",
      "\u7B97",
      "\u4F4E",
      "\u6301",
      "\u97F3",
      "\u773E",
      "\u66F8",
      "\u5E03",
      "\u590D",
      "\u5BB9",
      "\u5152",
      "\u9808",
      "\u969B",
      "\u5546",
      "\u975E",
      "\u9A57",
      "\u9023",
      "\u65B7",
      "\u6DF1",
      "\u96E3",
      "\u8FD1",
      "\u7926",
      "\u5343",
      "\u9031",
      "\u59D4",
      "\u7D20",
      "\u6280",
      "\u5099",
      "\u534A",
      "\u8FA6",
      "\u9752",
      "\u7701",
      "\u5217",
      "\u7FD2",
      "\u97FF",
      "\u7D04",
      "\u652F",
      "\u822C",
      "\u53F2",
      "\u611F",
      "\u52DE",
      "\u4FBF",
      "\u5718",
      "\u5F80",
      "\u9178",
      "\u6B77",
      "\u5E02",
      "\u514B",
      "\u4F55",
      "\u9664",
      "\u6D88",
      "\u69CB",
      "\u5E9C",
      "\u7A31",
      "\u592A",
      "\u6E96",
      "\u7CBE",
      "\u503C",
      "\u865F",
      "\u7387",
      "\u65CF",
      "\u7DAD",
      "\u5283",
      "\u9078",
      "\u6A19",
      "\u5BEB",
      "\u5B58",
      "\u5019",
      "\u6BDB",
      "\u89AA",
      "\u5FEB",
      "\u6548",
      "\u65AF",
      "\u9662",
      "\u67E5",
      "\u6C5F",
      "\u578B",
      "\u773C",
      "\u738B",
      "\u6309",
      "\u683C",
      "\u990A",
      "\u6613",
      "\u7F6E",
      "\u6D3E",
      "\u5C64",
      "\u7247",
      "\u59CB",
      "\u537B",
      "\u5C08",
      "\u72C0",
      "\u80B2",
      "\u5EE0",
      "\u4EAC",
      "\u8B58",
      "\u9069",
      "\u5C6C",
      "\u5713",
      "\u5305",
      "\u706B",
      "\u4F4F",
      "\u8ABF",
      "\u6EFF",
      "\u7E23",
      "\u5C40",
      "\u7167",
      "\u53C3",
      "\u7D05",
      "\u7D30",
      "\u5F15",
      "\u807D",
      "\u8A72",
      "\u9435",
      "\u50F9",
      "\u56B4",
      "\u9996",
      "\u5E95",
      "\u6DB2",
      "\u5B98",
      "\u5FB7",
      "\u96A8",
      "\u75C5",
      "\u8607",
      "\u5931",
      "\u723E",
      "\u6B7B",
      "\u8B1B",
      "\u914D",
      "\u5973",
      "\u9EC3",
      "\u63A8",
      "\u986F",
      "\u8AC7",
      "\u7F6A",
      "\u795E",
      "\u85DD",
      "\u5462",
      "\u5E2D",
      "\u542B",
      "\u4F01",
      "\u671B",
      "\u5BC6",
      "\u6279",
      "\u71DF",
      "\u9805",
      "\u9632",
      "\u8209",
      "\u7403",
      "\u82F1",
      "\u6C27",
      "\u52E2",
      "\u544A",
      "\u674E",
      "\u53F0",
      "\u843D",
      "\u6728",
      "\u5E6B",
      "\u8F2A",
      "\u7834",
      "\u4E9E",
      "\u5E2B",
      "\u570D",
      "\u6CE8",
      "\u9060",
      "\u5B57",
      "\u6750",
      "\u6392",
      "\u4F9B",
      "\u6CB3",
      "\u614B",
      "\u5C01",
      "\u53E6",
      "\u65BD",
      "\u6E1B",
      "\u6A39",
      "\u6EB6",
      "\u600E",
      "\u6B62",
      "\u6848",
      "\u8A00",
      "\u58EB",
      "\u5747",
      "\u6B66",
      "\u56FA",
      "\u8449",
      "\u9B5A",
      "\u6CE2",
      "\u8996",
      "\u50C5",
      "\u8CBB",
      "\u7DCA",
      "\u611B",
      "\u5DE6",
      "\u7AE0",
      "\u65E9",
      "\u671D",
      "\u5BB3",
      "\u7E8C",
      "\u8F15",
      "\u670D",
      "\u8A66",
      "\u98DF",
      "\u5145",
      "\u5175",
      "\u6E90",
      "\u5224",
      "\u8B77",
      "\u53F8",
      "\u8DB3",
      "\u67D0",
      "\u7DF4",
      "\u5DEE",
      "\u81F4",
      "\u677F",
      "\u7530",
      "\u964D",
      "\u9ED1",
      "\u72AF",
      "\u8CA0",
      "\u64CA",
      "\u8303",
      "\u7E7C",
      "\u8208",
      "\u4F3C",
      "\u9918",
      "\u5805",
      "\u66F2",
      "\u8F38",
      "\u4FEE",
      "\u6545",
      "\u57CE",
      "\u592B",
      "\u5920",
      "\u9001",
      "\u7B46",
      "\u8239",
      "\u4F54",
      "\u53F3",
      "\u8CA1",
      "\u5403",
      "\u5BCC",
      "\u6625",
      "\u8077",
      "\u89BA",
      "\u6F22",
      "\u756B",
      "\u529F",
      "\u5DF4",
      "\u8DDF",
      "\u96D6",
      "\u96DC",
      "\u98DB",
      "\u6AA2",
      "\u5438",
      "\u52A9",
      "\u6607",
      "\u967D",
      "\u4E92",
      "\u521D",
      "\u5275",
      "\u6297",
      "\u8003",
      "\u6295",
      "\u58DE",
      "\u7B56",
      "\u53E4",
      "\u5F91",
      "\u63DB",
      "\u672A",
      "\u8DD1",
      "\u7559",
      "\u92FC",
      "\u66FE",
      "\u7AEF",
      "\u8CAC",
      "\u7AD9",
      "\u7C21",
      "\u8FF0",
      "\u9322",
      "\u526F",
      "\u76E1",
      "\u5E1D",
      "\u5C04",
      "\u8349",
      "\u885D",
      "\u627F",
      "\u7368",
      "\u4EE4",
      "\u9650",
      "\u963F",
      "\u5BA3",
      "\u74B0",
      "\u96D9",
      "\u8ACB",
      "\u8D85",
      "\u5FAE",
      "\u8B93",
      "\u63A7",
      "\u5DDE",
      "\u826F",
      "\u8EF8",
      "\u627E",
      "\u5426",
      "\u7D00",
      "\u76CA",
      "\u4F9D",
      "\u512A",
      "\u9802",
      "\u790E",
      "\u8F09",
      "\u5012",
      "\u623F",
      "\u7A81",
      "\u5750",
      "\u7C89",
      "\u6575",
      "\u7565",
      "\u5BA2",
      "\u8881",
      "\u51B7",
      "\u52DD",
      "\u7D55",
      "\u6790",
      "\u584A",
      "\u5291",
      "\u6E2C",
      "\u7D72",
      "\u5354",
      "\u8A34",
      "\u5FF5",
      "\u9673",
      "\u4ECD",
      "\u7F85",
      "\u9E7D",
      "\u53CB",
      "\u6D0B",
      "\u932F",
      "\u82E6",
      "\u591C",
      "\u5211",
      "\u79FB",
      "\u983B",
      "\u9010",
      "\u9760",
      "\u6DF7",
      "\u6BCD",
      "\u77ED",
      "\u76AE",
      "\u7D42",
      "\u805A",
      "\u6C7D",
      "\u6751",
      "\u96F2",
      "\u54EA",
      "\u65E2",
      "\u8DDD",
      "\u885B",
      "\u505C",
      "\u70C8",
      "\u592E",
      "\u5BDF",
      "\u71D2",
      "\u8FC5",
      "\u5883",
      "\u82E5",
      "\u5370",
      "\u6D32",
      "\u523B",
      "\u62EC",
      "\u6FC0",
      "\u5B54",
      "\u641E",
      "\u751A",
      "\u5BA4",
      "\u5F85",
      "\u6838",
      "\u6821",
      "\u6563",
      "\u4FB5",
      "\u5427",
      "\u7532",
      "\u904A",
      "\u4E45",
      "\u83DC",
      "\u5473",
      "\u820A",
      "\u6A21",
      "\u6E56",
      "\u8CA8",
      "\u640D",
      "\u9810",
      "\u963B",
      "\u6BEB",
      "\u666E",
      "\u7A69",
      "\u4E59",
      "\u5ABD",
      "\u690D",
      "\u606F",
      "\u64F4",
      "\u9280",
      "\u8A9E",
      "\u63EE",
      "\u9152",
      "\u5B88",
      "\u62FF",
      "\u5E8F",
      "\u7D19",
      "\u91AB",
      "\u7F3A",
      "\u96E8",
      "\u55CE",
      "\u91DD",
      "\u5289",
      "\u554A",
      "\u6025",
      "\u5531",
      "\u8AA4",
      "\u8A13",
      "\u9858",
      "\u5BE9",
      "\u9644",
      "\u7372",
      "\u8336",
      "\u9BAE",
      "\u7CE7",
      "\u65A4",
      "\u5B69",
      "\u812B",
      "\u786B",
      "\u80A5",
      "\u5584",
      "\u9F8D",
      "\u6F14",
      "\u7236",
      "\u6F38",
      "\u8840",
      "\u6B61",
      "\u68B0",
      "\u638C",
      "\u6B4C",
      "\u6C99",
      "\u525B",
      "\u653B",
      "\u8B02",
      "\u76FE",
      "\u8A0E",
      "\u665A",
      "\u7C92",
      "\u4E82",
      "\u71C3",
      "\u77DB",
      "\u4E4E",
      "\u6BBA",
      "\u85E5",
      "\u5BE7",
      "\u9B6F",
      "\u8CB4",
      "\u9418",
      "\u7164",
      "\u8B80",
      "\u73ED",
      "\u4F2F",
      "\u9999",
      "\u4ECB",
      "\u8FEB",
      "\u53E5",
      "\u8C50",
      "\u57F9",
      "\u63E1",
      "\u862D",
      "\u64D4",
      "\u5F26",
      "\u86CB",
      "\u6C89",
      "\u5047",
      "\u7A7F",
      "\u57F7",
      "\u7B54",
      "\u6A02",
      "\u8AB0",
      "\u9806",
      "\u7159",
      "\u7E2E",
      "\u5FB5",
      "\u81C9",
      "\u559C",
      "\u677E",
      "\u8173",
      "\u56F0",
      "\u7570",
      "\u514D",
      "\u80CC",
      "\u661F",
      "\u798F",
      "\u8CB7",
      "\u67D3",
      "\u4E95",
      "\u6982",
      "\u6162",
      "\u6015",
      "\u78C1",
      "\u500D",
      "\u7956",
      "\u7687",
      "\u4FC3",
      "\u975C",
      "\u88DC",
      "\u8A55",
      "\u7FFB",
      "\u8089",
      "\u8E10",
      "\u5C3C",
      "\u8863",
      "\u5BEC",
      "\u63DA",
      "\u68C9",
      "\u5E0C",
      "\u50B7",
      "\u64CD",
      "\u5782",
      "\u79CB",
      "\u5B9C",
      "\u6C2B",
      "\u5957",
      "\u7763",
      "\u632F",
      "\u67B6",
      "\u4EAE",
      "\u672B",
      "\u61B2",
      "\u6176",
      "\u7DE8",
      "\u725B",
      "\u89F8",
      "\u6620",
      "\u96F7",
      "\u92B7",
      "\u8A69",
      "\u5EA7",
      "\u5C45",
      "\u6293",
      "\u88C2",
      "\u80DE",
      "\u547C",
      "\u5A18",
      "\u666F",
      "\u5A01",
      "\u7DA0",
      "\u6676",
      "\u539A",
      "\u76DF",
      "\u8861",
      "\u96DE",
      "\u5B6B",
      "\u5EF6",
      "\u5371",
      "\u81A0",
      "\u5C4B",
      "\u9109",
      "\u81E8",
      "\u9678",
      "\u9867",
      "\u6389",
      "\u5440",
      "\u71C8",
      "\u6B72",
      "\u63AA",
      "\u675F",
      "\u8010",
      "\u5287",
      "\u7389",
      "\u8D99",
      "\u8DF3",
      "\u54E5",
      "\u5B63",
      "\u8AB2",
      "\u51F1",
      "\u80E1",
      "\u984D",
      "\u6B3E",
      "\u7D39",
      "\u5377",
      "\u9F4A",
      "\u5049",
      "\u84B8",
      "\u6B96",
      "\u6C38",
      "\u5B97",
      "\u82D7",
      "\u5DDD",
      "\u7210",
      "\u5CA9",
      "\u5F31",
      "\u96F6",
      "\u694A",
      "\u594F",
      "\u6CBF",
      "\u9732",
      "\u687F",
      "\u63A2",
      "\u6ED1",
      "\u93AE",
      "\u98EF",
      "\u6FC3",
      "\u822A",
      "\u61F7",
      "\u8D95",
      "\u5EAB",
      "\u596A",
      "\u4F0A",
      "\u9748",
      "\u7A05",
      "\u9014",
      "\u6EC5",
      "\u8CFD",
      "\u6B78",
      "\u53EC",
      "\u9F13",
      "\u64AD",
      "\u76E4",
      "\u88C1",
      "\u96AA",
      "\u5EB7",
      "\u552F",
      "\u9304",
      "\u83CC",
      "\u7D14",
      "\u501F",
      "\u7CD6",
      "\u84CB",
      "\u6A6B",
      "\u7B26",
      "\u79C1",
      "\u52AA",
      "\u5802",
      "\u57DF",
      "\u69CD",
      "\u6F64",
      "\u5E45",
      "\u54C8",
      "\u7ADF",
      "\u719F",
      "\u87F2",
      "\u6FA4",
      "\u8166",
      "\u58E4",
      "\u78B3",
      "\u6B50",
      "\u904D",
      "\u5074",
      "\u5BE8",
      "\u6562",
      "\u5FB9",
      "\u616E",
      "\u659C",
      "\u8584",
      "\u5EAD",
      "\u7D0D",
      "\u5F48",
      "\u98FC",
      "\u4F38",
      "\u6298",
      "\u9EA5",
      "\u6FD5",
      "\u6697",
      "\u8377",
      "\u74E6",
      "\u585E",
      "\u5E8A",
      "\u7BC9",
      "\u60E1",
      "\u6236",
      "\u8A2A",
      "\u5854",
      "\u5947",
      "\u900F",
      "\u6881",
      "\u5200",
      "\u65CB",
      "\u8DE1",
      "\u5361",
      "\u6C2F",
      "\u9047",
      "\u4EFD",
      "\u6BD2",
      "\u6CE5",
      "\u9000",
      "\u6D17",
      "\u64FA",
      "\u7070",
      "\u5F69",
      "\u8CE3",
      "\u8017",
      "\u590F",
      "\u64C7",
      "\u5FD9",
      "\u9285",
      "\u737B",
      "\u786C",
      "\u4E88",
      "\u7E41",
      "\u5708",
      "\u96EA",
      "\u51FD",
      "\u4EA6",
      "\u62BD",
      "\u7BC7",
      "\u9663",
      "\u9670",
      "\u4E01",
      "\u5C3A",
      "\u8FFD",
      "\u5806",
      "\u96C4",
      "\u8FCE",
      "\u6CDB",
      "\u7238",
      "\u6A13",
      "\u907F",
      "\u8B00",
      "\u5678",
      "\u91CE",
      "\u8C6C",
      "\u65D7",
      "\u7D2F",
      "\u504F",
      "\u5178",
      "\u9928",
      "\u7D22",
      "\u79E6",
      "\u8102",
      "\u6F6E",
      "\u723A",
      "\u8C46",
      "\u5FFD",
      "\u6258",
      "\u9A5A",
      "\u5851",
      "\u907A",
      "\u6108",
      "\u6731",
      "\u66FF",
      "\u7E96",
      "\u7C97",
      "\u50BE",
      "\u5C1A",
      "\u75DB",
      "\u695A",
      "\u8B1D",
      "\u596E",
      "\u8CFC",
      "\u78E8",
      "\u541B",
      "\u6C60",
      "\u65C1",
      "\u788E",
      "\u9AA8",
      "\u76E3",
      "\u6355",
      "\u5F1F",
      "\u66B4",
      "\u5272",
      "\u8CAB",
      "\u6B8A",
      "\u91CB",
      "\u8A5E",
      "\u4EA1",
      "\u58C1",
      "\u9813",
      "\u5BF6",
      "\u5348",
      "\u5875",
      "\u805E",
      "\u63ED",
      "\u70AE",
      "\u6B98",
      "\u51AC",
      "\u6A4B",
      "\u5A66",
      "\u8B66",
      "\u7D9C",
      "\u62DB",
      "\u5433",
      "\u4ED8",
      "\u6D6E",
      "\u906D",
      "\u5F90",
      "\u60A8",
      "\u6416",
      "\u8C37",
      "\u8D0A",
      "\u7BB1",
      "\u9694",
      "\u8A02",
      "\u7537",
      "\u5439",
      "\u5712",
      "\u7D1B",
      "\u5510",
      "\u6557",
      "\u5B8B",
      "\u73BB",
      "\u5DE8",
      "\u8015",
      "\u5766",
      "\u69AE",
      "\u9589",
      "\u7063",
      "\u9375",
      "\u51E1",
      "\u99D0",
      "\u934B",
      "\u6551",
      "\u6069",
      "\u525D",
      "\u51DD",
      "\u9E7C",
      "\u9F52",
      "\u622A",
      "\u7149",
      "\u9EBB",
      "\u7D21",
      "\u7981",
      "\u5EE2",
      "\u76DB",
      "\u7248",
      "\u7DE9",
      "\u6DE8",
      "\u775B",
      "\u660C",
      "\u5A5A",
      "\u6D89",
      "\u7B52",
      "\u5634",
      "\u63D2",
      "\u5CB8",
      "\u6717",
      "\u838A",
      "\u8857",
      "\u85CF",
      "\u59D1",
      "\u8CBF",
      "\u8150",
      "\u5974",
      "\u5566",
      "\u6163",
      "\u4E58",
      "\u5925",
      "\u6062",
      "\u52FB",
      "\u7D17",
      "\u624E",
      "\u8FAF",
      "\u8033",
      "\u5F6A",
      "\u81E3",
      "\u5104",
      "\u7483",
      "\u62B5",
      "\u8108",
      "\u79C0",
      "\u85A9",
      "\u4FC4",
      "\u7DB2",
      "\u821E",
      "\u5E97",
      "\u5674",
      "\u7E31",
      "\u5BF8",
      "\u6C57",
      "\u639B",
      "\u6D2A",
      "\u8CC0",
      "\u9583",
      "\u67EC",
      "\u7206",
      "\u70EF",
      "\u6D25",
      "\u7A3B",
      "\u7246",
      "\u8EDF",
      "\u52C7",
      "\u50CF",
      "\u6EFE",
      "\u5398",
      "\u8499",
      "\u82B3",
      "\u80AF",
      "\u5761",
      "\u67F1",
      "\u76EA",
      "\u817F",
      "\u5100",
      "\u65C5",
      "\u5C3E",
      "\u8ECB",
      "\u51B0",
      "\u8CA2",
      "\u767B",
      "\u9ECE",
      "\u524A",
      "\u947D",
      "\u52D2",
      "\u9003",
      "\u969C",
      "\u6C28",
      "\u90ED",
      "\u5CF0",
      "\u5E63",
      "\u6E2F",
      "\u4F0F",
      "\u8ECC",
      "\u755D",
      "\u7562",
      "\u64E6",
      "\u83AB",
      "\u523A",
      "\u6D6A",
      "\u79D8",
      "\u63F4",
      "\u682A",
      "\u5065",
      "\u552E",
      "\u80A1",
      "\u5CF6",
      "\u7518",
      "\u6CE1",
      "\u7761",
      "\u7AE5",
      "\u9444",
      "\u6E6F",
      "\u95A5",
      "\u4F11",
      "\u532F",
      "\u820D",
      "\u7267",
      "\u7E5E",
      "\u70B8",
      "\u54F2",
      "\u78F7",
      "\u7E3E",
      "\u670B",
      "\u6DE1",
      "\u5C16",
      "\u555F",
      "\u9677",
      "\u67F4",
      "\u5448",
      "\u5F92",
      "\u984F",
      "\u6DDA",
      "\u7A0D",
      "\u5FD8",
      "\u6CF5",
      "\u85CD",
      "\u62D6",
      "\u6D1E",
      "\u6388",
      "\u93E1",
      "\u8F9B",
      "\u58EF",
      "\u92D2",
      "\u8CA7",
      "\u865B",
      "\u5F4E",
      "\u6469",
      "\u6CF0",
      "\u5E7C",
      "\u5EF7",
      "\u5C0A",
      "\u7A97",
      "\u7DB1",
      "\u5F04",
      "\u96B8",
      "\u7591",
      "\u6C0F",
      "\u5BAE",
      "\u59D0",
      "\u9707",
      "\u745E",
      "\u602A",
      "\u5C24",
      "\u7434",
      "\u5FAA",
      "\u63CF",
      "\u819C",
      "\u9055",
      "\u593E",
      "\u8170",
      "\u7DE3",
      "\u73E0",
      "\u7AAE",
      "\u68EE",
      "\u679D",
      "\u7AF9",
      "\u6E9D",
      "\u50AC",
      "\u7E69",
      "\u61B6",
      "\u90A6",
      "\u5269",
      "\u5E78",
      "\u6F3F",
      "\u6B04",
      "\u64C1",
      "\u7259",
      "\u8CAF",
      "\u79AE",
      "\u6FFE",
      "\u9209",
      "\u7D0B",
      "\u7F77",
      "\u62CD",
      "\u54B1",
      "\u558A",
      "\u8896",
      "\u57C3",
      "\u52E4",
      "\u7F70",
      "\u7126",
      "\u6F5B",
      "\u4F0D",
      "\u58A8",
      "\u6B32",
      "\u7E2B",
      "\u59D3",
      "\u520A",
      "\u98FD",
      "\u4EFF",
      "\u734E",
      "\u92C1",
      "\u9B3C",
      "\u9E97",
      "\u8DE8",
      "\u9ED8",
      "\u6316",
      "\u93C8",
      "\u6383",
      "\u559D",
      "\u888B",
      "\u70AD",
      "\u6C61",
      "\u5E55",
      "\u8AF8",
      "\u5F27",
      "\u52F5",
      "\u6885",
      "\u5976",
      "\u6F54",
      "\u707D",
      "\u821F",
      "\u9451",
      "\u82EF",
      "\u8A1F",
      "\u62B1",
      "\u6BC0",
      "\u61C2",
      "\u5BD2",
      "\u667A",
      "\u57D4",
      "\u5BC4",
      "\u5C46",
      "\u8E8D",
      "\u6E21",
      "\u6311",
      "\u4E39",
      "\u8271",
      "\u8C9D",
      "\u78B0",
      "\u62D4",
      "\u7239",
      "\u6234",
      "\u78BC",
      "\u5922",
      "\u82BD",
      "\u7194",
      "\u8D64",
      "\u6F01",
      "\u54ED",
      "\u656C",
      "\u9846",
      "\u5954",
      "\u925B",
      "\u4EF2",
      "\u864E",
      "\u7A00",
      "\u59B9",
      "\u4E4F",
      "\u73CD",
      "\u7533",
      "\u684C",
      "\u9075",
      "\u5141",
      "\u9686",
      "\u87BA",
      "\u5009",
      "\u9B4F",
      "\u92B3",
      "\u66C9",
      "\u6C2E",
      "\u517C",
      "\u96B1",
      "\u7919",
      "\u8D6B",
      "\u64A5",
      "\u5FE0",
      "\u8085",
      "\u7F38",
      "\u727D",
      "\u6436",
      "\u535A",
      "\u5DE7",
      "\u6BBC",
      "\u5144",
      "\u675C",
      "\u8A0A",
      "\u8AA0",
      "\u78A7",
      "\u7965",
      "\u67EF",
      "\u9801",
      "\u5DE1",
      "\u77E9",
      "\u60B2",
      "\u704C",
      "\u9F61",
      "\u502B",
      "\u7968",
      "\u5C0B",
      "\u6842",
      "\u92EA",
      "\u8056",
      "\u6050",
      "\u6070",
      "\u912D",
      "\u8DA3",
      "\u62AC",
      "\u8352",
      "\u9A30",
      "\u8CBC",
      "\u67D4",
      "\u6EF4",
      "\u731B",
      "\u95CA",
      "\u8F1B",
      "\u59BB",
      "\u586B",
      "\u64A4",
      "\u5132",
      "\u7C3D",
      "\u9B27",
      "\u64FE",
      "\u7D2B",
      "\u7802",
      "\u905E",
      "\u6232",
      "\u540A",
      "\u9676",
      "\u4F10",
      "\u9935",
      "\u7642",
      "\u74F6",
      "\u5A46",
      "\u64AB",
      "\u81C2",
      "\u6478",
      "\u5FCD",
      "\u8766",
      "\u881F",
      "\u9130",
      "\u80F8",
      "\u978F",
      "\u64E0",
      "\u5076",
      "\u68C4",
      "\u69FD",
      "\u52C1",
      "\u4E73",
      "\u9127",
      "\u5409",
      "\u4EC1",
      "\u721B",
      "\u78DA",
      "\u79DF",
      "\u70CF",
      "\u8266",
      "\u4F34",
      "\u74DC",
      "\u6DFA",
      "\u4E19",
      "\u66AB",
      "\u71E5",
      "\u6A61",
      "\u67F3",
      "\u8FF7",
      "\u6696",
      "\u724C",
      "\u79E7",
      "\u81BD",
      "\u8A73",
      "\u7C27",
      "\u8E0F",
      "\u74F7",
      "\u8B5C",
      "\u5446",
      "\u8CD3",
      "\u7CCA",
      "\u6D1B",
      "\u8F1D",
      "\u61A4",
      "\u7AF6",
      "\u9699",
      "\u6012",
      "\u7C98",
      "\u4E43",
      "\u7DD2",
      "\u80A9",
      "\u7C4D",
      "\u654F",
      "\u5857",
      "\u7199",
      "\u7686",
      "\u5075",
      "\u61F8",
      "\u6398",
      "\u4EAB",
      "\u7CFE",
      "\u9192",
      "\u72C2",
      "\u9396",
      "\u6DC0",
      "\u6068",
      "\u7272",
      "\u9738",
      "\u722C",
      "\u8CDE",
      "\u9006",
      "\u73A9",
      "\u9675",
      "\u795D",
      "\u79D2",
      "\u6D59",
      "\u8C8C",
      "\u5F79",
      "\u5F7C",
      "\u6089",
      "\u9D28",
      "\u8DA8",
      "\u9CF3",
      "\u6668",
      "\u755C",
      "\u8F29",
      "\u79E9",
      "\u5375",
      "\u7F72",
      "\u68AF",
      "\u708E",
      "\u7058",
      "\u68CB",
      "\u9A45",
      "\u7BE9",
      "\u5CFD",
      "\u5192",
      "\u5565",
      "\u58FD",
      "\u8B6F",
      "\u6D78",
      "\u6CC9",
      "\u5E3D",
      "\u9072",
      "\u77FD",
      "\u7586",
      "\u8CB8",
      "\u6F0F",
      "\u7A3F",
      "\u51A0",
      "\u5AE9",
      "\u8105",
      "\u82AF",
      "\u7262",
      "\u53DB",
      "\u8755",
      "\u5967",
      "\u9CF4",
      "\u5DBA",
      "\u7F8A",
      "\u6191",
      "\u4E32",
      "\u5858",
      "\u7E6A",
      "\u9175",
      "\u878D",
      "\u76C6",
      "\u932B",
      "\u5EDF",
      "\u7C4C",
      "\u51CD",
      "\u8F14",
      "\u651D",
      "\u8972",
      "\u7B4B",
      "\u62D2",
      "\u50DA",
      "\u65F1",
      "\u9240",
      "\u9CE5",
      "\u6F06",
      "\u6C88",
      "\u7709",
      "\u758F",
      "\u6DFB",
      "\u68D2",
      "\u7A57",
      "\u785D",
      "\u97D3",
      "\u903C",
      "\u626D",
      "\u50D1",
      "\u6DBC",
      "\u633A",
      "\u7897",
      "\u683D",
      "\u7092",
      "\u676F",
      "\u60A3",
      "\u993E",
      "\u52F8",
      "\u8C6A",
      "\u907C",
      "\u52C3",
      "\u9D3B",
      "\u65E6",
      "\u540F",
      "\u62DC",
      "\u72D7",
      "\u57CB",
      "\u8F25",
      "\u63A9",
      "\u98F2",
      "\u642C",
      "\u7F75",
      "\u8FAD",
      "\u52FE",
      "\u6263",
      "\u4F30",
      "\u8523",
      "\u7D68",
      "\u9727",
      "\u4E08",
      "\u6735",
      "\u59C6",
      "\u64EC",
      "\u5B87",
      "\u8F2F",
      "\u965D",
      "\u96D5",
      "\u511F",
      "\u84C4",
      "\u5D07",
      "\u526A",
      "\u5021",
      "\u5EF3",
      "\u54AC",
      "\u99DB",
      "\u85AF",
      "\u5237",
      "\u65A5",
      "\u756A",
      "\u8CE6",
      "\u5949",
      "\u4F5B",
      "\u6F86",
      "\u6F2B",
      "\u66FC",
      "\u6247",
      "\u9223",
      "\u6843",
      "\u6276",
      "\u4ED4",
      "\u8FD4",
      "\u4FD7",
      "\u8667",
      "\u8154",
      "\u978B",
      "\u68F1",
      "\u8986",
      "\u6846",
      "\u6084",
      "\u53D4",
      "\u649E",
      "\u9A19",
      "\u52D8",
      "\u65FA",
      "\u6CB8",
      "\u5B64",
      "\u5410",
      "\u5B5F",
      "\u6E20",
      "\u5C48",
      "\u75BE",
      "\u5999",
      "\u60DC",
      "\u4EF0",
      "\u72E0",
      "\u8139",
      "\u8AE7",
      "\u62CB",
      "\u9EF4",
      "\u6851",
      "\u5D17",
      "\u561B",
      "\u8870",
      "\u76DC",
      "\u6EF2",
      "\u81DF",
      "\u8CF4",
      "\u6E67",
      "\u751C",
      "\u66F9",
      "\u95B1",
      "\u808C",
      "\u54E9",
      "\u53B2",
      "\u70F4",
      "\u7DEF",
      "\u6BC5",
      "\u6628",
      "\u507D",
      "\u75C7",
      "\u716E",
      "\u5606",
      "\u91D8",
      "\u642D",
      "\u8396",
      "\u7C60",
      "\u9177",
      "\u5077",
      "\u5F13",
      "\u9310",
      "\u6046",
      "\u5091",
      "\u5751",
      "\u9F3B",
      "\u7FFC",
      "\u7DB8",
      "\u6558",
      "\u7344",
      "\u902E",
      "\u7F50",
      "\u7D61",
      "\u68DA",
      "\u6291",
      "\u81A8",
      "\u852C",
      "\u5BFA",
      "\u9A5F",
      "\u7A46",
      "\u51B6",
      "\u67AF",
      "\u518A",
      "\u5C4D",
      "\u51F8",
      "\u7D33",
      "\u576F",
      "\u72A7",
      "\u7130",
      "\u8F5F",
      "\u6B23",
      "\u6649",
      "\u7626",
      "\u79A6",
      "\u9320",
      "\u9326",
      "\u55AA",
      "\u65EC",
      "\u935B",
      "\u58DF",
      "\u641C",
      "\u64B2",
      "\u9080",
      "\u4EAD",
      "\u916F",
      "\u9081",
      "\u8212",
      "\u8106",
      "\u9176",
      "\u9592",
      "\u6182",
      "\u915A",
      "\u9811",
      "\u7FBD",
      "\u6F32",
      "\u5378",
      "\u4ED7",
      "\u966A",
      "\u95E2",
      "\u61F2",
      "\u676D",
      "\u59DA",
      "\u809A",
      "\u6349",
      "\u98C4",
      "\u6F02",
      "\u6606",
      "\u6B3A",
      "\u543E",
      "\u90CE",
      "\u70F7",
      "\u6C41",
      "\u5475",
      "\u98FE",
      "\u856D",
      "\u96C5",
      "\u90F5",
      "\u9077",
      "\u71D5",
      "\u6492",
      "\u59FB",
      "\u8D74",
      "\u5BB4",
      "\u7169",
      "\u50B5",
      "\u5E33",
      "\u6591",
      "\u9234",
      "\u65E8",
      "\u9187",
      "\u8463",
      "\u9905",
      "\u96DB",
      "\u59FF",
      "\u62CC",
      "\u5085",
      "\u8179",
      "\u59A5",
      "\u63C9",
      "\u8CE2",
      "\u62C6",
      "\u6B6A",
      "\u8461",
      "\u80FA",
      "\u4E1F",
      "\u6D69",
      "\u5FBD",
      "\u6602",
      "\u588A",
      "\u64CB",
      "\u89BD",
      "\u8CAA",
      "\u6170",
      "\u7E73",
      "\u6C6A",
      "\u614C",
      "\u99AE",
      "\u8AFE",
      "\u59DC",
      "\u8ABC",
      "\u5147",
      "\u52A3",
      "\u8AA3",
      "\u8000",
      "\u660F",
      "\u8EBA",
      "\u76C8",
      "\u9A0E",
      "\u55AC",
      "\u6EAA",
      "\u53E2",
      "\u76E7",
      "\u62B9",
      "\u60B6",
      "\u8AEE",
      "\u522E",
      "\u99D5",
      "\u7E9C",
      "\u609F",
      "\u6458",
      "\u927A",
      "\u64F2",
      "\u9817",
      "\u5E7B",
      "\u67C4",
      "\u60E0",
      "\u6158",
      "\u4F73",
      "\u4EC7",
      "\u81D8",
      "\u7AA9",
      "\u6ECC",
      "\u528D",
      "\u77A7",
      "\u5821",
      "\u6F51",
      "\u8525",
      "\u7F69",
      "\u970D",
      "\u6488",
      "\u80CE",
      "\u84BC",
      "\u6FF1",
      "\u5006",
      "\u6345",
      "\u6E58",
      "\u780D",
      "\u971E",
      "\u90B5",
      "\u8404",
      "\u760B",
      "\u6DEE",
      "\u9042",
      "\u718A",
      "\u7CDE",
      "\u70D8",
      "\u5BBF",
      "\u6A94",
      "\u6208",
      "\u99C1",
      "\u5AC2",
      "\u88D5",
      "\u5F99",
      "\u7BAD",
      "\u6350",
      "\u8178",
      "\u6490",
      "\u66EC",
      "\u8FA8",
      "\u6BBF",
      "\u84EE",
      "\u6524",
      "\u652A",
      "\u91AC",
      "\u5C4F",
      "\u75AB",
      "\u54C0",
      "\u8521",
      "\u5835",
      "\u6CAB",
      "\u76BA",
      "\u66A2",
      "\u758A",
      "\u95A3",
      "\u840A",
      "\u6572",
      "\u8F44",
      "\u9264",
      "\u75D5",
      "\u58E9",
      "\u5DF7",
      "\u9913",
      "\u798D",
      "\u4E18",
      "\u7384",
      "\u6E9C",
      "\u66F0",
      "\u908F",
      "\u5F6D",
      "\u5617",
      "\u537F",
      "\u59A8",
      "\u8247",
      "\u541E",
      "\u97CB",
      "\u6028",
      "\u77EE",
      "\u6B47"
    ];
  }
});

// node_modules/bip39/src/wordlists/korean.json
var require_korean = __commonJS({
  "node_modules/bip39/src/wordlists/korean.json"(exports, module2) {
    module2.exports = [
      "\u1100\u1161\u1100\u1167\u11A8",
      "\u1100\u1161\u1101\u1173\u11B7",
      "\u1100\u1161\u1102\u1161\u11AB",
      "\u1100\u1161\u1102\u1173\u11BC",
      "\u1100\u1161\u1103\u1173\u11A8",
      "\u1100\u1161\u1105\u1173\u110E\u1175\u11B7",
      "\u1100\u1161\u1106\u116E\u11B7",
      "\u1100\u1161\u1107\u1161\u11BC",
      "\u1100\u1161\u1109\u1161\u11BC",
      "\u1100\u1161\u1109\u1173\u11B7",
      "\u1100\u1161\u110B\u116E\u11AB\u1103\u1166",
      "\u1100\u1161\u110B\u1173\u11AF",
      "\u1100\u1161\u110B\u1175\u1103\u1173",
      "\u1100\u1161\u110B\u1175\u11B8",
      "\u1100\u1161\u110C\u1161\u11BC",
      "\u1100\u1161\u110C\u1165\u11BC",
      "\u1100\u1161\u110C\u1169\u11A8",
      "\u1100\u1161\u110C\u116E\u11A8",
      "\u1100\u1161\u11A8\u110B\u1169",
      "\u1100\u1161\u11A8\u110C\u1161",
      "\u1100\u1161\u11AB\u1100\u1167\u11A8",
      "\u1100\u1161\u11AB\u1107\u116E",
      "\u1100\u1161\u11AB\u1109\u1165\u11B8",
      "\u1100\u1161\u11AB\u110C\u1161\u11BC",
      "\u1100\u1161\u11AB\u110C\u1165\u11B8",
      "\u1100\u1161\u11AB\u1111\u1161\u11AB",
      "\u1100\u1161\u11AF\u1103\u1173\u11BC",
      "\u1100\u1161\u11AF\u1107\u1175",
      "\u1100\u1161\u11AF\u1109\u1162\u11A8",
      "\u1100\u1161\u11AF\u110C\u1173\u11BC",
      "\u1100\u1161\u11B7\u1100\u1161\u11A8",
      "\u1100\u1161\u11B7\u1100\u1175",
      "\u1100\u1161\u11B7\u1109\u1169",
      "\u1100\u1161\u11B7\u1109\u116E\u1109\u1165\u11BC",
      "\u1100\u1161\u11B7\u110C\u1161",
      "\u1100\u1161\u11B7\u110C\u1165\u11BC",
      "\u1100\u1161\u11B8\u110C\u1161\u1100\u1175",
      "\u1100\u1161\u11BC\u1102\u1161\u11B7",
      "\u1100\u1161\u11BC\u1103\u1161\u11BC",
      "\u1100\u1161\u11BC\u1103\u1169",
      "\u1100\u1161\u11BC\u1105\u1167\u11A8\u1112\u1175",
      "\u1100\u1161\u11BC\u1107\u1167\u11AB",
      "\u1100\u1161\u11BC\u1107\u116E\u11A8",
      "\u1100\u1161\u11BC\u1109\u1161",
      "\u1100\u1161\u11BC\u1109\u116E\u1105\u1163\u11BC",
      "\u1100\u1161\u11BC\u110B\u1161\u110C\u1175",
      "\u1100\u1161\u11BC\u110B\u116F\u11AB\u1103\u1169",
      "\u1100\u1161\u11BC\u110B\u1174",
      "\u1100\u1161\u11BC\u110C\u1166",
      "\u1100\u1161\u11BC\u110C\u1169",
      "\u1100\u1161\u11C0\u110B\u1175",
      "\u1100\u1162\u1100\u116E\u1105\u1175",
      "\u1100\u1162\u1102\u1161\u1105\u1175",
      "\u1100\u1162\u1107\u1161\u11BC",
      "\u1100\u1162\u1107\u1167\u11AF",
      "\u1100\u1162\u1109\u1165\u11AB",
      "\u1100\u1162\u1109\u1165\u11BC",
      "\u1100\u1162\u110B\u1175\u11AB",
      "\u1100\u1162\u11A8\u1100\u116A\u11AB\u110C\u1165\u11A8",
      "\u1100\u1165\u1109\u1175\u11AF",
      "\u1100\u1165\u110B\u1162\u11A8",
      "\u1100\u1165\u110B\u116E\u11AF",
      "\u1100\u1165\u110C\u1175\u11BA",
      "\u1100\u1165\u1111\u116E\u11B7",
      "\u1100\u1165\u11A8\u110C\u1165\u11BC",
      "\u1100\u1165\u11AB\u1100\u1161\u11BC",
      "\u1100\u1165\u11AB\u1106\u116E\u11AF",
      "\u1100\u1165\u11AB\u1109\u1165\u11AF",
      "\u1100\u1165\u11AB\u110C\u1169",
      "\u1100\u1165\u11AB\u110E\u116E\u11A8",
      "\u1100\u1165\u11AF\u110B\u1173\u11B7",
      "\u1100\u1165\u11B7\u1109\u1161",
      "\u1100\u1165\u11B7\u1110\u1169",
      "\u1100\u1166\u1109\u1175\u1111\u1161\u11AB",
      "\u1100\u1166\u110B\u1175\u11B7",
      "\u1100\u1167\u110B\u116E\u11AF",
      "\u1100\u1167\u11AB\u1112\u1162",
      "\u1100\u1167\u11AF\u1100\u116A",
      "\u1100\u1167\u11AF\u1100\u116E\u11A8",
      "\u1100\u1167\u11AF\u1105\u1169\u11AB",
      "\u1100\u1167\u11AF\u1109\u1165\u11A8",
      "\u1100\u1167\u11AF\u1109\u1173\u11BC",
      "\u1100\u1167\u11AF\u1109\u1175\u11B7",
      "\u1100\u1167\u11AF\u110C\u1165\u11BC",
      "\u1100\u1167\u11AF\u1112\u1169\u11AB",
      "\u1100\u1167\u11BC\u1100\u1168",
      "\u1100\u1167\u11BC\u1100\u1169",
      "\u1100\u1167\u11BC\u1100\u1175",
      "\u1100\u1167\u11BC\u1105\u1167\u11A8",
      "\u1100\u1167\u11BC\u1107\u1169\u11A8\u1100\u116E\u11BC",
      "\u1100\u1167\u11BC\u1107\u1175",
      "\u1100\u1167\u11BC\u1109\u1161\u11BC\u1103\u1169",
      "\u1100\u1167\u11BC\u110B\u1167\u11BC",
      "\u1100\u1167\u11BC\u110B\u116E",
      "\u1100\u1167\u11BC\u110C\u1162\u11BC",
      "\u1100\u1167\u11BC\u110C\u1166",
      "\u1100\u1167\u11BC\u110C\u116E",
      "\u1100\u1167\u11BC\u110E\u1161\u11AF",
      "\u1100\u1167\u11BC\u110E\u1175",
      "\u1100\u1167\u11BC\u1112\u1163\u11BC",
      "\u1100\u1167\u11BC\u1112\u1165\u11B7",
      "\u1100\u1168\u1100\u1169\u11A8",
      "\u1100\u1168\u1103\u1161\u11AB",
      "\u1100\u1168\u1105\u1161\u11AB",
      "\u1100\u1168\u1109\u1161\u11AB",
      "\u1100\u1168\u1109\u1169\u11A8",
      "\u1100\u1168\u110B\u1163\u11A8",
      "\u1100\u1168\u110C\u1165\u11AF",
      "\u1100\u1168\u110E\u1173\u11BC",
      "\u1100\u1168\u1112\u116C\u11A8",
      "\u1100\u1169\u1100\u1162\u11A8",
      "\u1100\u1169\u1100\u116E\u1105\u1167",
      "\u1100\u1169\u1100\u116E\u11BC",
      "\u1100\u1169\u1100\u1173\u11B8",
      "\u1100\u1169\u1103\u1173\u11BC\u1112\u1161\u11A8\u1109\u1162\u11BC",
      "\u1100\u1169\u1106\u116E\u1109\u1175\u11AB",
      "\u1100\u1169\u1106\u1175\u11AB",
      "\u1100\u1169\u110B\u1163\u11BC\u110B\u1175",
      "\u1100\u1169\u110C\u1161\u11BC",
      "\u1100\u1169\u110C\u1165\u11AB",
      "\u1100\u1169\u110C\u1175\u11B8",
      "\u1100\u1169\u110E\u116E\u11BA\u1100\u1161\u1105\u116E",
      "\u1100\u1169\u1110\u1169\u11BC",
      "\u1100\u1169\u1112\u1163\u11BC",
      "\u1100\u1169\u11A8\u1109\u1175\u11A8",
      "\u1100\u1169\u11AF\u1106\u1169\u11A8",
      "\u1100\u1169\u11AF\u110D\u1161\u1100\u1175",
      "\u1100\u1169\u11AF\u1111\u1173",
      "\u1100\u1169\u11BC\u1100\u1161\u11AB",
      "\u1100\u1169\u11BC\u1100\u1162",
      "\u1100\u1169\u11BC\u1100\u1167\u11A8",
      "\u1100\u1169\u11BC\u1100\u116E\u11AB",
      "\u1100\u1169\u11BC\u1100\u1173\u11B8",
      "\u1100\u1169\u11BC\u1100\u1175",
      "\u1100\u1169\u11BC\u1103\u1169\u11BC",
      "\u1100\u1169\u11BC\u1106\u116E\u110B\u116F\u11AB",
      "\u1100\u1169\u11BC\u1107\u116E",
      "\u1100\u1169\u11BC\u1109\u1161",
      "\u1100\u1169\u11BC\u1109\u1175\u11A8",
      "\u1100\u1169\u11BC\u110B\u1165\u11B8",
      "\u1100\u1169\u11BC\u110B\u1167\u11AB",
      "\u1100\u1169\u11BC\u110B\u116F\u11AB",
      "\u1100\u1169\u11BC\u110C\u1161\u11BC",
      "\u1100\u1169\u11BC\u110D\u1161",
      "\u1100\u1169\u11BC\u110E\u1162\u11A8",
      "\u1100\u1169\u11BC\u1110\u1169\u11BC",
      "\u1100\u1169\u11BC\u1111\u1169",
      "\u1100\u1169\u11BC\u1112\u1161\u11BC",
      "\u1100\u1169\u11BC\u1112\u1172\u110B\u1175\u11AF",
      "\u1100\u116A\u1106\u1169\u11A8",
      "\u1100\u116A\u110B\u1175\u11AF",
      "\u1100\u116A\u110C\u1161\u11BC",
      "\u1100\u116A\u110C\u1165\u11BC",
      "\u1100\u116A\u1112\u1161\u11A8",
      "\u1100\u116A\u11AB\u1100\u1162\u11A8",
      "\u1100\u116A\u11AB\u1100\u1168",
      "\u1100\u116A\u11AB\u1100\u116A\u11BC",
      "\u1100\u116A\u11AB\u1102\u1167\u11B7",
      "\u1100\u116A\u11AB\u1105\u1161\u11B7",
      "\u1100\u116A\u11AB\u1105\u1167\u11AB",
      "\u1100\u116A\u11AB\u1105\u1175",
      "\u1100\u116A\u11AB\u1109\u1173\u11B8",
      "\u1100\u116A\u11AB\u1109\u1175\u11B7",
      "\u1100\u116A\u11AB\u110C\u1165\u11B7",
      "\u1100\u116A\u11AB\u110E\u1161\u11AF",
      "\u1100\u116A\u11BC\u1100\u1167\u11BC",
      "\u1100\u116A\u11BC\u1100\u1169",
      "\u1100\u116A\u11BC\u110C\u1161\u11BC",
      "\u1100\u116A\u11BC\u110C\u116E",
      "\u1100\u116C\u1105\u1169\u110B\u116E\u11B7",
      "\u1100\u116C\u11BC\u110C\u1161\u11BC\u1112\u1175",
      "\u1100\u116D\u1100\u116A\u1109\u1165",
      "\u1100\u116D\u1106\u116E\u11AB",
      "\u1100\u116D\u1107\u1169\u11A8",
      "\u1100\u116D\u1109\u1175\u11AF",
      "\u1100\u116D\u110B\u1163\u11BC",
      "\u1100\u116D\u110B\u1172\u11A8",
      "\u1100\u116D\u110C\u1161\u11BC",
      "\u1100\u116D\u110C\u1175\u11A8",
      "\u1100\u116D\u1110\u1169\u11BC",
      "\u1100\u116D\u1112\u116A\u11AB",
      "\u1100\u116D\u1112\u116E\u11AB",
      "\u1100\u116E\u1100\u1167\u11BC",
      "\u1100\u116E\u1105\u1173\u11B7",
      "\u1100\u116E\u1106\u1165\u11BC",
      "\u1100\u116E\u1107\u1167\u11AF",
      "\u1100\u116E\u1107\u116E\u11AB",
      "\u1100\u116E\u1109\u1165\u11A8",
      "\u1100\u116E\u1109\u1165\u11BC",
      "\u1100\u116E\u1109\u1169\u11A8",
      "\u1100\u116E\u110B\u1167\u11A8",
      "\u1100\u116E\u110B\u1175\u11B8",
      "\u1100\u116E\u110E\u1165\u11BC",
      "\u1100\u116E\u110E\u1166\u110C\u1165\u11A8",
      "\u1100\u116E\u11A8\u1100\u1161",
      "\u1100\u116E\u11A8\u1100\u1175",
      "\u1100\u116E\u11A8\u1102\u1162",
      "\u1100\u116E\u11A8\u1105\u1175\u11B8",
      "\u1100\u116E\u11A8\u1106\u116E\u11AF",
      "\u1100\u116E\u11A8\u1106\u1175\u11AB",
      "\u1100\u116E\u11A8\u1109\u116E",
      "\u1100\u116E\u11A8\u110B\u1165",
      "\u1100\u116E\u11A8\u110B\u116A\u11BC",
      "\u1100\u116E\u11A8\u110C\u1165\u11A8",
      "\u1100\u116E\u11A8\u110C\u1166",
      "\u1100\u116E\u11A8\u1112\u116C",
      "\u1100\u116E\u11AB\u1103\u1162",
      "\u1100\u116E\u11AB\u1109\u1161",
      "\u1100\u116E\u11AB\u110B\u1175\u11AB",
      "\u1100\u116E\u11BC\u1100\u1173\u11A8\u110C\u1165\u11A8",
      "\u1100\u116F\u11AB\u1105\u1175",
      "\u1100\u116F\u11AB\u110B\u1171",
      "\u1100\u116F\u11AB\u1110\u116E",
      "\u1100\u1171\u1100\u116E\u11A8",
      "\u1100\u1171\u1109\u1175\u11AB",
      "\u1100\u1172\u110C\u1165\u11BC",
      "\u1100\u1172\u110E\u1175\u11A8",
      "\u1100\u1172\u11AB\u1112\u1167\u11BC",
      "\u1100\u1173\u1102\u1161\u11AF",
      "\u1100\u1173\u1102\u1163\u11BC",
      "\u1100\u1173\u1102\u1173\u11AF",
      "\u1100\u1173\u1105\u1165\u1102\u1161",
      "\u1100\u1173\u1105\u116E\u11B8",
      "\u1100\u1173\u1105\u1173\u11BA",
      "\u1100\u1173\u1105\u1175\u11B7",
      "\u1100\u1173\u110C\u1166\u1109\u1165\u110B\u1163",
      "\u1100\u1173\u1110\u1169\u1105\u1169\u11A8",
      "\u1100\u1173\u11A8\u1107\u1169\u11A8",
      "\u1100\u1173\u11A8\u1112\u1175",
      "\u1100\u1173\u11AB\u1100\u1165",
      "\u1100\u1173\u11AB\u1100\u116D",
      "\u1100\u1173\u11AB\u1105\u1162",
      "\u1100\u1173\u11AB\u1105\u1169",
      "\u1100\u1173\u11AB\u1106\u116E",
      "\u1100\u1173\u11AB\u1107\u1169\u11AB",
      "\u1100\u1173\u11AB\u110B\u116F\u11AB",
      "\u1100\u1173\u11AB\u110B\u1172\u11A8",
      "\u1100\u1173\u11AB\u110E\u1165",
      "\u1100\u1173\u11AF\u110A\u1175",
      "\u1100\u1173\u11AF\u110C\u1161",
      "\u1100\u1173\u11B7\u1100\u1161\u11BC\u1109\u1161\u11AB",
      "\u1100\u1173\u11B7\u1100\u1169",
      "\u1100\u1173\u11B7\u1102\u1167\u11AB",
      "\u1100\u1173\u11B7\u1106\u1166\u1103\u1161\u11AF",
      "\u1100\u1173\u11B7\u110B\u1162\u11A8",
      "\u1100\u1173\u11B7\u110B\u1167\u11AB",
      "\u1100\u1173\u11B7\u110B\u116D\u110B\u1175\u11AF",
      "\u1100\u1173\u11B7\u110C\u1175",
      "\u1100\u1173\u11BC\u110C\u1165\u11BC\u110C\u1165\u11A8",
      "\u1100\u1175\u1100\u1161\u11AB",
      "\u1100\u1175\u1100\u116A\u11AB",
      "\u1100\u1175\u1102\u1167\u11B7",
      "\u1100\u1175\u1102\u1173\u11BC",
      "\u1100\u1175\u1103\u1169\u11A8\u1100\u116D",
      "\u1100\u1175\u1103\u116E\u11BC",
      "\u1100\u1175\u1105\u1169\u11A8",
      "\u1100\u1175\u1105\u1173\u11B7",
      "\u1100\u1175\u1107\u1165\u11B8",
      "\u1100\u1175\u1107\u1169\u11AB",
      "\u1100\u1175\u1107\u116E\u11AB",
      "\u1100\u1175\u1108\u1173\u11B7",
      "\u1100\u1175\u1109\u116E\u11A8\u1109\u1161",
      "\u1100\u1175\u1109\u116E\u11AF",
      "\u1100\u1175\u110B\u1165\u11A8",
      "\u1100\u1175\u110B\u1165\u11B8",
      "\u1100\u1175\u110B\u1169\u11AB",
      "\u1100\u1175\u110B\u116E\u11AB",
      "\u1100\u1175\u110B\u116F\u11AB",
      "\u1100\u1175\u110C\u1165\u11A8",
      "\u1100\u1175\u110C\u116E\u11AB",
      "\u1100\u1175\u110E\u1175\u11B7",
      "\u1100\u1175\u1112\u1169\u11AB",
      "\u1100\u1175\u1112\u116C\u11A8",
      "\u1100\u1175\u11AB\u1100\u1173\u11B8",
      "\u1100\u1175\u11AB\u110C\u1161\u11BC",
      "\u1100\u1175\u11AF\u110B\u1175",
      "\u1100\u1175\u11B7\u1107\u1161\u11B8",
      "\u1100\u1175\u11B7\u110E\u1175",
      "\u1100\u1175\u11B7\u1111\u1169\u1100\u1169\u11BC\u1112\u1161\u11BC",
      "\u1101\u1161\u11A8\u1103\u116E\u1100\u1175",
      "\u1101\u1161\u11B7\u1108\u1161\u11A8",
      "\u1101\u1162\u1103\u1161\u11AF\u110B\u1173\u11B7",
      "\u1101\u1162\u1109\u1169\u1100\u1173\u11B7",
      "\u1101\u1165\u11B8\u110C\u1175\u11AF",
      "\u1101\u1169\u11A8\u1103\u1162\u1100\u1175",
      "\u1101\u1169\u11BE\u110B\u1175\u11C1",
      "\u1102\u1161\u1103\u1173\u11AF\u110B\u1175",
      "\u1102\u1161\u1105\u1161\u11AB\u1112\u1175",
      "\u1102\u1161\u1106\u1165\u110C\u1175",
      "\u1102\u1161\u1106\u116E\u11AF",
      "\u1102\u1161\u110E\u1175\u11B7\u1107\u1161\u11AB",
      "\u1102\u1161\u1112\u1173\u11AF",
      "\u1102\u1161\u11A8\u110B\u1167\u11B8",
      "\u1102\u1161\u11AB\u1107\u1161\u11BC",
      "\u1102\u1161\u11AF\u1100\u1162",
      "\u1102\u1161\u11AF\u110A\u1175",
      "\u1102\u1161\u11AF\u110D\u1161",
      "\u1102\u1161\u11B7\u1102\u1167",
      "\u1102\u1161\u11B7\u1103\u1162\u1106\u116E\u11AB",
      "\u1102\u1161\u11B7\u1106\u1162",
      "\u1102\u1161\u11B7\u1109\u1161\u11AB",
      "\u1102\u1161\u11B7\u110C\u1161",
      "\u1102\u1161\u11B7\u1111\u1167\u11AB",
      "\u1102\u1161\u11B7\u1112\u1161\u11A8\u1109\u1162\u11BC",
      "\u1102\u1161\u11BC\u1107\u1175",
      "\u1102\u1161\u11C0\u1106\u1161\u11AF",
      "\u1102\u1162\u1102\u1167\u11AB",
      "\u1102\u1162\u110B\u116D\u11BC",
      "\u1102\u1162\u110B\u1175\u11AF",
      "\u1102\u1162\u11B7\u1107\u1175",
      "\u1102\u1162\u11B7\u1109\u1162",
      "\u1102\u1162\u11BA\u1106\u116E\u11AF",
      "\u1102\u1162\u11BC\u1103\u1169\u11BC",
      "\u1102\u1162\u11BC\u1106\u1167\u11AB",
      "\u1102\u1162\u11BC\u1107\u1161\u11BC",
      "\u1102\u1162\u11BC\u110C\u1161\u11BC\u1100\u1169",
      "\u1102\u1166\u11A8\u1110\u1161\u110B\u1175",
      "\u1102\u1166\u11BA\u110D\u1162",
      "\u1102\u1169\u1103\u1169\u11BC",
      "\u1102\u1169\u1105\u1161\u11AB\u1109\u1162\u11A8",
      "\u1102\u1169\u1105\u1167\u11A8",
      "\u1102\u1169\u110B\u1175\u11AB",
      "\u1102\u1169\u11A8\u110B\u1173\u11B7",
      "\u1102\u1169\u11A8\u110E\u1161",
      "\u1102\u1169\u11A8\u1112\u116A",
      "\u1102\u1169\u11AB\u1105\u1175",
      "\u1102\u1169\u11AB\u1106\u116E\u11AB",
      "\u1102\u1169\u11AB\u110C\u1162\u11BC",
      "\u1102\u1169\u11AF\u110B\u1175",
      "\u1102\u1169\u11BC\u1100\u116E",
      "\u1102\u1169\u11BC\u1103\u1161\u11B7",
      "\u1102\u1169\u11BC\u1106\u1175\u11AB",
      "\u1102\u1169\u11BC\u1107\u116E",
      "\u1102\u1169\u11BC\u110B\u1165\u11B8",
      "\u1102\u1169\u11BC\u110C\u1161\u11BC",
      "\u1102\u1169\u11BC\u110E\u1169\u11AB",
      "\u1102\u1169\u11C1\u110B\u1175",
      "\u1102\u116E\u11AB\u1103\u1169\u11BC\u110C\u1161",
      "\u1102\u116E\u11AB\u1106\u116E\u11AF",
      "\u1102\u116E\u11AB\u110A\u1165\u11B8",
      "\u1102\u1172\u110B\u116D\u11A8",
      "\u1102\u1173\u1101\u1175\u11B7",
      "\u1102\u1173\u11A8\u1103\u1162",
      "\u1102\u1173\u11BC\u1103\u1169\u11BC\u110C\u1165\u11A8",
      "\u1102\u1173\u11BC\u1105\u1167\u11A8",
      "\u1103\u1161\u1107\u1161\u11BC",
      "\u1103\u1161\u110B\u1163\u11BC\u1109\u1165\u11BC",
      "\u1103\u1161\u110B\u1173\u11B7",
      "\u1103\u1161\u110B\u1175\u110B\u1165\u1110\u1173",
      "\u1103\u1161\u1112\u1162\u11BC",
      "\u1103\u1161\u11AB\u1100\u1168",
      "\u1103\u1161\u11AB\u1100\u1169\u11AF",
      "\u1103\u1161\u11AB\u1103\u1169\u11A8",
      "\u1103\u1161\u11AB\u1106\u1161\u11BA",
      "\u1103\u1161\u11AB\u1109\u116E\u11AB",
      "\u1103\u1161\u11AB\u110B\u1165",
      "\u1103\u1161\u11AB\u110B\u1171",
      "\u1103\u1161\u11AB\u110C\u1165\u11B7",
      "\u1103\u1161\u11AB\u110E\u1166",
      "\u1103\u1161\u11AB\u110E\u116E",
      "\u1103\u1161\u11AB\u1111\u1167\u11AB",
      "\u1103\u1161\u11AB\u1111\u116E\u11BC",
      "\u1103\u1161\u11AF\u1100\u1163\u11AF",
      "\u1103\u1161\u11AF\u1105\u1165",
      "\u1103\u1161\u11AF\u1105\u1167\u11A8",
      "\u1103\u1161\u11AF\u1105\u1175",
      "\u1103\u1161\u11B0\u1100\u1169\u1100\u1175",
      "\u1103\u1161\u11B7\u1103\u1161\u11BC",
      "\u1103\u1161\u11B7\u1107\u1162",
      "\u1103\u1161\u11B7\u110B\u116D",
      "\u1103\u1161\u11B7\u110B\u1175\u11B7",
      "\u1103\u1161\u11B8\u1107\u1167\u11AB",
      "\u1103\u1161\u11B8\u110C\u1161\u11BC",
      "\u1103\u1161\u11BC\u1100\u1173\u11AB",
      "\u1103\u1161\u11BC\u1107\u116E\u11AB\u1100\u1161\u11AB",
      "\u1103\u1161\u11BC\u110B\u1167\u11AB\u1112\u1175",
      "\u1103\u1161\u11BC\u110C\u1161\u11BC",
      "\u1103\u1162\u1100\u1172\u1106\u1169",
      "\u1103\u1162\u1102\u1161\u11BD",
      "\u1103\u1162\u1103\u1161\u11AB\u1112\u1175",
      "\u1103\u1162\u1103\u1161\u11B8",
      "\u1103\u1162\u1103\u1169\u1109\u1175",
      "\u1103\u1162\u1105\u1163\u11A8",
      "\u1103\u1162\u1105\u1163\u11BC",
      "\u1103\u1162\u1105\u1172\u11A8",
      "\u1103\u1162\u1106\u116E\u11AB",
      "\u1103\u1162\u1107\u116E\u1107\u116E\u11AB",
      "\u1103\u1162\u1109\u1175\u11AB",
      "\u1103\u1162\u110B\u1173\u11BC",
      "\u1103\u1162\u110C\u1161\u11BC",
      "\u1103\u1162\u110C\u1165\u11AB",
      "\u1103\u1162\u110C\u1165\u11B8",
      "\u1103\u1162\u110C\u116E\u11BC",
      "\u1103\u1162\u110E\u1162\u11A8",
      "\u1103\u1162\u110E\u116E\u11AF",
      "\u1103\u1162\u110E\u116E\u11BC",
      "\u1103\u1162\u1110\u1169\u11BC\u1105\u1167\u11BC",
      "\u1103\u1162\u1112\u1161\u11A8",
      "\u1103\u1162\u1112\u1161\u11AB\u1106\u1175\u11AB\u1100\u116E\u11A8",
      "\u1103\u1162\u1112\u1161\u11B8\u1109\u1175\u11AF",
      "\u1103\u1162\u1112\u1167\u11BC",
      "\u1103\u1165\u11BC\u110B\u1165\u1105\u1175",
      "\u1103\u1166\u110B\u1175\u1110\u1173",
      "\u1103\u1169\u1103\u1162\u110E\u1166",
      "\u1103\u1169\u1103\u1165\u11A8",
      "\u1103\u1169\u1103\u116E\u11A8",
      "\u1103\u1169\u1106\u1161\u11BC",
      "\u1103\u1169\u1109\u1165\u1100\u116A\u11AB",
      "\u1103\u1169\u1109\u1175\u11B7",
      "\u1103\u1169\u110B\u116E\u11B7",
      "\u1103\u1169\u110B\u1175\u11B8",
      "\u1103\u1169\u110C\u1161\u1100\u1175",
      "\u1103\u1169\u110C\u1165\u1112\u1175",
      "\u1103\u1169\u110C\u1165\u11AB",
      "\u1103\u1169\u110C\u116E\u11BC",
      "\u1103\u1169\u110E\u1161\u11A8",
      "\u1103\u1169\u11A8\u1100\u1161\u11B7",
      "\u1103\u1169\u11A8\u1105\u1175\u11B8",
      "\u1103\u1169\u11A8\u1109\u1165",
      "\u1103\u1169\u11A8\u110B\u1175\u11AF",
      "\u1103\u1169\u11A8\u110E\u1161\u11BC\u110C\u1165\u11A8",
      "\u1103\u1169\u11BC\u1112\u116A\u110E\u1162\u11A8",
      "\u1103\u1171\u11BA\u1106\u1169\u1109\u1173\u11B8",
      "\u1103\u1171\u11BA\u1109\u1161\u11AB",
      "\u1104\u1161\u11AF\u110B\u1161\u110B\u1175",
      "\u1106\u1161\u1102\u116E\u1105\u1161",
      "\u1106\u1161\u1102\u1173\u11AF",
      "\u1106\u1161\u1103\u1161\u11BC",
      "\u1106\u1161\u1105\u1161\u1110\u1169\u11AB",
      "\u1106\u1161\u1105\u1167\u11AB",
      "\u1106\u1161\u1106\u116E\u1105\u1175",
      "\u1106\u1161\u1109\u1161\u110C\u1175",
      "\u1106\u1161\u110B\u1163\u11A8",
      "\u1106\u1161\u110B\u116D\u1102\u1166\u110C\u1173",
      "\u1106\u1161\u110B\u1173\u11AF",
      "\u1106\u1161\u110B\u1173\u11B7",
      "\u1106\u1161\u110B\u1175\u110F\u1173",
      "\u1106\u1161\u110C\u116E\u11BC",
      "\u1106\u1161\u110C\u1175\u1106\u1161\u11A8",
      "\u1106\u1161\u110E\u1161\u11AB\u1100\u1161\u110C\u1175",
      "\u1106\u1161\u110E\u1161\u11AF",
      "\u1106\u1161\u1112\u1173\u11AB",
      "\u1106\u1161\u11A8\u1100\u1165\u11AF\u1105\u1175",
      "\u1106\u1161\u11A8\u1102\u1162",
      "\u1106\u1161\u11A8\u1109\u1161\u11BC",
      "\u1106\u1161\u11AB\u1102\u1161\u11B7",
      "\u1106\u1161\u11AB\u1103\u116E",
      "\u1106\u1161\u11AB\u1109\u1166",
      "\u1106\u1161\u11AB\u110B\u1163\u11A8",
      "\u1106\u1161\u11AB\u110B\u1175\u11AF",
      "\u1106\u1161\u11AB\u110C\u1165\u11B7",
      "\u1106\u1161\u11AB\u110C\u1169\u11A8",
      "\u1106\u1161\u11AB\u1112\u116A",
      "\u1106\u1161\u11AD\u110B\u1175",
      "\u1106\u1161\u11AF\u1100\u1175",
      "\u1106\u1161\u11AF\u110A\u1173\u11B7",
      "\u1106\u1161\u11AF\u1110\u116E",
      "\u1106\u1161\u11B7\u1103\u1162\u1105\u1169",
      "\u1106\u1161\u11BC\u110B\u116F\u11AB\u1100\u1167\u11BC",
      "\u1106\u1162\u1102\u1167\u11AB",
      "\u1106\u1162\u1103\u1161\u11AF",
      "\u1106\u1162\u1105\u1167\u11A8",
      "\u1106\u1162\u1107\u1165\u11AB",
      "\u1106\u1162\u1109\u1173\u110F\u1165\u11B7",
      "\u1106\u1162\u110B\u1175\u11AF",
      "\u1106\u1162\u110C\u1161\u11BC",
      "\u1106\u1162\u11A8\u110C\u116E",
      "\u1106\u1165\u11A8\u110B\u1175",
      "\u1106\u1165\u11AB\u110C\u1165",
      "\u1106\u1165\u11AB\u110C\u1175",
      "\u1106\u1165\u11AF\u1105\u1175",
      "\u1106\u1166\u110B\u1175\u11AF",
      "\u1106\u1167\u1102\u1173\u1105\u1175",
      "\u1106\u1167\u110E\u1175\u11AF",
      "\u1106\u1167\u11AB\u1103\u1161\u11B7",
      "\u1106\u1167\u11AF\u110E\u1175",
      "\u1106\u1167\u11BC\u1103\u1161\u11AB",
      "\u1106\u1167\u11BC\u1105\u1167\u11BC",
      "\u1106\u1167\u11BC\u110B\u1168",
      "\u1106\u1167\u11BC\u110B\u1174",
      "\u1106\u1167\u11BC\u110C\u1165\u11AF",
      "\u1106\u1167\u11BC\u110E\u1175\u11BC",
      "\u1106\u1167\u11BC\u1112\u1161\u11B7",
      "\u1106\u1169\u1100\u1173\u11B7",
      "\u1106\u1169\u1102\u1175\u1110\u1165",
      "\u1106\u1169\u1103\u1166\u11AF",
      "\u1106\u1169\u1103\u1173\u11AB",
      "\u1106\u1169\u1107\u1165\u11B7",
      "\u1106\u1169\u1109\u1173\u11B8",
      "\u1106\u1169\u110B\u1163\u11BC",
      "\u1106\u1169\u110B\u1175\u11B7",
      "\u1106\u1169\u110C\u1169\u1105\u1175",
      "\u1106\u1169\u110C\u1175\u11B8",
      "\u1106\u1169\u1110\u116E\u11BC\u110B\u1175",
      "\u1106\u1169\u11A8\u1100\u1165\u11AF\u110B\u1175",
      "\u1106\u1169\u11A8\u1105\u1169\u11A8",
      "\u1106\u1169\u11A8\u1109\u1161",
      "\u1106\u1169\u11A8\u1109\u1169\u1105\u1175",
      "\u1106\u1169\u11A8\u1109\u116E\u11B7",
      "\u1106\u1169\u11A8\u110C\u1165\u11A8",
      "\u1106\u1169\u11A8\u1111\u116D",
      "\u1106\u1169\u11AF\u1105\u1162",
      "\u1106\u1169\u11B7\u1106\u1162",
      "\u1106\u1169\u11B7\u1106\u116E\u1100\u1166",
      "\u1106\u1169\u11B7\u1109\u1161\u11AF",
      "\u1106\u1169\u11B7\u1109\u1169\u11A8",
      "\u1106\u1169\u11B7\u110C\u1175\u11BA",
      "\u1106\u1169\u11B7\u1110\u1169\u11BC",
      "\u1106\u1169\u11B8\u1109\u1175",
      "\u1106\u116E\u1100\u116A\u11AB\u1109\u1175\u11B7",
      "\u1106\u116E\u1100\u116E\u11BC\u1112\u116A",
      "\u1106\u116E\u1103\u1165\u110B\u1171",
      "\u1106\u116E\u1103\u1165\u11B7",
      "\u1106\u116E\u1105\u1173\u11C1",
      "\u1106\u116E\u1109\u1173\u11AB",
      "\u1106\u116E\u110B\u1165\u11BA",
      "\u1106\u116E\u110B\u1167\u11A8",
      "\u1106\u116E\u110B\u116D\u11BC",
      "\u1106\u116E\u110C\u1169\u1100\u1165\u11AB",
      "\u1106\u116E\u110C\u1175\u1100\u1162",
      "\u1106\u116E\u110E\u1165\u11A8",
      "\u1106\u116E\u11AB\u1100\u116E",
      "\u1106\u116E\u11AB\u1103\u1173\u11A8",
      "\u1106\u116E\u11AB\u1107\u1165\u11B8",
      "\u1106\u116E\u11AB\u1109\u1165",
      "\u1106\u116E\u11AB\u110C\u1166",
      "\u1106\u116E\u11AB\u1112\u1161\u11A8",
      "\u1106\u116E\u11AB\u1112\u116A",
      "\u1106\u116E\u11AF\u1100\u1161",
      "\u1106\u116E\u11AF\u1100\u1165\u11AB",
      "\u1106\u116E\u11AF\u1100\u1167\u11AF",
      "\u1106\u116E\u11AF\u1100\u1169\u1100\u1175",
      "\u1106\u116E\u11AF\u1105\u1169\u11AB",
      "\u1106\u116E\u11AF\u1105\u1175\u1112\u1161\u11A8",
      "\u1106\u116E\u11AF\u110B\u1173\u11B7",
      "\u1106\u116E\u11AF\u110C\u1175\u11AF",
      "\u1106\u116E\u11AF\u110E\u1166",
      "\u1106\u1175\u1100\u116E\u11A8",
      "\u1106\u1175\u1103\u1175\u110B\u1165",
      "\u1106\u1175\u1109\u1161\u110B\u1175\u11AF",
      "\u1106\u1175\u1109\u116E\u11AF",
      "\u1106\u1175\u110B\u1167\u11A8",
      "\u1106\u1175\u110B\u116D\u11BC\u1109\u1175\u11AF",
      "\u1106\u1175\u110B\u116E\u11B7",
      "\u1106\u1175\u110B\u1175\u11AB",
      "\u1106\u1175\u1110\u1175\u11BC",
      "\u1106\u1175\u1112\u1169\u11AB",
      "\u1106\u1175\u11AB\u1100\u1161\u11AB",
      "\u1106\u1175\u11AB\u110C\u1169\u11A8",
      "\u1106\u1175\u11AB\u110C\u116E",
      "\u1106\u1175\u11AE\u110B\u1173\u11B7",
      "\u1106\u1175\u11AF\u1100\u1161\u1105\u116E",
      "\u1106\u1175\u11AF\u1105\u1175\u1106\u1175\u1110\u1165",
      "\u1106\u1175\u11C0\u1107\u1161\u1103\u1161\u11A8",
      "\u1107\u1161\u1100\u1161\u110C\u1175",
      "\u1107\u1161\u1100\u116E\u1102\u1175",
      "\u1107\u1161\u1102\u1161\u1102\u1161",
      "\u1107\u1161\u1102\u1173\u11AF",
      "\u1107\u1161\u1103\u1161\u11A8",
      "\u1107\u1161\u1103\u1161\u11BA\u1100\u1161",
      "\u1107\u1161\u1105\u1161\u11B7",
      "\u1107\u1161\u110B\u1175\u1105\u1165\u1109\u1173",
      "\u1107\u1161\u1110\u1161\u11BC",
      "\u1107\u1161\u11A8\u1106\u116E\u11AF\u1100\u116A\u11AB",
      "\u1107\u1161\u11A8\u1109\u1161",
      "\u1107\u1161\u11A8\u1109\u116E",
      "\u1107\u1161\u11AB\u1103\u1162",
      "\u1107\u1161\u11AB\u1103\u1173\u1109\u1175",
      "\u1107\u1161\u11AB\u1106\u1161\u11AF",
      "\u1107\u1161\u11AB\u1107\u1161\u11AF",
      "\u1107\u1161\u11AB\u1109\u1165\u11BC",
      "\u1107\u1161\u11AB\u110B\u1173\u11BC",
      "\u1107\u1161\u11AB\u110C\u1161\u11BC",
      "\u1107\u1161\u11AB\u110C\u116E\u11A8",
      "\u1107\u1161\u11AB\u110C\u1175",
      "\u1107\u1161\u11AB\u110E\u1161\u11AB",
      "\u1107\u1161\u11AE\u110E\u1175\u11B7",
      "\u1107\u1161\u11AF\u1100\u1161\u1105\u1161\u11A8",
      "\u1107\u1161\u11AF\u1100\u1165\u11AF\u110B\u1173\u11B7",
      "\u1107\u1161\u11AF\u1100\u1167\u11AB",
      "\u1107\u1161\u11AF\u1103\u1161\u11AF",
      "\u1107\u1161\u11AF\u1105\u1166",
      "\u1107\u1161\u11AF\u1106\u1169\u11A8",
      "\u1107\u1161\u11AF\u1107\u1161\u1103\u1161\u11A8",
      "\u1107\u1161\u11AF\u1109\u1162\u11BC",
      "\u1107\u1161\u11AF\u110B\u1173\u11B7",
      "\u1107\u1161\u11AF\u110C\u1161\u1100\u116E\u11A8",
      "\u1107\u1161\u11AF\u110C\u1165\u11AB",
      "\u1107\u1161\u11AF\u1110\u1169\u11B8",
      "\u1107\u1161\u11AF\u1111\u116D",
      "\u1107\u1161\u11B7\u1112\u1161\u1102\u1173\u11AF",
      "\u1107\u1161\u11B8\u1100\u1173\u1105\u1173\u11BA",
      "\u1107\u1161\u11B8\u1106\u1161\u11BA",
      "\u1107\u1161\u11B8\u1109\u1161\u11BC",
      "\u1107\u1161\u11B8\u1109\u1169\u11C0",
      "\u1107\u1161\u11BC\u1100\u1173\u11B7",
      "\u1107\u1161\u11BC\u1106\u1167\u11AB",
      "\u1107\u1161\u11BC\u1106\u116E\u11AB",
      "\u1107\u1161\u11BC\u1107\u1161\u1103\u1161\u11A8",
      "\u1107\u1161\u11BC\u1107\u1165\u11B8",
      "\u1107\u1161\u11BC\u1109\u1169\u11BC",
      "\u1107\u1161\u11BC\u1109\u1175\u11A8",
      "\u1107\u1161\u11BC\u110B\u1161\u11AB",
      "\u1107\u1161\u11BC\u110B\u116E\u11AF",
      "\u1107\u1161\u11BC\u110C\u1175",
      "\u1107\u1161\u11BC\u1112\u1161\u11A8",
      "\u1107\u1161\u11BC\u1112\u1162",
      "\u1107\u1161\u11BC\u1112\u1163\u11BC",
      "\u1107\u1162\u1100\u1167\u11BC",
      "\u1107\u1162\u1101\u1169\u11B8",
      "\u1107\u1162\u1103\u1161\u11AF",
      "\u1107\u1162\u1103\u1173\u1106\u1175\u11AB\u1110\u1165\u11AB",
      "\u1107\u1162\u11A8\u1103\u116E\u1109\u1161\u11AB",
      "\u1107\u1162\u11A8\u1109\u1162\u11A8",
      "\u1107\u1162\u11A8\u1109\u1165\u11BC",
      "\u1107\u1162\u11A8\u110B\u1175\u11AB",
      "\u1107\u1162\u11A8\u110C\u1166",
      "\u1107\u1162\u11A8\u1112\u116A\u110C\u1165\u11B7",
      "\u1107\u1165\u1105\u1173\u11BA",
      "\u1107\u1165\u1109\u1165\u11BA",
      "\u1107\u1165\u1110\u1173\u11AB",
      "\u1107\u1165\u11AB\u1100\u1162",
      "\u1107\u1165\u11AB\u110B\u1167\u11A8",
      "\u1107\u1165\u11AB\u110C\u1175",
      "\u1107\u1165\u11AB\u1112\u1169",
      "\u1107\u1165\u11AF\u1100\u1173\u11B7",
      "\u1107\u1165\u11AF\u1105\u1166",
      "\u1107\u1165\u11AF\u110A\u1165",
      "\u1107\u1165\u11B7\u110B\u1171",
      "\u1107\u1165\u11B7\u110B\u1175\u11AB",
      "\u1107\u1165\u11B7\u110C\u116C",
      "\u1107\u1165\u11B8\u1105\u1172\u11AF",
      "\u1107\u1165\u11B8\u110B\u116F\u11AB",
      "\u1107\u1165\u11B8\u110C\u1165\u11A8",
      "\u1107\u1165\u11B8\u110E\u1175\u11A8",
      "\u1107\u1166\u110B\u1175\u110C\u1175\u11BC",
      "\u1107\u1166\u11AF\u1110\u1173",
      "\u1107\u1167\u11AB\u1100\u1167\u11BC",
      "\u1107\u1167\u11AB\u1103\u1169\u11BC",
      "\u1107\u1167\u11AB\u1106\u1167\u11BC",
      "\u1107\u1167\u11AB\u1109\u1175\u11AB",
      "\u1107\u1167\u11AB\u1112\u1169\u1109\u1161",
      "\u1107\u1167\u11AB\u1112\u116A",
      "\u1107\u1167\u11AF\u1103\u1169",
      "\u1107\u1167\u11AF\u1106\u1167\u11BC",
      "\u1107\u1167\u11AF\u110B\u1175\u11AF",
      "\u1107\u1167\u11BC\u1109\u1175\u11AF",
      "\u1107\u1167\u11BC\u110B\u1161\u1105\u1175",
      "\u1107\u1167\u11BC\u110B\u116F\u11AB",
      "\u1107\u1169\u1100\u116A\u11AB",
      "\u1107\u1169\u1102\u1165\u1109\u1173",
      "\u1107\u1169\u1105\u1161\u1109\u1162\u11A8",
      "\u1107\u1169\u1105\u1161\u11B7",
      "\u1107\u1169\u1105\u1173\u11B7",
      "\u1107\u1169\u1109\u1161\u11BC",
      "\u1107\u1169\u110B\u1161\u11AB",
      "\u1107\u1169\u110C\u1161\u1100\u1175",
      "\u1107\u1169\u110C\u1161\u11BC",
      "\u1107\u1169\u110C\u1165\u11AB",
      "\u1107\u1169\u110C\u1169\u11AB",
      "\u1107\u1169\u1110\u1169\u11BC",
      "\u1107\u1169\u1111\u1167\u11AB\u110C\u1165\u11A8",
      "\u1107\u1169\u1112\u1165\u11B7",
      "\u1107\u1169\u11A8\u1103\u1169",
      "\u1107\u1169\u11A8\u1109\u1161",
      "\u1107\u1169\u11A8\u1109\u116E\u11BC\u110B\u1161",
      "\u1107\u1169\u11A8\u1109\u1173\u11B8",
      "\u1107\u1169\u11A9\u110B\u1173\u11B7",
      "\u1107\u1169\u11AB\u1100\u1167\u11A8\u110C\u1165\u11A8",
      "\u1107\u1169\u11AB\u1105\u1162",
      "\u1107\u1169\u11AB\u1107\u116E",
      "\u1107\u1169\u11AB\u1109\u1161",
      "\u1107\u1169\u11AB\u1109\u1165\u11BC",
      "\u1107\u1169\u11AB\u110B\u1175\u11AB",
      "\u1107\u1169\u11AB\u110C\u1175\u11AF",
      "\u1107\u1169\u11AF\u1111\u1166\u11AB",
      "\u1107\u1169\u11BC\u1109\u1161",
      "\u1107\u1169\u11BC\u110C\u1175",
      "\u1107\u1169\u11BC\u1110\u116E",
      "\u1107\u116E\u1100\u1173\u11AB",
      "\u1107\u116E\u1101\u1173\u1105\u1165\u110B\u116E\u11B7",
      "\u1107\u116E\u1103\u1161\u11B7",
      "\u1107\u116E\u1103\u1169\u11BC\u1109\u1161\u11AB",
      "\u1107\u116E\u1106\u116E\u11AB",
      "\u1107\u116E\u1107\u116E\u11AB",
      "\u1107\u116E\u1109\u1161\u11AB",
      "\u1107\u116E\u1109\u1161\u11BC",
      "\u1107\u116E\u110B\u1165\u11BF",
      "\u1107\u116E\u110B\u1175\u11AB",
      "\u1107\u116E\u110C\u1161\u11A8\u110B\u116D\u11BC",
      "\u1107\u116E\u110C\u1161\u11BC",
      "\u1107\u116E\u110C\u1165\u11BC",
      "\u1107\u116E\u110C\u1169\u11A8",
      "\u1107\u116E\u110C\u1175\u1105\u1165\u11AB\u1112\u1175",
      "\u1107\u116E\u110E\u1175\u11AB",
      "\u1107\u116E\u1110\u1161\u11A8",
      "\u1107\u116E\u1111\u116E\u11B7",
      "\u1107\u116E\u1112\u116C\u110C\u1161\u11BC",
      "\u1107\u116E\u11A8\u1107\u116E",
      "\u1107\u116E\u11A8\u1112\u1161\u11AB",
      "\u1107\u116E\u11AB\u1102\u1169",
      "\u1107\u116E\u11AB\u1105\u1163\u11BC",
      "\u1107\u116E\u11AB\u1105\u1175",
      "\u1107\u116E\u11AB\u1106\u1167\u11BC",
      "\u1107\u116E\u11AB\u1109\u1165\u11A8",
      "\u1107\u116E\u11AB\u110B\u1163",
      "\u1107\u116E\u11AB\u110B\u1171\u1100\u1175",
      "\u1107\u116E\u11AB\u1111\u1175\u11AF",
      "\u1107\u116E\u11AB\u1112\u1169\u11BC\u1109\u1162\u11A8",
      "\u1107\u116E\u11AF\u1100\u1169\u1100\u1175",
      "\u1107\u116E\u11AF\u1100\u116A",
      "\u1107\u116E\u11AF\u1100\u116D",
      "\u1107\u116E\u11AF\u1101\u1169\u11BE",
      "\u1107\u116E\u11AF\u1106\u1161\u11AB",
      "\u1107\u116E\u11AF\u1107\u1165\u11B8",
      "\u1107\u116E\u11AF\u1107\u1175\u11BE",
      "\u1107\u116E\u11AF\u110B\u1161\u11AB",
      "\u1107\u116E\u11AF\u110B\u1175\u110B\u1175\u11A8",
      "\u1107\u116E\u11AF\u1112\u1162\u11BC",
      "\u1107\u1173\u1105\u1162\u11AB\u1103\u1173",
      "\u1107\u1175\u1100\u1173\u11A8",
      "\u1107\u1175\u1102\u1161\u11AB",
      "\u1107\u1175\u1102\u1175\u11AF",
      "\u1107\u1175\u1103\u116E\u11AF\u1100\u1175",
      "\u1107\u1175\u1103\u1175\u110B\u1169",
      "\u1107\u1175\u1105\u1169\u1109\u1169",
      "\u1107\u1175\u1106\u1161\u11AB",
      "\u1107\u1175\u1106\u1167\u11BC",
      "\u1107\u1175\u1106\u1175\u11AF",
      "\u1107\u1175\u1107\u1161\u1105\u1161\u11B7",
      "\u1107\u1175\u1107\u1175\u11B7\u1107\u1161\u11B8",
      "\u1107\u1175\u1109\u1161\u11BC",
      "\u1107\u1175\u110B\u116D\u11BC",
      "\u1107\u1175\u110B\u1172\u11AF",
      "\u1107\u1175\u110C\u116E\u11BC",
      "\u1107\u1175\u1110\u1161\u1106\u1175\u11AB",
      "\u1107\u1175\u1111\u1161\u11AB",
      "\u1107\u1175\u11AF\u1103\u1175\u11BC",
      "\u1107\u1175\u11BA\u1106\u116E\u11AF",
      "\u1107\u1175\u11BA\u1107\u1161\u11BC\u110B\u116E\u11AF",
      "\u1107\u1175\u11BA\u110C\u116E\u11AF\u1100\u1175",
      "\u1107\u1175\u11BE\u1101\u1161\u11AF",
      "\u1108\u1161\u11AF\u1100\u1161\u11AB\u1109\u1162\u11A8",
      "\u1108\u1161\u11AF\u1105\u1162",
      "\u1108\u1161\u11AF\u1105\u1175",
      "\u1109\u1161\u1100\u1165\u11AB",
      "\u1109\u1161\u1100\u1168\u110C\u1165\u11AF",
      "\u1109\u1161\u1102\u1161\u110B\u1175",
      "\u1109\u1161\u1102\u1163\u11BC",
      "\u1109\u1161\u1105\u1161\u11B7",
      "\u1109\u1161\u1105\u1161\u11BC",
      "\u1109\u1161\u1105\u1175\u11B8",
      "\u1109\u1161\u1106\u1169\u1102\u1175\u11B7",
      "\u1109\u1161\u1106\u116E\u11AF",
      "\u1109\u1161\u1107\u1161\u11BC",
      "\u1109\u1161\u1109\u1161\u11BC",
      "\u1109\u1161\u1109\u1162\u11BC\u1112\u116A\u11AF",
      "\u1109\u1161\u1109\u1165\u11AF",
      "\u1109\u1161\u1109\u1173\u11B7",
      "\u1109\u1161\u1109\u1175\u11AF",
      "\u1109\u1161\u110B\u1165\u11B8",
      "\u1109\u1161\u110B\u116D\u11BC",
      "\u1109\u1161\u110B\u116F\u11AF",
      "\u1109\u1161\u110C\u1161\u11BC",
      "\u1109\u1161\u110C\u1165\u11AB",
      "\u1109\u1161\u110C\u1175\u11AB",
      "\u1109\u1161\u110E\u1169\u11AB",
      "\u1109\u1161\u110E\u116E\u11AB\u1100\u1175",
      "\u1109\u1161\u1110\u1161\u11BC",
      "\u1109\u1161\u1110\u116E\u1105\u1175",
      "\u1109\u1161\u1112\u1173\u11AF",
      "\u1109\u1161\u11AB\u1100\u1175\u11AF",
      "\u1109\u1161\u11AB\u1107\u116E\u110B\u1175\u11AB\u1100\u116A",
      "\u1109\u1161\u11AB\u110B\u1165\u11B8",
      "\u1109\u1161\u11AB\u110E\u1162\u11A8",
      "\u1109\u1161\u11AF\u1105\u1175\u11B7",
      "\u1109\u1161\u11AF\u110B\u1175\u11AB",
      "\u1109\u1161\u11AF\u110D\u1161\u11A8",
      "\u1109\u1161\u11B7\u1100\u1168\u1110\u1161\u11BC",
      "\u1109\u1161\u11B7\u1100\u116E\u11A8",
      "\u1109\u1161\u11B7\u1109\u1175\u11B8",
      "\u1109\u1161\u11B7\u110B\u116F\u11AF",
      "\u1109\u1161\u11B7\u110E\u1169\u11AB",
      "\u1109\u1161\u11BC\u1100\u116A\u11AB",
      "\u1109\u1161\u11BC\u1100\u1173\u11B7",
      "\u1109\u1161\u11BC\u1103\u1162",
      "\u1109\u1161\u11BC\u1105\u1172",
      "\u1109\u1161\u11BC\u1107\u1161\u11AB\u1100\u1175",
      "\u1109\u1161\u11BC\u1109\u1161\u11BC",
      "\u1109\u1161\u11BC\u1109\u1175\u11A8",
      "\u1109\u1161\u11BC\u110B\u1165\u11B8",
      "\u1109\u1161\u11BC\u110B\u1175\u11AB",
      "\u1109\u1161\u11BC\u110C\u1161",
      "\u1109\u1161\u11BC\u110C\u1165\u11B7",
      "\u1109\u1161\u11BC\u110E\u1165",
      "\u1109\u1161\u11BC\u110E\u116E",
      "\u1109\u1161\u11BC\u1110\u1162",
      "\u1109\u1161\u11BC\u1111\u116D",
      "\u1109\u1161\u11BC\u1111\u116E\u11B7",
      "\u1109\u1161\u11BC\u1112\u116A\u11BC",
      "\u1109\u1162\u1107\u1167\u11A8",
      "\u1109\u1162\u11A8\u1101\u1161\u11AF",
      "\u1109\u1162\u11A8\u110B\u1167\u11AB\u1111\u1175\u11AF",
      "\u1109\u1162\u11BC\u1100\u1161\u11A8",
      "\u1109\u1162\u11BC\u1106\u1167\u11BC",
      "\u1109\u1162\u11BC\u1106\u116E\u11AF",
      "\u1109\u1162\u11BC\u1107\u1161\u11BC\u1109\u1169\u11BC",
      "\u1109\u1162\u11BC\u1109\u1161\u11AB",
      "\u1109\u1162\u11BC\u1109\u1165\u11AB",
      "\u1109\u1162\u11BC\u1109\u1175\u11AB",
      "\u1109\u1162\u11BC\u110B\u1175\u11AF",
      "\u1109\u1162\u11BC\u1112\u116A\u11AF",
      "\u1109\u1165\u1105\u1161\u11B8",
      "\u1109\u1165\u1105\u1173\u11AB",
      "\u1109\u1165\u1106\u1167\u11BC",
      "\u1109\u1165\u1106\u1175\u11AB",
      "\u1109\u1165\u1107\u1175\u1109\u1173",
      "\u1109\u1165\u110B\u1163\u11BC",
      "\u1109\u1165\u110B\u116E\u11AF",
      "\u1109\u1165\u110C\u1165\u11A8",
      "\u1109\u1165\u110C\u1165\u11B7",
      "\u1109\u1165\u110D\u1169\u11A8",
      "\u1109\u1165\u110F\u1173\u11AF",
      "\u1109\u1165\u11A8\u1109\u1161",
      "\u1109\u1165\u11A8\u110B\u1172",
      "\u1109\u1165\u11AB\u1100\u1165",
      "\u1109\u1165\u11AB\u1106\u116E\u11AF",
      "\u1109\u1165\u11AB\u1107\u1162",
      "\u1109\u1165\u11AB\u1109\u1162\u11BC",
      "\u1109\u1165\u11AB\u1109\u116E",
      "\u1109\u1165\u11AB\u110B\u116F\u11AB",
      "\u1109\u1165\u11AB\u110C\u1161\u11BC",
      "\u1109\u1165\u11AB\u110C\u1165\u11AB",
      "\u1109\u1165\u11AB\u1110\u1162\u11A8",
      "\u1109\u1165\u11AB\u1111\u116E\u11BC\u1100\u1175",
      "\u1109\u1165\u11AF\u1100\u1165\u110C\u1175",
      "\u1109\u1165\u11AF\u1102\u1161\u11AF",
      "\u1109\u1165\u11AF\u1105\u1165\u11BC\u1110\u1161\u11BC",
      "\u1109\u1165\u11AF\u1106\u1167\u11BC",
      "\u1109\u1165\u11AF\u1106\u116E\u11AB",
      "\u1109\u1165\u11AF\u1109\u1161",
      "\u1109\u1165\u11AF\u110B\u1161\u11A8\u1109\u1161\u11AB",
      "\u1109\u1165\u11AF\u110E\u1175",
      "\u1109\u1165\u11AF\u1110\u1161\u11BC",
      "\u1109\u1165\u11B8\u110A\u1175",
      "\u1109\u1165\u11BC\u1100\u1169\u11BC",
      "\u1109\u1165\u11BC\u1103\u1161\u11BC",
      "\u1109\u1165\u11BC\u1106\u1167\u11BC",
      "\u1109\u1165\u11BC\u1107\u1167\u11AF",
      "\u1109\u1165\u11BC\u110B\u1175\u11AB",
      "\u1109\u1165\u11BC\u110C\u1161\u11BC",
      "\u1109\u1165\u11BC\u110C\u1165\u11A8",
      "\u1109\u1165\u11BC\u110C\u1175\u11AF",
      "\u1109\u1165\u11BC\u1112\u1161\u11B7",
      "\u1109\u1166\u1100\u1173\u11B7",
      "\u1109\u1166\u1106\u1175\u1102\u1161",
      "\u1109\u1166\u1109\u1161\u11BC",
      "\u1109\u1166\u110B\u116F\u11AF",
      "\u1109\u1166\u110C\u1169\u11BC\u1103\u1162\u110B\u116A\u11BC",
      "\u1109\u1166\u1110\u1161\u11A8",
      "\u1109\u1166\u11AB\u1110\u1165",
      "\u1109\u1166\u11AB\u1110\u1175\u1106\u1175\u1110\u1165",
      "\u1109\u1166\u11BA\u110D\u1162",
      "\u1109\u1169\u1100\u1172\u1106\u1169",
      "\u1109\u1169\u1100\u1173\u11A8\u110C\u1165\u11A8",
      "\u1109\u1169\u1100\u1173\u11B7",
      "\u1109\u1169\u1102\u1161\u1100\u1175",
      "\u1109\u1169\u1102\u1167\u11AB",
      "\u1109\u1169\u1103\u1173\u11A8",
      "\u1109\u1169\u1106\u1161\u11BC",
      "\u1109\u1169\u1106\u116E\u11AB",
      "\u1109\u1169\u1109\u1165\u11AF",
      "\u1109\u1169\u1109\u1169\u11A8",
      "\u1109\u1169\u110B\u1161\u1100\u116A",
      "\u1109\u1169\u110B\u116D\u11BC",
      "\u1109\u1169\u110B\u116F\u11AB",
      "\u1109\u1169\u110B\u1173\u11B7",
      "\u1109\u1169\u110C\u116E\u11BC\u1112\u1175",
      "\u1109\u1169\u110C\u1175\u1111\u116E\u11B7",
      "\u1109\u1169\u110C\u1175\u11AF",
      "\u1109\u1169\u1111\u116E\u11BC",
      "\u1109\u1169\u1112\u1167\u11BC",
      "\u1109\u1169\u11A8\u1103\u1161\u11B7",
      "\u1109\u1169\u11A8\u1103\u1169",
      "\u1109\u1169\u11A8\u110B\u1169\u11BA",
      "\u1109\u1169\u11AB\u1100\u1161\u1105\u1161\u11A8",
      "\u1109\u1169\u11AB\u1100\u1175\u11AF",
      "\u1109\u1169\u11AB\u1102\u1167",
      "\u1109\u1169\u11AB\u1102\u1175\u11B7",
      "\u1109\u1169\u11AB\u1103\u1173\u11BC",
      "\u1109\u1169\u11AB\u1106\u1169\u11A8",
      "\u1109\u1169\u11AB\u1108\u1167\u11A8",
      "\u1109\u1169\u11AB\u1109\u1175\u11AF",
      "\u1109\u1169\u11AB\u110C\u1175\u11AF",
      "\u1109\u1169\u11AB\u1110\u1169\u11B8",
      "\u1109\u1169\u11AB\u1112\u1162",
      "\u1109\u1169\u11AF\u110C\u1175\u11A8\u1112\u1175",
      "\u1109\u1169\u11B7\u110A\u1175",
      "\u1109\u1169\u11BC\u110B\u1161\u110C\u1175",
      "\u1109\u1169\u11BC\u110B\u1175",
      "\u1109\u1169\u11BC\u1111\u1167\u11AB",
      "\u1109\u116C\u1100\u1169\u1100\u1175",
      "\u1109\u116D\u1111\u1175\u11BC",
      "\u1109\u116E\u1100\u1165\u11AB",
      "\u1109\u116E\u1102\u1167\u11AB",
      "\u1109\u116E\u1103\u1161\u11AB",
      "\u1109\u116E\u1103\u1169\u11BA\u1106\u116E\u11AF",
      "\u1109\u116E\u1103\u1169\u11BC\u110C\u1165\u11A8",
      "\u1109\u116E\u1106\u1167\u11AB",
      "\u1109\u116E\u1106\u1167\u11BC",
      "\u1109\u116E\u1107\u1161\u11A8",
      "\u1109\u116E\u1109\u1161\u11BC",
      "\u1109\u116E\u1109\u1165\u11A8",
      "\u1109\u116E\u1109\u116E\u11AF",
      "\u1109\u116E\u1109\u1175\u1105\u1169",
      "\u1109\u116E\u110B\u1165\u11B8",
      "\u1109\u116E\u110B\u1167\u11B7",
      "\u1109\u116E\u110B\u1167\u11BC",
      "\u1109\u116E\u110B\u1175\u11B8",
      "\u1109\u116E\u110C\u116E\u11AB",
      "\u1109\u116E\u110C\u1175\u11B8",
      "\u1109\u116E\u110E\u116E\u11AF",
      "\u1109\u116E\u110F\u1165\u11BA",
      "\u1109\u116E\u1111\u1175\u11AF",
      "\u1109\u116E\u1112\u1161\u11A8",
      "\u1109\u116E\u1112\u1165\u11B7\u1109\u1162\u11BC",
      "\u1109\u116E\u1112\u116A\u1100\u1175",
      "\u1109\u116E\u11A8\u1102\u1167",
      "\u1109\u116E\u11A8\u1109\u1169",
      "\u1109\u116E\u11A8\u110C\u1166",
      "\u1109\u116E\u11AB\u1100\u1161\u11AB",
      "\u1109\u116E\u11AB\u1109\u1165",
      "\u1109\u116E\u11AB\u1109\u116E",
      "\u1109\u116E\u11AB\u1109\u1175\u11A8\u1100\u1161\u11AB",
      "\u1109\u116E\u11AB\u110B\u1171",
      "\u1109\u116E\u11AE\u1100\u1161\u1105\u1161\u11A8",
      "\u1109\u116E\u11AF\u1107\u1167\u11BC",
      "\u1109\u116E\u11AF\u110C\u1175\u11B8",
      "\u1109\u116E\u11BA\u110C\u1161",
      "\u1109\u1173\u1102\u1175\u11B7",
      "\u1109\u1173\u1106\u116E\u11AF",
      "\u1109\u1173\u1109\u1173\u1105\u1169",
      "\u1109\u1173\u1109\u1173\u11BC",
      "\u1109\u1173\u110B\u1170\u1110\u1165",
      "\u1109\u1173\u110B\u1171\u110E\u1175",
      "\u1109\u1173\u110F\u1166\u110B\u1175\u1110\u1173",
      "\u1109\u1173\u1110\u1172\u1103\u1175\u110B\u1169",
      "\u1109\u1173\u1110\u1173\u1105\u1166\u1109\u1173",
      "\u1109\u1173\u1111\u1169\u110E\u1173",
      "\u1109\u1173\u11AF\u110D\u1165\u11A8",
      "\u1109\u1173\u11AF\u1111\u1173\u11B7",
      "\u1109\u1173\u11B8\u1100\u116A\u11AB",
      "\u1109\u1173\u11B8\u1100\u1175",
      "\u1109\u1173\u11BC\u1100\u1162\u11A8",
      "\u1109\u1173\u11BC\u1105\u1175",
      "\u1109\u1173\u11BC\u1107\u116E",
      "\u1109\u1173\u11BC\u110B\u116D\u11BC\u110E\u1161",
      "\u1109\u1173\u11BC\u110C\u1175\u11AB",
      "\u1109\u1175\u1100\u1161\u11A8",
      "\u1109\u1175\u1100\u1161\u11AB",
      "\u1109\u1175\u1100\u1169\u11AF",
      "\u1109\u1175\u1100\u1173\u11B7\u110E\u1175",
      "\u1109\u1175\u1102\u1161\u1105\u1175\u110B\u1169",
      "\u1109\u1175\u1103\u1162\u11A8",
      "\u1109\u1175\u1105\u1175\u110C\u1173",
      "\u1109\u1175\u1106\u1166\u11AB\u1110\u1173",
      "\u1109\u1175\u1106\u1175\u11AB",
      "\u1109\u1175\u1107\u116E\u1106\u1169",
      "\u1109\u1175\u1109\u1165\u11AB",
      "\u1109\u1175\u1109\u1165\u11AF",
      "\u1109\u1175\u1109\u1173\u1110\u1166\u11B7",
      "\u1109\u1175\u110B\u1161\u1107\u1165\u110C\u1175",
      "\u1109\u1175\u110B\u1165\u1106\u1165\u1102\u1175",
      "\u1109\u1175\u110B\u116F\u11AF",
      "\u1109\u1175\u110B\u1175\u11AB",
      "\u1109\u1175\u110B\u1175\u11AF",
      "\u1109\u1175\u110C\u1161\u11A8",
      "\u1109\u1175\u110C\u1161\u11BC",
      "\u1109\u1175\u110C\u1165\u11AF",
      "\u1109\u1175\u110C\u1165\u11B7",
      "\u1109\u1175\u110C\u116E\u11BC",
      "\u1109\u1175\u110C\u1173\u11AB",
      "\u1109\u1175\u110C\u1175\u11B8",
      "\u1109\u1175\u110E\u1165\u11BC",
      "\u1109\u1175\u1112\u1161\u11B8",
      "\u1109\u1175\u1112\u1165\u11B7",
      "\u1109\u1175\u11A8\u1100\u116E",
      "\u1109\u1175\u11A8\u1100\u1175",
      "\u1109\u1175\u11A8\u1103\u1161\u11BC",
      "\u1109\u1175\u11A8\u1105\u1163\u11BC",
      "\u1109\u1175\u11A8\u1105\u116D\u1111\u116E\u11B7",
      "\u1109\u1175\u11A8\u1106\u116E\u11AF",
      "\u1109\u1175\u11A8\u1108\u1161\u11BC",
      "\u1109\u1175\u11A8\u1109\u1161",
      "\u1109\u1175\u11A8\u1109\u1162\u11BC\u1112\u116A\u11AF",
      "\u1109\u1175\u11A8\u110E\u1169",
      "\u1109\u1175\u11A8\u1110\u1161\u11A8",
      "\u1109\u1175\u11A8\u1111\u116E\u11B7",
      "\u1109\u1175\u11AB\u1100\u1169",
      "\u1109\u1175\u11AB\u1100\u1172",
      "\u1109\u1175\u11AB\u1102\u1167\u11B7",
      "\u1109\u1175\u11AB\u1106\u116E\u11AB",
      "\u1109\u1175\u11AB\u1107\u1161\u11AF",
      "\u1109\u1175\u11AB\u1107\u1175",
      "\u1109\u1175\u11AB\u1109\u1161",
      "\u1109\u1175\u11AB\u1109\u1166",
      "\u1109\u1175\u11AB\u110B\u116D\u11BC",
      "\u1109\u1175\u11AB\u110C\u1166\u1111\u116E\u11B7",
      "\u1109\u1175\u11AB\u110E\u1165\u11BC",
      "\u1109\u1175\u11AB\u110E\u1166",
      "\u1109\u1175\u11AB\u1112\u116A",
      "\u1109\u1175\u11AF\u1100\u1161\u11B7",
      "\u1109\u1175\u11AF\u1102\u1162",
      "\u1109\u1175\u11AF\u1105\u1167\u11A8",
      "\u1109\u1175\u11AF\u1105\u1168",
      "\u1109\u1175\u11AF\u1106\u1161\u11BC",
      "\u1109\u1175\u11AF\u1109\u116E",
      "\u1109\u1175\u11AF\u1109\u1173\u11B8",
      "\u1109\u1175\u11AF\u1109\u1175",
      "\u1109\u1175\u11AF\u110C\u1161\u11BC",
      "\u1109\u1175\u11AF\u110C\u1165\u11BC",
      "\u1109\u1175\u11AF\u110C\u1175\u11AF\u110C\u1165\u11A8",
      "\u1109\u1175\u11AF\u110E\u1165\u11AB",
      "\u1109\u1175\u11AF\u110E\u1166",
      "\u1109\u1175\u11AF\u110F\u1165\u11BA",
      "\u1109\u1175\u11AF\u1110\u1162",
      "\u1109\u1175\u11AF\u1111\u1162",
      "\u1109\u1175\u11AF\u1112\u1165\u11B7",
      "\u1109\u1175\u11AF\u1112\u1167\u11AB",
      "\u1109\u1175\u11B7\u1105\u1175",
      "\u1109\u1175\u11B7\u1107\u116E\u1105\u1173\u11B7",
      "\u1109\u1175\u11B7\u1109\u1161",
      "\u1109\u1175\u11B7\u110C\u1161\u11BC",
      "\u1109\u1175\u11B7\u110C\u1165\u11BC",
      "\u1109\u1175\u11B7\u1111\u1161\u11AB",
      "\u110A\u1161\u11BC\u1103\u116E\u11BC\u110B\u1175",
      "\u110A\u1175\u1105\u1173\u11B7",
      "\u110A\u1175\u110B\u1161\u11BA",
      "\u110B\u1161\u1100\u1161\u110A\u1175",
      "\u110B\u1161\u1102\u1161\u110B\u116E\u11AB\u1109\u1165",
      "\u110B\u1161\u1103\u1173\u1102\u1175\u11B7",
      "\u110B\u1161\u1103\u1173\u11AF",
      "\u110B\u1161\u1109\u1171\u110B\u116E\u11B7",
      "\u110B\u1161\u1109\u1173\u1111\u1161\u11AF\u1110\u1173",
      "\u110B\u1161\u1109\u1175\u110B\u1161",
      "\u110B\u1161\u110B\u116E\u11AF\u1105\u1165",
      "\u110B\u1161\u110C\u1165\u110A\u1175",
      "\u110B\u1161\u110C\u116E\u11B7\u1106\u1161",
      "\u110B\u1161\u110C\u1175\u11A8",
      "\u110B\u1161\u110E\u1175\u11B7",
      "\u110B\u1161\u1111\u1161\u1110\u1173",
      "\u110B\u1161\u1111\u1173\u1105\u1175\u110F\u1161",
      "\u110B\u1161\u1111\u1173\u11B7",
      "\u110B\u1161\u1112\u1169\u11B8",
      "\u110B\u1161\u1112\u1173\u11AB",
      "\u110B\u1161\u11A8\u1100\u1175",
      "\u110B\u1161\u11A8\u1106\u1169\u11BC",
      "\u110B\u1161\u11A8\u1109\u116E",
      "\u110B\u1161\u11AB\u1100\u1162",
      "\u110B\u1161\u11AB\u1100\u1167\u11BC",
      "\u110B\u1161\u11AB\u1100\u116A",
      "\u110B\u1161\u11AB\u1102\u1162",
      "\u110B\u1161\u11AB\u1102\u1167\u11BC",
      "\u110B\u1161\u11AB\u1103\u1169\u11BC",
      "\u110B\u1161\u11AB\u1107\u1161\u11BC",
      "\u110B\u1161\u11AB\u1107\u116E",
      "\u110B\u1161\u11AB\u110C\u116E",
      "\u110B\u1161\u11AF\u1105\u116E\u1106\u1175\u1102\u1172\u11B7",
      "\u110B\u1161\u11AF\u110F\u1169\u110B\u1169\u11AF",
      "\u110B\u1161\u11B7\u1109\u1175",
      "\u110B\u1161\u11B7\u110F\u1165\u11BA",
      "\u110B\u1161\u11B8\u1105\u1167\u11A8",
      "\u110B\u1161\u11C1\u1102\u1161\u11AF",
      "\u110B\u1161\u11C1\u1106\u116E\u11AB",
      "\u110B\u1162\u110B\u1175\u11AB",
      "\u110B\u1162\u110C\u1165\u11BC",
      "\u110B\u1162\u11A8\u1109\u116E",
      "\u110B\u1162\u11AF\u1107\u1165\u11B7",
      "\u110B\u1163\u1100\u1161\u11AB",
      "\u110B\u1163\u1103\u1161\u11AB",
      "\u110B\u1163\u110B\u1169\u11BC",
      "\u110B\u1163\u11A8\u1100\u1161\u11AB",
      "\u110B\u1163\u11A8\u1100\u116E\u11A8",
      "\u110B\u1163\u11A8\u1109\u1169\u11A8",
      "\u110B\u1163\u11A8\u1109\u116E",
      "\u110B\u1163\u11A8\u110C\u1165\u11B7",
      "\u110B\u1163\u11A8\u1111\u116E\u11B7",
      "\u110B\u1163\u11A8\u1112\u1169\u11AB\u1102\u1167",
      "\u110B\u1163\u11BC\u1102\u1167\u11B7",
      "\u110B\u1163\u11BC\u1105\u1167\u11A8",
      "\u110B\u1163\u11BC\u1106\u1161\u11AF",
      "\u110B\u1163\u11BC\u1107\u1162\u110E\u116E",
      "\u110B\u1163\u11BC\u110C\u116E",
      "\u110B\u1163\u11BC\u1111\u1161",
      "\u110B\u1165\u1103\u116E\u11B7",
      "\u110B\u1165\u1105\u1167\u110B\u116E\u11B7",
      "\u110B\u1165\u1105\u1173\u11AB",
      "\u110B\u1165\u110C\u1166\u11BA\u1107\u1161\u11B7",
      "\u110B\u1165\u110D\u1162\u11BB\u1103\u1173\u11AB",
      "\u110B\u1165\u110D\u1165\u1103\u1161\u1100\u1161",
      "\u110B\u1165\u110D\u1165\u11AB\u110C\u1175",
      "\u110B\u1165\u11AB\u1102\u1175",
      "\u110B\u1165\u11AB\u1103\u1165\u11A8",
      "\u110B\u1165\u11AB\u1105\u1169\u11AB",
      "\u110B\u1165\u11AB\u110B\u1165",
      "\u110B\u1165\u11AF\u1100\u116E\u11AF",
      "\u110B\u1165\u11AF\u1105\u1173\u11AB",
      "\u110B\u1165\u11AF\u110B\u1173\u11B7",
      "\u110B\u1165\u11AF\u1111\u1175\u11BA",
      "\u110B\u1165\u11B7\u1106\u1161",
      "\u110B\u1165\u11B8\u1106\u116E",
      "\u110B\u1165\u11B8\u110C\u1169\u11BC",
      "\u110B\u1165\u11B8\u110E\u1166",
      "\u110B\u1165\u11BC\u1103\u1165\u11BC\u110B\u1175",
      "\u110B\u1165\u11BC\u1106\u1161\u11BC",
      "\u110B\u1165\u11BC\u1110\u1165\u1105\u1175",
      "\u110B\u1165\u11BD\u1100\u1173\u110C\u1166",
      "\u110B\u1166\u1102\u1165\u110C\u1175",
      "\u110B\u1166\u110B\u1165\u110F\u1165\u11AB",
      "\u110B\u1166\u11AB\u110C\u1175\u11AB",
      "\u110B\u1167\u1100\u1165\u11AB",
      "\u110B\u1167\u1100\u1169\u1109\u1162\u11BC",
      "\u110B\u1167\u1100\u116A\u11AB",
      "\u110B\u1167\u1100\u116E\u11AB",
      "\u110B\u1167\u1100\u116F\u11AB",
      "\u110B\u1167\u1103\u1162\u1109\u1162\u11BC",
      "\u110B\u1167\u1103\u1165\u11B2",
      "\u110B\u1167\u1103\u1169\u11BC\u1109\u1162\u11BC",
      "\u110B\u1167\u1103\u1173\u11AB",
      "\u110B\u1167\u1105\u1169\u11AB",
      "\u110B\u1167\u1105\u1173\u11B7",
      "\u110B\u1167\u1109\u1165\u11BA",
      "\u110B\u1167\u1109\u1165\u11BC",
      "\u110B\u1167\u110B\u116A\u11BC",
      "\u110B\u1167\u110B\u1175\u11AB",
      "\u110B\u1167\u110C\u1165\u11AB\u1112\u1175",
      "\u110B\u1167\u110C\u1175\u11A8\u110B\u116F\u11AB",
      "\u110B\u1167\u1112\u1161\u11A8\u1109\u1162\u11BC",
      "\u110B\u1167\u1112\u1162\u11BC",
      "\u110B\u1167\u11A8\u1109\u1161",
      "\u110B\u1167\u11A8\u1109\u1175",
      "\u110B\u1167\u11A8\u1112\u1161\u11AF",
      "\u110B\u1167\u11AB\u1100\u1167\u11AF",
      "\u110B\u1167\u11AB\u1100\u116E",
      "\u110B\u1167\u11AB\u1100\u1173\u11A8",
      "\u110B\u1167\u11AB\u1100\u1175",
      "\u110B\u1167\u11AB\u1105\u1161\u11A8",
      "\u110B\u1167\u11AB\u1109\u1165\u11AF",
      "\u110B\u1167\u11AB\u1109\u1166",
      "\u110B\u1167\u11AB\u1109\u1169\u11A8",
      "\u110B\u1167\u11AB\u1109\u1173\u11B8",
      "\u110B\u1167\u11AB\u110B\u1162",
      "\u110B\u1167\u11AB\u110B\u1168\u110B\u1175\u11AB",
      "\u110B\u1167\u11AB\u110B\u1175\u11AB",
      "\u110B\u1167\u11AB\u110C\u1161\u11BC",
      "\u110B\u1167\u11AB\u110C\u116E",
      "\u110B\u1167\u11AB\u110E\u116E\u11AF",
      "\u110B\u1167\u11AB\u1111\u1175\u11AF",
      "\u110B\u1167\u11AB\u1112\u1161\u11B8",
      "\u110B\u1167\u11AB\u1112\u1172",
      "\u110B\u1167\u11AF\u1100\u1175",
      "\u110B\u1167\u11AF\u1106\u1162",
      "\u110B\u1167\u11AF\u1109\u116C",
      "\u110B\u1167\u11AF\u1109\u1175\u11B7\u1112\u1175",
      "\u110B\u1167\u11AF\u110C\u1165\u11BC",
      "\u110B\u1167\u11AF\u110E\u1161",
      "\u110B\u1167\u11AF\u1112\u1173\u11AF",
      "\u110B\u1167\u11B7\u1105\u1167",
      "\u110B\u1167\u11B8\u1109\u1165",
      "\u110B\u1167\u11BC\u1100\u116E\u11A8",
      "\u110B\u1167\u11BC\u1102\u1161\u11B7",
      "\u110B\u1167\u11BC\u1109\u1161\u11BC",
      "\u110B\u1167\u11BC\u110B\u1163\u11BC",
      "\u110B\u1167\u11BC\u110B\u1167\u11A8",
      "\u110B\u1167\u11BC\u110B\u116E\u11BC",
      "\u110B\u1167\u11BC\u110B\u116F\u11AB\u1112\u1175",
      "\u110B\u1167\u11BC\u1112\u1161",
      "\u110B\u1167\u11BC\u1112\u1163\u11BC",
      "\u110B\u1167\u11BC\u1112\u1169\u11AB",
      "\u110B\u1167\u11BC\u1112\u116A",
      "\u110B\u1167\u11C1\u1100\u116E\u1105\u1175",
      "\u110B\u1167\u11C1\u1107\u1161\u11BC",
      "\u110B\u1167\u11C1\u110C\u1175\u11B8",
      "\u110B\u1168\u1100\u1161\u11B7",
      "\u110B\u1168\u1100\u1173\u11B7",
      "\u110B\u1168\u1107\u1161\u11BC",
      "\u110B\u1168\u1109\u1161\u11AB",
      "\u110B\u1168\u1109\u1161\u11BC",
      "\u110B\u1168\u1109\u1165\u11AB",
      "\u110B\u1168\u1109\u116E\u11AF",
      "\u110B\u1168\u1109\u1173\u11B8",
      "\u110B\u1168\u1109\u1175\u11A8\u110C\u1161\u11BC",
      "\u110B\u1168\u110B\u1163\u11A8",
      "\u110B\u1168\u110C\u1165\u11AB",
      "\u110B\u1168\u110C\u1165\u11AF",
      "\u110B\u1168\u110C\u1165\u11BC",
      "\u110B\u1168\u110F\u1165\u11AB\u1103\u1162",
      "\u110B\u1168\u11BA\u1102\u1161\u11AF",
      "\u110B\u1169\u1102\u1173\u11AF",
      "\u110B\u1169\u1105\u1161\u11A8",
      "\u110B\u1169\u1105\u1162\u11BA\u1103\u1169\u11BC\u110B\u1161\u11AB",
      "\u110B\u1169\u1105\u1166\u11AB\u110C\u1175",
      "\u110B\u1169\u1105\u1169\u110C\u1175",
      "\u110B\u1169\u1105\u1173\u11AB\u1107\u1161\u11AF",
      "\u110B\u1169\u1107\u1173\u11AB",
      "\u110B\u1169\u1109\u1175\u11B8",
      "\u110B\u1169\u110B\u1167\u11B7",
      "\u110B\u1169\u110B\u116F\u11AF",
      "\u110B\u1169\u110C\u1165\u11AB",
      "\u110B\u1169\u110C\u1175\u11A8",
      "\u110B\u1169\u110C\u1175\u11BC\u110B\u1165",
      "\u110B\u1169\u1111\u1166\u1105\u1161",
      "\u110B\u1169\u1111\u1175\u1109\u1173\u1110\u1166\u11AF",
      "\u110B\u1169\u1112\u1175\u1105\u1167",
      "\u110B\u1169\u11A8\u1109\u1161\u11BC",
      "\u110B\u1169\u11A8\u1109\u116E\u1109\u116E",
      "\u110B\u1169\u11AB\u1100\u1161\u11BD",
      "\u110B\u1169\u11AB\u1105\u1161\u110B\u1175\u11AB",
      "\u110B\u1169\u11AB\u1106\u1169\u11B7",
      "\u110B\u1169\u11AB\u110C\u1169\u11BC\u110B\u1175\u11AF",
      "\u110B\u1169\u11AB\u1110\u1169\u11BC",
      "\u110B\u1169\u11AF\u1100\u1161\u110B\u1173\u11AF",
      "\u110B\u1169\u11AF\u1105\u1175\u11B7\u1111\u1175\u11A8",
      "\u110B\u1169\u11AF\u1112\u1162",
      "\u110B\u1169\u11BA\u110E\u1161\u1105\u1175\u11B7",
      "\u110B\u116A\u110B\u1175\u1109\u1167\u110E\u1173",
      "\u110B\u116A\u110B\u1175\u11AB",
      "\u110B\u116A\u11AB\u1109\u1165\u11BC",
      "\u110B\u116A\u11AB\u110C\u1165\u11AB",
      "\u110B\u116A\u11BC\u1107\u1175",
      "\u110B\u116A\u11BC\u110C\u1161",
      "\u110B\u116B\u1102\u1163\u1112\u1161\u1106\u1167\u11AB",
      "\u110B\u116B\u11AB\u110C\u1175",
      "\u110B\u116C\u1100\u1161\u11BA\u110C\u1175\u11B8",
      "\u110B\u116C\u1100\u116E\u11A8",
      "\u110B\u116C\u1105\u1169\u110B\u116E\u11B7",
      "\u110B\u116C\u1109\u1161\u11B7\u110E\u1169\u11AB",
      "\u110B\u116C\u110E\u116E\u11AF",
      "\u110B\u116C\u110E\u1175\u11B7",
      "\u110B\u116C\u1112\u1161\u11AF\u1106\u1165\u1102\u1175",
      "\u110B\u116C\u11AB\u1107\u1161\u11AF",
      "\u110B\u116C\u11AB\u1109\u1169\u11AB",
      "\u110B\u116C\u11AB\u110D\u1169\u11A8",
      "\u110B\u116D\u1100\u1173\u11B7",
      "\u110B\u116D\u110B\u1175\u11AF",
      "\u110B\u116D\u110C\u1173\u11B7",
      "\u110B\u116D\u110E\u1165\u11BC",
      "\u110B\u116D\u11BC\u1100\u1175",
      "\u110B\u116D\u11BC\u1109\u1165",
      "\u110B\u116D\u11BC\u110B\u1165",
      "\u110B\u116E\u1109\u1161\u11AB",
      "\u110B\u116E\u1109\u1165\u11AB",
      "\u110B\u116E\u1109\u1173\u11BC",
      "\u110B\u116E\u110B\u1167\u11AB\u1112\u1175",
      "\u110B\u116E\u110C\u1165\u11BC",
      "\u110B\u116E\u110E\u1166\u1100\u116E\u11A8",
      "\u110B\u116E\u1111\u1167\u11AB",
      "\u110B\u116E\u11AB\u1103\u1169\u11BC",
      "\u110B\u116E\u11AB\u1106\u1167\u11BC",
      "\u110B\u116E\u11AB\u1107\u1161\u11AB",
      "\u110B\u116E\u11AB\u110C\u1165\u11AB",
      "\u110B\u116E\u11AB\u1112\u1162\u11BC",
      "\u110B\u116E\u11AF\u1109\u1161\u11AB",
      "\u110B\u116E\u11AF\u110B\u1173\u11B7",
      "\u110B\u116E\u11B7\u110C\u1175\u11A8\u110B\u1175\u11B7",
      "\u110B\u116E\u11BA\u110B\u1165\u1105\u1173\u11AB",
      "\u110B\u116E\u11BA\u110B\u1173\u11B7",
      "\u110B\u116F\u1102\u1161\u11A8",
      "\u110B\u116F\u11AB\u1100\u1169",
      "\u110B\u116F\u11AB\u1105\u1162",
      "\u110B\u116F\u11AB\u1109\u1165",
      "\u110B\u116F\u11AB\u1109\u116E\u11BC\u110B\u1175",
      "\u110B\u116F\u11AB\u110B\u1175\u11AB",
      "\u110B\u116F\u11AB\u110C\u1161\u11BC",
      "\u110B\u116F\u11AB\u1111\u1175\u1109\u1173",
      "\u110B\u116F\u11AF\u1100\u1173\u11B8",
      "\u110B\u116F\u11AF\u1103\u1173\u110F\u1165\u11B8",
      "\u110B\u116F\u11AF\u1109\u1166",
      "\u110B\u116F\u11AF\u110B\u116D\u110B\u1175\u11AF",
      "\u110B\u1170\u110B\u1175\u1110\u1165",
      "\u110B\u1171\u1107\u1161\u11AB",
      "\u110B\u1171\u1107\u1165\u11B8",
      "\u110B\u1171\u1109\u1165\u11BC",
      "\u110B\u1171\u110B\u116F\u11AB",
      "\u110B\u1171\u1112\u1165\u11B7",
      "\u110B\u1171\u1112\u1167\u11B8",
      "\u110B\u1171\u11BA\u1109\u1161\u1105\u1161\u11B7",
      "\u110B\u1172\u1102\u1161\u11AB\u1112\u1175",
      "\u110B\u1172\u1105\u1165\u11B8",
      "\u110B\u1172\u1106\u1167\u11BC",
      "\u110B\u1172\u1106\u116E\u11AF",
      "\u110B\u1172\u1109\u1161\u11AB",
      "\u110B\u1172\u110C\u1165\u11A8",
      "\u110B\u1172\u110E\u1175\u110B\u116F\u11AB",
      "\u110B\u1172\u1112\u1161\u11A8",
      "\u110B\u1172\u1112\u1162\u11BC",
      "\u110B\u1172\u1112\u1167\u11BC",
      "\u110B\u1172\u11A8\u1100\u116E\u11AB",
      "\u110B\u1172\u11A8\u1109\u1161\u11BC",
      "\u110B\u1172\u11A8\u1109\u1175\u11B8",
      "\u110B\u1172\u11A8\u110E\u1166",
      "\u110B\u1173\u11AB\u1112\u1162\u11BC",
      "\u110B\u1173\u11B7\u1105\u1167\u11A8",
      "\u110B\u1173\u11B7\u1105\u116D",
      "\u110B\u1173\u11B7\u1107\u1161\u11AB",
      "\u110B\u1173\u11B7\u1109\u1165\u11BC",
      "\u110B\u1173\u11B7\u1109\u1175\u11A8",
      "\u110B\u1173\u11B7\u110B\u1161\u11A8",
      "\u110B\u1173\u11B7\u110C\u116E",
      "\u110B\u1174\u1100\u1167\u11AB",
      "\u110B\u1174\u1102\u1169\u11AB",
      "\u110B\u1174\u1106\u116E\u11AB",
      "\u110B\u1174\u1107\u1169\u11A8",
      "\u110B\u1174\u1109\u1175\u11A8",
      "\u110B\u1174\u1109\u1175\u11B7",
      "\u110B\u1174\u110B\u116C\u1105\u1169",
      "\u110B\u1174\u110B\u116D\u11A8",
      "\u110B\u1174\u110B\u116F\u11AB",
      "\u110B\u1174\u1112\u1161\u11A8",
      "\u110B\u1175\u1100\u1165\u11BA",
      "\u110B\u1175\u1100\u1169\u11BA",
      "\u110B\u1175\u1102\u1167\u11B7",
      "\u110B\u1175\u1102\u1169\u11B7",
      "\u110B\u1175\u1103\u1161\u11AF",
      "\u110B\u1175\u1103\u1162\u1105\u1169",
      "\u110B\u1175\u1103\u1169\u11BC",
      "\u110B\u1175\u1105\u1165\u11C2\u1100\u1166",
      "\u110B\u1175\u1105\u1167\u11A8\u1109\u1165",
      "\u110B\u1175\u1105\u1169\u11AB\u110C\u1165\u11A8",
      "\u110B\u1175\u1105\u1173\u11B7",
      "\u110B\u1175\u1106\u1175\u11AB",
      "\u110B\u1175\u1107\u1161\u11AF\u1109\u1169",
      "\u110B\u1175\u1107\u1167\u11AF",
      "\u110B\u1175\u1107\u116E\u11AF",
      "\u110B\u1175\u1108\u1161\u11AF",
      "\u110B\u1175\u1109\u1161\u11BC",
      "\u110B\u1175\u1109\u1165\u11BC",
      "\u110B\u1175\u1109\u1173\u11AF",
      "\u110B\u1175\u110B\u1163\u1100\u1175",
      "\u110B\u1175\u110B\u116D\u11BC",
      "\u110B\u1175\u110B\u116E\u11BA",
      "\u110B\u1175\u110B\u116F\u11AF",
      "\u110B\u1175\u110B\u1173\u11A8\u1100\u1169",
      "\u110B\u1175\u110B\u1175\u11A8",
      "\u110B\u1175\u110C\u1165\u11AB",
      "\u110B\u1175\u110C\u116E\u11BC",
      "\u110B\u1175\u1110\u1173\u11AE\u1102\u1161\u11AF",
      "\u110B\u1175\u1110\u1173\u11AF",
      "\u110B\u1175\u1112\u1169\u11AB",
      "\u110B\u1175\u11AB\u1100\u1161\u11AB",
      "\u110B\u1175\u11AB\u1100\u1167\u11A8",
      "\u110B\u1175\u11AB\u1100\u1169\u11BC",
      "\u110B\u1175\u11AB\u1100\u116E",
      "\u110B\u1175\u11AB\u1100\u1173\u11AB",
      "\u110B\u1175\u11AB\u1100\u1175",
      "\u110B\u1175\u11AB\u1103\u1169",
      "\u110B\u1175\u11AB\u1105\u1172",
      "\u110B\u1175\u11AB\u1106\u116E\u11AF",
      "\u110B\u1175\u11AB\u1109\u1162\u11BC",
      "\u110B\u1175\u11AB\u1109\u116B",
      "\u110B\u1175\u11AB\u110B\u1167\u11AB",
      "\u110B\u1175\u11AB\u110B\u116F\u11AB",
      "\u110B\u1175\u11AB\u110C\u1162",
      "\u110B\u1175\u11AB\u110C\u1169\u11BC",
      "\u110B\u1175\u11AB\u110E\u1165\u11AB",
      "\u110B\u1175\u11AB\u110E\u1166",
      "\u110B\u1175\u11AB\u1110\u1165\u1102\u1166\u11BA",
      "\u110B\u1175\u11AB\u1112\u1161",
      "\u110B\u1175\u11AB\u1112\u1167\u11BC",
      "\u110B\u1175\u11AF\u1100\u1169\u11B8",
      "\u110B\u1175\u11AF\u1100\u1175",
      "\u110B\u1175\u11AF\u1103\u1161\u11AB",
      "\u110B\u1175\u11AF\u1103\u1162",
      "\u110B\u1175\u11AF\u1103\u1173\u11BC",
      "\u110B\u1175\u11AF\u1107\u1161\u11AB",
      "\u110B\u1175\u11AF\u1107\u1169\u11AB",
      "\u110B\u1175\u11AF\u1107\u116E",
      "\u110B\u1175\u11AF\u1109\u1161\u11BC",
      "\u110B\u1175\u11AF\u1109\u1162\u11BC",
      "\u110B\u1175\u11AF\u1109\u1169\u11AB",
      "\u110B\u1175\u11AF\u110B\u116D\u110B\u1175\u11AF",
      "\u110B\u1175\u11AF\u110B\u116F\u11AF",
      "\u110B\u1175\u11AF\u110C\u1165\u11BC",
      "\u110B\u1175\u11AF\u110C\u1169\u11BC",
      "\u110B\u1175\u11AF\u110C\u116E\u110B\u1175\u11AF",
      "\u110B\u1175\u11AF\u110D\u1175\u11A8",
      "\u110B\u1175\u11AF\u110E\u1166",
      "\u110B\u1175\u11AF\u110E\u1175",
      "\u110B\u1175\u11AF\u1112\u1162\u11BC",
      "\u110B\u1175\u11AF\u1112\u116C\u110B\u116D\u11BC",
      "\u110B\u1175\u11B7\u1100\u1173\u11B7",
      "\u110B\u1175\u11B7\u1106\u116E",
      "\u110B\u1175\u11B8\u1103\u1162",
      "\u110B\u1175\u11B8\u1105\u1167\u11A8",
      "\u110B\u1175\u11B8\u1106\u1161\u11BA",
      "\u110B\u1175\u11B8\u1109\u1161",
      "\u110B\u1175\u11B8\u1109\u116E\u11AF",
      "\u110B\u1175\u11B8\u1109\u1175",
      "\u110B\u1175\u11B8\u110B\u116F\u11AB",
      "\u110B\u1175\u11B8\u110C\u1161\u11BC",
      "\u110B\u1175\u11B8\u1112\u1161\u11A8",
      "\u110C\u1161\u1100\u1161\u110B\u116D\u11BC",
      "\u110C\u1161\u1100\u1167\u11A8",
      "\u110C\u1161\u1100\u1173\u11A8",
      "\u110C\u1161\u1103\u1169\u11BC",
      "\u110C\u1161\u1105\u1161\u11BC",
      "\u110C\u1161\u1107\u116E\u1109\u1175\u11B7",
      "\u110C\u1161\u1109\u1175\u11A8",
      "\u110C\u1161\u1109\u1175\u11AB",
      "\u110C\u1161\u110B\u1167\u11AB",
      "\u110C\u1161\u110B\u116F\u11AB",
      "\u110C\u1161\u110B\u1172\u11AF",
      "\u110C\u1161\u110C\u1165\u11AB\u1100\u1165",
      "\u110C\u1161\u110C\u1165\u11BC",
      "\u110C\u1161\u110C\u1169\u11AB\u1109\u1175\u11B7",
      "\u110C\u1161\u1111\u1161\u11AB",
      "\u110C\u1161\u11A8\u1100\u1161",
      "\u110C\u1161\u11A8\u1102\u1167\u11AB",
      "\u110C\u1161\u11A8\u1109\u1165\u11BC",
      "\u110C\u1161\u11A8\u110B\u1165\u11B8",
      "\u110C\u1161\u11A8\u110B\u116D\u11BC",
      "\u110C\u1161\u11A8\u110B\u1173\u11AB\u1104\u1161\u11AF",
      "\u110C\u1161\u11A8\u1111\u116E\u11B7",
      "\u110C\u1161\u11AB\u1103\u1175",
      "\u110C\u1161\u11AB\u1104\u1173\u11A8",
      "\u110C\u1161\u11AB\u110E\u1175",
      "\u110C\u1161\u11AF\u1106\u1169\u11BA",
      "\u110C\u1161\u11B7\u1101\u1161\u11AB",
      "\u110C\u1161\u11B7\u1109\u116E\u1112\u1161\u11B7",
      "\u110C\u1161\u11B7\u1109\u1175",
      "\u110C\u1161\u11B7\u110B\u1169\u11BA",
      "\u110C\u1161\u11B7\u110C\u1161\u1105\u1175",
      "\u110C\u1161\u11B8\u110C\u1175",
      "\u110C\u1161\u11BC\u1100\u116A\u11AB",
      "\u110C\u1161\u11BC\u1100\u116E\u11AB",
      "\u110C\u1161\u11BC\u1100\u1175\u1100\u1161\u11AB",
      "\u110C\u1161\u11BC\u1105\u1162",
      "\u110C\u1161\u11BC\u1105\u1168",
      "\u110C\u1161\u11BC\u1105\u1173",
      "\u110C\u1161\u11BC\u1106\u1161",
      "\u110C\u1161\u11BC\u1106\u1167\u11AB",
      "\u110C\u1161\u11BC\u1106\u1169",
      "\u110C\u1161\u11BC\u1106\u1175",
      "\u110C\u1161\u11BC\u1107\u1175",
      "\u110C\u1161\u11BC\u1109\u1161",
      "\u110C\u1161\u11BC\u1109\u1169",
      "\u110C\u1161\u11BC\u1109\u1175\u11A8",
      "\u110C\u1161\u11BC\u110B\u1162\u110B\u1175\u11AB",
      "\u110C\u1161\u11BC\u110B\u1175\u11AB",
      "\u110C\u1161\u11BC\u110C\u1165\u11B7",
      "\u110C\u1161\u11BC\u110E\u1161",
      "\u110C\u1161\u11BC\u1112\u1161\u11A8\u1100\u1173\u11B7",
      "\u110C\u1162\u1102\u1173\u11BC",
      "\u110C\u1162\u1108\u1161\u11AF\u1105\u1175",
      "\u110C\u1162\u1109\u1161\u11AB",
      "\u110C\u1162\u1109\u1162\u11BC",
      "\u110C\u1162\u110C\u1161\u11A8\u1102\u1167\u11AB",
      "\u110C\u1162\u110C\u1165\u11BC",
      "\u110C\u1162\u110E\u1162\u1100\u1175",
      "\u110C\u1162\u1111\u1161\u11AB",
      "\u110C\u1162\u1112\u1161\u11A8",
      "\u110C\u1162\u1112\u116A\u11AF\u110B\u116D\u11BC",
      "\u110C\u1165\u1100\u1165\u11BA",
      "\u110C\u1165\u1100\u1169\u1105\u1175",
      "\u110C\u1165\u1100\u1169\u11BA",
      "\u110C\u1165\u1102\u1167\u11A8",
      "\u110C\u1165\u1105\u1165\u11AB",
      "\u110C\u1165\u1105\u1165\u11C2\u1100\u1166",
      "\u110C\u1165\u1107\u1165\u11AB",
      "\u110C\u1165\u110B\u116E\u11AF",
      "\u110C\u1165\u110C\u1165\u11AF\u1105\u1169",
      "\u110C\u1165\u110E\u116E\u11A8",
      "\u110C\u1165\u11A8\u1100\u1173\u11A8",
      "\u110C\u1165\u11A8\u1103\u1161\u11BC\u1112\u1175",
      "\u110C\u1165\u11A8\u1109\u1165\u11BC",
      "\u110C\u1165\u11A8\u110B\u116D\u11BC",
      "\u110C\u1165\u11A8\u110B\u1173\u11BC",
      "\u110C\u1165\u11AB\u1100\u1162",
      "\u110C\u1165\u11AB\u1100\u1169\u11BC",
      "\u110C\u1165\u11AB\u1100\u1175",
      "\u110C\u1165\u11AB\u1103\u1161\u11AF",
      "\u110C\u1165\u11AB\u1105\u1161\u1103\u1169",
      "\u110C\u1165\u11AB\u1106\u1161\u11BC",
      "\u110C\u1165\u11AB\u1106\u116E\u11AB",
      "\u110C\u1165\u11AB\u1107\u1161\u11AB",
      "\u110C\u1165\u11AB\u1107\u116E",
      "\u110C\u1165\u11AB\u1109\u1166",
      "\u110C\u1165\u11AB\u1109\u1175",
      "\u110C\u1165\u11AB\u110B\u116D\u11BC",
      "\u110C\u1165\u11AB\u110C\u1161",
      "\u110C\u1165\u11AB\u110C\u1162\u11BC",
      "\u110C\u1165\u11AB\u110C\u116E",
      "\u110C\u1165\u11AB\u110E\u1165\u11AF",
      "\u110C\u1165\u11AB\u110E\u1166",
      "\u110C\u1165\u11AB\u1110\u1169\u11BC",
      "\u110C\u1165\u11AB\u1112\u1167",
      "\u110C\u1165\u11AB\u1112\u116E",
      "\u110C\u1165\u11AF\u1103\u1162",
      "\u110C\u1165\u11AF\u1106\u1161\u11BC",
      "\u110C\u1165\u11AF\u1107\u1161\u11AB",
      "\u110C\u1165\u11AF\u110B\u1163\u11A8",
      "\u110C\u1165\u11AF\u110E\u1161",
      "\u110C\u1165\u11B7\u1100\u1165\u11B7",
      "\u110C\u1165\u11B7\u1109\u116E",
      "\u110C\u1165\u11B7\u1109\u1175\u11B7",
      "\u110C\u1165\u11B7\u110B\u116F\u11AB",
      "\u110C\u1165\u11B7\u110C\u1165\u11B7",
      "\u110C\u1165\u11B7\u110E\u1161",
      "\u110C\u1165\u11B8\u1100\u1173\u11AB",
      "\u110C\u1165\u11B8\u1109\u1175",
      "\u110C\u1165\u11B8\u110E\u1169\u11A8",
      "\u110C\u1165\u11BA\u1100\u1161\u1105\u1161\u11A8",
      "\u110C\u1165\u11BC\u1100\u1165\u110C\u1161\u11BC",
      "\u110C\u1165\u11BC\u1103\u1169",
      "\u110C\u1165\u11BC\u1105\u1172\u110C\u1161\u11BC",
      "\u110C\u1165\u11BC\u1105\u1175",
      "\u110C\u1165\u11BC\u1106\u1161\u11AF",
      "\u110C\u1165\u11BC\u1106\u1167\u11AB",
      "\u110C\u1165\u11BC\u1106\u116E\u11AB",
      "\u110C\u1165\u11BC\u1107\u1161\u11AB\u1103\u1162",
      "\u110C\u1165\u11BC\u1107\u1169",
      "\u110C\u1165\u11BC\u1107\u116E",
      "\u110C\u1165\u11BC\u1107\u1175",
      "\u110C\u1165\u11BC\u1109\u1161\u11BC",
      "\u110C\u1165\u11BC\u1109\u1165\u11BC",
      "\u110C\u1165\u11BC\u110B\u1169",
      "\u110C\u1165\u11BC\u110B\u116F\u11AB",
      "\u110C\u1165\u11BC\u110C\u1161\u11BC",
      "\u110C\u1165\u11BC\u110C\u1175",
      "\u110C\u1165\u11BC\u110E\u1175",
      "\u110C\u1165\u11BC\u1112\u116A\u11A8\u1112\u1175",
      "\u110C\u1166\u1100\u1169\u11BC",
      "\u110C\u1166\u1100\u116A\u110C\u1165\u11B7",
      "\u110C\u1166\u1103\u1162\u1105\u1169",
      "\u110C\u1166\u1106\u1169\u11A8",
      "\u110C\u1166\u1107\u1161\u11AF",
      "\u110C\u1166\u1107\u1165\u11B8",
      "\u110C\u1166\u1109\u1161\u11BA\u1102\u1161\u11AF",
      "\u110C\u1166\u110B\u1161\u11AB",
      "\u110C\u1166\u110B\u1175\u11AF",
      "\u110C\u1166\u110C\u1161\u11A8",
      "\u110C\u1166\u110C\u116E\u1103\u1169",
      "\u110C\u1166\u110E\u116E\u11AF",
      "\u110C\u1166\u1111\u116E\u11B7",
      "\u110C\u1166\u1112\u1161\u11AB",
      "\u110C\u1169\u1100\u1161\u11A8",
      "\u110C\u1169\u1100\u1165\u11AB",
      "\u110C\u1169\u1100\u1173\u11B7",
      "\u110C\u1169\u1100\u1175\u11BC",
      "\u110C\u1169\u1106\u1167\u11BC",
      "\u110C\u1169\u1106\u1175\u1105\u116D",
      "\u110C\u1169\u1109\u1161\u11BC",
      "\u110C\u1169\u1109\u1165\u11AB",
      "\u110C\u1169\u110B\u116D\u11BC\u1112\u1175",
      "\u110C\u1169\u110C\u1165\u11AF",
      "\u110C\u1169\u110C\u1165\u11BC",
      "\u110C\u1169\u110C\u1175\u11A8",
      "\u110C\u1169\u11AB\u1103\u1162\u11BA\u1106\u1161\u11AF",
      "\u110C\u1169\u11AB\u110C\u1162",
      "\u110C\u1169\u11AF\u110B\u1165\u11B8",
      "\u110C\u1169\u11AF\u110B\u1173\u11B7",
      "\u110C\u1169\u11BC\u1100\u116D",
      "\u110C\u1169\u11BC\u1105\u1169",
      "\u110C\u1169\u11BC\u1105\u1172",
      "\u110C\u1169\u11BC\u1109\u1169\u1105\u1175",
      "\u110C\u1169\u11BC\u110B\u1165\u11B8\u110B\u116F\u11AB",
      "\u110C\u1169\u11BC\u110C\u1169\u11BC",
      "\u110C\u1169\u11BC\u1112\u1161\u11B8",
      "\u110C\u116A\u1109\u1165\u11A8",
      "\u110C\u116C\u110B\u1175\u11AB",
      "\u110C\u116E\u1100\u116A\u11AB\u110C\u1165\u11A8",
      "\u110C\u116E\u1105\u1173\u11B7",
      "\u110C\u116E\u1106\u1161\u11AF",
      "\u110C\u116E\u1106\u1165\u1102\u1175",
      "\u110C\u116E\u1106\u1165\u11A8",
      "\u110C\u116E\u1106\u116E\u11AB",
      "\u110C\u116E\u1106\u1175\u11AB",
      "\u110C\u116E\u1107\u1161\u11BC",
      "\u110C\u116E\u1107\u1167\u11AB",
      "\u110C\u116E\u1109\u1175\u11A8",
      "\u110C\u116E\u110B\u1175\u11AB",
      "\u110C\u116E\u110B\u1175\u11AF",
      "\u110C\u116E\u110C\u1161\u11BC",
      "\u110C\u116E\u110C\u1165\u11AB\u110C\u1161",
      "\u110C\u116E\u1110\u1162\u11A8",
      "\u110C\u116E\u11AB\u1107\u1175",
      "\u110C\u116E\u11AF\u1100\u1165\u1105\u1175",
      "\u110C\u116E\u11AF\u1100\u1175",
      "\u110C\u116E\u11AF\u1106\u116E\u1102\u1174",
      "\u110C\u116E\u11BC\u1100\u1161\u11AB",
      "\u110C\u116E\u11BC\u1100\u1168\u1107\u1161\u11BC\u1109\u1169\u11BC",
      "\u110C\u116E\u11BC\u1100\u116E\u11A8",
      "\u110C\u116E\u11BC\u1102\u1167\u11AB",
      "\u110C\u116E\u11BC\u1103\u1161\u11AB",
      "\u110C\u116E\u11BC\u1103\u1169\u11A8",
      "\u110C\u116E\u11BC\u1107\u1161\u11AB",
      "\u110C\u116E\u11BC\u1107\u116E",
      "\u110C\u116E\u11BC\u1109\u1166",
      "\u110C\u116E\u11BC\u1109\u1169\u1100\u1175\u110B\u1165\u11B8",
      "\u110C\u116E\u11BC\u1109\u116E\u11AB",
      "\u110C\u116E\u11BC\u110B\u1161\u11BC",
      "\u110C\u116E\u11BC\u110B\u116D",
      "\u110C\u116E\u11BC\u1112\u1161\u11A8\u1100\u116D",
      "\u110C\u1173\u11A8\u1109\u1165\u11A8",
      "\u110C\u1173\u11A8\u1109\u1175",
      "\u110C\u1173\u11AF\u1100\u1165\u110B\u116E\u11B7",
      "\u110C\u1173\u11BC\u1100\u1161",
      "\u110C\u1173\u11BC\u1100\u1165",
      "\u110C\u1173\u11BC\u1100\u116F\u11AB",
      "\u110C\u1173\u11BC\u1109\u1161\u11BC",
      "\u110C\u1173\u11BC\u1109\u1166",
      "\u110C\u1175\u1100\u1161\u11A8",
      "\u110C\u1175\u1100\u1161\u11B8",
      "\u110C\u1175\u1100\u1167\u11BC",
      "\u110C\u1175\u1100\u1173\u11A8\u1112\u1175",
      "\u110C\u1175\u1100\u1173\u11B7",
      "\u110C\u1175\u1100\u1173\u11B8",
      "\u110C\u1175\u1102\u1173\u11BC",
      "\u110C\u1175\u1105\u1173\u11B7\u1100\u1175\u11AF",
      "\u110C\u1175\u1105\u1175\u1109\u1161\u11AB",
      "\u110C\u1175\u1107\u1161\u11BC",
      "\u110C\u1175\u1107\u116E\u11BC",
      "\u110C\u1175\u1109\u1175\u11A8",
      "\u110C\u1175\u110B\u1167\u11A8",
      "\u110C\u1175\u110B\u116E\u1100\u1162",
      "\u110C\u1175\u110B\u116F\u11AB",
      "\u110C\u1175\u110C\u1165\u11A8",
      "\u110C\u1175\u110C\u1165\u11B7",
      "\u110C\u1175\u110C\u1175\u11AB",
      "\u110C\u1175\u110E\u116E\u11AF",
      "\u110C\u1175\u11A8\u1109\u1165\u11AB",
      "\u110C\u1175\u11A8\u110B\u1165\u11B8",
      "\u110C\u1175\u11A8\u110B\u116F\u11AB",
      "\u110C\u1175\u11A8\u110C\u1161\u11BC",
      "\u110C\u1175\u11AB\u1100\u1173\u11B8",
      "\u110C\u1175\u11AB\u1103\u1169\u11BC",
      "\u110C\u1175\u11AB\u1105\u1169",
      "\u110C\u1175\u11AB\u1105\u116D",
      "\u110C\u1175\u11AB\u1105\u1175",
      "\u110C\u1175\u11AB\u110D\u1161",
      "\u110C\u1175\u11AB\u110E\u1161\u11AF",
      "\u110C\u1175\u11AB\u110E\u116E\u11AF",
      "\u110C\u1175\u11AB\u1110\u1169\u11BC",
      "\u110C\u1175\u11AB\u1112\u1162\u11BC",
      "\u110C\u1175\u11AF\u1106\u116E\u11AB",
      "\u110C\u1175\u11AF\u1107\u1167\u11BC",
      "\u110C\u1175\u11AF\u1109\u1165",
      "\u110C\u1175\u11B7\u110C\u1161\u11A8",
      "\u110C\u1175\u11B8\u1103\u1161\u11AB",
      "\u110C\u1175\u11B8\u110B\u1161\u11AB",
      "\u110C\u1175\u11B8\u110C\u116E\u11BC",
      "\u110D\u1161\u110C\u1173\u11BC",
      "\u110D\u1175\u1101\u1165\u1100\u1175",
      "\u110E\u1161\u1102\u1161\u11B7",
      "\u110E\u1161\u1105\u1161\u1105\u1175",
      "\u110E\u1161\u1105\u1163\u11BC",
      "\u110E\u1161\u1105\u1175\u11B7",
      "\u110E\u1161\u1107\u1167\u11AF",
      "\u110E\u1161\u1109\u1165\u11AB",
      "\u110E\u1161\u110E\u1173\u11B7",
      "\u110E\u1161\u11A8\u1100\u1161\u11A8",
      "\u110E\u1161\u11AB\u1106\u116E\u11AF",
      "\u110E\u1161\u11AB\u1109\u1165\u11BC",
      "\u110E\u1161\u11B7\u1100\u1161",
      "\u110E\u1161\u11B7\u1100\u1175\u1105\u1173\u11B7",
      "\u110E\u1161\u11B7\u1109\u1162",
      "\u110E\u1161\u11B7\u1109\u1165\u11A8",
      "\u110E\u1161\u11B7\u110B\u1167",
      "\u110E\u1161\u11B7\u110B\u116C",
      "\u110E\u1161\u11B7\u110C\u1169",
      "\u110E\u1161\u11BA\u110C\u1161\u11AB",
      "\u110E\u1161\u11BC\u1100\u1161",
      "\u110E\u1161\u11BC\u1100\u1169",
      "\u110E\u1161\u11BC\u1100\u116E",
      "\u110E\u1161\u11BC\u1106\u116E\u11AB",
      "\u110E\u1161\u11BC\u1107\u1161\u11A9",
      "\u110E\u1161\u11BC\u110C\u1161\u11A8",
      "\u110E\u1161\u11BC\u110C\u1169",
      "\u110E\u1162\u1102\u1165\u11AF",
      "\u110E\u1162\u110C\u1165\u11B7",
      "\u110E\u1162\u11A8\u1100\u1161\u1107\u1161\u11BC",
      "\u110E\u1162\u11A8\u1107\u1161\u11BC",
      "\u110E\u1162\u11A8\u1109\u1161\u11BC",
      "\u110E\u1162\u11A8\u110B\u1175\u11B7",
      "\u110E\u1162\u11B7\u1111\u1175\u110B\u1165\u11AB",
      "\u110E\u1165\u1107\u1165\u11AF",
      "\u110E\u1165\u110B\u1173\u11B7",
      "\u110E\u1165\u11AB\u1100\u116E\u11A8",
      "\u110E\u1165\u11AB\u1103\u116E\u11BC",
      "\u110E\u1165\u11AB\u110C\u1161\u11BC",
      "\u110E\u1165\u11AB\u110C\u1162",
      "\u110E\u1165\u11AB\u110E\u1165\u11AB\u1112\u1175",
      "\u110E\u1165\u11AF\u1103\u1169",
      "\u110E\u1165\u11AF\u110C\u1165\u1112\u1175",
      "\u110E\u1165\u11AF\u1112\u1161\u11A8",
      "\u110E\u1165\u11BA\u1102\u1161\u11AF",
      "\u110E\u1165\u11BA\u110D\u1162",
      "\u110E\u1165\u11BC\u1102\u1167\u11AB",
      "\u110E\u1165\u11BC\u1107\u1161\u110C\u1175",
      "\u110E\u1165\u11BC\u1109\u1169",
      "\u110E\u1165\u11BC\u110E\u116E\u11AB",
      "\u110E\u1166\u1100\u1168",
      "\u110E\u1166\u1105\u1167\u11A8",
      "\u110E\u1166\u110B\u1169\u11AB",
      "\u110E\u1166\u110B\u1172\u11A8",
      "\u110E\u1166\u110C\u116E\u11BC",
      "\u110E\u1166\u1112\u1165\u11B7",
      "\u110E\u1169\u1103\u1173\u11BC\u1112\u1161\u11A8\u1109\u1162\u11BC",
      "\u110E\u1169\u1107\u1161\u11AB",
      "\u110E\u1169\u1107\u1161\u11B8",
      "\u110E\u1169\u1109\u1161\u11BC\u1112\u116A",
      "\u110E\u1169\u1109\u116E\u11AB",
      "\u110E\u1169\u110B\u1167\u1105\u1173\u11B7",
      "\u110E\u1169\u110B\u116F\u11AB",
      "\u110E\u1169\u110C\u1165\u1102\u1167\u11A8",
      "\u110E\u1169\u110C\u1165\u11B7",
      "\u110E\u1169\u110E\u1165\u11BC",
      "\u110E\u1169\u110F\u1169\u11AF\u1105\u1175\u11BA",
      "\u110E\u1169\u11BA\u1107\u116E\u11AF",
      "\u110E\u1169\u11BC\u1100\u1161\u11A8",
      "\u110E\u1169\u11BC\u1105\u1175",
      "\u110E\u1169\u11BC\u110C\u1161\u11BC",
      "\u110E\u116A\u11AF\u110B\u1167\u11BC",
      "\u110E\u116C\u1100\u1173\u11AB",
      "\u110E\u116C\u1109\u1161\u11BC",
      "\u110E\u116C\u1109\u1165\u11AB",
      "\u110E\u116C\u1109\u1175\u11AB",
      "\u110E\u116C\u110B\u1161\u11A8",
      "\u110E\u116C\u110C\u1169\u11BC",
      "\u110E\u116E\u1109\u1165\u11A8",
      "\u110E\u116E\u110B\u1165\u11A8",
      "\u110E\u116E\u110C\u1175\u11AB",
      "\u110E\u116E\u110E\u1165\u11AB",
      "\u110E\u116E\u110E\u1173\u11A8",
      "\u110E\u116E\u11A8\u1100\u116E",
      "\u110E\u116E\u11A8\u1109\u1169",
      "\u110E\u116E\u11A8\u110C\u1166",
      "\u110E\u116E\u11A8\u1112\u1161",
      "\u110E\u116E\u11AF\u1100\u1173\u11AB",
      "\u110E\u116E\u11AF\u1107\u1161\u11AF",
      "\u110E\u116E\u11AF\u1109\u1161\u11AB",
      "\u110E\u116E\u11AF\u1109\u1175\u11AB",
      "\u110E\u116E\u11AF\u110B\u1167\u11AB",
      "\u110E\u116E\u11AF\u110B\u1175\u11B8",
      "\u110E\u116E\u11AF\u110C\u1161\u11BC",
      "\u110E\u116E\u11AF\u1111\u1161\u11AB",
      "\u110E\u116E\u11BC\u1100\u1167\u11A8",
      "\u110E\u116E\u11BC\u1100\u1169",
      "\u110E\u116E\u11BC\u1103\u1169\u11AF",
      "\u110E\u116E\u11BC\u1107\u116E\u11AB\u1112\u1175",
      "\u110E\u116E\u11BC\u110E\u1165\u11BC\u1103\u1169",
      "\u110E\u1171\u110B\u1165\u11B8",
      "\u110E\u1171\u110C\u1175\u11A8",
      "\u110E\u1171\u1112\u1163\u11BC",
      "\u110E\u1175\u110B\u1163\u11A8",
      "\u110E\u1175\u11AB\u1100\u116E",
      "\u110E\u1175\u11AB\u110E\u1165\u11A8",
      "\u110E\u1175\u11AF\u1109\u1175\u11B8",
      "\u110E\u1175\u11AF\u110B\u116F\u11AF",
      "\u110E\u1175\u11AF\u1111\u1161\u11AB",
      "\u110E\u1175\u11B7\u1103\u1162",
      "\u110E\u1175\u11B7\u1106\u116E\u11A8",
      "\u110E\u1175\u11B7\u1109\u1175\u11AF",
      "\u110E\u1175\u11BA\u1109\u1169\u11AF",
      "\u110E\u1175\u11BC\u110E\u1161\u11AB",
      "\u110F\u1161\u1106\u1166\u1105\u1161",
      "\u110F\u1161\u110B\u116E\u11AB\u1110\u1165",
      "\u110F\u1161\u11AF\u1100\u116E\u11A8\u1109\u116E",
      "\u110F\u1162\u1105\u1175\u11A8\u1110\u1165",
      "\u110F\u1162\u11B7\u1111\u1165\u1109\u1173",
      "\u110F\u1162\u11B7\u1111\u1166\u110B\u1175\u11AB",
      "\u110F\u1165\u1110\u1173\u11AB",
      "\u110F\u1165\u11AB\u1103\u1175\u1109\u1167\u11AB",
      "\u110F\u1165\u11AF\u1105\u1165",
      "\u110F\u1165\u11B7\u1111\u1172\u1110\u1165",
      "\u110F\u1169\u1101\u1175\u1105\u1175",
      "\u110F\u1169\u1106\u1175\u1103\u1175",
      "\u110F\u1169\u11AB\u1109\u1165\u1110\u1173",
      "\u110F\u1169\u11AF\u1105\u1161",
      "\u110F\u1169\u11B7\u1111\u1173\u11AF\u1105\u1166\u11A8\u1109\u1173",
      "\u110F\u1169\u11BC\u1102\u1161\u1106\u116E\u11AF",
      "\u110F\u116B\u1100\u1161\u11B7",
      "\u110F\u116E\u1103\u1166\u1110\u1161",
      "\u110F\u1173\u1105\u1175\u11B7",
      "\u110F\u1173\u11AB\u1100\u1175\u11AF",
      "\u110F\u1173\u11AB\u1104\u1161\u11AF",
      "\u110F\u1173\u11AB\u1109\u1169\u1105\u1175",
      "\u110F\u1173\u11AB\u110B\u1161\u1103\u1173\u11AF",
      "\u110F\u1173\u11AB\u110B\u1165\u1106\u1165\u1102\u1175",
      "\u110F\u1173\u11AB\u110B\u1175\u11AF",
      "\u110F\u1173\u11AB\u110C\u1165\u11AF",
      "\u110F\u1173\u11AF\u1105\u1162\u1109\u1175\u11A8",
      "\u110F\u1173\u11AF\u1105\u1165\u11B8",
      "\u110F\u1175\u11AF\u1105\u1169",
      "\u1110\u1161\u110B\u1175\u11B8",
      "\u1110\u1161\u110C\u1161\u1100\u1175",
      "\u1110\u1161\u11A8\u1100\u116E",
      "\u1110\u1161\u11A8\u110C\u1161",
      "\u1110\u1161\u11AB\u1109\u1162\u11BC",
      "\u1110\u1162\u1100\u116F\u11AB\u1103\u1169",
      "\u1110\u1162\u110B\u1163\u11BC",
      "\u1110\u1162\u1111\u116E\u11BC",
      "\u1110\u1162\u11A8\u1109\u1175",
      "\u1110\u1162\u11AF\u1105\u1165\u11AB\u1110\u1173",
      "\u1110\u1165\u1102\u1165\u11AF",
      "\u1110\u1165\u1106\u1175\u1102\u1165\u11AF",
      "\u1110\u1166\u1102\u1175\u1109\u1173",
      "\u1110\u1166\u1109\u1173\u1110\u1173",
      "\u1110\u1166\u110B\u1175\u1107\u1173\u11AF",
      "\u1110\u1166\u11AF\u1105\u1166\u1107\u1175\u110C\u1165\u11AB",
      "\u1110\u1169\u1105\u1169\u11AB",
      "\u1110\u1169\u1106\u1161\u1110\u1169",
      "\u1110\u1169\u110B\u116D\u110B\u1175\u11AF",
      "\u1110\u1169\u11BC\u1100\u1168",
      "\u1110\u1169\u11BC\u1100\u116A",
      "\u1110\u1169\u11BC\u1105\u1169",
      "\u1110\u1169\u11BC\u1109\u1175\u11AB",
      "\u1110\u1169\u11BC\u110B\u1167\u11A8",
      "\u1110\u1169\u11BC\u110B\u1175\u11AF",
      "\u1110\u1169\u11BC\u110C\u1161\u11BC",
      "\u1110\u1169\u11BC\u110C\u1166",
      "\u1110\u1169\u11BC\u110C\u1173\u11BC",
      "\u1110\u1169\u11BC\u1112\u1161\u11B8",
      "\u1110\u1169\u11BC\u1112\u116A",
      "\u1110\u116C\u1100\u1173\u11AB",
      "\u1110\u116C\u110B\u116F\u11AB",
      "\u1110\u116C\u110C\u1175\u11A8\u1100\u1173\u11B7",
      "\u1110\u1171\u1100\u1175\u11B7",
      "\u1110\u1173\u1105\u1165\u11A8",
      "\u1110\u1173\u11A8\u1100\u1173\u11B8",
      "\u1110\u1173\u11A8\u1107\u1167\u11AF",
      "\u1110\u1173\u11A8\u1109\u1165\u11BC",
      "\u1110\u1173\u11A8\u1109\u116E",
      "\u1110\u1173\u11A8\u110C\u1175\u11BC",
      "\u1110\u1173\u11A8\u1112\u1175",
      "\u1110\u1173\u11AB\u1110\u1173\u11AB\u1112\u1175",
      "\u1110\u1175\u1109\u1167\u110E\u1173",
      "\u1111\u1161\u1105\u1161\u11AB\u1109\u1162\u11A8",
      "\u1111\u1161\u110B\u1175\u11AF",
      "\u1111\u1161\u110E\u116E\u11AF\u1109\u1169",
      "\u1111\u1161\u11AB\u1100\u1167\u11AF",
      "\u1111\u1161\u11AB\u1103\u1161\u11AB",
      "\u1111\u1161\u11AB\u1106\u1162",
      "\u1111\u1161\u11AB\u1109\u1161",
      "\u1111\u1161\u11AF\u1109\u1175\u11B8",
      "\u1111\u1161\u11AF\u110B\u116F\u11AF",
      "\u1111\u1161\u11B8\u1109\u1169\u11BC",
      "\u1111\u1162\u1109\u1167\u11AB",
      "\u1111\u1162\u11A8\u1109\u1173",
      "\u1111\u1162\u11A8\u1109\u1175\u1106\u1175\u11AF\u1105\u1175",
      "\u1111\u1162\u11AB\u1110\u1175",
      "\u1111\u1165\u1109\u1166\u11AB\u1110\u1173",
      "\u1111\u1166\u110B\u1175\u11AB\u1110\u1173",
      "\u1111\u1167\u11AB\u1100\u1167\u11AB",
      "\u1111\u1167\u11AB\u110B\u1174",
      "\u1111\u1167\u11AB\u110C\u1175",
      "\u1111\u1167\u11AB\u1112\u1175",
      "\u1111\u1167\u11BC\u1100\u1161",
      "\u1111\u1167\u11BC\u1100\u1172\u11AB",
      "\u1111\u1167\u11BC\u1109\u1162\u11BC",
      "\u1111\u1167\u11BC\u1109\u1169",
      "\u1111\u1167\u11BC\u110B\u1163\u11BC",
      "\u1111\u1167\u11BC\u110B\u1175\u11AF",
      "\u1111\u1167\u11BC\u1112\u116A",
      "\u1111\u1169\u1109\u1173\u1110\u1165",
      "\u1111\u1169\u110B\u1175\u11AB\u1110\u1173",
      "\u1111\u1169\u110C\u1161\u11BC",
      "\u1111\u1169\u1112\u1161\u11B7",
      "\u1111\u116D\u1106\u1167\u11AB",
      "\u1111\u116D\u110C\u1165\u11BC",
      "\u1111\u116D\u110C\u116E\u11AB",
      "\u1111\u116D\u1112\u1167\u11AB",
      "\u1111\u116E\u11B7\u1106\u1169\u11A8",
      "\u1111\u116E\u11B7\u110C\u1175\u11AF",
      "\u1111\u116E\u11BC\u1100\u1167\u11BC",
      "\u1111\u116E\u11BC\u1109\u1169\u11A8",
      "\u1111\u116E\u11BC\u1109\u1173\u11B8",
      "\u1111\u1173\u1105\u1161\u11BC\u1109\u1173",
      "\u1111\u1173\u1105\u1175\u11AB\u1110\u1165",
      "\u1111\u1173\u11AF\u1105\u1161\u1109\u1173\u1110\u1175\u11A8",
      "\u1111\u1175\u1100\u1169\u11AB",
      "\u1111\u1175\u1106\u1161\u11BC",
      "\u1111\u1175\u110B\u1161\u1102\u1169",
      "\u1111\u1175\u11AF\u1105\u1173\u11B7",
      "\u1111\u1175\u11AF\u1109\u116E",
      "\u1111\u1175\u11AF\u110B\u116D",
      "\u1111\u1175\u11AF\u110C\u1161",
      "\u1111\u1175\u11AF\u1110\u1169\u11BC",
      "\u1111\u1175\u11BC\u1100\u1168",
      "\u1112\u1161\u1102\u1173\u1102\u1175\u11B7",
      "\u1112\u1161\u1102\u1173\u11AF",
      "\u1112\u1161\u1103\u1173\u110B\u1170\u110B\u1165",
      "\u1112\u1161\u1105\u116E\u11BA\u1107\u1161\u11B7",
      "\u1112\u1161\u1107\u1161\u11AB\u1100\u1175",
      "\u1112\u1161\u1109\u116E\u11A8\u110C\u1175\u11B8",
      "\u1112\u1161\u1109\u116E\u11AB",
      "\u1112\u1161\u110B\u1167\u1110\u1173\u11AB",
      "\u1112\u1161\u110C\u1175\u1106\u1161\u11AB",
      "\u1112\u1161\u110E\u1165\u11AB",
      "\u1112\u1161\u1111\u116E\u11B7",
      "\u1112\u1161\u1111\u1175\u11AF",
      "\u1112\u1161\u11A8\u1100\u116A",
      "\u1112\u1161\u11A8\u1100\u116D",
      "\u1112\u1161\u11A8\u1100\u1173\u11B8",
      "\u1112\u1161\u11A8\u1100\u1175",
      "\u1112\u1161\u11A8\u1102\u1167\u11AB",
      "\u1112\u1161\u11A8\u1105\u1167\u11A8",
      "\u1112\u1161\u11A8\u1107\u1165\u11AB",
      "\u1112\u1161\u11A8\u1107\u116E\u1106\u1169",
      "\u1112\u1161\u11A8\u1107\u1175",
      "\u1112\u1161\u11A8\u1109\u1162\u11BC",
      "\u1112\u1161\u11A8\u1109\u116E\u11AF",
      "\u1112\u1161\u11A8\u1109\u1173\u11B8",
      "\u1112\u1161\u11A8\u110B\u116D\u11BC\u1111\u116E\u11B7",
      "\u1112\u1161\u11A8\u110B\u116F\u11AB",
      "\u1112\u1161\u11A8\u110B\u1171",
      "\u1112\u1161\u11A8\u110C\u1161",
      "\u1112\u1161\u11A8\u110C\u1165\u11B7",
      "\u1112\u1161\u11AB\u1100\u1168",
      "\u1112\u1161\u11AB\u1100\u1173\u11AF",
      "\u1112\u1161\u11AB\u1101\u1165\u1107\u1165\u11AB\u110B\u1166",
      "\u1112\u1161\u11AB\u1102\u1161\u11BD",
      "\u1112\u1161\u11AB\u1102\u116E\u11AB",
      "\u1112\u1161\u11AB\u1103\u1169\u11BC\u110B\u1161\u11AB",
      "\u1112\u1161\u11AB\u1104\u1162",
      "\u1112\u1161\u11AB\u1105\u1161\u1109\u1161\u11AB",
      "\u1112\u1161\u11AB\u1106\u1161\u1103\u1175",
      "\u1112\u1161\u11AB\u1106\u116E\u11AB",
      "\u1112\u1161\u11AB\u1107\u1165\u11AB",
      "\u1112\u1161\u11AB\u1107\u1169\u11A8",
      "\u1112\u1161\u11AB\u1109\u1175\u11A8",
      "\u1112\u1161\u11AB\u110B\u1167\u1105\u1173\u11B7",
      "\u1112\u1161\u11AB\u110D\u1169\u11A8",
      "\u1112\u1161\u11AF\u1106\u1165\u1102\u1175",
      "\u1112\u1161\u11AF\u110B\u1161\u1107\u1165\u110C\u1175",
      "\u1112\u1161\u11AF\u110B\u1175\u11AB",
      "\u1112\u1161\u11B7\u1101\u1166",
      "\u1112\u1161\u11B7\u1107\u116E\u1105\u1169",
      "\u1112\u1161\u11B8\u1100\u1167\u11A8",
      "\u1112\u1161\u11B8\u1105\u1175\u110C\u1165\u11A8",
      "\u1112\u1161\u11BC\u1100\u1169\u11BC",
      "\u1112\u1161\u11BC\u1100\u116E",
      "\u1112\u1161\u11BC\u1109\u1161\u11BC",
      "\u1112\u1161\u11BC\u110B\u1174",
      "\u1112\u1162\u1100\u1167\u11AF",
      "\u1112\u1162\u1100\u116E\u11AB",
      "\u1112\u1162\u1103\u1161\u11B8",
      "\u1112\u1162\u1103\u1161\u11BC",
      "\u1112\u1162\u1106\u116E\u11AF",
      "\u1112\u1162\u1109\u1165\u11A8",
      "\u1112\u1162\u1109\u1165\u11AF",
      "\u1112\u1162\u1109\u116E\u110B\u116D\u11A8\u110C\u1161\u11BC",
      "\u1112\u1162\u110B\u1161\u11AB",
      "\u1112\u1162\u11A8\u1109\u1175\u11B7",
      "\u1112\u1162\u11AB\u1103\u1173\u1107\u1162\u11A8",
      "\u1112\u1162\u11B7\u1107\u1165\u1100\u1165",
      "\u1112\u1162\u11BA\u1107\u1167\u11C0",
      "\u1112\u1162\u11BA\u1109\u1161\u11AF",
      "\u1112\u1162\u11BC\u1103\u1169\u11BC",
      "\u1112\u1162\u11BC\u1107\u1169\u11A8",
      "\u1112\u1162\u11BC\u1109\u1161",
      "\u1112\u1162\u11BC\u110B\u116E\u11AB",
      "\u1112\u1162\u11BC\u110B\u1171",
      "\u1112\u1163\u11BC\u1100\u1175",
      "\u1112\u1163\u11BC\u1109\u1161\u11BC",
      "\u1112\u1163\u11BC\u1109\u116E",
      "\u1112\u1165\u1105\u1161\u11A8",
      "\u1112\u1165\u110B\u116D\u11BC",
      "\u1112\u1166\u11AF\u1100\u1175",
      "\u1112\u1167\u11AB\u1100\u116A\u11AB",
      "\u1112\u1167\u11AB\u1100\u1173\u11B7",
      "\u1112\u1167\u11AB\u1103\u1162",
      "\u1112\u1167\u11AB\u1109\u1161\u11BC",
      "\u1112\u1167\u11AB\u1109\u1175\u11AF",
      "\u1112\u1167\u11AB\u110C\u1161\u11BC",
      "\u1112\u1167\u11AB\u110C\u1162",
      "\u1112\u1167\u11AB\u110C\u1175",
      "\u1112\u1167\u11AF\u110B\u1162\u11A8",
      "\u1112\u1167\u11B8\u1105\u1167\u11A8",
      "\u1112\u1167\u11BC\u1107\u116E",
      "\u1112\u1167\u11BC\u1109\u1161",
      "\u1112\u1167\u11BC\u1109\u116E",
      "\u1112\u1167\u11BC\u1109\u1175\u11A8",
      "\u1112\u1167\u11BC\u110C\u1166",
      "\u1112\u1167\u11BC\u1110\u1162",
      "\u1112\u1167\u11BC\u1111\u1167\u11AB",
      "\u1112\u1168\u1110\u1162\u11A8",
      "\u1112\u1169\u1100\u1175\u1109\u1175\u11B7",
      "\u1112\u1169\u1102\u1161\u11B7",
      "\u1112\u1169\u1105\u1161\u11BC\u110B\u1175",
      "\u1112\u1169\u1107\u1161\u11A8",
      "\u1112\u1169\u1110\u1166\u11AF",
      "\u1112\u1169\u1112\u1173\u11B8",
      "\u1112\u1169\u11A8\u1109\u1175",
      "\u1112\u1169\u11AF\u1105\u1169",
      "\u1112\u1169\u11B7\u1111\u1166\u110B\u1175\u110C\u1175",
      "\u1112\u1169\u11BC\u1107\u1169",
      "\u1112\u1169\u11BC\u1109\u116E",
      "\u1112\u1169\u11BC\u110E\u1161",
      "\u1112\u116A\u1106\u1167\u11AB",
      "\u1112\u116A\u1107\u116E\u11AB",
      "\u1112\u116A\u1109\u1161\u11AF",
      "\u1112\u116A\u110B\u116D\u110B\u1175\u11AF",
      "\u1112\u116A\u110C\u1161\u11BC",
      "\u1112\u116A\u1112\u1161\u11A8",
      "\u1112\u116A\u11A8\u1107\u1169",
      "\u1112\u116A\u11A8\u110B\u1175\u11AB",
      "\u1112\u116A\u11A8\u110C\u1161\u11BC",
      "\u1112\u116A\u11A8\u110C\u1165\u11BC",
      "\u1112\u116A\u11AB\u1100\u1161\u11B8",
      "\u1112\u116A\u11AB\u1100\u1167\u11BC",
      "\u1112\u116A\u11AB\u110B\u1167\u11BC",
      "\u1112\u116A\u11AB\u110B\u1172\u11AF",
      "\u1112\u116A\u11AB\u110C\u1161",
      "\u1112\u116A\u11AF\u1100\u1175",
      "\u1112\u116A\u11AF\u1103\u1169\u11BC",
      "\u1112\u116A\u11AF\u1107\u1161\u11AF\u1112\u1175",
      "\u1112\u116A\u11AF\u110B\u116D\u11BC",
      "\u1112\u116A\u11AF\u110D\u1161\u11A8",
      "\u1112\u116C\u1100\u1167\u11AB",
      "\u1112\u116C\u1100\u116A\u11AB",
      "\u1112\u116C\u1107\u1169\u11A8",
      "\u1112\u116C\u1109\u1162\u11A8",
      "\u1112\u116C\u110B\u116F\u11AB",
      "\u1112\u116C\u110C\u1161\u11BC",
      "\u1112\u116C\u110C\u1165\u11AB",
      "\u1112\u116C\u11BA\u1109\u116E",
      "\u1112\u116C\u11BC\u1103\u1161\u11AB\u1107\u1169\u1103\u1169",
      "\u1112\u116D\u110B\u1172\u11AF\u110C\u1165\u11A8",
      "\u1112\u116E\u1107\u1161\u11AB",
      "\u1112\u116E\u110E\u116E\u11BA\u1100\u1161\u1105\u116E",
      "\u1112\u116E\u11AB\u1105\u1167\u11AB",
      "\u1112\u116F\u11AF\u110A\u1175\u11AB",
      "\u1112\u1172\u1109\u1175\u11A8",
      "\u1112\u1172\u110B\u1175\u11AF",
      "\u1112\u1172\u11BC\u1102\u1162",
      "\u1112\u1173\u1105\u1173\u11B7",
      "\u1112\u1173\u11A8\u1107\u1162\u11A8",
      "\u1112\u1173\u11A8\u110B\u1175\u11AB",
      "\u1112\u1173\u11AB\u110C\u1165\u11A8",
      "\u1112\u1173\u11AB\u1112\u1175",
      "\u1112\u1173\u11BC\u1106\u1175",
      "\u1112\u1173\u11BC\u1107\u116E\u11AB",
      "\u1112\u1174\u1100\u1169\u11A8",
      "\u1112\u1174\u1106\u1161\u11BC",
      "\u1112\u1174\u1109\u1162\u11BC",
      "\u1112\u1174\u11AB\u1109\u1162\u11A8",
      "\u1112\u1175\u11B7\u1101\u1165\u11BA"
    ];
  }
});

// node_modules/bip39/src/wordlists/french.json
var require_french = __commonJS({
  "node_modules/bip39/src/wordlists/french.json"(exports, module2) {
    module2.exports = [
      "abaisser",
      "abandon",
      "abdiquer",
      "abeille",
      "abolir",
      "aborder",
      "aboutir",
      "aboyer",
      "abrasif",
      "abreuver",
      "abriter",
      "abroger",
      "abrupt",
      "absence",
      "absolu",
      "absurde",
      "abusif",
      "abyssal",
      "acade\u0301mie",
      "acajou",
      "acarien",
      "accabler",
      "accepter",
      "acclamer",
      "accolade",
      "accroche",
      "accuser",
      "acerbe",
      "achat",
      "acheter",
      "aciduler",
      "acier",
      "acompte",
      "acque\u0301rir",
      "acronyme",
      "acteur",
      "actif",
      "actuel",
      "adepte",
      "ade\u0301quat",
      "adhe\u0301sif",
      "adjectif",
      "adjuger",
      "admettre",
      "admirer",
      "adopter",
      "adorer",
      "adoucir",
      "adresse",
      "adroit",
      "adulte",
      "adverbe",
      "ae\u0301rer",
      "ae\u0301ronef",
      "affaire",
      "affecter",
      "affiche",
      "affreux",
      "affubler",
      "agacer",
      "agencer",
      "agile",
      "agiter",
      "agrafer",
      "agre\u0301able",
      "agrume",
      "aider",
      "aiguille",
      "ailier",
      "aimable",
      "aisance",
      "ajouter",
      "ajuster",
      "alarmer",
      "alchimie",
      "alerte",
      "alge\u0300bre",
      "algue",
      "alie\u0301ner",
      "aliment",
      "alle\u0301ger",
      "alliage",
      "allouer",
      "allumer",
      "alourdir",
      "alpaga",
      "altesse",
      "alve\u0301ole",
      "amateur",
      "ambigu",
      "ambre",
      "ame\u0301nager",
      "amertume",
      "amidon",
      "amiral",
      "amorcer",
      "amour",
      "amovible",
      "amphibie",
      "ampleur",
      "amusant",
      "analyse",
      "anaphore",
      "anarchie",
      "anatomie",
      "ancien",
      "ane\u0301antir",
      "angle",
      "angoisse",
      "anguleux",
      "animal",
      "annexer",
      "annonce",
      "annuel",
      "anodin",
      "anomalie",
      "anonyme",
      "anormal",
      "antenne",
      "antidote",
      "anxieux",
      "apaiser",
      "ape\u0301ritif",
      "aplanir",
      "apologie",
      "appareil",
      "appeler",
      "apporter",
      "appuyer",
      "aquarium",
      "aqueduc",
      "arbitre",
      "arbuste",
      "ardeur",
      "ardoise",
      "argent",
      "arlequin",
      "armature",
      "armement",
      "armoire",
      "armure",
      "arpenter",
      "arracher",
      "arriver",
      "arroser",
      "arsenic",
      "arte\u0301riel",
      "article",
      "aspect",
      "asphalte",
      "aspirer",
      "assaut",
      "asservir",
      "assiette",
      "associer",
      "assurer",
      "asticot",
      "astre",
      "astuce",
      "atelier",
      "atome",
      "atrium",
      "atroce",
      "attaque",
      "attentif",
      "attirer",
      "attraper",
      "aubaine",
      "auberge",
      "audace",
      "audible",
      "augurer",
      "aurore",
      "automne",
      "autruche",
      "avaler",
      "avancer",
      "avarice",
      "avenir",
      "averse",
      "aveugle",
      "aviateur",
      "avide",
      "avion",
      "aviser",
      "avoine",
      "avouer",
      "avril",
      "axial",
      "axiome",
      "badge",
      "bafouer",
      "bagage",
      "baguette",
      "baignade",
      "balancer",
      "balcon",
      "baleine",
      "balisage",
      "bambin",
      "bancaire",
      "bandage",
      "banlieue",
      "bannie\u0300re",
      "banquier",
      "barbier",
      "baril",
      "baron",
      "barque",
      "barrage",
      "bassin",
      "bastion",
      "bataille",
      "bateau",
      "batterie",
      "baudrier",
      "bavarder",
      "belette",
      "be\u0301lier",
      "belote",
      "be\u0301ne\u0301fice",
      "berceau",
      "berger",
      "berline",
      "bermuda",
      "besace",
      "besogne",
      "be\u0301tail",
      "beurre",
      "biberon",
      "bicycle",
      "bidule",
      "bijou",
      "bilan",
      "bilingue",
      "billard",
      "binaire",
      "biologie",
      "biopsie",
      "biotype",
      "biscuit",
      "bison",
      "bistouri",
      "bitume",
      "bizarre",
      "blafard",
      "blague",
      "blanchir",
      "blessant",
      "blinder",
      "blond",
      "bloquer",
      "blouson",
      "bobard",
      "bobine",
      "boire",
      "boiser",
      "bolide",
      "bonbon",
      "bondir",
      "bonheur",
      "bonifier",
      "bonus",
      "bordure",
      "borne",
      "botte",
      "boucle",
      "boueux",
      "bougie",
      "boulon",
      "bouquin",
      "bourse",
      "boussole",
      "boutique",
      "boxeur",
      "branche",
      "brasier",
      "brave",
      "brebis",
      "bre\u0300che",
      "breuvage",
      "bricoler",
      "brigade",
      "brillant",
      "brioche",
      "brique",
      "brochure",
      "broder",
      "bronzer",
      "brousse",
      "broyeur",
      "brume",
      "brusque",
      "brutal",
      "bruyant",
      "buffle",
      "buisson",
      "bulletin",
      "bureau",
      "burin",
      "bustier",
      "butiner",
      "butoir",
      "buvable",
      "buvette",
      "cabanon",
      "cabine",
      "cachette",
      "cadeau",
      "cadre",
      "cafe\u0301ine",
      "caillou",
      "caisson",
      "calculer",
      "calepin",
      "calibre",
      "calmer",
      "calomnie",
      "calvaire",
      "camarade",
      "came\u0301ra",
      "camion",
      "campagne",
      "canal",
      "caneton",
      "canon",
      "cantine",
      "canular",
      "capable",
      "caporal",
      "caprice",
      "capsule",
      "capter",
      "capuche",
      "carabine",
      "carbone",
      "caresser",
      "caribou",
      "carnage",
      "carotte",
      "carreau",
      "carton",
      "cascade",
      "casier",
      "casque",
      "cassure",
      "causer",
      "caution",
      "cavalier",
      "caverne",
      "caviar",
      "ce\u0301dille",
      "ceinture",
      "ce\u0301leste",
      "cellule",
      "cendrier",
      "censurer",
      "central",
      "cercle",
      "ce\u0301re\u0301bral",
      "cerise",
      "cerner",
      "cerveau",
      "cesser",
      "chagrin",
      "chaise",
      "chaleur",
      "chambre",
      "chance",
      "chapitre",
      "charbon",
      "chasseur",
      "chaton",
      "chausson",
      "chavirer",
      "chemise",
      "chenille",
      "che\u0301quier",
      "chercher",
      "cheval",
      "chien",
      "chiffre",
      "chignon",
      "chime\u0300re",
      "chiot",
      "chlorure",
      "chocolat",
      "choisir",
      "chose",
      "chouette",
      "chrome",
      "chute",
      "cigare",
      "cigogne",
      "cimenter",
      "cine\u0301ma",
      "cintrer",
      "circuler",
      "cirer",
      "cirque",
      "citerne",
      "citoyen",
      "citron",
      "civil",
      "clairon",
      "clameur",
      "claquer",
      "classe",
      "clavier",
      "client",
      "cligner",
      "climat",
      "clivage",
      "cloche",
      "clonage",
      "cloporte",
      "cobalt",
      "cobra",
      "cocasse",
      "cocotier",
      "coder",
      "codifier",
      "coffre",
      "cogner",
      "cohe\u0301sion",
      "coiffer",
      "coincer",
      "cole\u0300re",
      "colibri",
      "colline",
      "colmater",
      "colonel",
      "combat",
      "come\u0301die",
      "commande",
      "compact",
      "concert",
      "conduire",
      "confier",
      "congeler",
      "connoter",
      "consonne",
      "contact",
      "convexe",
      "copain",
      "copie",
      "corail",
      "corbeau",
      "cordage",
      "corniche",
      "corpus",
      "correct",
      "corte\u0300ge",
      "cosmique",
      "costume",
      "coton",
      "coude",
      "coupure",
      "courage",
      "couteau",
      "couvrir",
      "coyote",
      "crabe",
      "crainte",
      "cravate",
      "crayon",
      "cre\u0301ature",
      "cre\u0301diter",
      "cre\u0301meux",
      "creuser",
      "crevette",
      "cribler",
      "crier",
      "cristal",
      "crite\u0300re",
      "croire",
      "croquer",
      "crotale",
      "crucial",
      "cruel",
      "crypter",
      "cubique",
      "cueillir",
      "cuille\u0300re",
      "cuisine",
      "cuivre",
      "culminer",
      "cultiver",
      "cumuler",
      "cupide",
      "curatif",
      "curseur",
      "cyanure",
      "cycle",
      "cylindre",
      "cynique",
      "daigner",
      "damier",
      "danger",
      "danseur",
      "dauphin",
      "de\u0301battre",
      "de\u0301biter",
      "de\u0301border",
      "de\u0301brider",
      "de\u0301butant",
      "de\u0301caler",
      "de\u0301cembre",
      "de\u0301chirer",
      "de\u0301cider",
      "de\u0301clarer",
      "de\u0301corer",
      "de\u0301crire",
      "de\u0301cupler",
      "de\u0301dale",
      "de\u0301ductif",
      "de\u0301esse",
      "de\u0301fensif",
      "de\u0301filer",
      "de\u0301frayer",
      "de\u0301gager",
      "de\u0301givrer",
      "de\u0301glutir",
      "de\u0301grafer",
      "de\u0301jeuner",
      "de\u0301lice",
      "de\u0301loger",
      "demander",
      "demeurer",
      "de\u0301molir",
      "de\u0301nicher",
      "de\u0301nouer",
      "dentelle",
      "de\u0301nuder",
      "de\u0301part",
      "de\u0301penser",
      "de\u0301phaser",
      "de\u0301placer",
      "de\u0301poser",
      "de\u0301ranger",
      "de\u0301rober",
      "de\u0301sastre",
      "descente",
      "de\u0301sert",
      "de\u0301signer",
      "de\u0301sobe\u0301ir",
      "dessiner",
      "destrier",
      "de\u0301tacher",
      "de\u0301tester",
      "de\u0301tourer",
      "de\u0301tresse",
      "devancer",
      "devenir",
      "deviner",
      "devoir",
      "diable",
      "dialogue",
      "diamant",
      "dicter",
      "diffe\u0301rer",
      "dige\u0301rer",
      "digital",
      "digne",
      "diluer",
      "dimanche",
      "diminuer",
      "dioxyde",
      "directif",
      "diriger",
      "discuter",
      "disposer",
      "dissiper",
      "distance",
      "divertir",
      "diviser",
      "docile",
      "docteur",
      "dogme",
      "doigt",
      "domaine",
      "domicile",
      "dompter",
      "donateur",
      "donjon",
      "donner",
      "dopamine",
      "dortoir",
      "dorure",
      "dosage",
      "doseur",
      "dossier",
      "dotation",
      "douanier",
      "double",
      "douceur",
      "douter",
      "doyen",
      "dragon",
      "draper",
      "dresser",
      "dribbler",
      "droiture",
      "duperie",
      "duplexe",
      "durable",
      "durcir",
      "dynastie",
      "e\u0301blouir",
      "e\u0301carter",
      "e\u0301charpe",
      "e\u0301chelle",
      "e\u0301clairer",
      "e\u0301clipse",
      "e\u0301clore",
      "e\u0301cluse",
      "e\u0301cole",
      "e\u0301conomie",
      "e\u0301corce",
      "e\u0301couter",
      "e\u0301craser",
      "e\u0301cre\u0301mer",
      "e\u0301crivain",
      "e\u0301crou",
      "e\u0301cume",
      "e\u0301cureuil",
      "e\u0301difier",
      "e\u0301duquer",
      "effacer",
      "effectif",
      "effigie",
      "effort",
      "effrayer",
      "effusion",
      "e\u0301galiser",
      "e\u0301garer",
      "e\u0301jecter",
      "e\u0301laborer",
      "e\u0301largir",
      "e\u0301lectron",
      "e\u0301le\u0301gant",
      "e\u0301le\u0301phant",
      "e\u0301le\u0300ve",
      "e\u0301ligible",
      "e\u0301litisme",
      "e\u0301loge",
      "e\u0301lucider",
      "e\u0301luder",
      "emballer",
      "embellir",
      "embryon",
      "e\u0301meraude",
      "e\u0301mission",
      "emmener",
      "e\u0301motion",
      "e\u0301mouvoir",
      "empereur",
      "employer",
      "emporter",
      "emprise",
      "e\u0301mulsion",
      "encadrer",
      "enche\u0300re",
      "enclave",
      "encoche",
      "endiguer",
      "endosser",
      "endroit",
      "enduire",
      "e\u0301nergie",
      "enfance",
      "enfermer",
      "enfouir",
      "engager",
      "engin",
      "englober",
      "e\u0301nigme",
      "enjamber",
      "enjeu",
      "enlever",
      "ennemi",
      "ennuyeux",
      "enrichir",
      "enrobage",
      "enseigne",
      "entasser",
      "entendre",
      "entier",
      "entourer",
      "entraver",
      "e\u0301nume\u0301rer",
      "envahir",
      "enviable",
      "envoyer",
      "enzyme",
      "e\u0301olien",
      "e\u0301paissir",
      "e\u0301pargne",
      "e\u0301patant",
      "e\u0301paule",
      "e\u0301picerie",
      "e\u0301pide\u0301mie",
      "e\u0301pier",
      "e\u0301pilogue",
      "e\u0301pine",
      "e\u0301pisode",
      "e\u0301pitaphe",
      "e\u0301poque",
      "e\u0301preuve",
      "e\u0301prouver",
      "e\u0301puisant",
      "e\u0301querre",
      "e\u0301quipe",
      "e\u0301riger",
      "e\u0301rosion",
      "erreur",
      "e\u0301ruption",
      "escalier",
      "espadon",
      "espe\u0300ce",
      "espie\u0300gle",
      "espoir",
      "esprit",
      "esquiver",
      "essayer",
      "essence",
      "essieu",
      "essorer",
      "estime",
      "estomac",
      "estrade",
      "e\u0301tage\u0300re",
      "e\u0301taler",
      "e\u0301tanche",
      "e\u0301tatique",
      "e\u0301teindre",
      "e\u0301tendoir",
      "e\u0301ternel",
      "e\u0301thanol",
      "e\u0301thique",
      "ethnie",
      "e\u0301tirer",
      "e\u0301toffer",
      "e\u0301toile",
      "e\u0301tonnant",
      "e\u0301tourdir",
      "e\u0301trange",
      "e\u0301troit",
      "e\u0301tude",
      "euphorie",
      "e\u0301valuer",
      "e\u0301vasion",
      "e\u0301ventail",
      "e\u0301vidence",
      "e\u0301viter",
      "e\u0301volutif",
      "e\u0301voquer",
      "exact",
      "exage\u0301rer",
      "exaucer",
      "exceller",
      "excitant",
      "exclusif",
      "excuse",
      "exe\u0301cuter",
      "exemple",
      "exercer",
      "exhaler",
      "exhorter",
      "exigence",
      "exiler",
      "exister",
      "exotique",
      "expe\u0301dier",
      "explorer",
      "exposer",
      "exprimer",
      "exquis",
      "extensif",
      "extraire",
      "exulter",
      "fable",
      "fabuleux",
      "facette",
      "facile",
      "facture",
      "faiblir",
      "falaise",
      "fameux",
      "famille",
      "farceur",
      "farfelu",
      "farine",
      "farouche",
      "fasciner",
      "fatal",
      "fatigue",
      "faucon",
      "fautif",
      "faveur",
      "favori",
      "fe\u0301brile",
      "fe\u0301conder",
      "fe\u0301de\u0301rer",
      "fe\u0301lin",
      "femme",
      "fe\u0301mur",
      "fendoir",
      "fe\u0301odal",
      "fermer",
      "fe\u0301roce",
      "ferveur",
      "festival",
      "feuille",
      "feutre",
      "fe\u0301vrier",
      "fiasco",
      "ficeler",
      "fictif",
      "fide\u0300le",
      "figure",
      "filature",
      "filetage",
      "filie\u0300re",
      "filleul",
      "filmer",
      "filou",
      "filtrer",
      "financer",
      "finir",
      "fiole",
      "firme",
      "fissure",
      "fixer",
      "flairer",
      "flamme",
      "flasque",
      "flatteur",
      "fle\u0301au",
      "fle\u0300che",
      "fleur",
      "flexion",
      "flocon",
      "flore",
      "fluctuer",
      "fluide",
      "fluvial",
      "folie",
      "fonderie",
      "fongible",
      "fontaine",
      "forcer",
      "forgeron",
      "formuler",
      "fortune",
      "fossile",
      "foudre",
      "fouge\u0300re",
      "fouiller",
      "foulure",
      "fourmi",
      "fragile",
      "fraise",
      "franchir",
      "frapper",
      "frayeur",
      "fre\u0301gate",
      "freiner",
      "frelon",
      "fre\u0301mir",
      "fre\u0301ne\u0301sie",
      "fre\u0300re",
      "friable",
      "friction",
      "frisson",
      "frivole",
      "froid",
      "fromage",
      "frontal",
      "frotter",
      "fruit",
      "fugitif",
      "fuite",
      "fureur",
      "furieux",
      "furtif",
      "fusion",
      "futur",
      "gagner",
      "galaxie",
      "galerie",
      "gambader",
      "garantir",
      "gardien",
      "garnir",
      "garrigue",
      "gazelle",
      "gazon",
      "ge\u0301ant",
      "ge\u0301latine",
      "ge\u0301lule",
      "gendarme",
      "ge\u0301ne\u0301ral",
      "ge\u0301nie",
      "genou",
      "gentil",
      "ge\u0301ologie",
      "ge\u0301ome\u0300tre",
      "ge\u0301ranium",
      "germe",
      "gestuel",
      "geyser",
      "gibier",
      "gicler",
      "girafe",
      "givre",
      "glace",
      "glaive",
      "glisser",
      "globe",
      "gloire",
      "glorieux",
      "golfeur",
      "gomme",
      "gonfler",
      "gorge",
      "gorille",
      "goudron",
      "gouffre",
      "goulot",
      "goupille",
      "gourmand",
      "goutte",
      "graduel",
      "graffiti",
      "graine",
      "grand",
      "grappin",
      "gratuit",
      "gravir",
      "grenat",
      "griffure",
      "griller",
      "grimper",
      "grogner",
      "gronder",
      "grotte",
      "groupe",
      "gruger",
      "grutier",
      "gruye\u0300re",
      "gue\u0301pard",
      "guerrier",
      "guide",
      "guimauve",
      "guitare",
      "gustatif",
      "gymnaste",
      "gyrostat",
      "habitude",
      "hachoir",
      "halte",
      "hameau",
      "hangar",
      "hanneton",
      "haricot",
      "harmonie",
      "harpon",
      "hasard",
      "he\u0301lium",
      "he\u0301matome",
      "herbe",
      "he\u0301risson",
      "hermine",
      "he\u0301ron",
      "he\u0301siter",
      "heureux",
      "hiberner",
      "hibou",
      "hilarant",
      "histoire",
      "hiver",
      "homard",
      "hommage",
      "homoge\u0300ne",
      "honneur",
      "honorer",
      "honteux",
      "horde",
      "horizon",
      "horloge",
      "hormone",
      "horrible",
      "houleux",
      "housse",
      "hublot",
      "huileux",
      "humain",
      "humble",
      "humide",
      "humour",
      "hurler",
      "hydromel",
      "hygie\u0300ne",
      "hymne",
      "hypnose",
      "idylle",
      "ignorer",
      "iguane",
      "illicite",
      "illusion",
      "image",
      "imbiber",
      "imiter",
      "immense",
      "immobile",
      "immuable",
      "impact",
      "impe\u0301rial",
      "implorer",
      "imposer",
      "imprimer",
      "imputer",
      "incarner",
      "incendie",
      "incident",
      "incliner",
      "incolore",
      "indexer",
      "indice",
      "inductif",
      "ine\u0301dit",
      "ineptie",
      "inexact",
      "infini",
      "infliger",
      "informer",
      "infusion",
      "inge\u0301rer",
      "inhaler",
      "inhiber",
      "injecter",
      "injure",
      "innocent",
      "inoculer",
      "inonder",
      "inscrire",
      "insecte",
      "insigne",
      "insolite",
      "inspirer",
      "instinct",
      "insulter",
      "intact",
      "intense",
      "intime",
      "intrigue",
      "intuitif",
      "inutile",
      "invasion",
      "inventer",
      "inviter",
      "invoquer",
      "ironique",
      "irradier",
      "irre\u0301el",
      "irriter",
      "isoler",
      "ivoire",
      "ivresse",
      "jaguar",
      "jaillir",
      "jambe",
      "janvier",
      "jardin",
      "jauger",
      "jaune",
      "javelot",
      "jetable",
      "jeton",
      "jeudi",
      "jeunesse",
      "joindre",
      "joncher",
      "jongler",
      "joueur",
      "jouissif",
      "journal",
      "jovial",
      "joyau",
      "joyeux",
      "jubiler",
      "jugement",
      "junior",
      "jupon",
      "juriste",
      "justice",
      "juteux",
      "juve\u0301nile",
      "kayak",
      "kimono",
      "kiosque",
      "label",
      "labial",
      "labourer",
      "lace\u0301rer",
      "lactose",
      "lagune",
      "laine",
      "laisser",
      "laitier",
      "lambeau",
      "lamelle",
      "lampe",
      "lanceur",
      "langage",
      "lanterne",
      "lapin",
      "largeur",
      "larme",
      "laurier",
      "lavabo",
      "lavoir",
      "lecture",
      "le\u0301gal",
      "le\u0301ger",
      "le\u0301gume",
      "lessive",
      "lettre",
      "levier",
      "lexique",
      "le\u0301zard",
      "liasse",
      "libe\u0301rer",
      "libre",
      "licence",
      "licorne",
      "lie\u0300ge",
      "lie\u0300vre",
      "ligature",
      "ligoter",
      "ligue",
      "limer",
      "limite",
      "limonade",
      "limpide",
      "line\u0301aire",
      "lingot",
      "lionceau",
      "liquide",
      "lisie\u0300re",
      "lister",
      "lithium",
      "litige",
      "littoral",
      "livreur",
      "logique",
      "lointain",
      "loisir",
      "lombric",
      "loterie",
      "louer",
      "lourd",
      "loutre",
      "louve",
      "loyal",
      "lubie",
      "lucide",
      "lucratif",
      "lueur",
      "lugubre",
      "luisant",
      "lumie\u0300re",
      "lunaire",
      "lundi",
      "luron",
      "lutter",
      "luxueux",
      "machine",
      "magasin",
      "magenta",
      "magique",
      "maigre",
      "maillon",
      "maintien",
      "mairie",
      "maison",
      "majorer",
      "malaxer",
      "male\u0301fice",
      "malheur",
      "malice",
      "mallette",
      "mammouth",
      "mandater",
      "maniable",
      "manquant",
      "manteau",
      "manuel",
      "marathon",
      "marbre",
      "marchand",
      "mardi",
      "maritime",
      "marqueur",
      "marron",
      "marteler",
      "mascotte",
      "massif",
      "mate\u0301riel",
      "matie\u0300re",
      "matraque",
      "maudire",
      "maussade",
      "mauve",
      "maximal",
      "me\u0301chant",
      "me\u0301connu",
      "me\u0301daille",
      "me\u0301decin",
      "me\u0301diter",
      "me\u0301duse",
      "meilleur",
      "me\u0301lange",
      "me\u0301lodie",
      "membre",
      "me\u0301moire",
      "menacer",
      "mener",
      "menhir",
      "mensonge",
      "mentor",
      "mercredi",
      "me\u0301rite",
      "merle",
      "messager",
      "mesure",
      "me\u0301tal",
      "me\u0301te\u0301ore",
      "me\u0301thode",
      "me\u0301tier",
      "meuble",
      "miauler",
      "microbe",
      "miette",
      "mignon",
      "migrer",
      "milieu",
      "million",
      "mimique",
      "mince",
      "mine\u0301ral",
      "minimal",
      "minorer",
      "minute",
      "miracle",
      "miroiter",
      "missile",
      "mixte",
      "mobile",
      "moderne",
      "moelleux",
      "mondial",
      "moniteur",
      "monnaie",
      "monotone",
      "monstre",
      "montagne",
      "monument",
      "moqueur",
      "morceau",
      "morsure",
      "mortier",
      "moteur",
      "motif",
      "mouche",
      "moufle",
      "moulin",
      "mousson",
      "mouton",
      "mouvant",
      "multiple",
      "munition",
      "muraille",
      "mure\u0300ne",
      "murmure",
      "muscle",
      "muse\u0301um",
      "musicien",
      "mutation",
      "muter",
      "mutuel",
      "myriade",
      "myrtille",
      "myste\u0300re",
      "mythique",
      "nageur",
      "nappe",
      "narquois",
      "narrer",
      "natation",
      "nation",
      "nature",
      "naufrage",
      "nautique",
      "navire",
      "ne\u0301buleux",
      "nectar",
      "ne\u0301faste",
      "ne\u0301gation",
      "ne\u0301gliger",
      "ne\u0301gocier",
      "neige",
      "nerveux",
      "nettoyer",
      "neurone",
      "neutron",
      "neveu",
      "niche",
      "nickel",
      "nitrate",
      "niveau",
      "noble",
      "nocif",
      "nocturne",
      "noirceur",
      "noisette",
      "nomade",
      "nombreux",
      "nommer",
      "normatif",
      "notable",
      "notifier",
      "notoire",
      "nourrir",
      "nouveau",
      "novateur",
      "novembre",
      "novice",
      "nuage",
      "nuancer",
      "nuire",
      "nuisible",
      "nume\u0301ro",
      "nuptial",
      "nuque",
      "nutritif",
      "obe\u0301ir",
      "objectif",
      "obliger",
      "obscur",
      "observer",
      "obstacle",
      "obtenir",
      "obturer",
      "occasion",
      "occuper",
      "oce\u0301an",
      "octobre",
      "octroyer",
      "octupler",
      "oculaire",
      "odeur",
      "odorant",
      "offenser",
      "officier",
      "offrir",
      "ogive",
      "oiseau",
      "oisillon",
      "olfactif",
      "olivier",
      "ombrage",
      "omettre",
      "onctueux",
      "onduler",
      "one\u0301reux",
      "onirique",
      "opale",
      "opaque",
      "ope\u0301rer",
      "opinion",
      "opportun",
      "opprimer",
      "opter",
      "optique",
      "orageux",
      "orange",
      "orbite",
      "ordonner",
      "oreille",
      "organe",
      "orgueil",
      "orifice",
      "ornement",
      "orque",
      "ortie",
      "osciller",
      "osmose",
      "ossature",
      "otarie",
      "ouragan",
      "ourson",
      "outil",
      "outrager",
      "ouvrage",
      "ovation",
      "oxyde",
      "oxyge\u0300ne",
      "ozone",
      "paisible",
      "palace",
      "palmare\u0300s",
      "palourde",
      "palper",
      "panache",
      "panda",
      "pangolin",
      "paniquer",
      "panneau",
      "panorama",
      "pantalon",
      "papaye",
      "papier",
      "papoter",
      "papyrus",
      "paradoxe",
      "parcelle",
      "paresse",
      "parfumer",
      "parler",
      "parole",
      "parrain",
      "parsemer",
      "partager",
      "parure",
      "parvenir",
      "passion",
      "paste\u0300que",
      "paternel",
      "patience",
      "patron",
      "pavillon",
      "pavoiser",
      "payer",
      "paysage",
      "peigne",
      "peintre",
      "pelage",
      "pe\u0301lican",
      "pelle",
      "pelouse",
      "peluche",
      "pendule",
      "pe\u0301ne\u0301trer",
      "pe\u0301nible",
      "pensif",
      "pe\u0301nurie",
      "pe\u0301pite",
      "pe\u0301plum",
      "perdrix",
      "perforer",
      "pe\u0301riode",
      "permuter",
      "perplexe",
      "persil",
      "perte",
      "peser",
      "pe\u0301tale",
      "petit",
      "pe\u0301trir",
      "peuple",
      "pharaon",
      "phobie",
      "phoque",
      "photon",
      "phrase",
      "physique",
      "piano",
      "pictural",
      "pie\u0300ce",
      "pierre",
      "pieuvre",
      "pilote",
      "pinceau",
      "pipette",
      "piquer",
      "pirogue",
      "piscine",
      "piston",
      "pivoter",
      "pixel",
      "pizza",
      "placard",
      "plafond",
      "plaisir",
      "planer",
      "plaque",
      "plastron",
      "plateau",
      "pleurer",
      "plexus",
      "pliage",
      "plomb",
      "plonger",
      "pluie",
      "plumage",
      "pochette",
      "poe\u0301sie",
      "poe\u0300te",
      "pointe",
      "poirier",
      "poisson",
      "poivre",
      "polaire",
      "policier",
      "pollen",
      "polygone",
      "pommade",
      "pompier",
      "ponctuel",
      "ponde\u0301rer",
      "poney",
      "portique",
      "position",
      "posse\u0301der",
      "posture",
      "potager",
      "poteau",
      "potion",
      "pouce",
      "poulain",
      "poumon",
      "pourpre",
      "poussin",
      "pouvoir",
      "prairie",
      "pratique",
      "pre\u0301cieux",
      "pre\u0301dire",
      "pre\u0301fixe",
      "pre\u0301lude",
      "pre\u0301nom",
      "pre\u0301sence",
      "pre\u0301texte",
      "pre\u0301voir",
      "primitif",
      "prince",
      "prison",
      "priver",
      "proble\u0300me",
      "proce\u0301der",
      "prodige",
      "profond",
      "progre\u0300s",
      "proie",
      "projeter",
      "prologue",
      "promener",
      "propre",
      "prospe\u0300re",
      "prote\u0301ger",
      "prouesse",
      "proverbe",
      "prudence",
      "pruneau",
      "psychose",
      "public",
      "puceron",
      "puiser",
      "pulpe",
      "pulsar",
      "punaise",
      "punitif",
      "pupitre",
      "purifier",
      "puzzle",
      "pyramide",
      "quasar",
      "querelle",
      "question",
      "quie\u0301tude",
      "quitter",
      "quotient",
      "racine",
      "raconter",
      "radieux",
      "ragondin",
      "raideur",
      "raisin",
      "ralentir",
      "rallonge",
      "ramasser",
      "rapide",
      "rasage",
      "ratisser",
      "ravager",
      "ravin",
      "rayonner",
      "re\u0301actif",
      "re\u0301agir",
      "re\u0301aliser",
      "re\u0301animer",
      "recevoir",
      "re\u0301citer",
      "re\u0301clamer",
      "re\u0301colter",
      "recruter",
      "reculer",
      "recycler",
      "re\u0301diger",
      "redouter",
      "refaire",
      "re\u0301flexe",
      "re\u0301former",
      "refrain",
      "refuge",
      "re\u0301galien",
      "re\u0301gion",
      "re\u0301glage",
      "re\u0301gulier",
      "re\u0301ite\u0301rer",
      "rejeter",
      "rejouer",
      "relatif",
      "relever",
      "relief",
      "remarque",
      "reme\u0300de",
      "remise",
      "remonter",
      "remplir",
      "remuer",
      "renard",
      "renfort",
      "renifler",
      "renoncer",
      "rentrer",
      "renvoi",
      "replier",
      "reporter",
      "reprise",
      "reptile",
      "requin",
      "re\u0301serve",
      "re\u0301sineux",
      "re\u0301soudre",
      "respect",
      "rester",
      "re\u0301sultat",
      "re\u0301tablir",
      "retenir",
      "re\u0301ticule",
      "retomber",
      "retracer",
      "re\u0301union",
      "re\u0301ussir",
      "revanche",
      "revivre",
      "re\u0301volte",
      "re\u0301vulsif",
      "richesse",
      "rideau",
      "rieur",
      "rigide",
      "rigoler",
      "rincer",
      "riposter",
      "risible",
      "risque",
      "rituel",
      "rival",
      "rivie\u0300re",
      "rocheux",
      "romance",
      "rompre",
      "ronce",
      "rondin",
      "roseau",
      "rosier",
      "rotatif",
      "rotor",
      "rotule",
      "rouge",
      "rouille",
      "rouleau",
      "routine",
      "royaume",
      "ruban",
      "rubis",
      "ruche",
      "ruelle",
      "rugueux",
      "ruiner",
      "ruisseau",
      "ruser",
      "rustique",
      "rythme",
      "sabler",
      "saboter",
      "sabre",
      "sacoche",
      "safari",
      "sagesse",
      "saisir",
      "salade",
      "salive",
      "salon",
      "saluer",
      "samedi",
      "sanction",
      "sanglier",
      "sarcasme",
      "sardine",
      "saturer",
      "saugrenu",
      "saumon",
      "sauter",
      "sauvage",
      "savant",
      "savonner",
      "scalpel",
      "scandale",
      "sce\u0301le\u0301rat",
      "sce\u0301nario",
      "sceptre",
      "sche\u0301ma",
      "science",
      "scinder",
      "score",
      "scrutin",
      "sculpter",
      "se\u0301ance",
      "se\u0301cable",
      "se\u0301cher",
      "secouer",
      "se\u0301cre\u0301ter",
      "se\u0301datif",
      "se\u0301duire",
      "seigneur",
      "se\u0301jour",
      "se\u0301lectif",
      "semaine",
      "sembler",
      "semence",
      "se\u0301minal",
      "se\u0301nateur",
      "sensible",
      "sentence",
      "se\u0301parer",
      "se\u0301quence",
      "serein",
      "sergent",
      "se\u0301rieux",
      "serrure",
      "se\u0301rum",
      "service",
      "se\u0301same",
      "se\u0301vir",
      "sevrage",
      "sextuple",
      "side\u0301ral",
      "sie\u0300cle",
      "sie\u0301ger",
      "siffler",
      "sigle",
      "signal",
      "silence",
      "silicium",
      "simple",
      "since\u0300re",
      "sinistre",
      "siphon",
      "sirop",
      "sismique",
      "situer",
      "skier",
      "social",
      "socle",
      "sodium",
      "soigneux",
      "soldat",
      "soleil",
      "solitude",
      "soluble",
      "sombre",
      "sommeil",
      "somnoler",
      "sonde",
      "songeur",
      "sonnette",
      "sonore",
      "sorcier",
      "sortir",
      "sosie",
      "sottise",
      "soucieux",
      "soudure",
      "souffle",
      "soulever",
      "soupape",
      "source",
      "soutirer",
      "souvenir",
      "spacieux",
      "spatial",
      "spe\u0301cial",
      "sphe\u0300re",
      "spiral",
      "stable",
      "station",
      "sternum",
      "stimulus",
      "stipuler",
      "strict",
      "studieux",
      "stupeur",
      "styliste",
      "sublime",
      "substrat",
      "subtil",
      "subvenir",
      "succe\u0300s",
      "sucre",
      "suffixe",
      "sugge\u0301rer",
      "suiveur",
      "sulfate",
      "superbe",
      "supplier",
      "surface",
      "suricate",
      "surmener",
      "surprise",
      "sursaut",
      "survie",
      "suspect",
      "syllabe",
      "symbole",
      "syme\u0301trie",
      "synapse",
      "syntaxe",
      "syste\u0300me",
      "tabac",
      "tablier",
      "tactile",
      "tailler",
      "talent",
      "talisman",
      "talonner",
      "tambour",
      "tamiser",
      "tangible",
      "tapis",
      "taquiner",
      "tarder",
      "tarif",
      "tartine",
      "tasse",
      "tatami",
      "tatouage",
      "taupe",
      "taureau",
      "taxer",
      "te\u0301moin",
      "temporel",
      "tenaille",
      "tendre",
      "teneur",
      "tenir",
      "tension",
      "terminer",
      "terne",
      "terrible",
      "te\u0301tine",
      "texte",
      "the\u0300me",
      "the\u0301orie",
      "the\u0301rapie",
      "thorax",
      "tibia",
      "tie\u0300de",
      "timide",
      "tirelire",
      "tiroir",
      "tissu",
      "titane",
      "titre",
      "tituber",
      "toboggan",
      "tole\u0301rant",
      "tomate",
      "tonique",
      "tonneau",
      "toponyme",
      "torche",
      "tordre",
      "tornade",
      "torpille",
      "torrent",
      "torse",
      "tortue",
      "totem",
      "toucher",
      "tournage",
      "tousser",
      "toxine",
      "traction",
      "trafic",
      "tragique",
      "trahir",
      "train",
      "trancher",
      "travail",
      "tre\u0300fle",
      "tremper",
      "tre\u0301sor",
      "treuil",
      "triage",
      "tribunal",
      "tricoter",
      "trilogie",
      "triomphe",
      "tripler",
      "triturer",
      "trivial",
      "trombone",
      "tronc",
      "tropical",
      "troupeau",
      "tuile",
      "tulipe",
      "tumulte",
      "tunnel",
      "turbine",
      "tuteur",
      "tutoyer",
      "tuyau",
      "tympan",
      "typhon",
      "typique",
      "tyran",
      "ubuesque",
      "ultime",
      "ultrason",
      "unanime",
      "unifier",
      "union",
      "unique",
      "unitaire",
      "univers",
      "uranium",
      "urbain",
      "urticant",
      "usage",
      "usine",
      "usuel",
      "usure",
      "utile",
      "utopie",
      "vacarme",
      "vaccin",
      "vagabond",
      "vague",
      "vaillant",
      "vaincre",
      "vaisseau",
      "valable",
      "valise",
      "vallon",
      "valve",
      "vampire",
      "vanille",
      "vapeur",
      "varier",
      "vaseux",
      "vassal",
      "vaste",
      "vecteur",
      "vedette",
      "ve\u0301ge\u0301tal",
      "ve\u0301hicule",
      "veinard",
      "ve\u0301loce",
      "vendredi",
      "ve\u0301ne\u0301rer",
      "venger",
      "venimeux",
      "ventouse",
      "verdure",
      "ve\u0301rin",
      "vernir",
      "verrou",
      "verser",
      "vertu",
      "veston",
      "ve\u0301te\u0301ran",
      "ve\u0301tuste",
      "vexant",
      "vexer",
      "viaduc",
      "viande",
      "victoire",
      "vidange",
      "vide\u0301o",
      "vignette",
      "vigueur",
      "vilain",
      "village",
      "vinaigre",
      "violon",
      "vipe\u0300re",
      "virement",
      "virtuose",
      "virus",
      "visage",
      "viseur",
      "vision",
      "visqueux",
      "visuel",
      "vital",
      "vitesse",
      "viticole",
      "vitrine",
      "vivace",
      "vivipare",
      "vocation",
      "voguer",
      "voile",
      "voisin",
      "voiture",
      "volaille",
      "volcan",
      "voltiger",
      "volume",
      "vorace",
      "vortex",
      "voter",
      "vouloir",
      "voyage",
      "voyelle",
      "wagon",
      "xe\u0301non",
      "yacht",
      "ze\u0300bre",
      "ze\u0301nith",
      "zeste",
      "zoologie"
    ];
  }
});

// node_modules/bip39/src/wordlists/italian.json
var require_italian = __commonJS({
  "node_modules/bip39/src/wordlists/italian.json"(exports, module2) {
    module2.exports = [
      "abaco",
      "abbaglio",
      "abbinato",
      "abete",
      "abisso",
      "abolire",
      "abrasivo",
      "abrogato",
      "accadere",
      "accenno",
      "accusato",
      "acetone",
      "achille",
      "acido",
      "acqua",
      "acre",
      "acrilico",
      "acrobata",
      "acuto",
      "adagio",
      "addebito",
      "addome",
      "adeguato",
      "aderire",
      "adipe",
      "adottare",
      "adulare",
      "affabile",
      "affetto",
      "affisso",
      "affranto",
      "aforisma",
      "afoso",
      "africano",
      "agave",
      "agente",
      "agevole",
      "aggancio",
      "agire",
      "agitare",
      "agonismo",
      "agricolo",
      "agrumeto",
      "aguzzo",
      "alabarda",
      "alato",
      "albatro",
      "alberato",
      "albo",
      "albume",
      "alce",
      "alcolico",
      "alettone",
      "alfa",
      "algebra",
      "aliante",
      "alibi",
      "alimento",
      "allagato",
      "allegro",
      "allievo",
      "allodola",
      "allusivo",
      "almeno",
      "alogeno",
      "alpaca",
      "alpestre",
      "altalena",
      "alterno",
      "alticcio",
      "altrove",
      "alunno",
      "alveolo",
      "alzare",
      "amalgama",
      "amanita",
      "amarena",
      "ambito",
      "ambrato",
      "ameba",
      "america",
      "ametista",
      "amico",
      "ammasso",
      "ammenda",
      "ammirare",
      "ammonito",
      "amore",
      "ampio",
      "ampliare",
      "amuleto",
      "anacardo",
      "anagrafe",
      "analista",
      "anarchia",
      "anatra",
      "anca",
      "ancella",
      "ancora",
      "andare",
      "andrea",
      "anello",
      "angelo",
      "angolare",
      "angusto",
      "anima",
      "annegare",
      "annidato",
      "anno",
      "annuncio",
      "anonimo",
      "anticipo",
      "anzi",
      "apatico",
      "apertura",
      "apode",
      "apparire",
      "appetito",
      "appoggio",
      "approdo",
      "appunto",
      "aprile",
      "arabica",
      "arachide",
      "aragosta",
      "araldica",
      "arancio",
      "aratura",
      "arazzo",
      "arbitro",
      "archivio",
      "ardito",
      "arenile",
      "argento",
      "argine",
      "arguto",
      "aria",
      "armonia",
      "arnese",
      "arredato",
      "arringa",
      "arrosto",
      "arsenico",
      "arso",
      "artefice",
      "arzillo",
      "asciutto",
      "ascolto",
      "asepsi",
      "asettico",
      "asfalto",
      "asino",
      "asola",
      "aspirato",
      "aspro",
      "assaggio",
      "asse",
      "assoluto",
      "assurdo",
      "asta",
      "astenuto",
      "astice",
      "astratto",
      "atavico",
      "ateismo",
      "atomico",
      "atono",
      "attesa",
      "attivare",
      "attorno",
      "attrito",
      "attuale",
      "ausilio",
      "austria",
      "autista",
      "autonomo",
      "autunno",
      "avanzato",
      "avere",
      "avvenire",
      "avviso",
      "avvolgere",
      "azione",
      "azoto",
      "azzimo",
      "azzurro",
      "babele",
      "baccano",
      "bacino",
      "baco",
      "badessa",
      "badilata",
      "bagnato",
      "baita",
      "balcone",
      "baldo",
      "balena",
      "ballata",
      "balzano",
      "bambino",
      "bandire",
      "baraonda",
      "barbaro",
      "barca",
      "baritono",
      "barlume",
      "barocco",
      "basilico",
      "basso",
      "batosta",
      "battuto",
      "baule",
      "bava",
      "bavosa",
      "becco",
      "beffa",
      "belgio",
      "belva",
      "benda",
      "benevole",
      "benigno",
      "benzina",
      "bere",
      "berlina",
      "beta",
      "bibita",
      "bici",
      "bidone",
      "bifido",
      "biga",
      "bilancia",
      "bimbo",
      "binocolo",
      "biologo",
      "bipede",
      "bipolare",
      "birbante",
      "birra",
      "biscotto",
      "bisesto",
      "bisnonno",
      "bisonte",
      "bisturi",
      "bizzarro",
      "blando",
      "blatta",
      "bollito",
      "bonifico",
      "bordo",
      "bosco",
      "botanico",
      "bottino",
      "bozzolo",
      "braccio",
      "bradipo",
      "brama",
      "branca",
      "bravura",
      "bretella",
      "brevetto",
      "brezza",
      "briglia",
      "brillante",
      "brindare",
      "broccolo",
      "brodo",
      "bronzina",
      "brullo",
      "bruno",
      "bubbone",
      "buca",
      "budino",
      "buffone",
      "buio",
      "bulbo",
      "buono",
      "burlone",
      "burrasca",
      "bussola",
      "busta",
      "cadetto",
      "caduco",
      "calamaro",
      "calcolo",
      "calesse",
      "calibro",
      "calmo",
      "caloria",
      "cambusa",
      "camerata",
      "camicia",
      "cammino",
      "camola",
      "campale",
      "canapa",
      "candela",
      "cane",
      "canino",
      "canotto",
      "cantina",
      "capace",
      "capello",
      "capitolo",
      "capogiro",
      "cappero",
      "capra",
      "capsula",
      "carapace",
      "carcassa",
      "cardo",
      "carisma",
      "carovana",
      "carretto",
      "cartolina",
      "casaccio",
      "cascata",
      "caserma",
      "caso",
      "cassone",
      "castello",
      "casuale",
      "catasta",
      "catena",
      "catrame",
      "cauto",
      "cavillo",
      "cedibile",
      "cedrata",
      "cefalo",
      "celebre",
      "cellulare",
      "cena",
      "cenone",
      "centesimo",
      "ceramica",
      "cercare",
      "certo",
      "cerume",
      "cervello",
      "cesoia",
      "cespo",
      "ceto",
      "chela",
      "chiaro",
      "chicca",
      "chiedere",
      "chimera",
      "china",
      "chirurgo",
      "chitarra",
      "ciao",
      "ciclismo",
      "cifrare",
      "cigno",
      "cilindro",
      "ciottolo",
      "circa",
      "cirrosi",
      "citrico",
      "cittadino",
      "ciuffo",
      "civetta",
      "civile",
      "classico",
      "clinica",
      "cloro",
      "cocco",
      "codardo",
      "codice",
      "coerente",
      "cognome",
      "collare",
      "colmato",
      "colore",
      "colposo",
      "coltivato",
      "colza",
      "coma",
      "cometa",
      "commando",
      "comodo",
      "computer",
      "comune",
      "conciso",
      "condurre",
      "conferma",
      "congelare",
      "coniuge",
      "connesso",
      "conoscere",
      "consumo",
      "continuo",
      "convegno",
      "coperto",
      "copione",
      "coppia",
      "copricapo",
      "corazza",
      "cordata",
      "coricato",
      "cornice",
      "corolla",
      "corpo",
      "corredo",
      "corsia",
      "cortese",
      "cosmico",
      "costante",
      "cottura",
      "covato",
      "cratere",
      "cravatta",
      "creato",
      "credere",
      "cremoso",
      "crescita",
      "creta",
      "criceto",
      "crinale",
      "crisi",
      "critico",
      "croce",
      "cronaca",
      "crostata",
      "cruciale",
      "crusca",
      "cucire",
      "cuculo",
      "cugino",
      "cullato",
      "cupola",
      "curatore",
      "cursore",
      "curvo",
      "cuscino",
      "custode",
      "dado",
      "daino",
      "dalmata",
      "damerino",
      "daniela",
      "dannoso",
      "danzare",
      "datato",
      "davanti",
      "davvero",
      "debutto",
      "decennio",
      "deciso",
      "declino",
      "decollo",
      "decreto",
      "dedicato",
      "definito",
      "deforme",
      "degno",
      "delegare",
      "delfino",
      "delirio",
      "delta",
      "demenza",
      "denotato",
      "dentro",
      "deposito",
      "derapata",
      "derivare",
      "deroga",
      "descritto",
      "deserto",
      "desiderio",
      "desumere",
      "detersivo",
      "devoto",
      "diametro",
      "dicembre",
      "diedro",
      "difeso",
      "diffuso",
      "digerire",
      "digitale",
      "diluvio",
      "dinamico",
      "dinnanzi",
      "dipinto",
      "diploma",
      "dipolo",
      "diradare",
      "dire",
      "dirotto",
      "dirupo",
      "disagio",
      "discreto",
      "disfare",
      "disgelo",
      "disposto",
      "distanza",
      "disumano",
      "dito",
      "divano",
      "divelto",
      "dividere",
      "divorato",
      "doblone",
      "docente",
      "doganale",
      "dogma",
      "dolce",
      "domato",
      "domenica",
      "dominare",
      "dondolo",
      "dono",
      "dormire",
      "dote",
      "dottore",
      "dovuto",
      "dozzina",
      "drago",
      "druido",
      "dubbio",
      "dubitare",
      "ducale",
      "duna",
      "duomo",
      "duplice",
      "duraturo",
      "ebano",
      "eccesso",
      "ecco",
      "eclissi",
      "economia",
      "edera",
      "edicola",
      "edile",
      "editoria",
      "educare",
      "egemonia",
      "egli",
      "egoismo",
      "egregio",
      "elaborato",
      "elargire",
      "elegante",
      "elencato",
      "eletto",
      "elevare",
      "elfico",
      "elica",
      "elmo",
      "elsa",
      "eluso",
      "emanato",
      "emblema",
      "emesso",
      "emiro",
      "emotivo",
      "emozione",
      "empirico",
      "emulo",
      "endemico",
      "enduro",
      "energia",
      "enfasi",
      "enoteca",
      "entrare",
      "enzima",
      "epatite",
      "epilogo",
      "episodio",
      "epocale",
      "eppure",
      "equatore",
      "erario",
      "erba",
      "erboso",
      "erede",
      "eremita",
      "erigere",
      "ermetico",
      "eroe",
      "erosivo",
      "errante",
      "esagono",
      "esame",
      "esanime",
      "esaudire",
      "esca",
      "esempio",
      "esercito",
      "esibito",
      "esigente",
      "esistere",
      "esito",
      "esofago",
      "esortato",
      "esoso",
      "espanso",
      "espresso",
      "essenza",
      "esso",
      "esteso",
      "estimare",
      "estonia",
      "estroso",
      "esultare",
      "etilico",
      "etnico",
      "etrusco",
      "etto",
      "euclideo",
      "europa",
      "evaso",
      "evidenza",
      "evitato",
      "evoluto",
      "evviva",
      "fabbrica",
      "faccenda",
      "fachiro",
      "falco",
      "famiglia",
      "fanale",
      "fanfara",
      "fango",
      "fantasma",
      "fare",
      "farfalla",
      "farinoso",
      "farmaco",
      "fascia",
      "fastoso",
      "fasullo",
      "faticare",
      "fato",
      "favoloso",
      "febbre",
      "fecola",
      "fede",
      "fegato",
      "felpa",
      "feltro",
      "femmina",
      "fendere",
      "fenomeno",
      "fermento",
      "ferro",
      "fertile",
      "fessura",
      "festivo",
      "fetta",
      "feudo",
      "fiaba",
      "fiducia",
      "fifa",
      "figurato",
      "filo",
      "finanza",
      "finestra",
      "finire",
      "fiore",
      "fiscale",
      "fisico",
      "fiume",
      "flacone",
      "flamenco",
      "flebo",
      "flemma",
      "florido",
      "fluente",
      "fluoro",
      "fobico",
      "focaccia",
      "focoso",
      "foderato",
      "foglio",
      "folata",
      "folclore",
      "folgore",
      "fondente",
      "fonetico",
      "fonia",
      "fontana",
      "forbito",
      "forchetta",
      "foresta",
      "formica",
      "fornaio",
      "foro",
      "fortezza",
      "forzare",
      "fosfato",
      "fosso",
      "fracasso",
      "frana",
      "frassino",
      "fratello",
      "freccetta",
      "frenata",
      "fresco",
      "frigo",
      "frollino",
      "fronde",
      "frugale",
      "frutta",
      "fucilata",
      "fucsia",
      "fuggente",
      "fulmine",
      "fulvo",
      "fumante",
      "fumetto",
      "fumoso",
      "fune",
      "funzione",
      "fuoco",
      "furbo",
      "furgone",
      "furore",
      "fuso",
      "futile",
      "gabbiano",
      "gaffe",
      "galateo",
      "gallina",
      "galoppo",
      "gambero",
      "gamma",
      "garanzia",
      "garbo",
      "garofano",
      "garzone",
      "gasdotto",
      "gasolio",
      "gastrico",
      "gatto",
      "gaudio",
      "gazebo",
      "gazzella",
      "geco",
      "gelatina",
      "gelso",
      "gemello",
      "gemmato",
      "gene",
      "genitore",
      "gennaio",
      "genotipo",
      "gergo",
      "ghepardo",
      "ghiaccio",
      "ghisa",
      "giallo",
      "gilda",
      "ginepro",
      "giocare",
      "gioiello",
      "giorno",
      "giove",
      "girato",
      "girone",
      "gittata",
      "giudizio",
      "giurato",
      "giusto",
      "globulo",
      "glutine",
      "gnomo",
      "gobba",
      "golf",
      "gomito",
      "gommone",
      "gonfio",
      "gonna",
      "governo",
      "gracile",
      "grado",
      "grafico",
      "grammo",
      "grande",
      "grattare",
      "gravoso",
      "grazia",
      "greca",
      "gregge",
      "grifone",
      "grigio",
      "grinza",
      "grotta",
      "gruppo",
      "guadagno",
      "guaio",
      "guanto",
      "guardare",
      "gufo",
      "guidare",
      "ibernato",
      "icona",
      "identico",
      "idillio",
      "idolo",
      "idra",
      "idrico",
      "idrogeno",
      "igiene",
      "ignaro",
      "ignorato",
      "ilare",
      "illeso",
      "illogico",
      "illudere",
      "imballo",
      "imbevuto",
      "imbocco",
      "imbuto",
      "immane",
      "immerso",
      "immolato",
      "impacco",
      "impeto",
      "impiego",
      "importo",
      "impronta",
      "inalare",
      "inarcare",
      "inattivo",
      "incanto",
      "incendio",
      "inchino",
      "incisivo",
      "incluso",
      "incontro",
      "incrocio",
      "incubo",
      "indagine",
      "india",
      "indole",
      "inedito",
      "infatti",
      "infilare",
      "inflitto",
      "ingaggio",
      "ingegno",
      "inglese",
      "ingordo",
      "ingrosso",
      "innesco",
      "inodore",
      "inoltrare",
      "inondato",
      "insano",
      "insetto",
      "insieme",
      "insonnia",
      "insulina",
      "intasato",
      "intero",
      "intonaco",
      "intuito",
      "inumidire",
      "invalido",
      "invece",
      "invito",
      "iperbole",
      "ipnotico",
      "ipotesi",
      "ippica",
      "iride",
      "irlanda",
      "ironico",
      "irrigato",
      "irrorare",
      "isolato",
      "isotopo",
      "isterico",
      "istituto",
      "istrice",
      "italia",
      "iterare",
      "labbro",
      "labirinto",
      "lacca",
      "lacerato",
      "lacrima",
      "lacuna",
      "laddove",
      "lago",
      "lampo",
      "lancetta",
      "lanterna",
      "lardoso",
      "larga",
      "laringe",
      "lastra",
      "latenza",
      "latino",
      "lattuga",
      "lavagna",
      "lavoro",
      "legale",
      "leggero",
      "lembo",
      "lentezza",
      "lenza",
      "leone",
      "lepre",
      "lesivo",
      "lessato",
      "lesto",
      "letterale",
      "leva",
      "levigato",
      "libero",
      "lido",
      "lievito",
      "lilla",
      "limatura",
      "limitare",
      "limpido",
      "lineare",
      "lingua",
      "liquido",
      "lira",
      "lirica",
      "lisca",
      "lite",
      "litigio",
      "livrea",
      "locanda",
      "lode",
      "logica",
      "lombare",
      "londra",
      "longevo",
      "loquace",
      "lorenzo",
      "loto",
      "lotteria",
      "luce",
      "lucidato",
      "lumaca",
      "luminoso",
      "lungo",
      "lupo",
      "luppolo",
      "lusinga",
      "lusso",
      "lutto",
      "macabro",
      "macchina",
      "macero",
      "macinato",
      "madama",
      "magico",
      "maglia",
      "magnete",
      "magro",
      "maiolica",
      "malafede",
      "malgrado",
      "malinteso",
      "malsano",
      "malto",
      "malumore",
      "mana",
      "mancia",
      "mandorla",
      "mangiare",
      "manifesto",
      "mannaro",
      "manovra",
      "mansarda",
      "mantide",
      "manubrio",
      "mappa",
      "maratona",
      "marcire",
      "maretta",
      "marmo",
      "marsupio",
      "maschera",
      "massaia",
      "mastino",
      "materasso",
      "matricola",
      "mattone",
      "maturo",
      "mazurca",
      "meandro",
      "meccanico",
      "mecenate",
      "medesimo",
      "meditare",
      "mega",
      "melassa",
      "melis",
      "melodia",
      "meninge",
      "meno",
      "mensola",
      "mercurio",
      "merenda",
      "merlo",
      "meschino",
      "mese",
      "messere",
      "mestolo",
      "metallo",
      "metodo",
      "mettere",
      "miagolare",
      "mica",
      "micelio",
      "michele",
      "microbo",
      "midollo",
      "miele",
      "migliore",
      "milano",
      "milite",
      "mimosa",
      "minerale",
      "mini",
      "minore",
      "mirino",
      "mirtillo",
      "miscela",
      "missiva",
      "misto",
      "misurare",
      "mitezza",
      "mitigare",
      "mitra",
      "mittente",
      "mnemonico",
      "modello",
      "modifica",
      "modulo",
      "mogano",
      "mogio",
      "mole",
      "molosso",
      "monastero",
      "monco",
      "mondina",
      "monetario",
      "monile",
      "monotono",
      "monsone",
      "montato",
      "monviso",
      "mora",
      "mordere",
      "morsicato",
      "mostro",
      "motivato",
      "motosega",
      "motto",
      "movenza",
      "movimento",
      "mozzo",
      "mucca",
      "mucosa",
      "muffa",
      "mughetto",
      "mugnaio",
      "mulatto",
      "mulinello",
      "multiplo",
      "mummia",
      "munto",
      "muovere",
      "murale",
      "musa",
      "muscolo",
      "musica",
      "mutevole",
      "muto",
      "nababbo",
      "nafta",
      "nanometro",
      "narciso",
      "narice",
      "narrato",
      "nascere",
      "nastrare",
      "naturale",
      "nautica",
      "naviglio",
      "nebulosa",
      "necrosi",
      "negativo",
      "negozio",
      "nemmeno",
      "neofita",
      "neretto",
      "nervo",
      "nessuno",
      "nettuno",
      "neutrale",
      "neve",
      "nevrotico",
      "nicchia",
      "ninfa",
      "nitido",
      "nobile",
      "nocivo",
      "nodo",
      "nome",
      "nomina",
      "nordico",
      "normale",
      "norvegese",
      "nostrano",
      "notare",
      "notizia",
      "notturno",
      "novella",
      "nucleo",
      "nulla",
      "numero",
      "nuovo",
      "nutrire",
      "nuvola",
      "nuziale",
      "oasi",
      "obbedire",
      "obbligo",
      "obelisco",
      "oblio",
      "obolo",
      "obsoleto",
      "occasione",
      "occhio",
      "occidente",
      "occorrere",
      "occultare",
      "ocra",
      "oculato",
      "odierno",
      "odorare",
      "offerta",
      "offrire",
      "offuscato",
      "oggetto",
      "oggi",
      "ognuno",
      "olandese",
      "olfatto",
      "oliato",
      "oliva",
      "ologramma",
      "oltre",
      "omaggio",
      "ombelico",
      "ombra",
      "omega",
      "omissione",
      "ondoso",
      "onere",
      "onice",
      "onnivoro",
      "onorevole",
      "onta",
      "operato",
      "opinione",
      "opposto",
      "oracolo",
      "orafo",
      "ordine",
      "orecchino",
      "orefice",
      "orfano",
      "organico",
      "origine",
      "orizzonte",
      "orma",
      "ormeggio",
      "ornativo",
      "orologio",
      "orrendo",
      "orribile",
      "ortensia",
      "ortica",
      "orzata",
      "orzo",
      "osare",
      "oscurare",
      "osmosi",
      "ospedale",
      "ospite",
      "ossa",
      "ossidare",
      "ostacolo",
      "oste",
      "otite",
      "otre",
      "ottagono",
      "ottimo",
      "ottobre",
      "ovale",
      "ovest",
      "ovino",
      "oviparo",
      "ovocito",
      "ovunque",
      "ovviare",
      "ozio",
      "pacchetto",
      "pace",
      "pacifico",
      "padella",
      "padrone",
      "paese",
      "paga",
      "pagina",
      "palazzina",
      "palesare",
      "pallido",
      "palo",
      "palude",
      "pandoro",
      "pannello",
      "paolo",
      "paonazzo",
      "paprica",
      "parabola",
      "parcella",
      "parere",
      "pargolo",
      "pari",
      "parlato",
      "parola",
      "partire",
      "parvenza",
      "parziale",
      "passivo",
      "pasticca",
      "patacca",
      "patologia",
      "pattume",
      "pavone",
      "peccato",
      "pedalare",
      "pedonale",
      "peggio",
      "peloso",
      "penare",
      "pendice",
      "penisola",
      "pennuto",
      "penombra",
      "pensare",
      "pentola",
      "pepe",
      "pepita",
      "perbene",
      "percorso",
      "perdonato",
      "perforare",
      "pergamena",
      "periodo",
      "permesso",
      "perno",
      "perplesso",
      "persuaso",
      "pertugio",
      "pervaso",
      "pesatore",
      "pesista",
      "peso",
      "pestifero",
      "petalo",
      "pettine",
      "petulante",
      "pezzo",
      "piacere",
      "pianta",
      "piattino",
      "piccino",
      "picozza",
      "piega",
      "pietra",
      "piffero",
      "pigiama",
      "pigolio",
      "pigro",
      "pila",
      "pilifero",
      "pillola",
      "pilota",
      "pimpante",
      "pineta",
      "pinna",
      "pinolo",
      "pioggia",
      "piombo",
      "piramide",
      "piretico",
      "pirite",
      "pirolisi",
      "pitone",
      "pizzico",
      "placebo",
      "planare",
      "plasma",
      "platano",
      "plenario",
      "pochezza",
      "poderoso",
      "podismo",
      "poesia",
      "poggiare",
      "polenta",
      "poligono",
      "pollice",
      "polmonite",
      "polpetta",
      "polso",
      "poltrona",
      "polvere",
      "pomice",
      "pomodoro",
      "ponte",
      "popoloso",
      "porfido",
      "poroso",
      "porpora",
      "porre",
      "portata",
      "posa",
      "positivo",
      "possesso",
      "postulato",
      "potassio",
      "potere",
      "pranzo",
      "prassi",
      "pratica",
      "precluso",
      "predica",
      "prefisso",
      "pregiato",
      "prelievo",
      "premere",
      "prenotare",
      "preparato",
      "presenza",
      "pretesto",
      "prevalso",
      "prima",
      "principe",
      "privato",
      "problema",
      "procura",
      "produrre",
      "profumo",
      "progetto",
      "prolunga",
      "promessa",
      "pronome",
      "proposta",
      "proroga",
      "proteso",
      "prova",
      "prudente",
      "prugna",
      "prurito",
      "psiche",
      "pubblico",
      "pudica",
      "pugilato",
      "pugno",
      "pulce",
      "pulito",
      "pulsante",
      "puntare",
      "pupazzo",
      "pupilla",
      "puro",
      "quadro",
      "qualcosa",
      "quasi",
      "querela",
      "quota",
      "raccolto",
      "raddoppio",
      "radicale",
      "radunato",
      "raffica",
      "ragazzo",
      "ragione",
      "ragno",
      "ramarro",
      "ramingo",
      "ramo",
      "randagio",
      "rantolare",
      "rapato",
      "rapina",
      "rappreso",
      "rasatura",
      "raschiato",
      "rasente",
      "rassegna",
      "rastrello",
      "rata",
      "ravveduto",
      "reale",
      "recepire",
      "recinto",
      "recluta",
      "recondito",
      "recupero",
      "reddito",
      "redimere",
      "regalato",
      "registro",
      "regola",
      "regresso",
      "relazione",
      "remare",
      "remoto",
      "renna",
      "replica",
      "reprimere",
      "reputare",
      "resa",
      "residente",
      "responso",
      "restauro",
      "rete",
      "retina",
      "retorica",
      "rettifica",
      "revocato",
      "riassunto",
      "ribadire",
      "ribelle",
      "ribrezzo",
      "ricarica",
      "ricco",
      "ricevere",
      "riciclato",
      "ricordo",
      "ricreduto",
      "ridicolo",
      "ridurre",
      "rifasare",
      "riflesso",
      "riforma",
      "rifugio",
      "rigare",
      "rigettato",
      "righello",
      "rilassato",
      "rilevato",
      "rimanere",
      "rimbalzo",
      "rimedio",
      "rimorchio",
      "rinascita",
      "rincaro",
      "rinforzo",
      "rinnovo",
      "rinomato",
      "rinsavito",
      "rintocco",
      "rinuncia",
      "rinvenire",
      "riparato",
      "ripetuto",
      "ripieno",
      "riportare",
      "ripresa",
      "ripulire",
      "risata",
      "rischio",
      "riserva",
      "risibile",
      "riso",
      "rispetto",
      "ristoro",
      "risultato",
      "risvolto",
      "ritardo",
      "ritegno",
      "ritmico",
      "ritrovo",
      "riunione",
      "riva",
      "riverso",
      "rivincita",
      "rivolto",
      "rizoma",
      "roba",
      "robotico",
      "robusto",
      "roccia",
      "roco",
      "rodaggio",
      "rodere",
      "roditore",
      "rogito",
      "rollio",
      "romantico",
      "rompere",
      "ronzio",
      "rosolare",
      "rospo",
      "rotante",
      "rotondo",
      "rotula",
      "rovescio",
      "rubizzo",
      "rubrica",
      "ruga",
      "rullino",
      "rumine",
      "rumoroso",
      "ruolo",
      "rupe",
      "russare",
      "rustico",
      "sabato",
      "sabbiare",
      "sabotato",
      "sagoma",
      "salasso",
      "saldatura",
      "salgemma",
      "salivare",
      "salmone",
      "salone",
      "saltare",
      "saluto",
      "salvo",
      "sapere",
      "sapido",
      "saporito",
      "saraceno",
      "sarcasmo",
      "sarto",
      "sassoso",
      "satellite",
      "satira",
      "satollo",
      "saturno",
      "savana",
      "savio",
      "saziato",
      "sbadiglio",
      "sbalzo",
      "sbancato",
      "sbarra",
      "sbattere",
      "sbavare",
      "sbendare",
      "sbirciare",
      "sbloccato",
      "sbocciato",
      "sbrinare",
      "sbruffone",
      "sbuffare",
      "scabroso",
      "scadenza",
      "scala",
      "scambiare",
      "scandalo",
      "scapola",
      "scarso",
      "scatenare",
      "scavato",
      "scelto",
      "scenico",
      "scettro",
      "scheda",
      "schiena",
      "sciarpa",
      "scienza",
      "scindere",
      "scippo",
      "sciroppo",
      "scivolo",
      "sclerare",
      "scodella",
      "scolpito",
      "scomparto",
      "sconforto",
      "scoprire",
      "scorta",
      "scossone",
      "scozzese",
      "scriba",
      "scrollare",
      "scrutinio",
      "scuderia",
      "scultore",
      "scuola",
      "scuro",
      "scusare",
      "sdebitare",
      "sdoganare",
      "seccatura",
      "secondo",
      "sedano",
      "seggiola",
      "segnalato",
      "segregato",
      "seguito",
      "selciato",
      "selettivo",
      "sella",
      "selvaggio",
      "semaforo",
      "sembrare",
      "seme",
      "seminato",
      "sempre",
      "senso",
      "sentire",
      "sepolto",
      "sequenza",
      "serata",
      "serbato",
      "sereno",
      "serio",
      "serpente",
      "serraglio",
      "servire",
      "sestina",
      "setola",
      "settimana",
      "sfacelo",
      "sfaldare",
      "sfamato",
      "sfarzoso",
      "sfaticato",
      "sfera",
      "sfida",
      "sfilato",
      "sfinge",
      "sfocato",
      "sfoderare",
      "sfogo",
      "sfoltire",
      "sforzato",
      "sfratto",
      "sfruttato",
      "sfuggito",
      "sfumare",
      "sfuso",
      "sgabello",
      "sgarbato",
      "sgonfiare",
      "sgorbio",
      "sgrassato",
      "sguardo",
      "sibilo",
      "siccome",
      "sierra",
      "sigla",
      "signore",
      "silenzio",
      "sillaba",
      "simbolo",
      "simpatico",
      "simulato",
      "sinfonia",
      "singolo",
      "sinistro",
      "sino",
      "sintesi",
      "sinusoide",
      "sipario",
      "sisma",
      "sistole",
      "situato",
      "slitta",
      "slogatura",
      "sloveno",
      "smarrito",
      "smemorato",
      "smentito",
      "smeraldo",
      "smilzo",
      "smontare",
      "smottato",
      "smussato",
      "snellire",
      "snervato",
      "snodo",
      "sobbalzo",
      "sobrio",
      "soccorso",
      "sociale",
      "sodale",
      "soffitto",
      "sogno",
      "soldato",
      "solenne",
      "solido",
      "sollazzo",
      "solo",
      "solubile",
      "solvente",
      "somatico",
      "somma",
      "sonda",
      "sonetto",
      "sonnifero",
      "sopire",
      "soppeso",
      "sopra",
      "sorgere",
      "sorpasso",
      "sorriso",
      "sorso",
      "sorteggio",
      "sorvolato",
      "sospiro",
      "sosta",
      "sottile",
      "spada",
      "spalla",
      "spargere",
      "spatola",
      "spavento",
      "spazzola",
      "specie",
      "spedire",
      "spegnere",
      "spelatura",
      "speranza",
      "spessore",
      "spettrale",
      "spezzato",
      "spia",
      "spigoloso",
      "spillato",
      "spinoso",
      "spirale",
      "splendido",
      "sportivo",
      "sposo",
      "spranga",
      "sprecare",
      "spronato",
      "spruzzo",
      "spuntino",
      "squillo",
      "sradicare",
      "srotolato",
      "stabile",
      "stacco",
      "staffa",
      "stagnare",
      "stampato",
      "stantio",
      "starnuto",
      "stasera",
      "statuto",
      "stelo",
      "steppa",
      "sterzo",
      "stiletto",
      "stima",
      "stirpe",
      "stivale",
      "stizzoso",
      "stonato",
      "storico",
      "strappo",
      "stregato",
      "stridulo",
      "strozzare",
      "strutto",
      "stuccare",
      "stufo",
      "stupendo",
      "subentro",
      "succoso",
      "sudore",
      "suggerito",
      "sugo",
      "sultano",
      "suonare",
      "superbo",
      "supporto",
      "surgelato",
      "surrogato",
      "sussurro",
      "sutura",
      "svagare",
      "svedese",
      "sveglio",
      "svelare",
      "svenuto",
      "svezia",
      "sviluppo",
      "svista",
      "svizzera",
      "svolta",
      "svuotare",
      "tabacco",
      "tabulato",
      "tacciare",
      "taciturno",
      "tale",
      "talismano",
      "tampone",
      "tannino",
      "tara",
      "tardivo",
      "targato",
      "tariffa",
      "tarpare",
      "tartaruga",
      "tasto",
      "tattico",
      "taverna",
      "tavolata",
      "tazza",
      "teca",
      "tecnico",
      "telefono",
      "temerario",
      "tempo",
      "temuto",
      "tendone",
      "tenero",
      "tensione",
      "tentacolo",
      "teorema",
      "terme",
      "terrazzo",
      "terzetto",
      "tesi",
      "tesserato",
      "testato",
      "tetro",
      "tettoia",
      "tifare",
      "tigella",
      "timbro",
      "tinto",
      "tipico",
      "tipografo",
      "tiraggio",
      "tiro",
      "titanio",
      "titolo",
      "titubante",
      "tizio",
      "tizzone",
      "toccare",
      "tollerare",
      "tolto",
      "tombola",
      "tomo",
      "tonfo",
      "tonsilla",
      "topazio",
      "topologia",
      "toppa",
      "torba",
      "tornare",
      "torrone",
      "tortora",
      "toscano",
      "tossire",
      "tostatura",
      "totano",
      "trabocco",
      "trachea",
      "trafila",
      "tragedia",
      "tralcio",
      "tramonto",
      "transito",
      "trapano",
      "trarre",
      "trasloco",
      "trattato",
      "trave",
      "treccia",
      "tremolio",
      "trespolo",
      "tributo",
      "tricheco",
      "trifoglio",
      "trillo",
      "trincea",
      "trio",
      "tristezza",
      "triturato",
      "trivella",
      "tromba",
      "trono",
      "troppo",
      "trottola",
      "trovare",
      "truccato",
      "tubatura",
      "tuffato",
      "tulipano",
      "tumulto",
      "tunisia",
      "turbare",
      "turchino",
      "tuta",
      "tutela",
      "ubicato",
      "uccello",
      "uccisore",
      "udire",
      "uditivo",
      "uffa",
      "ufficio",
      "uguale",
      "ulisse",
      "ultimato",
      "umano",
      "umile",
      "umorismo",
      "uncinetto",
      "ungere",
      "ungherese",
      "unicorno",
      "unificato",
      "unisono",
      "unitario",
      "unte",
      "uovo",
      "upupa",
      "uragano",
      "urgenza",
      "urlo",
      "usanza",
      "usato",
      "uscito",
      "usignolo",
      "usuraio",
      "utensile",
      "utilizzo",
      "utopia",
      "vacante",
      "vaccinato",
      "vagabondo",
      "vagliato",
      "valanga",
      "valgo",
      "valico",
      "valletta",
      "valoroso",
      "valutare",
      "valvola",
      "vampata",
      "vangare",
      "vanitoso",
      "vano",
      "vantaggio",
      "vanvera",
      "vapore",
      "varano",
      "varcato",
      "variante",
      "vasca",
      "vedetta",
      "vedova",
      "veduto",
      "vegetale",
      "veicolo",
      "velcro",
      "velina",
      "velluto",
      "veloce",
      "venato",
      "vendemmia",
      "vento",
      "verace",
      "verbale",
      "vergogna",
      "verifica",
      "vero",
      "verruca",
      "verticale",
      "vescica",
      "vessillo",
      "vestale",
      "veterano",
      "vetrina",
      "vetusto",
      "viandante",
      "vibrante",
      "vicenda",
      "vichingo",
      "vicinanza",
      "vidimare",
      "vigilia",
      "vigneto",
      "vigore",
      "vile",
      "villano",
      "vimini",
      "vincitore",
      "viola",
      "vipera",
      "virgola",
      "virologo",
      "virulento",
      "viscoso",
      "visione",
      "vispo",
      "vissuto",
      "visura",
      "vita",
      "vitello",
      "vittima",
      "vivanda",
      "vivido",
      "viziare",
      "voce",
      "voga",
      "volatile",
      "volere",
      "volpe",
      "voragine",
      "vulcano",
      "zampogna",
      "zanna",
      "zappato",
      "zattera",
      "zavorra",
      "zefiro",
      "zelante",
      "zelo",
      "zenzero",
      "zerbino",
      "zibetto",
      "zinco",
      "zircone",
      "zitto",
      "zolla",
      "zotico",
      "zucchero",
      "zufolo",
      "zulu",
      "zuppa"
    ];
  }
});

// node_modules/bip39/src/wordlists/spanish.json
var require_spanish = __commonJS({
  "node_modules/bip39/src/wordlists/spanish.json"(exports, module2) {
    module2.exports = [
      "a\u0301baco",
      "abdomen",
      "abeja",
      "abierto",
      "abogado",
      "abono",
      "aborto",
      "abrazo",
      "abrir",
      "abuelo",
      "abuso",
      "acabar",
      "academia",
      "acceso",
      "accio\u0301n",
      "aceite",
      "acelga",
      "acento",
      "aceptar",
      "a\u0301cido",
      "aclarar",
      "acne\u0301",
      "acoger",
      "acoso",
      "activo",
      "acto",
      "actriz",
      "actuar",
      "acudir",
      "acuerdo",
      "acusar",
      "adicto",
      "admitir",
      "adoptar",
      "adorno",
      "aduana",
      "adulto",
      "ae\u0301reo",
      "afectar",
      "aficio\u0301n",
      "afinar",
      "afirmar",
      "a\u0301gil",
      "agitar",
      "agoni\u0301a",
      "agosto",
      "agotar",
      "agregar",
      "agrio",
      "agua",
      "agudo",
      "a\u0301guila",
      "aguja",
      "ahogo",
      "ahorro",
      "aire",
      "aislar",
      "ajedrez",
      "ajeno",
      "ajuste",
      "alacra\u0301n",
      "alambre",
      "alarma",
      "alba",
      "a\u0301lbum",
      "alcalde",
      "aldea",
      "alegre",
      "alejar",
      "alerta",
      "aleta",
      "alfiler",
      "alga",
      "algodo\u0301n",
      "aliado",
      "aliento",
      "alivio",
      "alma",
      "almeja",
      "almi\u0301bar",
      "altar",
      "alteza",
      "altivo",
      "alto",
      "altura",
      "alumno",
      "alzar",
      "amable",
      "amante",
      "amapola",
      "amargo",
      "amasar",
      "a\u0301mbar",
      "a\u0301mbito",
      "ameno",
      "amigo",
      "amistad",
      "amor",
      "amparo",
      "amplio",
      "ancho",
      "anciano",
      "ancla",
      "andar",
      "ande\u0301n",
      "anemia",
      "a\u0301ngulo",
      "anillo",
      "a\u0301nimo",
      "ani\u0301s",
      "anotar",
      "antena",
      "antiguo",
      "antojo",
      "anual",
      "anular",
      "anuncio",
      "an\u0303adir",
      "an\u0303ejo",
      "an\u0303o",
      "apagar",
      "aparato",
      "apetito",
      "apio",
      "aplicar",
      "apodo",
      "aporte",
      "apoyo",
      "aprender",
      "aprobar",
      "apuesta",
      "apuro",
      "arado",
      "aran\u0303a",
      "arar",
      "a\u0301rbitro",
      "a\u0301rbol",
      "arbusto",
      "archivo",
      "arco",
      "arder",
      "ardilla",
      "arduo",
      "a\u0301rea",
      "a\u0301rido",
      "aries",
      "armoni\u0301a",
      "arne\u0301s",
      "aroma",
      "arpa",
      "arpo\u0301n",
      "arreglo",
      "arroz",
      "arruga",
      "arte",
      "artista",
      "asa",
      "asado",
      "asalto",
      "ascenso",
      "asegurar",
      "aseo",
      "asesor",
      "asiento",
      "asilo",
      "asistir",
      "asno",
      "asombro",
      "a\u0301spero",
      "astilla",
      "astro",
      "astuto",
      "asumir",
      "asunto",
      "atajo",
      "ataque",
      "atar",
      "atento",
      "ateo",
      "a\u0301tico",
      "atleta",
      "a\u0301tomo",
      "atraer",
      "atroz",
      "atu\u0301n",
      "audaz",
      "audio",
      "auge",
      "aula",
      "aumento",
      "ausente",
      "autor",
      "aval",
      "avance",
      "avaro",
      "ave",
      "avellana",
      "avena",
      "avestruz",
      "avio\u0301n",
      "aviso",
      "ayer",
      "ayuda",
      "ayuno",
      "azafra\u0301n",
      "azar",
      "azote",
      "azu\u0301car",
      "azufre",
      "azul",
      "baba",
      "babor",
      "bache",
      "bahi\u0301a",
      "baile",
      "bajar",
      "balanza",
      "balco\u0301n",
      "balde",
      "bambu\u0301",
      "banco",
      "banda",
      "ban\u0303o",
      "barba",
      "barco",
      "barniz",
      "barro",
      "ba\u0301scula",
      "basto\u0301n",
      "basura",
      "batalla",
      "bateri\u0301a",
      "batir",
      "batuta",
      "bau\u0301l",
      "bazar",
      "bebe\u0301",
      "bebida",
      "bello",
      "besar",
      "beso",
      "bestia",
      "bicho",
      "bien",
      "bingo",
      "blanco",
      "bloque",
      "blusa",
      "boa",
      "bobina",
      "bobo",
      "boca",
      "bocina",
      "boda",
      "bodega",
      "boina",
      "bola",
      "bolero",
      "bolsa",
      "bomba",
      "bondad",
      "bonito",
      "bono",
      "bonsa\u0301i",
      "borde",
      "borrar",
      "bosque",
      "bote",
      "boti\u0301n",
      "bo\u0301veda",
      "bozal",
      "bravo",
      "brazo",
      "brecha",
      "breve",
      "brillo",
      "brinco",
      "brisa",
      "broca",
      "broma",
      "bronce",
      "brote",
      "bruja",
      "brusco",
      "bruto",
      "buceo",
      "bucle",
      "bueno",
      "buey",
      "bufanda",
      "bufo\u0301n",
      "bu\u0301ho",
      "buitre",
      "bulto",
      "burbuja",
      "burla",
      "burro",
      "buscar",
      "butaca",
      "buzo\u0301n",
      "caballo",
      "cabeza",
      "cabina",
      "cabra",
      "cacao",
      "cada\u0301ver",
      "cadena",
      "caer",
      "cafe\u0301",
      "cai\u0301da",
      "caima\u0301n",
      "caja",
      "cajo\u0301n",
      "cal",
      "calamar",
      "calcio",
      "caldo",
      "calidad",
      "calle",
      "calma",
      "calor",
      "calvo",
      "cama",
      "cambio",
      "camello",
      "camino",
      "campo",
      "ca\u0301ncer",
      "candil",
      "canela",
      "canguro",
      "canica",
      "canto",
      "can\u0303a",
      "can\u0303o\u0301n",
      "caoba",
      "caos",
      "capaz",
      "capita\u0301n",
      "capote",
      "captar",
      "capucha",
      "cara",
      "carbo\u0301n",
      "ca\u0301rcel",
      "careta",
      "carga",
      "carin\u0303o",
      "carne",
      "carpeta",
      "carro",
      "carta",
      "casa",
      "casco",
      "casero",
      "caspa",
      "castor",
      "catorce",
      "catre",
      "caudal",
      "causa",
      "cazo",
      "cebolla",
      "ceder",
      "cedro",
      "celda",
      "ce\u0301lebre",
      "celoso",
      "ce\u0301lula",
      "cemento",
      "ceniza",
      "centro",
      "cerca",
      "cerdo",
      "cereza",
      "cero",
      "cerrar",
      "certeza",
      "ce\u0301sped",
      "cetro",
      "chacal",
      "chaleco",
      "champu\u0301",
      "chancla",
      "chapa",
      "charla",
      "chico",
      "chiste",
      "chivo",
      "choque",
      "choza",
      "chuleta",
      "chupar",
      "ciclo\u0301n",
      "ciego",
      "cielo",
      "cien",
      "cierto",
      "cifra",
      "cigarro",
      "cima",
      "cinco",
      "cine",
      "cinta",
      "cipre\u0301s",
      "circo",
      "ciruela",
      "cisne",
      "cita",
      "ciudad",
      "clamor",
      "clan",
      "claro",
      "clase",
      "clave",
      "cliente",
      "clima",
      "cli\u0301nica",
      "cobre",
      "coccio\u0301n",
      "cochino",
      "cocina",
      "coco",
      "co\u0301digo",
      "codo",
      "cofre",
      "coger",
      "cohete",
      "coji\u0301n",
      "cojo",
      "cola",
      "colcha",
      "colegio",
      "colgar",
      "colina",
      "collar",
      "colmo",
      "columna",
      "combate",
      "comer",
      "comida",
      "co\u0301modo",
      "compra",
      "conde",
      "conejo",
      "conga",
      "conocer",
      "consejo",
      "contar",
      "copa",
      "copia",
      "corazo\u0301n",
      "corbata",
      "corcho",
      "cordo\u0301n",
      "corona",
      "correr",
      "coser",
      "cosmos",
      "costa",
      "cra\u0301neo",
      "cra\u0301ter",
      "crear",
      "crecer",
      "crei\u0301do",
      "crema",
      "cri\u0301a",
      "crimen",
      "cripta",
      "crisis",
      "cromo",
      "cro\u0301nica",
      "croqueta",
      "crudo",
      "cruz",
      "cuadro",
      "cuarto",
      "cuatro",
      "cubo",
      "cubrir",
      "cuchara",
      "cuello",
      "cuento",
      "cuerda",
      "cuesta",
      "cueva",
      "cuidar",
      "culebra",
      "culpa",
      "culto",
      "cumbre",
      "cumplir",
      "cuna",
      "cuneta",
      "cuota",
      "cupo\u0301n",
      "cu\u0301pula",
      "curar",
      "curioso",
      "curso",
      "curva",
      "cutis",
      "dama",
      "danza",
      "dar",
      "dardo",
      "da\u0301til",
      "deber",
      "de\u0301bil",
      "de\u0301cada",
      "decir",
      "dedo",
      "defensa",
      "definir",
      "dejar",
      "delfi\u0301n",
      "delgado",
      "delito",
      "demora",
      "denso",
      "dental",
      "deporte",
      "derecho",
      "derrota",
      "desayuno",
      "deseo",
      "desfile",
      "desnudo",
      "destino",
      "desvi\u0301o",
      "detalle",
      "detener",
      "deuda",
      "di\u0301a",
      "diablo",
      "diadema",
      "diamante",
      "diana",
      "diario",
      "dibujo",
      "dictar",
      "diente",
      "dieta",
      "diez",
      "difi\u0301cil",
      "digno",
      "dilema",
      "diluir",
      "dinero",
      "directo",
      "dirigir",
      "disco",
      "disen\u0303o",
      "disfraz",
      "diva",
      "divino",
      "doble",
      "doce",
      "dolor",
      "domingo",
      "don",
      "donar",
      "dorado",
      "dormir",
      "dorso",
      "dos",
      "dosis",
      "drago\u0301n",
      "droga",
      "ducha",
      "duda",
      "duelo",
      "duen\u0303o",
      "dulce",
      "du\u0301o",
      "duque",
      "durar",
      "dureza",
      "duro",
      "e\u0301bano",
      "ebrio",
      "echar",
      "eco",
      "ecuador",
      "edad",
      "edicio\u0301n",
      "edificio",
      "editor",
      "educar",
      "efecto",
      "eficaz",
      "eje",
      "ejemplo",
      "elefante",
      "elegir",
      "elemento",
      "elevar",
      "elipse",
      "e\u0301lite",
      "elixir",
      "elogio",
      "eludir",
      "embudo",
      "emitir",
      "emocio\u0301n",
      "empate",
      "empen\u0303o",
      "empleo",
      "empresa",
      "enano",
      "encargo",
      "enchufe",
      "enci\u0301a",
      "enemigo",
      "enero",
      "enfado",
      "enfermo",
      "engan\u0303o",
      "enigma",
      "enlace",
      "enorme",
      "enredo",
      "ensayo",
      "ensen\u0303ar",
      "entero",
      "entrar",
      "envase",
      "envi\u0301o",
      "e\u0301poca",
      "equipo",
      "erizo",
      "escala",
      "escena",
      "escolar",
      "escribir",
      "escudo",
      "esencia",
      "esfera",
      "esfuerzo",
      "espada",
      "espejo",
      "espi\u0301a",
      "esposa",
      "espuma",
      "esqui\u0301",
      "estar",
      "este",
      "estilo",
      "estufa",
      "etapa",
      "eterno",
      "e\u0301tica",
      "etnia",
      "evadir",
      "evaluar",
      "evento",
      "evitar",
      "exacto",
      "examen",
      "exceso",
      "excusa",
      "exento",
      "exigir",
      "exilio",
      "existir",
      "e\u0301xito",
      "experto",
      "explicar",
      "exponer",
      "extremo",
      "fa\u0301brica",
      "fa\u0301bula",
      "fachada",
      "fa\u0301cil",
      "factor",
      "faena",
      "faja",
      "falda",
      "fallo",
      "falso",
      "faltar",
      "fama",
      "familia",
      "famoso",
      "farao\u0301n",
      "farmacia",
      "farol",
      "farsa",
      "fase",
      "fatiga",
      "fauna",
      "favor",
      "fax",
      "febrero",
      "fecha",
      "feliz",
      "feo",
      "feria",
      "feroz",
      "fe\u0301rtil",
      "fervor",
      "festi\u0301n",
      "fiable",
      "fianza",
      "fiar",
      "fibra",
      "ficcio\u0301n",
      "ficha",
      "fideo",
      "fiebre",
      "fiel",
      "fiera",
      "fiesta",
      "figura",
      "fijar",
      "fijo",
      "fila",
      "filete",
      "filial",
      "filtro",
      "fin",
      "finca",
      "fingir",
      "finito",
      "firma",
      "flaco",
      "flauta",
      "flecha",
      "flor",
      "flota",
      "fluir",
      "flujo",
      "flu\u0301or",
      "fobia",
      "foca",
      "fogata",
      "fogo\u0301n",
      "folio",
      "folleto",
      "fondo",
      "forma",
      "forro",
      "fortuna",
      "forzar",
      "fosa",
      "foto",
      "fracaso",
      "fra\u0301gil",
      "franja",
      "frase",
      "fraude",
      "frei\u0301r",
      "freno",
      "fresa",
      "fri\u0301o",
      "frito",
      "fruta",
      "fuego",
      "fuente",
      "fuerza",
      "fuga",
      "fumar",
      "funcio\u0301n",
      "funda",
      "furgo\u0301n",
      "furia",
      "fusil",
      "fu\u0301tbol",
      "futuro",
      "gacela",
      "gafas",
      "gaita",
      "gajo",
      "gala",
      "galeri\u0301a",
      "gallo",
      "gamba",
      "ganar",
      "gancho",
      "ganga",
      "ganso",
      "garaje",
      "garza",
      "gasolina",
      "gastar",
      "gato",
      "gavila\u0301n",
      "gemelo",
      "gemir",
      "gen",
      "ge\u0301nero",
      "genio",
      "gente",
      "geranio",
      "gerente",
      "germen",
      "gesto",
      "gigante",
      "gimnasio",
      "girar",
      "giro",
      "glaciar",
      "globo",
      "gloria",
      "gol",
      "golfo",
      "goloso",
      "golpe",
      "goma",
      "gordo",
      "gorila",
      "gorra",
      "gota",
      "goteo",
      "gozar",
      "grada",
      "gra\u0301fico",
      "grano",
      "grasa",
      "gratis",
      "grave",
      "grieta",
      "grillo",
      "gripe",
      "gris",
      "grito",
      "grosor",
      "gru\u0301a",
      "grueso",
      "grumo",
      "grupo",
      "guante",
      "guapo",
      "guardia",
      "guerra",
      "gui\u0301a",
      "guin\u0303o",
      "guion",
      "guiso",
      "guitarra",
      "gusano",
      "gustar",
      "haber",
      "ha\u0301bil",
      "hablar",
      "hacer",
      "hacha",
      "hada",
      "hallar",
      "hamaca",
      "harina",
      "haz",
      "hazan\u0303a",
      "hebilla",
      "hebra",
      "hecho",
      "helado",
      "helio",
      "hembra",
      "herir",
      "hermano",
      "he\u0301roe",
      "hervir",
      "hielo",
      "hierro",
      "hi\u0301gado",
      "higiene",
      "hijo",
      "himno",
      "historia",
      "hocico",
      "hogar",
      "hoguera",
      "hoja",
      "hombre",
      "hongo",
      "honor",
      "honra",
      "hora",
      "hormiga",
      "horno",
      "hostil",
      "hoyo",
      "hueco",
      "huelga",
      "huerta",
      "hueso",
      "huevo",
      "huida",
      "huir",
      "humano",
      "hu\u0301medo",
      "humilde",
      "humo",
      "hundir",
      "huraca\u0301n",
      "hurto",
      "icono",
      "ideal",
      "idioma",
      "i\u0301dolo",
      "iglesia",
      "iglu\u0301",
      "igual",
      "ilegal",
      "ilusio\u0301n",
      "imagen",
      "ima\u0301n",
      "imitar",
      "impar",
      "imperio",
      "imponer",
      "impulso",
      "incapaz",
      "i\u0301ndice",
      "inerte",
      "infiel",
      "informe",
      "ingenio",
      "inicio",
      "inmenso",
      "inmune",
      "innato",
      "insecto",
      "instante",
      "intere\u0301s",
      "i\u0301ntimo",
      "intuir",
      "inu\u0301til",
      "invierno",
      "ira",
      "iris",
      "ironi\u0301a",
      "isla",
      "islote",
      "jabali\u0301",
      "jabo\u0301n",
      "jamo\u0301n",
      "jarabe",
      "jardi\u0301n",
      "jarra",
      "jaula",
      "jazmi\u0301n",
      "jefe",
      "jeringa",
      "jinete",
      "jornada",
      "joroba",
      "joven",
      "joya",
      "juerga",
      "jueves",
      "juez",
      "jugador",
      "jugo",
      "juguete",
      "juicio",
      "junco",
      "jungla",
      "junio",
      "juntar",
      "ju\u0301piter",
      "jurar",
      "justo",
      "juvenil",
      "juzgar",
      "kilo",
      "koala",
      "labio",
      "lacio",
      "lacra",
      "lado",
      "ladro\u0301n",
      "lagarto",
      "la\u0301grima",
      "laguna",
      "laico",
      "lamer",
      "la\u0301mina",
      "la\u0301mpara",
      "lana",
      "lancha",
      "langosta",
      "lanza",
      "la\u0301piz",
      "largo",
      "larva",
      "la\u0301stima",
      "lata",
      "la\u0301tex",
      "latir",
      "laurel",
      "lavar",
      "lazo",
      "leal",
      "leccio\u0301n",
      "leche",
      "lector",
      "leer",
      "legio\u0301n",
      "legumbre",
      "lejano",
      "lengua",
      "lento",
      "len\u0303a",
      "leo\u0301n",
      "leopardo",
      "lesio\u0301n",
      "letal",
      "letra",
      "leve",
      "leyenda",
      "libertad",
      "libro",
      "licor",
      "li\u0301der",
      "lidiar",
      "lienzo",
      "liga",
      "ligero",
      "lima",
      "li\u0301mite",
      "limo\u0301n",
      "limpio",
      "lince",
      "lindo",
      "li\u0301nea",
      "lingote",
      "lino",
      "linterna",
      "li\u0301quido",
      "liso",
      "lista",
      "litera",
      "litio",
      "litro",
      "llaga",
      "llama",
      "llanto",
      "llave",
      "llegar",
      "llenar",
      "llevar",
      "llorar",
      "llover",
      "lluvia",
      "lobo",
      "locio\u0301n",
      "loco",
      "locura",
      "lo\u0301gica",
      "logro",
      "lombriz",
      "lomo",
      "lonja",
      "lote",
      "lucha",
      "lucir",
      "lugar",
      "lujo",
      "luna",
      "lunes",
      "lupa",
      "lustro",
      "luto",
      "luz",
      "maceta",
      "macho",
      "madera",
      "madre",
      "maduro",
      "maestro",
      "mafia",
      "magia",
      "mago",
      "mai\u0301z",
      "maldad",
      "maleta",
      "malla",
      "malo",
      "mama\u0301",
      "mambo",
      "mamut",
      "manco",
      "mando",
      "manejar",
      "manga",
      "maniqui\u0301",
      "manjar",
      "mano",
      "manso",
      "manta",
      "man\u0303ana",
      "mapa",
      "ma\u0301quina",
      "mar",
      "marco",
      "marea",
      "marfil",
      "margen",
      "marido",
      "ma\u0301rmol",
      "marro\u0301n",
      "martes",
      "marzo",
      "masa",
      "ma\u0301scara",
      "masivo",
      "matar",
      "materia",
      "matiz",
      "matriz",
      "ma\u0301ximo",
      "mayor",
      "mazorca",
      "mecha",
      "medalla",
      "medio",
      "me\u0301dula",
      "mejilla",
      "mejor",
      "melena",
      "melo\u0301n",
      "memoria",
      "menor",
      "mensaje",
      "mente",
      "menu\u0301",
      "mercado",
      "merengue",
      "me\u0301rito",
      "mes",
      "meso\u0301n",
      "meta",
      "meter",
      "me\u0301todo",
      "metro",
      "mezcla",
      "miedo",
      "miel",
      "miembro",
      "miga",
      "mil",
      "milagro",
      "militar",
      "millo\u0301n",
      "mimo",
      "mina",
      "minero",
      "mi\u0301nimo",
      "minuto",
      "miope",
      "mirar",
      "misa",
      "miseria",
      "misil",
      "mismo",
      "mitad",
      "mito",
      "mochila",
      "mocio\u0301n",
      "moda",
      "modelo",
      "moho",
      "mojar",
      "molde",
      "moler",
      "molino",
      "momento",
      "momia",
      "monarca",
      "moneda",
      "monja",
      "monto",
      "mon\u0303o",
      "morada",
      "morder",
      "moreno",
      "morir",
      "morro",
      "morsa",
      "mortal",
      "mosca",
      "mostrar",
      "motivo",
      "mover",
      "mo\u0301vil",
      "mozo",
      "mucho",
      "mudar",
      "mueble",
      "muela",
      "muerte",
      "muestra",
      "mugre",
      "mujer",
      "mula",
      "muleta",
      "multa",
      "mundo",
      "mun\u0303eca",
      "mural",
      "muro",
      "mu\u0301sculo",
      "museo",
      "musgo",
      "mu\u0301sica",
      "muslo",
      "na\u0301car",
      "nacio\u0301n",
      "nadar",
      "naipe",
      "naranja",
      "nariz",
      "narrar",
      "nasal",
      "natal",
      "nativo",
      "natural",
      "na\u0301usea",
      "naval",
      "nave",
      "navidad",
      "necio",
      "ne\u0301ctar",
      "negar",
      "negocio",
      "negro",
      "neo\u0301n",
      "nervio",
      "neto",
      "neutro",
      "nevar",
      "nevera",
      "nicho",
      "nido",
      "niebla",
      "nieto",
      "nin\u0303ez",
      "nin\u0303o",
      "ni\u0301tido",
      "nivel",
      "nobleza",
      "noche",
      "no\u0301mina",
      "noria",
      "norma",
      "norte",
      "nota",
      "noticia",
      "novato",
      "novela",
      "novio",
      "nube",
      "nuca",
      "nu\u0301cleo",
      "nudillo",
      "nudo",
      "nuera",
      "nueve",
      "nuez",
      "nulo",
      "nu\u0301mero",
      "nutria",
      "oasis",
      "obeso",
      "obispo",
      "objeto",
      "obra",
      "obrero",
      "observar",
      "obtener",
      "obvio",
      "oca",
      "ocaso",
      "oce\u0301ano",
      "ochenta",
      "ocho",
      "ocio",
      "ocre",
      "octavo",
      "octubre",
      "oculto",
      "ocupar",
      "ocurrir",
      "odiar",
      "odio",
      "odisea",
      "oeste",
      "ofensa",
      "oferta",
      "oficio",
      "ofrecer",
      "ogro",
      "oi\u0301do",
      "oi\u0301r",
      "ojo",
      "ola",
      "oleada",
      "olfato",
      "olivo",
      "olla",
      "olmo",
      "olor",
      "olvido",
      "ombligo",
      "onda",
      "onza",
      "opaco",
      "opcio\u0301n",
      "o\u0301pera",
      "opinar",
      "oponer",
      "optar",
      "o\u0301ptica",
      "opuesto",
      "oracio\u0301n",
      "orador",
      "oral",
      "o\u0301rbita",
      "orca",
      "orden",
      "oreja",
      "o\u0301rgano",
      "orgi\u0301a",
      "orgullo",
      "oriente",
      "origen",
      "orilla",
      "oro",
      "orquesta",
      "oruga",
      "osadi\u0301a",
      "oscuro",
      "osezno",
      "oso",
      "ostra",
      "oton\u0303o",
      "otro",
      "oveja",
      "o\u0301vulo",
      "o\u0301xido",
      "oxi\u0301geno",
      "oyente",
      "ozono",
      "pacto",
      "padre",
      "paella",
      "pa\u0301gina",
      "pago",
      "pai\u0301s",
      "pa\u0301jaro",
      "palabra",
      "palco",
      "paleta",
      "pa\u0301lido",
      "palma",
      "paloma",
      "palpar",
      "pan",
      "panal",
      "pa\u0301nico",
      "pantera",
      "pan\u0303uelo",
      "papa\u0301",
      "papel",
      "papilla",
      "paquete",
      "parar",
      "parcela",
      "pared",
      "parir",
      "paro",
      "pa\u0301rpado",
      "parque",
      "pa\u0301rrafo",
      "parte",
      "pasar",
      "paseo",
      "pasio\u0301n",
      "paso",
      "pasta",
      "pata",
      "patio",
      "patria",
      "pausa",
      "pauta",
      "pavo",
      "payaso",
      "peato\u0301n",
      "pecado",
      "pecera",
      "pecho",
      "pedal",
      "pedir",
      "pegar",
      "peine",
      "pelar",
      "peldan\u0303o",
      "pelea",
      "peligro",
      "pellejo",
      "pelo",
      "peluca",
      "pena",
      "pensar",
      "pen\u0303o\u0301n",
      "peo\u0301n",
      "peor",
      "pepino",
      "pequen\u0303o",
      "pera",
      "percha",
      "perder",
      "pereza",
      "perfil",
      "perico",
      "perla",
      "permiso",
      "perro",
      "persona",
      "pesa",
      "pesca",
      "pe\u0301simo",
      "pestan\u0303a",
      "pe\u0301talo",
      "petro\u0301leo",
      "pez",
      "pezun\u0303a",
      "picar",
      "picho\u0301n",
      "pie",
      "piedra",
      "pierna",
      "pieza",
      "pijama",
      "pilar",
      "piloto",
      "pimienta",
      "pino",
      "pintor",
      "pinza",
      "pin\u0303a",
      "piojo",
      "pipa",
      "pirata",
      "pisar",
      "piscina",
      "piso",
      "pista",
      "pito\u0301n",
      "pizca",
      "placa",
      "plan",
      "plata",
      "playa",
      "plaza",
      "pleito",
      "pleno",
      "plomo",
      "pluma",
      "plural",
      "pobre",
      "poco",
      "poder",
      "podio",
      "poema",
      "poesi\u0301a",
      "poeta",
      "polen",
      "polici\u0301a",
      "pollo",
      "polvo",
      "pomada",
      "pomelo",
      "pomo",
      "pompa",
      "poner",
      "porcio\u0301n",
      "portal",
      "posada",
      "poseer",
      "posible",
      "poste",
      "potencia",
      "potro",
      "pozo",
      "prado",
      "precoz",
      "pregunta",
      "premio",
      "prensa",
      "preso",
      "previo",
      "primo",
      "pri\u0301ncipe",
      "prisio\u0301n",
      "privar",
      "proa",
      "probar",
      "proceso",
      "producto",
      "proeza",
      "profesor",
      "programa",
      "prole",
      "promesa",
      "pronto",
      "propio",
      "pro\u0301ximo",
      "prueba",
      "pu\u0301blico",
      "puchero",
      "pudor",
      "pueblo",
      "puerta",
      "puesto",
      "pulga",
      "pulir",
      "pulmo\u0301n",
      "pulpo",
      "pulso",
      "puma",
      "punto",
      "pun\u0303al",
      "pun\u0303o",
      "pupa",
      "pupila",
      "pure\u0301",
      "quedar",
      "queja",
      "quemar",
      "querer",
      "queso",
      "quieto",
      "qui\u0301mica",
      "quince",
      "quitar",
      "ra\u0301bano",
      "rabia",
      "rabo",
      "racio\u0301n",
      "radical",
      "rai\u0301z",
      "rama",
      "rampa",
      "rancho",
      "rango",
      "rapaz",
      "ra\u0301pido",
      "rapto",
      "rasgo",
      "raspa",
      "rato",
      "rayo",
      "raza",
      "razo\u0301n",
      "reaccio\u0301n",
      "realidad",
      "reban\u0303o",
      "rebote",
      "recaer",
      "receta",
      "rechazo",
      "recoger",
      "recreo",
      "recto",
      "recurso",
      "red",
      "redondo",
      "reducir",
      "reflejo",
      "reforma",
      "refra\u0301n",
      "refugio",
      "regalo",
      "regir",
      "regla",
      "regreso",
      "rehe\u0301n",
      "reino",
      "rei\u0301r",
      "reja",
      "relato",
      "relevo",
      "relieve",
      "relleno",
      "reloj",
      "remar",
      "remedio",
      "remo",
      "rencor",
      "rendir",
      "renta",
      "reparto",
      "repetir",
      "reposo",
      "reptil",
      "res",
      "rescate",
      "resina",
      "respeto",
      "resto",
      "resumen",
      "retiro",
      "retorno",
      "retrato",
      "reunir",
      "reve\u0301s",
      "revista",
      "rey",
      "rezar",
      "rico",
      "riego",
      "rienda",
      "riesgo",
      "rifa",
      "ri\u0301gido",
      "rigor",
      "rinco\u0301n",
      "rin\u0303o\u0301n",
      "ri\u0301o",
      "riqueza",
      "risa",
      "ritmo",
      "rito",
      "rizo",
      "roble",
      "roce",
      "rociar",
      "rodar",
      "rodeo",
      "rodilla",
      "roer",
      "rojizo",
      "rojo",
      "romero",
      "romper",
      "ron",
      "ronco",
      "ronda",
      "ropa",
      "ropero",
      "rosa",
      "rosca",
      "rostro",
      "rotar",
      "rubi\u0301",
      "rubor",
      "rudo",
      "rueda",
      "rugir",
      "ruido",
      "ruina",
      "ruleta",
      "rulo",
      "rumbo",
      "rumor",
      "ruptura",
      "ruta",
      "rutina",
      "sa\u0301bado",
      "saber",
      "sabio",
      "sable",
      "sacar",
      "sagaz",
      "sagrado",
      "sala",
      "saldo",
      "salero",
      "salir",
      "salmo\u0301n",
      "salo\u0301n",
      "salsa",
      "salto",
      "salud",
      "salvar",
      "samba",
      "sancio\u0301n",
      "sandi\u0301a",
      "sanear",
      "sangre",
      "sanidad",
      "sano",
      "santo",
      "sapo",
      "saque",
      "sardina",
      "sarte\u0301n",
      "sastre",
      "sata\u0301n",
      "sauna",
      "saxofo\u0301n",
      "seccio\u0301n",
      "seco",
      "secreto",
      "secta",
      "sed",
      "seguir",
      "seis",
      "sello",
      "selva",
      "semana",
      "semilla",
      "senda",
      "sensor",
      "sen\u0303al",
      "sen\u0303or",
      "separar",
      "sepia",
      "sequi\u0301a",
      "ser",
      "serie",
      "sermo\u0301n",
      "servir",
      "sesenta",
      "sesio\u0301n",
      "seta",
      "setenta",
      "severo",
      "sexo",
      "sexto",
      "sidra",
      "siesta",
      "siete",
      "siglo",
      "signo",
      "si\u0301laba",
      "silbar",
      "silencio",
      "silla",
      "si\u0301mbolo",
      "simio",
      "sirena",
      "sistema",
      "sitio",
      "situar",
      "sobre",
      "socio",
      "sodio",
      "sol",
      "solapa",
      "soldado",
      "soledad",
      "so\u0301lido",
      "soltar",
      "solucio\u0301n",
      "sombra",
      "sondeo",
      "sonido",
      "sonoro",
      "sonrisa",
      "sopa",
      "soplar",
      "soporte",
      "sordo",
      "sorpresa",
      "sorteo",
      "soste\u0301n",
      "so\u0301tano",
      "suave",
      "subir",
      "suceso",
      "sudor",
      "suegra",
      "suelo",
      "suen\u0303o",
      "suerte",
      "sufrir",
      "sujeto",
      "sulta\u0301n",
      "sumar",
      "superar",
      "suplir",
      "suponer",
      "supremo",
      "sur",
      "surco",
      "suren\u0303o",
      "surgir",
      "susto",
      "sutil",
      "tabaco",
      "tabique",
      "tabla",
      "tabu\u0301",
      "taco",
      "tacto",
      "tajo",
      "talar",
      "talco",
      "talento",
      "talla",
      "talo\u0301n",
      "taman\u0303o",
      "tambor",
      "tango",
      "tanque",
      "tapa",
      "tapete",
      "tapia",
      "tapo\u0301n",
      "taquilla",
      "tarde",
      "tarea",
      "tarifa",
      "tarjeta",
      "tarot",
      "tarro",
      "tarta",
      "tatuaje",
      "tauro",
      "taza",
      "tazo\u0301n",
      "teatro",
      "techo",
      "tecla",
      "te\u0301cnica",
      "tejado",
      "tejer",
      "tejido",
      "tela",
      "tele\u0301fono",
      "tema",
      "temor",
      "templo",
      "tenaz",
      "tender",
      "tener",
      "tenis",
      "tenso",
      "teori\u0301a",
      "terapia",
      "terco",
      "te\u0301rmino",
      "ternura",
      "terror",
      "tesis",
      "tesoro",
      "testigo",
      "tetera",
      "texto",
      "tez",
      "tibio",
      "tiburo\u0301n",
      "tiempo",
      "tienda",
      "tierra",
      "tieso",
      "tigre",
      "tijera",
      "tilde",
      "timbre",
      "ti\u0301mido",
      "timo",
      "tinta",
      "ti\u0301o",
      "ti\u0301pico",
      "tipo",
      "tira",
      "tiro\u0301n",
      "tita\u0301n",
      "ti\u0301tere",
      "ti\u0301tulo",
      "tiza",
      "toalla",
      "tobillo",
      "tocar",
      "tocino",
      "todo",
      "toga",
      "toldo",
      "tomar",
      "tono",
      "tonto",
      "topar",
      "tope",
      "toque",
      "to\u0301rax",
      "torero",
      "tormenta",
      "torneo",
      "toro",
      "torpedo",
      "torre",
      "torso",
      "tortuga",
      "tos",
      "tosco",
      "toser",
      "to\u0301xico",
      "trabajo",
      "tractor",
      "traer",
      "tra\u0301fico",
      "trago",
      "traje",
      "tramo",
      "trance",
      "trato",
      "trauma",
      "trazar",
      "tre\u0301bol",
      "tregua",
      "treinta",
      "tren",
      "trepar",
      "tres",
      "tribu",
      "trigo",
      "tripa",
      "triste",
      "triunfo",
      "trofeo",
      "trompa",
      "tronco",
      "tropa",
      "trote",
      "trozo",
      "truco",
      "trueno",
      "trufa",
      "tuberi\u0301a",
      "tubo",
      "tuerto",
      "tumba",
      "tumor",
      "tu\u0301nel",
      "tu\u0301nica",
      "turbina",
      "turismo",
      "turno",
      "tutor",
      "ubicar",
      "u\u0301lcera",
      "umbral",
      "unidad",
      "unir",
      "universo",
      "uno",
      "untar",
      "un\u0303a",
      "urbano",
      "urbe",
      "urgente",
      "urna",
      "usar",
      "usuario",
      "u\u0301til",
      "utopi\u0301a",
      "uva",
      "vaca",
      "vaci\u0301o",
      "vacuna",
      "vagar",
      "vago",
      "vaina",
      "vajilla",
      "vale",
      "va\u0301lido",
      "valle",
      "valor",
      "va\u0301lvula",
      "vampiro",
      "vara",
      "variar",
      "varo\u0301n",
      "vaso",
      "vecino",
      "vector",
      "vehi\u0301culo",
      "veinte",
      "vejez",
      "vela",
      "velero",
      "veloz",
      "vena",
      "vencer",
      "venda",
      "veneno",
      "vengar",
      "venir",
      "venta",
      "venus",
      "ver",
      "verano",
      "verbo",
      "verde",
      "vereda",
      "verja",
      "verso",
      "verter",
      "vi\u0301a",
      "viaje",
      "vibrar",
      "vicio",
      "vi\u0301ctima",
      "vida",
      "vi\u0301deo",
      "vidrio",
      "viejo",
      "viernes",
      "vigor",
      "vil",
      "villa",
      "vinagre",
      "vino",
      "vin\u0303edo",
      "violi\u0301n",
      "viral",
      "virgo",
      "virtud",
      "visor",
      "vi\u0301spera",
      "vista",
      "vitamina",
      "viudo",
      "vivaz",
      "vivero",
      "vivir",
      "vivo",
      "volca\u0301n",
      "volumen",
      "volver",
      "voraz",
      "votar",
      "voto",
      "voz",
      "vuelo",
      "vulgar",
      "yacer",
      "yate",
      "yegua",
      "yema",
      "yerno",
      "yeso",
      "yodo",
      "yoga",
      "yogur",
      "zafiro",
      "zanja",
      "zapato",
      "zarza",
      "zona",
      "zorro",
      "zumo",
      "zurdo"
    ];
  }
});

// node_modules/bip39/src/wordlists/japanese.json
var require_japanese = __commonJS({
  "node_modules/bip39/src/wordlists/japanese.json"(exports, module2) {
    module2.exports = [
      "\u3042\u3044\u3053\u304F\u3057\u3093",
      "\u3042\u3044\u3055\u3064",
      "\u3042\u3044\u305F\u3099",
      "\u3042\u304A\u305D\u3099\u3089",
      "\u3042\u304B\u3061\u3083\u3093",
      "\u3042\u304D\u308B",
      "\u3042\u3051\u304B\u3099\u305F",
      "\u3042\u3051\u308B",
      "\u3042\u3053\u304B\u3099\u308C\u308B",
      "\u3042\u3055\u3044",
      "\u3042\u3055\u3072",
      "\u3042\u3057\u3042\u3068",
      "\u3042\u3057\u3099\u308F\u3046",
      "\u3042\u3059\u3099\u304B\u308B",
      "\u3042\u3059\u3099\u304D",
      "\u3042\u305D\u3075\u3099",
      "\u3042\u305F\u3048\u308B",
      "\u3042\u305F\u305F\u3081\u308B",
      "\u3042\u305F\u308A\u307E\u3048",
      "\u3042\u305F\u308B",
      "\u3042\u3064\u3044",
      "\u3042\u3064\u304B\u3046",
      "\u3042\u3063\u3057\u3085\u304F",
      "\u3042\u3064\u307E\u308A",
      "\u3042\u3064\u3081\u308B",
      "\u3042\u3066\u306A",
      "\u3042\u3066\u306F\u307E\u308B",
      "\u3042\u3072\u308B",
      "\u3042\u3075\u3099\u3089",
      "\u3042\u3075\u3099\u308B",
      "\u3042\u3075\u308C\u308B",
      "\u3042\u307E\u3044",
      "\u3042\u307E\u3068\u3099",
      "\u3042\u307E\u3084\u304B\u3059",
      "\u3042\u307E\u308A",
      "\u3042\u307F\u3082\u306E",
      "\u3042\u3081\u308A\u304B",
      "\u3042\u3084\u307E\u308B",
      "\u3042\u3086\u3080",
      "\u3042\u3089\u3044\u304F\u3099\u307E",
      "\u3042\u3089\u3057",
      "\u3042\u3089\u3059\u3057\u3099",
      "\u3042\u3089\u305F\u3081\u308B",
      "\u3042\u3089\u3086\u308B",
      "\u3042\u3089\u308F\u3059",
      "\u3042\u308A\u304B\u3099\u3068\u3046",
      "\u3042\u308F\u305B\u308B",
      "\u3042\u308F\u3066\u308B",
      "\u3042\u3093\u3044",
      "\u3042\u3093\u304B\u3099\u3044",
      "\u3042\u3093\u3053",
      "\u3042\u3093\u305B\u3099\u3093",
      "\u3042\u3093\u3066\u3044",
      "\u3042\u3093\u306A\u3044",
      "\u3042\u3093\u307E\u308A",
      "\u3044\u3044\u305F\u3099\u3059",
      "\u3044\u304A\u3093",
      "\u3044\u304B\u3099\u3044",
      "\u3044\u304B\u3099\u304F",
      "\u3044\u304D\u304A\u3044",
      "\u3044\u304D\u306A\u308A",
      "\u3044\u304D\u3082\u306E",
      "\u3044\u304D\u308B",
      "\u3044\u304F\u3057\u3099",
      "\u3044\u304F\u3075\u3099\u3093",
      "\u3044\u3051\u306F\u3099\u306A",
      "\u3044\u3051\u3093",
      "\u3044\u3053\u3046",
      "\u3044\u3053\u304F",
      "\u3044\u3053\u3064",
      "\u3044\u3055\u307E\u3057\u3044",
      "\u3044\u3055\u3093",
      "\u3044\u3057\u304D",
      "\u3044\u3057\u3099\u3085\u3046",
      "\u3044\u3057\u3099\u3087\u3046",
      "\u3044\u3057\u3099\u308F\u308B",
      "\u3044\u3059\u3099\u307F",
      "\u3044\u3059\u3099\u308C",
      "\u3044\u305B\u3044",
      "\u3044\u305B\u3048\u3072\u3099",
      "\u3044\u305B\u304B\u3044",
      "\u3044\u305B\u304D",
      "\u3044\u305B\u3099\u3093",
      "\u3044\u305D\u3046\u308D\u3046",
      "\u3044\u305D\u304B\u3099\u3057\u3044",
      "\u3044\u305F\u3099\u3044",
      "\u3044\u305F\u3099\u304F",
      "\u3044\u305F\u3059\u3099\u3089",
      "\u3044\u305F\u307F",
      "\u3044\u305F\u308A\u3042",
      "\u3044\u3061\u304A\u3046",
      "\u3044\u3061\u3057\u3099",
      "\u3044\u3061\u3068\u3099",
      "\u3044\u3061\u306F\u3099",
      "\u3044\u3061\u3075\u3099",
      "\u3044\u3061\u308A\u3085\u3046",
      "\u3044\u3064\u304B",
      "\u3044\u3063\u3057\u3085\u3093",
      "\u3044\u3063\u305B\u3044",
      "\u3044\u3063\u305D\u3046",
      "\u3044\u3063\u305F\u3093",
      "\u3044\u3063\u3061",
      "\u3044\u3063\u3066\u3044",
      "\u3044\u3063\u307B\u309A\u3046",
      "\u3044\u3066\u3055\u3099",
      "\u3044\u3066\u3093",
      "\u3044\u3068\u3099\u3046",
      "\u3044\u3068\u3053",
      "\u3044\u306A\u3044",
      "\u3044\u306A\u304B",
      "\u3044\u306D\u3080\u308A",
      "\u3044\u306E\u3061",
      "\u3044\u306E\u308B",
      "\u3044\u306F\u3064",
      "\u3044\u306F\u3099\u308B",
      "\u3044\u306F\u3093",
      "\u3044\u3072\u3099\u304D",
      "\u3044\u3072\u3093",
      "\u3044\u3075\u304F",
      "\u3044\u3078\u3093",
      "\u3044\u307B\u3046",
      "\u3044\u307F\u3093",
      "\u3044\u3082\u3046\u3068",
      "\u3044\u3082\u305F\u308C",
      "\u3044\u3082\u308A",
      "\u3044\u3084\u304B\u3099\u308B",
      "\u3044\u3084\u3059",
      "\u3044\u3088\u304B\u3093",
      "\u3044\u3088\u304F",
      "\u3044\u3089\u3044",
      "\u3044\u3089\u3059\u3068",
      "\u3044\u308A\u304F\u3099\u3061",
      "\u3044\u308A\u3087\u3046",
      "\u3044\u308C\u3044",
      "\u3044\u308C\u3082\u306E",
      "\u3044\u308C\u308B",
      "\u3044\u308D\u3048\u3093\u3072\u309A\u3064",
      "\u3044\u308F\u3044",
      "\u3044\u308F\u3046",
      "\u3044\u308F\u304B\u3093",
      "\u3044\u308F\u306F\u3099",
      "\u3044\u308F\u3086\u308B",
      "\u3044\u3093\u3051\u3099\u3093\u307E\u3081",
      "\u3044\u3093\u3055\u3064",
      "\u3044\u3093\u3057\u3087\u3046",
      "\u3044\u3093\u3088\u3046",
      "\u3046\u3048\u304D",
      "\u3046\u3048\u308B",
      "\u3046\u304A\u3055\u3099",
      "\u3046\u304B\u3099\u3044",
      "\u3046\u304B\u3075\u3099",
      "\u3046\u304B\u3078\u3099\u308B",
      "\u3046\u304D\u308F",
      "\u3046\u304F\u3089\u3044\u306A",
      "\u3046\u304F\u308C\u308C",
      "\u3046\u3051\u305F\u307E\u308F\u308B",
      "\u3046\u3051\u3064\u3051",
      "\u3046\u3051\u3068\u308B",
      "\u3046\u3051\u3082\u3064",
      "\u3046\u3051\u308B",
      "\u3046\u3053\u3099\u304B\u3059",
      "\u3046\u3053\u3099\u304F",
      "\u3046\u3053\u3093",
      "\u3046\u3055\u304D\u3099",
      "\u3046\u3057\u306A\u3046",
      "\u3046\u3057\u308D\u304B\u3099\u307F",
      "\u3046\u3059\u3044",
      "\u3046\u3059\u304D\u3099",
      "\u3046\u3059\u304F\u3099\u3089\u3044",
      "\u3046\u3059\u3081\u308B",
      "\u3046\u305B\u3064",
      "\u3046\u3061\u3042\u308F\u305B",
      "\u3046\u3061\u304B\u3099\u308F",
      "\u3046\u3061\u304D",
      "\u3046\u3061\u3085\u3046",
      "\u3046\u3063\u304B\u308A",
      "\u3046\u3064\u304F\u3057\u3044",
      "\u3046\u3063\u305F\u3048\u308B",
      "\u3046\u3064\u308B",
      "\u3046\u3068\u3099\u3093",
      "\u3046\u306A\u304D\u3099",
      "\u3046\u306A\u3057\u3099",
      "\u3046\u306A\u3059\u3099\u304F",
      "\u3046\u306A\u308B",
      "\u3046\u306D\u308B",
      "\u3046\u306E\u3046",
      "\u3046\u3075\u3099\u3051\u3099",
      "\u3046\u3075\u3099\u3053\u3099\u3048",
      "\u3046\u307E\u308C\u308B",
      "\u3046\u3081\u308B",
      "\u3046\u3082\u3046",
      "\u3046\u3084\u307E\u3046",
      "\u3046\u3088\u304F",
      "\u3046\u3089\u304B\u3099\u3048\u3059",
      "\u3046\u3089\u304F\u3099\u3061",
      "\u3046\u3089\u306A\u3044",
      "\u3046\u308A\u3042\u3051\u3099",
      "\u3046\u308A\u304D\u308C",
      "\u3046\u308B\u3055\u3044",
      "\u3046\u308C\u3057\u3044",
      "\u3046\u308C\u3086\u304D",
      "\u3046\u308C\u308B",
      "\u3046\u308D\u3053",
      "\u3046\u308F\u304D",
      "\u3046\u308F\u3055",
      "\u3046\u3093\u3053\u3046",
      "\u3046\u3093\u3061\u3093",
      "\u3046\u3093\u3066\u3093",
      "\u3046\u3093\u3068\u3099\u3046",
      "\u3048\u3044\u3048\u3093",
      "\u3048\u3044\u304B\u3099",
      "\u3048\u3044\u304D\u3087\u3046",
      "\u3048\u3044\u3053\u3099",
      "\u3048\u3044\u305B\u3044",
      "\u3048\u3044\u3075\u3099\u3093",
      "\u3048\u3044\u3088\u3046",
      "\u3048\u3044\u308F",
      "\u3048\u304A\u308A",
      "\u3048\u304B\u3099\u304A",
      "\u3048\u304B\u3099\u304F",
      "\u3048\u304D\u305F\u3044",
      "\u3048\u304F\u305B\u308B",
      "\u3048\u3057\u3083\u304F",
      "\u3048\u3059\u3066",
      "\u3048\u3064\u3089\u3093",
      "\u3048\u306E\u304F\u3099",
      "\u3048\u307B\u3046\u307E\u304D",
      "\u3048\u307B\u3093",
      "\u3048\u307E\u304D",
      "\u3048\u3082\u3057\u3099",
      "\u3048\u3082\u306E",
      "\u3048\u3089\u3044",
      "\u3048\u3089\u3075\u3099",
      "\u3048\u308A\u3042",
      "\u3048\u3093\u3048\u3093",
      "\u3048\u3093\u304B\u3044",
      "\u3048\u3093\u304D\u3099",
      "\u3048\u3093\u3051\u3099\u304D",
      "\u3048\u3093\u3057\u3085\u3046",
      "\u3048\u3093\u305B\u3099\u3064",
      "\u3048\u3093\u305D\u304F",
      "\u3048\u3093\u3061\u3087\u3046",
      "\u3048\u3093\u3068\u3064",
      "\u304A\u3044\u304B\u3051\u308B",
      "\u304A\u3044\u3053\u3059",
      "\u304A\u3044\u3057\u3044",
      "\u304A\u3044\u3064\u304F",
      "\u304A\u3046\u3048\u3093",
      "\u304A\u3046\u3055\u307E",
      "\u304A\u3046\u3057\u3099",
      "\u304A\u3046\u305B\u3064",
      "\u304A\u3046\u305F\u3044",
      "\u304A\u3046\u3075\u304F",
      "\u304A\u3046\u3078\u3099\u3044",
      "\u304A\u3046\u3088\u3046",
      "\u304A\u3048\u308B",
      "\u304A\u304A\u3044",
      "\u304A\u304A\u3046",
      "\u304A\u304A\u3068\u3099\u304A\u308A",
      "\u304A\u304A\u3084",
      "\u304A\u304A\u3088\u305D",
      "\u304A\u304B\u3048\u308A",
      "\u304A\u304B\u3059\u3099",
      "\u304A\u304B\u3099\u3080",
      "\u304A\u304B\u308F\u308A",
      "\u304A\u304D\u3099\u306A\u3046",
      "\u304A\u304D\u308B",
      "\u304A\u304F\u3055\u307E",
      "\u304A\u304F\u3057\u3099\u3087\u3046",
      "\u304A\u304F\u308A\u304B\u3099\u306A",
      "\u304A\u304F\u308B",
      "\u304A\u304F\u308C\u308B",
      "\u304A\u3053\u3059",
      "\u304A\u3053\u306A\u3046",
      "\u304A\u3053\u308B",
      "\u304A\u3055\u3048\u308B",
      "\u304A\u3055\u306A\u3044",
      "\u304A\u3055\u3081\u308B",
      "\u304A\u3057\u3044\u308C",
      "\u304A\u3057\u3048\u308B",
      "\u304A\u3057\u3099\u304D\u3099",
      "\u304A\u3057\u3099\u3055\u3093",
      "\u304A\u3057\u3083\u308C",
      "\u304A\u305D\u3089\u304F",
      "\u304A\u305D\u308F\u308B",
      "\u304A\u305F\u304B\u3099\u3044",
      "\u304A\u305F\u304F",
      "\u304A\u305F\u3099\u3084\u304B",
      "\u304A\u3061\u3064\u304F",
      "\u304A\u3063\u3068",
      "\u304A\u3064\u308A",
      "\u304A\u3066\u3099\u304B\u3051",
      "\u304A\u3068\u3057\u3082\u306E",
      "\u304A\u3068\u306A\u3057\u3044",
      "\u304A\u3068\u3099\u308A",
      "\u304A\u3068\u3099\u308D\u304B\u3059",
      "\u304A\u306F\u3099\u3055\u3093",
      "\u304A\u307E\u3044\u308A",
      "\u304A\u3081\u3066\u3099\u3068\u3046",
      "\u304A\u3082\u3044\u3066\u3099",
      "\u304A\u3082\u3046",
      "\u304A\u3082\u305F\u3044",
      "\u304A\u3082\u3061\u3083",
      "\u304A\u3084\u3064",
      "\u304A\u3084\u3086\u3072\u3099",
      "\u304A\u3088\u307B\u3099\u3059",
      "\u304A\u3089\u3093\u305F\u3099",
      "\u304A\u308D\u3059",
      "\u304A\u3093\u304B\u3099\u304F",
      "\u304A\u3093\u3051\u3044",
      "\u304A\u3093\u3057\u3083",
      "\u304A\u3093\u305B\u3093",
      "\u304A\u3093\u305F\u3099\u3093",
      "\u304A\u3093\u3061\u3085\u3046",
      "\u304A\u3093\u3068\u3099\u3051\u3044",
      "\u304B\u3042\u3064",
      "\u304B\u3044\u304B\u3099",
      "\u304B\u3099\u3044\u304D",
      "\u304B\u3099\u3044\u3051\u3093",
      "\u304B\u3099\u3044\u3053\u3046",
      "\u304B\u3044\u3055\u3064",
      "\u304B\u3044\u3057\u3083",
      "\u304B\u3044\u3059\u3044\u3088\u304F",
      "\u304B\u3044\u305B\u3099\u3093",
      "\u304B\u3044\u305D\u3099\u3046\u3068\u3099",
      "\u304B\u3044\u3064\u3046",
      "\u304B\u3044\u3066\u3093",
      "\u304B\u3044\u3068\u3046",
      "\u304B\u3044\u3075\u304F",
      "\u304B\u3099\u3044\u3078\u304D",
      "\u304B\u3044\u307B\u3046",
      "\u304B\u3044\u3088\u3046",
      "\u304B\u3099\u3044\u3089\u3044",
      "\u304B\u3044\u308F",
      "\u304B\u3048\u308B",
      "\u304B\u304A\u308A",
      "\u304B\u304B\u3048\u308B",
      "\u304B\u304B\u3099\u304F",
      "\u304B\u304B\u3099\u3057",
      "\u304B\u304B\u3099\u307F",
      "\u304B\u304F\u3053\u3099",
      "\u304B\u304F\u3068\u304F",
      "\u304B\u3055\u3099\u308B",
      "\u304B\u3099\u305D\u3099\u3046",
      "\u304B\u305F\u3044",
      "\u304B\u305F\u3061",
      "\u304B\u3099\u3061\u3087\u3046",
      "\u304B\u3099\u3063\u304D\u3085\u3046",
      "\u304B\u3099\u3063\u3053\u3046",
      "\u304B\u3099\u3063\u3055\u3093",
      "\u304B\u3099\u3063\u3057\u3087\u3046",
      "\u304B\u306A\u3055\u3099\u308F\u3057",
      "\u304B\u306E\u3046",
      "\u304B\u3099\u306F\u304F",
      "\u304B\u3075\u3099\u304B",
      "\u304B\u307B\u3046",
      "\u304B\u307B\u3053\u3099",
      "\u304B\u307E\u3046",
      "\u304B\u307E\u307B\u3099\u3053",
      "\u304B\u3081\u308C\u304A\u3093",
      "\u304B\u3086\u3044",
      "\u304B\u3088\u3046\u3072\u3099",
      "\u304B\u3089\u3044",
      "\u304B\u308B\u3044",
      "\u304B\u308D\u3046",
      "\u304B\u308F\u304F",
      "\u304B\u308F\u3089",
      "\u304B\u3099\u3093\u304B",
      "\u304B\u3093\u3051\u3044",
      "\u304B\u3093\u3053\u3046",
      "\u304B\u3093\u3057\u3083",
      "\u304B\u3093\u305D\u3046",
      "\u304B\u3093\u305F\u3093",
      "\u304B\u3093\u3061",
      "\u304B\u3099\u3093\u306F\u3099\u308B",
      "\u304D\u3042\u3044",
      "\u304D\u3042\u3064",
      "\u304D\u3044\u308D",
      "\u304D\u3099\u3044\u3093",
      "\u304D\u3046\u3044",
      "\u304D\u3046\u3093",
      "\u304D\u3048\u308B",
      "\u304D\u304A\u3046",
      "\u304D\u304A\u304F",
      "\u304D\u304A\u3061",
      "\u304D\u304A\u3093",
      "\u304D\u304B\u3044",
      "\u304D\u304B\u304F",
      "\u304D\u304B\u3093\u3057\u3083",
      "\u304D\u304D\u3066",
      "\u304D\u304F\u306F\u3099\u308A",
      "\u304D\u304F\u3089\u3051\u3099",
      "\u304D\u3051\u3093\u305B\u3044",
      "\u304D\u3053\u3046",
      "\u304D\u3053\u3048\u308B",
      "\u304D\u3053\u304F",
      "\u304D\u3055\u3044",
      "\u304D\u3055\u304F",
      "\u304D\u3055\u307E",
      "\u304D\u3055\u3089\u304D\u3099",
      "\u304D\u3099\u3057\u3099\u304B\u304B\u3099\u304F",
      "\u304D\u3099\u3057\u304D",
      "\u304D\u3099\u3057\u3099\u305F\u3044\u3051\u3093",
      "\u304D\u3099\u3057\u3099\u306B\u3063\u3066\u3044",
      "\u304D\u3099\u3057\u3099\u3085\u3064\u3057\u3083",
      "\u304D\u3059\u3046",
      "\u304D\u305B\u3044",
      "\u304D\u305B\u304D",
      "\u304D\u305B\u3064",
      "\u304D\u305D\u3046",
      "\u304D\u305D\u3099\u304F",
      "\u304D\u305D\u3099\u3093",
      "\u304D\u305F\u3048\u308B",
      "\u304D\u3061\u3087\u3046",
      "\u304D\u3064\u3048\u3093",
      "\u304D\u3099\u3063\u3061\u308A",
      "\u304D\u3064\u3064\u304D",
      "\u304D\u3064\u306D",
      "\u304D\u3066\u3044",
      "\u304D\u3068\u3099\u3046",
      "\u304D\u3068\u3099\u304F",
      "\u304D\u306A\u3044",
      "\u304D\u306A\u304B\u3099",
      "\u304D\u306A\u3053",
      "\u304D\u306C\u3053\u3099\u3057",
      "\u304D\u306D\u3093",
      "\u304D\u306E\u3046",
      "\u304D\u306E\u3057\u305F",
      "\u304D\u306F\u304F",
      "\u304D\u3072\u3099\u3057\u3044",
      "\u304D\u3072\u3093",
      "\u304D\u3075\u304F",
      "\u304D\u3075\u3099\u3093",
      "\u304D\u307B\u3099\u3046",
      "\u304D\u307B\u3093",
      "\u304D\u307E\u308B",
      "\u304D\u307F\u3064",
      "\u304D\u3080\u3059\u3099\u304B\u3057\u3044",
      "\u304D\u3081\u308B",
      "\u304D\u3082\u305F\u3099\u3081\u3057",
      "\u304D\u3082\u3061",
      "\u304D\u3082\u306E",
      "\u304D\u3083\u304F",
      "\u304D\u3084\u304F",
      "\u304D\u3099\u3085\u3046\u306B\u304F",
      "\u304D\u3088\u3046",
      "\u304D\u3087\u3046\u308A\u3085\u3046",
      "\u304D\u3089\u3044",
      "\u304D\u3089\u304F",
      "\u304D\u308A\u3093",
      "\u304D\u308C\u3044",
      "\u304D\u308C\u3064",
      "\u304D\u308D\u304F",
      "\u304D\u3099\u308D\u3093",
      "\u304D\u308F\u3081\u308B",
      "\u304D\u3099\u3093\u3044\u308D",
      "\u304D\u3093\u304B\u304F\u3057\u3099",
      "\u304D\u3093\u3057\u3099\u3087",
      "\u304D\u3093\u3088\u3046\u3072\u3099",
      "\u304F\u3099\u3042\u3044",
      "\u304F\u3044\u3059\u3099",
      "\u304F\u3046\u304B\u3093",
      "\u304F\u3046\u304D",
      "\u304F\u3046\u304F\u3099\u3093",
      "\u304F\u3046\u3053\u3046",
      "\u304F\u3099\u3046\u305B\u3044",
      "\u304F\u3046\u305D\u3046",
      "\u304F\u3099\u3046\u305F\u3089",
      "\u304F\u3046\u3075\u304F",
      "\u304F\u3046\u307B\u3099",
      "\u304F\u304B\u3093",
      "\u304F\u304D\u3087\u3046",
      "\u304F\u3051\u3099\u3093",
      "\u304F\u3099\u3053\u3046",
      "\u304F\u3055\u3044",
      "\u304F\u3055\u304D",
      "\u304F\u3055\u306F\u3099\u306A",
      "\u304F\u3055\u308B",
      "\u304F\u3057\u3083\u307F",
      "\u304F\u3057\u3087\u3046",
      "\u304F\u3059\u306E\u304D",
      "\u304F\u3059\u308A\u3086\u3072\u3099",
      "\u304F\u305B\u3051\u3099",
      "\u304F\u305B\u3093",
      "\u304F\u3099\u305F\u3044\u3066\u304D",
      "\u304F\u305F\u3099\u3055\u308B",
      "\u304F\u305F\u3072\u3099\u308C\u308B",
      "\u304F\u3061\u3053\u307F",
      "\u304F\u3061\u3055\u304D",
      "\u304F\u3064\u3057\u305F",
      "\u304F\u3099\u3063\u3059\u308A",
      "\u304F\u3064\u308D\u304F\u3099",
      "\u304F\u3068\u3046\u3066\u3093",
      "\u304F\u3068\u3099\u304F",
      "\u304F\u306A\u3093",
      "\u304F\u306D\u304F\u306D",
      "\u304F\u306E\u3046",
      "\u304F\u3075\u3046",
      "\u304F\u307F\u3042\u308F\u305B",
      "\u304F\u307F\u305F\u3066\u308B",
      "\u304F\u3081\u308B",
      "\u304F\u3084\u304F\u3057\u3087",
      "\u304F\u3089\u3059",
      "\u304F\u3089\u3078\u3099\u308B",
      "\u304F\u308B\u307E",
      "\u304F\u308C\u308B",
      "\u304F\u308D\u3046",
      "\u304F\u308F\u3057\u3044",
      "\u304F\u3099\u3093\u304B\u3093",
      "\u304F\u3099\u3093\u3057\u3087\u304F",
      "\u304F\u3099\u3093\u305F\u3044",
      "\u304F\u3099\u3093\u3066",
      "\u3051\u3042\u306A",
      "\u3051\u3044\u304B\u304F",
      "\u3051\u3044\u3051\u3093",
      "\u3051\u3044\u3053",
      "\u3051\u3044\u3055\u3064",
      "\u3051\u3099\u3044\u3057\u3099\u3085\u3064",
      "\u3051\u3044\u305F\u3044",
      "\u3051\u3099\u3044\u306E\u3046\u3057\u3099\u3093",
      "\u3051\u3044\u308C\u304D",
      "\u3051\u3044\u308D",
      "\u3051\u304A\u3068\u3059",
      "\u3051\u304A\u308A\u3082\u306E",
      "\u3051\u3099\u304D\u304B",
      "\u3051\u3099\u304D\u3051\u3099\u3093",
      "\u3051\u3099\u304D\u305F\u3099\u3093",
      "\u3051\u3099\u304D\u3061\u3093",
      "\u3051\u3099\u304D\u3068\u3064",
      "\u3051\u3099\u304D\u306F",
      "\u3051\u3099\u304D\u3084\u304F",
      "\u3051\u3099\u3053\u3046",
      "\u3051\u3099\u3053\u304F\u3057\u3099\u3087\u3046",
      "\u3051\u3099\u3055\u3099\u3044",
      "\u3051\u3055\u304D",
      "\u3051\u3099\u3055\u3099\u3093",
      "\u3051\u3057\u304D",
      "\u3051\u3057\u3053\u3099\u3080",
      "\u3051\u3057\u3087\u3046",
      "\u3051\u3099\u3059\u3068",
      "\u3051\u305F\u306F\u3099",
      "\u3051\u3061\u3083\u3063\u3075\u309A",
      "\u3051\u3061\u3089\u3059",
      "\u3051\u3064\u3042\u3064",
      "\u3051\u3064\u3044",
      "\u3051\u3064\u3048\u304D",
      "\u3051\u3063\u3053\u3093",
      "\u3051\u3064\u3057\u3099\u3087",
      "\u3051\u3063\u305B\u304D",
      "\u3051\u3063\u3066\u3044",
      "\u3051\u3064\u307E\u3064",
      "\u3051\u3099\u3064\u3088\u3046\u3072\u3099",
      "\u3051\u3099\u3064\u308C\u3044",
      "\u3051\u3064\u308D\u3093",
      "\u3051\u3099\u3068\u3099\u304F",
      "\u3051\u3068\u306F\u3099\u3059",
      "\u3051\u3068\u308B",
      "\u3051\u306A\u3051\u3099",
      "\u3051\u306A\u3059",
      "\u3051\u306A\u307F",
      "\u3051\u306C\u304D",
      "\u3051\u3099\u306D\u3064",
      "\u3051\u306D\u3093",
      "\u3051\u306F\u3044",
      "\u3051\u3099\u3072\u3093",
      "\u3051\u3075\u3099\u304B\u3044",
      "\u3051\u3099\u307B\u3099\u304F",
      "\u3051\u307E\u308A",
      "\u3051\u307F\u304B\u308B",
      "\u3051\u3080\u3057",
      "\u3051\u3080\u308A",
      "\u3051\u3082\u306E",
      "\u3051\u3089\u3044",
      "\u3051\u308D\u3051\u308D",
      "\u3051\u308F\u3057\u3044",
      "\u3051\u3093\u3044",
      "\u3051\u3093\u3048\u3064",
      "\u3051\u3093\u304A",
      "\u3051\u3093\u304B",
      "\u3051\u3099\u3093\u304D",
      "\u3051\u3093\u3051\u3099\u3093",
      "\u3051\u3093\u3053\u3046",
      "\u3051\u3093\u3055\u304F",
      "\u3051\u3093\u3057\u3085\u3046",
      "\u3051\u3093\u3059\u3046",
      "\u3051\u3099\u3093\u305D\u3046",
      "\u3051\u3093\u3061\u304F",
      "\u3051\u3093\u3066\u3044",
      "\u3051\u3093\u3068\u3046",
      "\u3051\u3093\u306A\u3044",
      "\u3051\u3093\u306B\u3093",
      "\u3051\u3099\u3093\u3075\u3099\u3064",
      "\u3051\u3093\u307E",
      "\u3051\u3093\u307F\u3093",
      "\u3051\u3093\u3081\u3044",
      "\u3051\u3093\u3089\u3093",
      "\u3051\u3093\u308A",
      "\u3053\u3042\u304F\u307E",
      "\u3053\u3044\u306C",
      "\u3053\u3044\u3072\u3099\u3068",
      "\u3053\u3099\u3046\u3044",
      "\u3053\u3046\u3048\u3093",
      "\u3053\u3046\u304A\u3093",
      "\u3053\u3046\u304B\u3093",
      "\u3053\u3099\u3046\u304D\u3085\u3046",
      "\u3053\u3099\u3046\u3051\u3044",
      "\u3053\u3046\u3053\u3046",
      "\u3053\u3046\u3055\u3044",
      "\u3053\u3046\u3057\u3099",
      "\u3053\u3046\u3059\u3044",
      "\u3053\u3099\u3046\u305B\u3044",
      "\u3053\u3046\u305D\u304F",
      "\u3053\u3046\u305F\u3044",
      "\u3053\u3046\u3061\u3083",
      "\u3053\u3046\u3064\u3046",
      "\u3053\u3046\u3066\u3044",
      "\u3053\u3046\u3068\u3099\u3046",
      "\u3053\u3046\u306A\u3044",
      "\u3053\u3046\u306F\u3044",
      "\u3053\u3099\u3046\u307B\u3046",
      "\u3053\u3099\u3046\u307E\u3093",
      "\u3053\u3046\u3082\u304F",
      "\u3053\u3046\u308A\u3064",
      "\u3053\u3048\u308B",
      "\u3053\u304A\u308A",
      "\u3053\u3099\u304B\u3044",
      "\u3053\u3099\u304B\u3099\u3064",
      "\u3053\u3099\u304B\u3093",
      "\u3053\u304F\u3053\u3099",
      "\u3053\u304F\u3055\u3044",
      "\u3053\u304F\u3068\u3046",
      "\u3053\u304F\u306A\u3044",
      "\u3053\u304F\u306F\u304F",
      "\u3053\u304F\u3099\u307E",
      "\u3053\u3051\u3044",
      "\u3053\u3051\u308B",
      "\u3053\u3053\u306E\u304B",
      "\u3053\u3053\u308D",
      "\u3053\u3055\u3081",
      "\u3053\u3057\u3064",
      "\u3053\u3059\u3046",
      "\u3053\u305B\u3044",
      "\u3053\u305B\u304D",
      "\u3053\u305B\u3099\u3093",
      "\u3053\u305D\u305F\u3099\u3066",
      "\u3053\u305F\u3044",
      "\u3053\u305F\u3048\u308B",
      "\u3053\u305F\u3064",
      "\u3053\u3061\u3087\u3046",
      "\u3053\u3063\u304B",
      "\u3053\u3064\u3053\u3064",
      "\u3053\u3064\u306F\u3099\u3093",
      "\u3053\u3064\u3075\u3099",
      "\u3053\u3066\u3044",
      "\u3053\u3066\u3093",
      "\u3053\u3068\u304B\u3099\u3089",
      "\u3053\u3068\u3057",
      "\u3053\u3068\u306F\u3099",
      "\u3053\u3068\u308A",
      "\u3053\u306A\u3053\u3099\u306A",
      "\u3053\u306D\u3053\u306D",
      "\u3053\u306E\u307E\u307E",
      "\u3053\u306E\u307F",
      "\u3053\u306E\u3088",
      "\u3053\u3099\u306F\u3093",
      "\u3053\u3072\u3064\u3057\u3099",
      "\u3053\u3075\u3046",
      "\u3053\u3075\u3093",
      "\u3053\u307B\u3099\u308C\u308B",
      "\u3053\u3099\u307E\u3042\u3075\u3099\u3089",
      "\u3053\u307E\u304B\u3044",
      "\u3053\u3099\u307E\u3059\u308A",
      "\u3053\u307E\u3064\u306A",
      "\u3053\u307E\u308B",
      "\u3053\u3080\u304D\u3099\u3053",
      "\u3053\u3082\u3057\u3099",
      "\u3053\u3082\u3061",
      "\u3053\u3082\u306E",
      "\u3053\u3082\u3093",
      "\u3053\u3084\u304F",
      "\u3053\u3084\u307E",
      "\u3053\u3086\u3046",
      "\u3053\u3086\u3072\u3099",
      "\u3053\u3088\u3044",
      "\u3053\u3088\u3046",
      "\u3053\u308A\u308B",
      "\u3053\u308C\u304F\u3057\u3087\u3093",
      "\u3053\u308D\u3063\u3051",
      "\u3053\u308F\u3082\u3066",
      "\u3053\u308F\u308C\u308B",
      "\u3053\u3093\u3044\u3093",
      "\u3053\u3093\u304B\u3044",
      "\u3053\u3093\u304D",
      "\u3053\u3093\u3057\u3085\u3046",
      "\u3053\u3093\u3059\u3044",
      "\u3053\u3093\u305F\u3099\u3066",
      "\u3053\u3093\u3068\u3093",
      "\u3053\u3093\u306A\u3093",
      "\u3053\u3093\u3072\u3099\u306B",
      "\u3053\u3093\u307B\u309A\u3093",
      "\u3053\u3093\u307E\u3051",
      "\u3053\u3093\u3084",
      "\u3053\u3093\u308C\u3044",
      "\u3053\u3093\u308F\u304F",
      "\u3055\u3099\u3044\u3048\u304D",
      "\u3055\u3044\u304B\u3044",
      "\u3055\u3044\u304D\u3093",
      "\u3055\u3099\u3044\u3051\u3099\u3093",
      "\u3055\u3099\u3044\u3053",
      "\u3055\u3044\u3057\u3087",
      "\u3055\u3044\u305B\u3044",
      "\u3055\u3099\u3044\u305F\u304F",
      "\u3055\u3099\u3044\u3061\u3085\u3046",
      "\u3055\u3044\u3066\u304D",
      "\u3055\u3099\u3044\u308A\u3087\u3046",
      "\u3055\u3046\u306A",
      "\u3055\u304B\u3044\u3057",
      "\u3055\u304B\u3099\u3059",
      "\u3055\u304B\u306A",
      "\u3055\u304B\u307F\u3061",
      "\u3055\u304B\u3099\u308B",
      "\u3055\u304D\u3099\u3087\u3046",
      "\u3055\u304F\u3057",
      "\u3055\u304F\u3072\u3093",
      "\u3055\u304F\u3089",
      "\u3055\u3053\u304F",
      "\u3055\u3053\u3064",
      "\u3055\u3059\u3099\u304B\u308B",
      "\u3055\u3099\u305B\u304D",
      "\u3055\u305F\u3093",
      "\u3055\u3064\u3048\u3044",
      "\u3055\u3099\u3064\u304A\u3093",
      "\u3055\u3099\u3063\u304B",
      "\u3055\u3099\u3064\u304B\u3099\u304F",
      "\u3055\u3063\u304D\u3087\u304F",
      "\u3055\u3099\u3063\u3057",
      "\u3055\u3064\u3057\u3099\u3093",
      "\u3055\u3099\u3063\u305D\u3046",
      "\u3055\u3064\u305F\u306F\u3099",
      "\u3055\u3064\u307E\u3044\u3082",
      "\u3055\u3066\u3044",
      "\u3055\u3068\u3044\u3082",
      "\u3055\u3068\u3046",
      "\u3055\u3068\u304A\u3084",
      "\u3055\u3068\u3057",
      "\u3055\u3068\u308B",
      "\u3055\u306E\u3046",
      "\u3055\u306F\u3099\u304F",
      "\u3055\u3072\u3099\u3057\u3044",
      "\u3055\u3078\u3099\u3064",
      "\u3055\u307B\u3046",
      "\u3055\u307B\u3068\u3099",
      "\u3055\u307E\u3059",
      "\u3055\u307F\u3057\u3044",
      "\u3055\u307F\u305F\u3099\u308C",
      "\u3055\u3080\u3051",
      "\u3055\u3081\u308B",
      "\u3055\u3084\u3048\u3093\u3068\u3099\u3046",
      "\u3055\u3086\u3046",
      "\u3055\u3088\u3046",
      "\u3055\u3088\u304F",
      "\u3055\u3089\u305F\u3099",
      "\u3055\u3099\u308B\u305D\u306F\u3099",
      "\u3055\u308F\u3084\u304B",
      "\u3055\u308F\u308B",
      "\u3055\u3093\u3044\u3093",
      "\u3055\u3093\u304B",
      "\u3055\u3093\u304D\u3083\u304F",
      "\u3055\u3093\u3053\u3046",
      "\u3055\u3093\u3055\u3044",
      "\u3055\u3099\u3093\u3057\u3087",
      "\u3055\u3093\u3059\u3046",
      "\u3055\u3093\u305B\u3044",
      "\u3055\u3093\u305D",
      "\u3055\u3093\u3061",
      "\u3055\u3093\u307E",
      "\u3055\u3093\u307F",
      "\u3055\u3093\u3089\u3093",
      "\u3057\u3042\u3044",
      "\u3057\u3042\u3051\u3099",
      "\u3057\u3042\u3055\u3063\u3066",
      "\u3057\u3042\u308F\u305B",
      "\u3057\u3044\u304F",
      "\u3057\u3044\u3093",
      "\u3057\u3046\u3061",
      "\u3057\u3048\u3044",
      "\u3057\u304A\u3051",
      "\u3057\u304B\u3044",
      "\u3057\u304B\u304F",
      "\u3057\u3099\u304B\u3093",
      "\u3057\u3053\u3099\u3068",
      "\u3057\u3059\u3046",
      "\u3057\u3099\u305F\u3099\u3044",
      "\u3057\u305F\u3046\u3051",
      "\u3057\u305F\u304D\u3099",
      "\u3057\u305F\u3066",
      "\u3057\u305F\u307F",
      "\u3057\u3061\u3087\u3046",
      "\u3057\u3061\u308A\u3093",
      "\u3057\u3063\u304B\u308A",
      "\u3057\u3064\u3057\u3099",
      "\u3057\u3064\u3082\u3093",
      "\u3057\u3066\u3044",
      "\u3057\u3066\u304D",
      "\u3057\u3066\u3064",
      "\u3057\u3099\u3066\u3093",
      "\u3057\u3099\u3068\u3099\u3046",
      "\u3057\u306A\u304D\u3099\u308C",
      "\u3057\u306A\u3082\u306E",
      "\u3057\u306A\u3093",
      "\u3057\u306D\u307E",
      "\u3057\u306D\u3093",
      "\u3057\u306E\u304F\u3099",
      "\u3057\u306E\u3075\u3099",
      "\u3057\u306F\u3044",
      "\u3057\u306F\u3099\u304B\u308A",
      "\u3057\u306F\u3064",
      "\u3057\u306F\u3089\u3044",
      "\u3057\u306F\u3093",
      "\u3057\u3072\u3087\u3046",
      "\u3057\u3075\u304F",
      "\u3057\u3099\u3075\u3099\u3093",
      "\u3057\u3078\u3044",
      "\u3057\u307B\u3046",
      "\u3057\u307B\u3093",
      "\u3057\u307E\u3046",
      "\u3057\u307E\u308B",
      "\u3057\u307F\u3093",
      "\u3057\u3080\u3051\u308B",
      "\u3057\u3099\u3080\u3057\u3087",
      "\u3057\u3081\u3044",
      "\u3057\u3081\u308B",
      "\u3057\u3082\u3093",
      "\u3057\u3083\u3044\u3093",
      "\u3057\u3083\u3046\u3093",
      "\u3057\u3083\u304A\u3093",
      "\u3057\u3099\u3083\u304B\u3099\u3044\u3082",
      "\u3057\u3084\u304F\u3057\u3087",
      "\u3057\u3083\u304F\u307B\u3046",
      "\u3057\u3083\u3051\u3093",
      "\u3057\u3083\u3053",
      "\u3057\u3083\u3055\u3099\u3044",
      "\u3057\u3083\u3057\u3093",
      "\u3057\u3083\u305B\u3093",
      "\u3057\u3083\u305D\u3046",
      "\u3057\u3083\u305F\u3044",
      "\u3057\u3083\u3061\u3087\u3046",
      "\u3057\u3083\u3063\u304D\u3093",
      "\u3057\u3099\u3083\u307E",
      "\u3057\u3083\u308A\u3093",
      "\u3057\u3083\u308C\u3044",
      "\u3057\u3099\u3086\u3046",
      "\u3057\u3099\u3085\u3046\u3057\u3087",
      "\u3057\u3085\u304F\u306F\u304F",
      "\u3057\u3099\u3085\u3057\u3093",
      "\u3057\u3085\u3063\u305B\u304D",
      "\u3057\u3085\u307F",
      "\u3057\u3085\u3089\u306F\u3099",
      "\u3057\u3099\u3085\u3093\u306F\u3099\u3093",
      "\u3057\u3087\u3046\u304B\u3044",
      "\u3057\u3087\u304F\u305F\u304F",
      "\u3057\u3087\u3063\u3051\u3093",
      "\u3057\u3087\u3068\u3099\u3046",
      "\u3057\u3087\u3082\u3064",
      "\u3057\u3089\u305B\u308B",
      "\u3057\u3089\u3078\u3099\u308B",
      "\u3057\u3093\u304B",
      "\u3057\u3093\u3053\u3046",
      "\u3057\u3099\u3093\u3057\u3099\u3083",
      "\u3057\u3093\u305B\u3044\u3057\u3099",
      "\u3057\u3093\u3061\u304F",
      "\u3057\u3093\u308A\u3093",
      "\u3059\u3042\u3051\u3099",
      "\u3059\u3042\u3057",
      "\u3059\u3042\u306A",
      "\u3059\u3099\u3042\u3093",
      "\u3059\u3044\u3048\u3044",
      "\u3059\u3044\u304B",
      "\u3059\u3044\u3068\u3046",
      "\u3059\u3099\u3044\u3075\u3099\u3093",
      "\u3059\u3044\u3088\u3046\u3072\u3099",
      "\u3059\u3046\u304B\u3099\u304F",
      "\u3059\u3046\u3057\u3099\u3064",
      "\u3059\u3046\u305B\u3093",
      "\u3059\u304A\u3068\u3099\u308A",
      "\u3059\u304D\u307E",
      "\u3059\u304F\u3046",
      "\u3059\u304F\u306A\u3044",
      "\u3059\u3051\u308B",
      "\u3059\u3053\u3099\u3044",
      "\u3059\u3053\u3057",
      "\u3059\u3099\u3055\u3093",
      "\u3059\u3059\u3099\u3057\u3044",
      "\u3059\u3059\u3080",
      "\u3059\u3059\u3081\u308B",
      "\u3059\u3063\u304B\u308A",
      "\u3059\u3099\u3063\u3057\u308A",
      "\u3059\u3099\u3063\u3068",
      "\u3059\u3066\u304D",
      "\u3059\u3066\u308B",
      "\u3059\u306D\u308B",
      "\u3059\u306E\u3053",
      "\u3059\u306F\u305F\u3099",
      "\u3059\u306F\u3099\u3089\u3057\u3044",
      "\u3059\u3099\u3072\u3087\u3046",
      "\u3059\u3099\u3075\u3099\u306C\u308C",
      "\u3059\u3075\u3099\u308A",
      "\u3059\u3075\u308C",
      "\u3059\u3078\u3099\u3066",
      "\u3059\u3078\u3099\u308B",
      "\u3059\u3099\u307B\u3046",
      "\u3059\u307B\u3099\u3093",
      "\u3059\u307E\u3044",
      "\u3059\u3081\u3057",
      "\u3059\u3082\u3046",
      "\u3059\u3084\u304D",
      "\u3059\u3089\u3059\u3089",
      "\u3059\u308B\u3081",
      "\u3059\u308C\u3061\u304B\u3099\u3046",
      "\u3059\u308D\u3063\u3068",
      "\u3059\u308F\u308B",
      "\u3059\u3093\u305B\u3099\u3093",
      "\u3059\u3093\u307B\u309A\u3046",
      "\u305B\u3042\u3075\u3099\u3089",
      "\u305B\u3044\u304B\u3064",
      "\u305B\u3044\u3051\u3099\u3093",
      "\u305B\u3044\u3057\u3099",
      "\u305B\u3044\u3088\u3046",
      "\u305B\u304A\u3046",
      "\u305B\u304B\u3044\u304B\u3093",
      "\u305B\u304D\u306B\u3093",
      "\u305B\u304D\u3080",
      "\u305B\u304D\u3086",
      "\u305B\u304D\u3089\u3093\u3046\u3093",
      "\u305B\u3051\u3093",
      "\u305B\u3053\u3046",
      "\u305B\u3059\u3057\u3099",
      "\u305B\u305F\u3044",
      "\u305B\u305F\u3051",
      "\u305B\u3063\u304B\u304F",
      "\u305B\u3063\u304D\u3083\u304F",
      "\u305B\u3099\u3063\u304F",
      "\u305B\u3063\u3051\u3093",
      "\u305B\u3063\u3053\u3064",
      "\u305B\u3063\u3055\u305F\u304F\u307E",
      "\u305B\u3064\u305D\u3099\u304F",
      "\u305B\u3064\u305F\u3099\u3093",
      "\u305B\u3064\u3066\u3099\u3093",
      "\u305B\u3063\u306F\u309A\u3093",
      "\u305B\u3064\u3072\u3099",
      "\u305B\u3064\u3075\u3099\u3093",
      "\u305B\u3064\u3081\u3044",
      "\u305B\u3064\u308A\u3064",
      "\u305B\u306A\u304B",
      "\u305B\u306E\u3072\u3099",
      "\u305B\u306F\u306F\u3099",
      "\u305B\u3072\u3099\u308D",
      "\u305B\u307B\u3099\u306D",
      "\u305B\u307E\u3044",
      "\u305B\u307E\u308B",
      "\u305B\u3081\u308B",
      "\u305B\u3082\u305F\u308C",
      "\u305B\u308A\u3075",
      "\u305B\u3099\u3093\u3042\u304F",
      "\u305B\u3093\u3044",
      "\u305B\u3093\u3048\u3044",
      "\u305B\u3093\u304B",
      "\u305B\u3093\u304D\u3087",
      "\u305B\u3093\u304F",
      "\u305B\u3093\u3051\u3099\u3093",
      "\u305B\u3099\u3093\u3053\u3099",
      "\u305B\u3093\u3055\u3044",
      "\u305B\u3093\u3057\u3085",
      "\u305B\u3093\u3059\u3044",
      "\u305B\u3093\u305B\u3044",
      "\u305B\u3093\u305D\u3099",
      "\u305B\u3093\u305F\u304F",
      "\u305B\u3093\u3061\u3087\u3046",
      "\u305B\u3093\u3066\u3044",
      "\u305B\u3093\u3068\u3046",
      "\u305B\u3093\u306C\u304D",
      "\u305B\u3093\u306D\u3093",
      "\u305B\u3093\u306F\u309A\u3044",
      "\u305B\u3099\u3093\u3075\u3099",
      "\u305B\u3099\u3093\u307B\u309A\u3046",
      "\u305B\u3093\u3080",
      "\u305B\u3093\u3081\u3093\u3057\u3099\u3087",
      "\u305B\u3093\u3082\u3093",
      "\u305B\u3093\u3084\u304F",
      "\u305B\u3093\u3086\u3046",
      "\u305B\u3093\u3088\u3046",
      "\u305B\u3099\u3093\u3089",
      "\u305B\u3099\u3093\u308A\u3083\u304F",
      "\u305B\u3093\u308C\u3044",
      "\u305B\u3093\u308D",
      "\u305D\u3042\u304F",
      "\u305D\u3044\u3068\u3051\u3099\u308B",
      "\u305D\u3044\u306D",
      "\u305D\u3046\u304B\u3099\u3093\u304D\u3087\u3046",
      "\u305D\u3046\u304D",
      "\u305D\u3046\u3053\u3099",
      "\u305D\u3046\u3057\u3093",
      "\u305D\u3046\u305F\u3099\u3093",
      "\u305D\u3046\u306A\u3093",
      "\u305D\u3046\u3072\u3099",
      "\u305D\u3046\u3081\u3093",
      "\u305D\u3046\u308A",
      "\u305D\u3048\u3082\u306E",
      "\u305D\u3048\u3093",
      "\u305D\u304B\u3099\u3044",
      "\u305D\u3051\u3099\u304D",
      "\u305D\u3053\u3046",
      "\u305D\u3053\u305D\u3053",
      "\u305D\u3055\u3099\u3044",
      "\u305D\u3057\u306A",
      "\u305D\u305B\u3044",
      "\u305D\u305B\u3093",
      "\u305D\u305D\u304F\u3099",
      "\u305D\u305F\u3099\u3066\u308B",
      "\u305D\u3064\u3046",
      "\u305D\u3064\u3048\u3093",
      "\u305D\u3063\u304B\u3093",
      "\u305D\u3064\u304D\u3099\u3087\u3046",
      "\u305D\u3063\u3051\u3064",
      "\u305D\u3063\u3053\u3046",
      "\u305D\u3063\u305B\u3093",
      "\u305D\u3063\u3068",
      "\u305D\u3068\u304B\u3099\u308F",
      "\u305D\u3068\u3064\u3099\u3089",
      "\u305D\u306A\u3048\u308B",
      "\u305D\u306A\u305F",
      "\u305D\u3075\u307B\u3099",
      "\u305D\u307B\u3099\u304F",
      "\u305D\u307B\u3099\u308D",
      "\u305D\u307E\u3064",
      "\u305D\u307E\u308B",
      "\u305D\u3080\u304F",
      "\u305D\u3080\u308A\u3048",
      "\u305D\u3081\u308B",
      "\u305D\u3082\u305D\u3082",
      "\u305D\u3088\u304B\u305B\u3099",
      "\u305D\u3089\u307E\u3081",
      "\u305D\u308D\u3046",
      "\u305D\u3093\u304B\u3044",
      "\u305D\u3093\u3051\u3044",
      "\u305D\u3093\u3055\u3099\u3044",
      "\u305D\u3093\u3057\u3064",
      "\u305D\u3093\u305D\u3099\u304F",
      "\u305D\u3093\u3061\u3087\u3046",
      "\u305D\u3099\u3093\u3072\u3099",
      "\u305D\u3099\u3093\u3075\u3099\u3093",
      "\u305D\u3093\u307F\u3093",
      "\u305F\u3042\u3044",
      "\u305F\u3044\u3044\u3093",
      "\u305F\u3044\u3046\u3093",
      "\u305F\u3044\u3048\u304D",
      "\u305F\u3044\u304A\u3046",
      "\u305F\u3099\u3044\u304B\u3099\u304F",
      "\u305F\u3044\u304D",
      "\u305F\u3044\u304F\u3099\u3046",
      "\u305F\u3044\u3051\u3093",
      "\u305F\u3044\u3053",
      "\u305F\u3044\u3055\u3099\u3044",
      "\u305F\u3099\u3044\u3057\u3099\u3087\u3046\u3075\u3099",
      "\u305F\u3099\u3044\u3059\u304D",
      "\u305F\u3044\u305B\u3064",
      "\u305F\u3044\u305D\u3046",
      "\u305F\u3099\u3044\u305F\u3044",
      "\u305F\u3044\u3061\u3087\u3046",
      "\u305F\u3044\u3066\u3044",
      "\u305F\u3099\u3044\u3068\u3099\u3053\u308D",
      "\u305F\u3044\u306A\u3044",
      "\u305F\u3044\u306D\u3064",
      "\u305F\u3044\u306E\u3046",
      "\u305F\u3044\u306F\u3093",
      "\u305F\u3099\u3044\u3072\u3087\u3046",
      "\u305F\u3044\u3075\u3046",
      "\u305F\u3044\u3078\u3093",
      "\u305F\u3044\u307B",
      "\u305F\u3044\u307E\u3064\u306F\u3099\u306A",
      "\u305F\u3044\u307F\u3093\u304F\u3099",
      "\u305F\u3044\u3080",
      "\u305F\u3044\u3081\u3093",
      "\u305F\u3044\u3084\u304D",
      "\u305F\u3044\u3088\u3046",
      "\u305F\u3044\u3089",
      "\u305F\u3044\u308A\u3087\u304F",
      "\u305F\u3044\u308B",
      "\u305F\u3044\u308F\u3093",
      "\u305F\u3046\u3048",
      "\u305F\u3048\u308B",
      "\u305F\u304A\u3059",
      "\u305F\u304A\u308B",
      "\u305F\u304A\u308C\u308B",
      "\u305F\u304B\u3044",
      "\u305F\u304B\u306D",
      "\u305F\u304D\u3072\u3099",
      "\u305F\u304F\u3055\u3093",
      "\u305F\u3053\u304F",
      "\u305F\u3053\u3084\u304D",
      "\u305F\u3055\u3044",
      "\u305F\u3057\u3055\u3099\u3093",
      "\u305F\u3099\u3057\u3099\u3083\u308C",
      "\u305F\u3059\u3051\u308B",
      "\u305F\u3059\u3099\u3055\u308F\u308B",
      "\u305F\u305D\u304B\u3099\u308C",
      "\u305F\u305F\u304B\u3046",
      "\u305F\u305F\u304F",
      "\u305F\u305F\u3099\u3057\u3044",
      "\u305F\u305F\u307F",
      "\u305F\u3061\u306F\u3099\u306A",
      "\u305F\u3099\u3063\u304B\u3044",
      "\u305F\u3099\u3063\u304D\u3083\u304F",
      "\u305F\u3099\u3063\u3053",
      "\u305F\u3099\u3063\u3057\u3085\u3064",
      "\u305F\u3099\u3063\u305F\u3044",
      "\u305F\u3066\u308B",
      "\u305F\u3068\u3048\u308B",
      "\u305F\u306A\u306F\u3099\u305F",
      "\u305F\u306B\u3093",
      "\u305F\u306C\u304D",
      "\u305F\u306E\u3057\u307F",
      "\u305F\u306F\u3064",
      "\u305F\u3075\u3099\u3093",
      "\u305F\u3078\u3099\u308B",
      "\u305F\u307B\u3099\u3046",
      "\u305F\u307E\u3053\u3099",
      "\u305F\u307E\u308B",
      "\u305F\u3099\u3080\u308B",
      "\u305F\u3081\u3044\u304D",
      "\u305F\u3081\u3059",
      "\u305F\u3081\u308B",
      "\u305F\u3082\u3064",
      "\u305F\u3084\u3059\u3044",
      "\u305F\u3088\u308B",
      "\u305F\u3089\u3059",
      "\u305F\u308A\u304D\u307B\u3093\u304B\u3099\u3093",
      "\u305F\u308A\u3087\u3046",
      "\u305F\u308A\u308B",
      "\u305F\u308B\u3068",
      "\u305F\u308C\u308B",
      "\u305F\u308C\u3093\u3068",
      "\u305F\u308D\u3063\u3068",
      "\u305F\u308F\u3080\u308C\u308B",
      "\u305F\u3099\u3093\u3042\u3064",
      "\u305F\u3093\u3044",
      "\u305F\u3093\u304A\u3093",
      "\u305F\u3093\u304B",
      "\u305F\u3093\u304D",
      "\u305F\u3093\u3051\u3093",
      "\u305F\u3093\u3053\u3099",
      "\u305F\u3093\u3055\u3093",
      "\u305F\u3093\u3057\u3099\u3087\u3046\u3072\u3099",
      "\u305F\u3099\u3093\u305B\u3044",
      "\u305F\u3093\u305D\u304F",
      "\u305F\u3093\u305F\u3044",
      "\u305F\u3099\u3093\u3061",
      "\u305F\u3093\u3066\u3044",
      "\u305F\u3093\u3068\u3046",
      "\u305F\u3099\u3093\u306A",
      "\u305F\u3093\u306B\u3093",
      "\u305F\u3099\u3093\u306D\u3064",
      "\u305F\u3093\u306E\u3046",
      "\u305F\u3093\u3072\u309A\u3093",
      "\u305F\u3099\u3093\u307B\u3099\u3046",
      "\u305F\u3093\u307E\u3064",
      "\u305F\u3093\u3081\u3044",
      "\u305F\u3099\u3093\u308C\u3064",
      "\u305F\u3099\u3093\u308D",
      "\u305F\u3099\u3093\u308F",
      "\u3061\u3042\u3044",
      "\u3061\u3042\u3093",
      "\u3061\u3044\u304D",
      "\u3061\u3044\u3055\u3044",
      "\u3061\u3048\u3093",
      "\u3061\u304B\u3044",
      "\u3061\u304B\u3089",
      "\u3061\u304D\u3085\u3046",
      "\u3061\u304D\u3093",
      "\u3061\u3051\u3044\u3059\u3099",
      "\u3061\u3051\u3093",
      "\u3061\u3053\u304F",
      "\u3061\u3055\u3044",
      "\u3061\u3057\u304D",
      "\u3061\u3057\u308A\u3087\u3046",
      "\u3061\u305B\u3044",
      "\u3061\u305D\u3046",
      "\u3061\u305F\u3044",
      "\u3061\u305F\u3093",
      "\u3061\u3061\u304A\u3084",
      "\u3061\u3064\u3057\u3099\u3087",
      "\u3061\u3066\u304D",
      "\u3061\u3066\u3093",
      "\u3061\u306C\u304D",
      "\u3061\u306C\u308A",
      "\u3061\u306E\u3046",
      "\u3061\u3072\u3087\u3046",
      "\u3061\u3078\u3044\u305B\u3093",
      "\u3061\u307B\u3046",
      "\u3061\u307E\u305F",
      "\u3061\u307F\u3064",
      "\u3061\u307F\u3068\u3099\u308D",
      "\u3061\u3081\u3044\u3068\u3099",
      "\u3061\u3083\u3093\u3053\u306A\u3078\u3099",
      "\u3061\u3085\u3046\u3044",
      "\u3061\u3086\u308A\u3087\u304F",
      "\u3061\u3087\u3046\u3057",
      "\u3061\u3087\u3055\u304F\u3051\u3093",
      "\u3061\u3089\u3057",
      "\u3061\u3089\u307F",
      "\u3061\u308A\u304B\u3099\u307F",
      "\u3061\u308A\u3087\u3046",
      "\u3061\u308B\u3068\u3099",
      "\u3061\u308F\u308F",
      "\u3061\u3093\u305F\u3044",
      "\u3061\u3093\u3082\u304F",
      "\u3064\u3044\u304B",
      "\u3064\u3044\u305F\u3061",
      "\u3064\u3046\u304B",
      "\u3064\u3046\u3057\u3099\u3087\u3046",
      "\u3064\u3046\u306F\u3093",
      "\u3064\u3046\u308F",
      "\u3064\u304B\u3046",
      "\u3064\u304B\u308C\u308B",
      "\u3064\u304F\u306D",
      "\u3064\u304F\u308B",
      "\u3064\u3051\u306D",
      "\u3064\u3051\u308B",
      "\u3064\u3053\u3099\u3046",
      "\u3064\u305F\u3048\u308B",
      "\u3064\u3064\u3099\u304F",
      "\u3064\u3064\u3057\u3099",
      "\u3064\u3064\u3080",
      "\u3064\u3068\u3081\u308B",
      "\u3064\u306A\u304B\u3099\u308B",
      "\u3064\u306A\u307F",
      "\u3064\u306D\u3064\u3099\u306D",
      "\u3064\u306E\u308B",
      "\u3064\u3075\u3099\u3059",
      "\u3064\u307E\u3089\u306A\u3044",
      "\u3064\u307E\u308B",
      "\u3064\u307F\u304D",
      "\u3064\u3081\u305F\u3044",
      "\u3064\u3082\u308A",
      "\u3064\u3082\u308B",
      "\u3064\u3088\u3044",
      "\u3064\u308B\u307B\u3099",
      "\u3064\u308B\u307F\u304F",
      "\u3064\u308F\u3082\u306E",
      "\u3064\u308F\u308A",
      "\u3066\u3042\u3057",
      "\u3066\u3042\u3066",
      "\u3066\u3042\u307F",
      "\u3066\u3044\u304A\u3093",
      "\u3066\u3044\u304B",
      "\u3066\u3044\u304D",
      "\u3066\u3044\u3051\u3044",
      "\u3066\u3044\u3053\u304F",
      "\u3066\u3044\u3055\u3064",
      "\u3066\u3044\u3057",
      "\u3066\u3044\u305B\u3044",
      "\u3066\u3044\u305F\u3044",
      "\u3066\u3044\u3068\u3099",
      "\u3066\u3044\u306D\u3044",
      "\u3066\u3044\u3072\u3087\u3046",
      "\u3066\u3044\u3078\u3093",
      "\u3066\u3044\u307B\u3099\u3046",
      "\u3066\u3046\u3061",
      "\u3066\u304A\u304F\u308C",
      "\u3066\u304D\u3068\u3046",
      "\u3066\u304F\u3072\u3099",
      "\u3066\u3099\u3053\u307B\u3099\u3053",
      "\u3066\u3055\u304D\u3099\u3087\u3046",
      "\u3066\u3055\u3051\u3099",
      "\u3066\u3059\u308A",
      "\u3066\u305D\u3046",
      "\u3066\u3061\u304B\u3099\u3044",
      "\u3066\u3061\u3087\u3046",
      "\u3066\u3064\u304B\u3099\u304F",
      "\u3066\u3064\u3064\u3099\u304D",
      "\u3066\u3099\u3063\u306F\u309A",
      "\u3066\u3064\u307B\u3099\u3046",
      "\u3066\u3064\u3084",
      "\u3066\u3099\u306C\u304B\u3048",
      "\u3066\u306C\u304D",
      "\u3066\u306C\u304F\u3099\u3044",
      "\u3066\u306E\u3072\u3089",
      "\u3066\u306F\u3044",
      "\u3066\u3075\u3099\u304F\u308D",
      "\u3066\u3075\u305F\u3099",
      "\u3066\u307B\u3068\u3099\u304D",
      "\u3066\u307B\u3093",
      "\u3066\u307E\u3048",
      "\u3066\u307E\u304D\u3059\u3099\u3057",
      "\u3066\u307F\u3057\u3099\u304B",
      "\u3066\u307F\u3084\u3051\u3099",
      "\u3066\u3089\u3059",
      "\u3066\u308C\u3072\u3099",
      "\u3066\u308F\u3051",
      "\u3066\u308F\u305F\u3057",
      "\u3066\u3099\u3093\u3042\u3064",
      "\u3066\u3093\u3044\u3093",
      "\u3066\u3093\u304B\u3044",
      "\u3066\u3093\u304D",
      "\u3066\u3093\u304F\u3099",
      "\u3066\u3093\u3051\u3093",
      "\u3066\u3093\u3053\u3099\u304F",
      "\u3066\u3093\u3055\u3044",
      "\u3066\u3093\u3057",
      "\u3066\u3093\u3059\u3046",
      "\u3066\u3099\u3093\u3061",
      "\u3066\u3093\u3066\u304D",
      "\u3066\u3093\u3068\u3046",
      "\u3066\u3093\u306A\u3044",
      "\u3066\u3093\u3075\u309A\u3089",
      "\u3066\u3093\u307B\u3099\u3046\u305F\u3099\u3044",
      "\u3066\u3093\u3081\u3064",
      "\u3066\u3093\u3089\u3093\u304B\u3044",
      "\u3066\u3099\u3093\u308A\u3087\u304F",
      "\u3066\u3099\u3093\u308F",
      "\u3068\u3099\u3042\u3044",
      "\u3068\u3044\u308C",
      "\u3068\u3099\u3046\u304B\u3093",
      "\u3068\u3046\u304D\u3085\u3046",
      "\u3068\u3099\u3046\u304F\u3099",
      "\u3068\u3046\u3057",
      "\u3068\u3046\u3080\u304D\u3099",
      "\u3068\u304A\u3044",
      "\u3068\u304A\u304B",
      "\u3068\u304A\u304F",
      "\u3068\u304A\u3059",
      "\u3068\u304A\u308B",
      "\u3068\u304B\u3044",
      "\u3068\u304B\u3059",
      "\u3068\u304D\u304A\u308A",
      "\u3068\u304D\u3068\u3099\u304D",
      "\u3068\u304F\u3044",
      "\u3068\u304F\u3057\u3085\u3046",
      "\u3068\u304F\u3066\u3093",
      "\u3068\u304F\u306B",
      "\u3068\u304F\u3078\u3099\u3064",
      "\u3068\u3051\u3044",
      "\u3068\u3051\u308B",
      "\u3068\u3053\u3084",
      "\u3068\u3055\u304B",
      "\u3068\u3057\u3087\u304B\u3093",
      "\u3068\u305D\u3046",
      "\u3068\u305F\u3093",
      "\u3068\u3061\u3085\u3046",
      "\u3068\u3063\u304D\u3085\u3046",
      "\u3068\u3063\u304F\u3093",
      "\u3068\u3064\u305B\u3099\u3093",
      "\u3068\u3064\u306B\u3085\u3046",
      "\u3068\u3068\u3099\u3051\u308B",
      "\u3068\u3068\u306E\u3048\u308B",
      "\u3068\u306A\u3044",
      "\u3068\u306A\u3048\u308B",
      "\u3068\u306A\u308A",
      "\u3068\u306E\u3055\u307E",
      "\u3068\u306F\u3099\u3059",
      "\u3068\u3099\u3075\u3099\u304B\u3099\u308F",
      "\u3068\u307B\u3046",
      "\u3068\u307E\u308B",
      "\u3068\u3081\u308B",
      "\u3068\u3082\u305F\u3099\u3061",
      "\u3068\u3082\u308B",
      "\u3068\u3099\u3088\u3046\u3072\u3099",
      "\u3068\u3089\u3048\u308B",
      "\u3068\u3093\u304B\u3064",
      "\u3068\u3099\u3093\u3075\u3099\u308A",
      "\u306A\u3044\u304B\u304F",
      "\u306A\u3044\u3053\u3046",
      "\u306A\u3044\u3057\u3087",
      "\u306A\u3044\u3059",
      "\u306A\u3044\u305B\u3093",
      "\u306A\u3044\u305D\u3046",
      "\u306A\u304A\u3059",
      "\u306A\u304B\u3099\u3044",
      "\u306A\u304F\u3059",
      "\u306A\u3051\u3099\u308B",
      "\u306A\u3053\u3046\u3068\u3099",
      "\u306A\u3055\u3051",
      "\u306A\u305F\u3066\u3099\u3053\u3053",
      "\u306A\u3063\u3068\u3046",
      "\u306A\u3064\u3084\u3059\u307F",
      "\u306A\u306A\u304A\u3057",
      "\u306A\u306B\u3053\u3099\u3068",
      "\u306A\u306B\u3082\u306E",
      "\u306A\u306B\u308F",
      "\u306A\u306E\u304B",
      "\u306A\u3075\u305F\u3099",
      "\u306A\u307E\u3044\u304D",
      "\u306A\u307E\u3048",
      "\u306A\u307E\u307F",
      "\u306A\u307F\u305F\u3099",
      "\u306A\u3081\u3089\u304B",
      "\u306A\u3081\u308B",
      "\u306A\u3084\u3080",
      "\u306A\u3089\u3046",
      "\u306A\u3089\u3072\u3099",
      "\u306A\u3089\u3075\u3099",
      "\u306A\u308C\u308B",
      "\u306A\u308F\u3068\u3072\u3099",
      "\u306A\u308F\u306F\u3099\u308A",
      "\u306B\u3042\u3046",
      "\u306B\u3044\u304B\u3099\u305F",
      "\u306B\u3046\u3051",
      "\u306B\u304A\u3044",
      "\u306B\u304B\u3044",
      "\u306B\u304B\u3099\u3066",
      "\u306B\u304D\u3072\u3099",
      "\u306B\u304F\u3057\u307F",
      "\u306B\u304F\u307E\u3093",
      "\u306B\u3051\u3099\u308B",
      "\u306B\u3055\u3093\u304B\u305F\u3093\u305D",
      "\u306B\u3057\u304D",
      "\u306B\u305B\u3082\u306E",
      "\u306B\u3061\u3057\u3099\u3087\u3046",
      "\u306B\u3061\u3088\u3046\u3072\u3099",
      "\u306B\u3063\u304B",
      "\u306B\u3063\u304D",
      "\u306B\u3063\u3051\u3044",
      "\u306B\u3063\u3053\u3046",
      "\u306B\u3063\u3055\u3093",
      "\u306B\u3063\u3057\u3087\u304F",
      "\u306B\u3063\u3059\u3046",
      "\u306B\u3063\u305B\u304D",
      "\u306B\u3063\u3066\u3044",
      "\u306B\u306A\u3046",
      "\u306B\u307B\u3093",
      "\u306B\u307E\u3081",
      "\u306B\u3082\u3064",
      "\u306B\u3084\u308A",
      "\u306B\u3085\u3046\u3044\u3093",
      "\u306B\u308A\u3093\u3057\u3083",
      "\u306B\u308F\u3068\u308A",
      "\u306B\u3093\u3044",
      "\u306B\u3093\u304B",
      "\u306B\u3093\u304D",
      "\u306B\u3093\u3051\u3099\u3093",
      "\u306B\u3093\u3057\u304D",
      "\u306B\u3093\u3059\u3099\u3046",
      "\u306B\u3093\u305D\u3046",
      "\u306B\u3093\u305F\u3044",
      "\u306B\u3093\u3061",
      "\u306B\u3093\u3066\u3044",
      "\u306B\u3093\u306B\u304F",
      "\u306B\u3093\u3075\u309A",
      "\u306B\u3093\u307E\u308A",
      "\u306B\u3093\u3080",
      "\u306B\u3093\u3081\u3044",
      "\u306B\u3093\u3088\u3046",
      "\u306C\u3044\u304F\u304D\u3099",
      "\u306C\u304B\u3059",
      "\u306C\u304F\u3099\u3044\u3068\u308B",
      "\u306C\u304F\u3099\u3046",
      "\u306C\u304F\u3082\u308A",
      "\u306C\u3059\u3080",
      "\u306C\u307E\u3048\u3072\u3099",
      "\u306C\u3081\u308A",
      "\u306C\u3089\u3059",
      "\u306C\u3093\u3061\u3083\u304F",
      "\u306D\u3042\u3051\u3099",
      "\u306D\u3044\u304D",
      "\u306D\u3044\u308B",
      "\u306D\u3044\u308D",
      "\u306D\u304F\u3099\u305B",
      "\u306D\u304F\u305F\u3044",
      "\u306D\u304F\u3089",
      "\u306D\u3053\u305B\u3099",
      "\u306D\u3053\u3080",
      "\u306D\u3055\u3051\u3099",
      "\u306D\u3059\u3053\u3099\u3059",
      "\u306D\u305D\u3078\u3099\u308B",
      "\u306D\u305F\u3099\u3093",
      "\u306D\u3064\u3044",
      "\u306D\u3063\u3057\u3093",
      "\u306D\u3064\u305D\u3099\u3046",
      "\u306D\u3063\u305F\u3044\u304D\u3099\u3087",
      "\u306D\u3075\u3099\u305D\u304F",
      "\u306D\u3075\u305F\u3099",
      "\u306D\u307B\u3099\u3046",
      "\u306D\u307B\u308A\u306F\u307B\u308A",
      "\u306D\u307E\u304D",
      "\u306D\u307E\u308F\u3057",
      "\u306D\u307F\u307F",
      "\u306D\u3080\u3044",
      "\u306D\u3080\u305F\u3044",
      "\u306D\u3082\u3068",
      "\u306D\u3089\u3046",
      "\u306D\u308F\u3055\u3099",
      "\u306D\u3093\u3044\u308A",
      "\u306D\u3093\u304A\u3057",
      "\u306D\u3093\u304B\u3093",
      "\u306D\u3093\u304D\u3093",
      "\u306D\u3093\u304F\u3099",
      "\u306D\u3093\u3055\u3099",
      "\u306D\u3093\u3057",
      "\u306D\u3093\u3061\u3083\u304F",
      "\u306D\u3093\u3068\u3099",
      "\u306D\u3093\u3072\u309A",
      "\u306D\u3093\u3075\u3099\u3064",
      "\u306D\u3093\u307E\u3064",
      "\u306D\u3093\u308A\u3087\u3046",
      "\u306D\u3093\u308C\u3044",
      "\u306E\u3044\u3059\u3099",
      "\u306E\u304A\u3064\u3099\u307E",
      "\u306E\u304B\u3099\u3059",
      "\u306E\u304D\u306A\u307F",
      "\u306E\u3053\u304D\u3099\u308A",
      "\u306E\u3053\u3059",
      "\u306E\u3053\u308B",
      "\u306E\u305B\u308B",
      "\u306E\u305D\u3099\u304F",
      "\u306E\u305D\u3099\u3080",
      "\u306E\u305F\u307E\u3046",
      "\u306E\u3061\u307B\u3068\u3099",
      "\u306E\u3063\u304F",
      "\u306E\u306F\u3099\u3059",
      "\u306E\u306F\u3089",
      "\u306E\u3078\u3099\u308B",
      "\u306E\u307B\u3099\u308B",
      "\u306E\u307F\u3082\u306E",
      "\u306E\u3084\u307E",
      "\u306E\u3089\u3044\u306C",
      "\u306E\u3089\u306D\u3053",
      "\u306E\u308A\u3082\u306E",
      "\u306E\u308A\u3086\u304D",
      "\u306E\u308C\u3093",
      "\u306E\u3093\u304D",
      "\u306F\u3099\u3042\u3044",
      "\u306F\u3042\u304F",
      "\u306F\u3099\u3042\u3055\u3093",
      "\u306F\u3099\u3044\u304B",
      "\u306F\u3099\u3044\u304F",
      "\u306F\u3044\u3051\u3093",
      "\u306F\u3044\u3053\u3099",
      "\u306F\u3044\u3057\u3093",
      "\u306F\u3044\u3059\u3044",
      "\u306F\u3044\u305B\u3093",
      "\u306F\u3044\u305D\u3046",
      "\u306F\u3044\u3061",
      "\u306F\u3099\u3044\u306F\u3099\u3044",
      "\u306F\u3044\u308C\u3064",
      "\u306F\u3048\u308B",
      "\u306F\u304A\u308B",
      "\u306F\u304B\u3044",
      "\u306F\u3099\u304B\u308A",
      "\u306F\u304B\u308B",
      "\u306F\u304F\u3057\u3085",
      "\u306F\u3051\u3093",
      "\u306F\u3053\u3075\u3099",
      "\u306F\u3055\u307F",
      "\u306F\u3055\u3093",
      "\u306F\u3057\u3053\u3099",
      "\u306F\u3099\u3057\u3087",
      "\u306F\u3057\u308B",
      "\u306F\u305B\u308B",
      "\u306F\u309A\u305D\u3053\u3093",
      "\u306F\u305D\u3093",
      "\u306F\u305F\u3093",
      "\u306F\u3061\u307F\u3064",
      "\u306F\u3064\u304A\u3093",
      "\u306F\u3063\u304B\u304F",
      "\u306F\u3064\u3099\u304D",
      "\u306F\u3063\u304D\u308A",
      "\u306F\u3063\u304F\u3064",
      "\u306F\u3063\u3051\u3093",
      "\u306F\u3063\u3053\u3046",
      "\u306F\u3063\u3055\u3093",
      "\u306F\u3063\u3057\u3093",
      "\u306F\u3063\u305F\u3064",
      "\u306F\u3063\u3061\u3085\u3046",
      "\u306F\u3063\u3066\u3093",
      "\u306F\u3063\u3072\u309A\u3087\u3046",
      "\u306F\u3063\u307B\u309A\u3046",
      "\u306F\u306A\u3059",
      "\u306F\u306A\u3072\u3099",
      "\u306F\u306B\u304B\u3080",
      "\u306F\u3075\u3099\u3089\u3057",
      "\u306F\u307F\u304B\u3099\u304D",
      "\u306F\u3080\u304B\u3046",
      "\u306F\u3081\u3064",
      "\u306F\u3084\u3044",
      "\u306F\u3084\u3057",
      "\u306F\u3089\u3046",
      "\u306F\u308D\u3046\u3043\u3093",
      "\u306F\u308F\u3044",
      "\u306F\u3093\u3044",
      "\u306F\u3093\u3048\u3044",
      "\u306F\u3093\u304A\u3093",
      "\u306F\u3093\u304B\u304F",
      "\u306F\u3093\u304D\u3087\u3046",
      "\u306F\u3099\u3093\u304F\u3099\u307F",
      "\u306F\u3093\u3053",
      "\u306F\u3093\u3057\u3083",
      "\u306F\u3093\u3059\u3046",
      "\u306F\u3093\u305F\u3099\u3093",
      "\u306F\u309A\u3093\u3061",
      "\u306F\u309A\u3093\u3064",
      "\u306F\u3093\u3066\u3044",
      "\u306F\u3093\u3068\u3057",
      "\u306F\u3093\u306E\u3046",
      "\u306F\u3093\u306F\u309A",
      "\u306F\u3093\u3075\u3099\u3093",
      "\u306F\u3093\u3078\u309A\u3093",
      "\u306F\u3093\u307B\u3099\u3046\u304D",
      "\u306F\u3093\u3081\u3044",
      "\u306F\u3093\u3089\u3093",
      "\u306F\u3093\u308D\u3093",
      "\u3072\u3044\u304D",
      "\u3072\u3046\u3093",
      "\u3072\u3048\u308B",
      "\u3072\u304B\u304F",
      "\u3072\u304B\u308A",
      "\u3072\u304B\u308B",
      "\u3072\u304B\u3093",
      "\u3072\u304F\u3044",
      "\u3072\u3051\u3064",
      "\u3072\u3053\u3046\u304D",
      "\u3072\u3053\u304F",
      "\u3072\u3055\u3044",
      "\u3072\u3055\u3057\u3075\u3099\u308A",
      "\u3072\u3055\u3093",
      "\u3072\u3099\u3057\u3099\u3085\u3064\u304B\u3093",
      "\u3072\u3057\u3087",
      "\u3072\u305D\u304B",
      "\u3072\u305D\u3080",
      "\u3072\u305F\u3080\u304D",
      "\u3072\u305F\u3099\u308A",
      "\u3072\u305F\u308B",
      "\u3072\u3064\u304D\u3099",
      "\u3072\u3063\u3053\u3057",
      "\u3072\u3063\u3057",
      "\u3072\u3064\u3057\u3099\u3085\u3072\u3093",
      "\u3072\u3063\u3059",
      "\u3072\u3064\u305B\u3099\u3093",
      "\u3072\u309A\u3063\u305F\u308A",
      "\u3072\u309A\u3063\u3061\u308A",
      "\u3072\u3064\u3088\u3046",
      "\u3072\u3066\u3044",
      "\u3072\u3068\u3053\u3099\u307F",
      "\u3072\u306A\u307E\u3064\u308A",
      "\u3072\u306A\u3093",
      "\u3072\u306D\u308B",
      "\u3072\u306F\u3093",
      "\u3072\u3072\u3099\u304F",
      "\u3072\u3072\u3087\u3046",
      "\u3072\u307B\u3046",
      "\u3072\u307E\u308F\u308A",
      "\u3072\u307E\u3093",
      "\u3072\u307F\u3064",
      "\u3072\u3081\u3044",
      "\u3072\u3081\u3057\u3099\u3057",
      "\u3072\u3084\u3051",
      "\u3072\u3084\u3059",
      "\u3072\u3088\u3046",
      "\u3072\u3099\u3087\u3046\u304D",
      "\u3072\u3089\u304B\u3099\u306A",
      "\u3072\u3089\u304F",
      "\u3072\u308A\u3064",
      "\u3072\u308A\u3087\u3046",
      "\u3072\u308B\u307E",
      "\u3072\u308B\u3084\u3059\u307F",
      "\u3072\u308C\u3044",
      "\u3072\u308D\u3044",
      "\u3072\u308D\u3046",
      "\u3072\u308D\u304D",
      "\u3072\u308D\u3086\u304D",
      "\u3072\u3093\u304B\u304F",
      "\u3072\u3093\u3051\u3064",
      "\u3072\u3093\u3053\u3093",
      "\u3072\u3093\u3057\u3085",
      "\u3072\u3093\u305D\u3046",
      "\u3072\u309A\u3093\u3061",
      "\u3072\u3093\u306F\u309A\u3093",
      "\u3072\u3099\u3093\u307B\u3099\u3046",
      "\u3075\u3042\u3093",
      "\u3075\u3044\u3046\u3061",
      "\u3075\u3046\u3051\u3044",
      "\u3075\u3046\u305B\u3093",
      "\u3075\u309A\u3046\u305F\u308D\u3046",
      "\u3075\u3046\u3068\u3046",
      "\u3075\u3046\u3075",
      "\u3075\u3048\u308B",
      "\u3075\u304A\u3093",
      "\u3075\u304B\u3044",
      "\u3075\u304D\u3093",
      "\u3075\u304F\u3055\u3099\u3064",
      "\u3075\u304F\u3075\u3099\u304F\u308D",
      "\u3075\u3053\u3046",
      "\u3075\u3055\u3044",
      "\u3075\u3057\u304D\u3099",
      "\u3075\u3057\u3099\u307F",
      "\u3075\u3059\u307E",
      "\u3075\u305B\u3044",
      "\u3075\u305B\u304F\u3099",
      "\u3075\u305D\u304F",
      "\u3075\u3099\u305F\u306B\u304F",
      "\u3075\u305F\u3093",
      "\u3075\u3061\u3087\u3046",
      "\u3075\u3064\u3046",
      "\u3075\u3064\u304B",
      "\u3075\u3063\u304B\u3064",
      "\u3075\u3063\u304D",
      "\u3075\u3063\u3053\u304F",
      "\u3075\u3099\u3068\u3099\u3046",
      "\u3075\u3068\u308B",
      "\u3075\u3068\u3093",
      "\u3075\u306E\u3046",
      "\u3075\u306F\u3044",
      "\u3075\u3072\u3087\u3046",
      "\u3075\u3078\u3093",
      "\u3075\u307E\u3093",
      "\u3075\u307F\u3093",
      "\u3075\u3081\u3064",
      "\u3075\u3081\u3093",
      "\u3075\u3088\u3046",
      "\u3075\u308A\u3053",
      "\u3075\u308A\u308B",
      "\u3075\u308B\u3044",
      "\u3075\u3093\u3044\u304D",
      "\u3075\u3099\u3093\u304B\u3099\u304F",
      "\u3075\u3099\u3093\u304F\u3099",
      "\u3075\u3093\u3057\u3064",
      "\u3075\u3099\u3093\u305B\u304D",
      "\u3075\u3093\u305D\u3046",
      "\u3075\u3099\u3093\u307B\u309A\u3046",
      "\u3078\u3044\u3042\u3093",
      "\u3078\u3044\u304A\u3093",
      "\u3078\u3044\u304B\u3099\u3044",
      "\u3078\u3044\u304D",
      "\u3078\u3044\u3051\u3099\u3093",
      "\u3078\u3044\u3053\u3046",
      "\u3078\u3044\u3055",
      "\u3078\u3044\u3057\u3083",
      "\u3078\u3044\u305B\u3064",
      "\u3078\u3044\u305D",
      "\u3078\u3044\u305F\u304F",
      "\u3078\u3044\u3066\u3093",
      "\u3078\u3044\u306D\u3064",
      "\u3078\u3044\u308F",
      "\u3078\u304D\u304B\u3099",
      "\u3078\u3053\u3080",
      "\u3078\u3099\u306B\u3044\u308D",
      "\u3078\u3099\u306B\u3057\u3087\u3046\u304B\u3099",
      "\u3078\u3089\u3059",
      "\u3078\u3093\u304B\u3093",
      "\u3078\u3099\u3093\u304D\u3087\u3046",
      "\u3078\u3099\u3093\u3053\u3099\u3057",
      "\u3078\u3093\u3055\u3044",
      "\u3078\u3093\u305F\u3044",
      "\u3078\u3099\u3093\u308A",
      "\u307B\u3042\u3093",
      "\u307B\u3044\u304F",
      "\u307B\u3099\u3046\u304D\u3099\u3087",
      "\u307B\u3046\u3053\u304F",
      "\u307B\u3046\u305D\u3046",
      "\u307B\u3046\u307B\u3046",
      "\u307B\u3046\u3082\u3093",
      "\u307B\u3046\u308A\u3064",
      "\u307B\u3048\u308B",
      "\u307B\u304A\u3093",
      "\u307B\u304B\u3093",
      "\u307B\u304D\u3087\u3046",
      "\u307B\u3099\u304D\u3093",
      "\u307B\u304F\u308D",
      "\u307B\u3051\u3064",
      "\u307B\u3051\u3093",
      "\u307B\u3053\u3046",
      "\u307B\u3053\u308B",
      "\u307B\u3057\u3044",
      "\u307B\u3057\u3064",
      "\u307B\u3057\u3085",
      "\u307B\u3057\u3087\u3046",
      "\u307B\u305B\u3044",
      "\u307B\u305D\u3044",
      "\u307B\u305D\u304F",
      "\u307B\u305F\u3066",
      "\u307B\u305F\u308B",
      "\u307B\u309A\u3061\u3075\u3099\u304F\u308D",
      "\u307B\u3063\u304D\u3087\u304F",
      "\u307B\u3063\u3055",
      "\u307B\u3063\u305F\u3093",
      "\u307B\u3068\u3093\u3068\u3099",
      "\u307B\u3081\u308B",
      "\u307B\u3093\u3044",
      "\u307B\u3093\u304D",
      "\u307B\u3093\u3051",
      "\u307B\u3093\u3057\u3064",
      "\u307B\u3093\u3084\u304F",
      "\u307E\u3044\u306B\u3061",
      "\u307E\u304B\u3044",
      "\u307E\u304B\u305B\u308B",
      "\u307E\u304B\u3099\u308B",
      "\u307E\u3051\u308B",
      "\u307E\u3053\u3068",
      "\u307E\u3055\u3064",
      "\u307E\u3057\u3099\u3081",
      "\u307E\u3059\u304F",
      "\u307E\u305B\u3099\u308B",
      "\u307E\u3064\u308A",
      "\u307E\u3068\u3081",
      "\u307E\u306A\u3075\u3099",
      "\u307E\u306C\u3051",
      "\u307E\u306D\u304F",
      "\u307E\u307B\u3046",
      "\u307E\u3082\u308B",
      "\u307E\u3086\u3051\u3099",
      "\u307E\u3088\u3046",
      "\u307E\u308D\u3084\u304B",
      "\u307E\u308F\u3059",
      "\u307E\u308F\u308A",
      "\u307E\u308F\u308B",
      "\u307E\u3093\u304B\u3099",
      "\u307E\u3093\u304D\u3064",
      "\u307E\u3093\u305D\u3099\u304F",
      "\u307E\u3093\u306A\u304B",
      "\u307F\u3044\u3089",
      "\u307F\u3046\u3061",
      "\u307F\u3048\u308B",
      "\u307F\u304B\u3099\u304F",
      "\u307F\u304B\u305F",
      "\u307F\u304B\u3093",
      "\u307F\u3051\u3093",
      "\u307F\u3053\u3093",
      "\u307F\u3057\u3099\u304B\u3044",
      "\u307F\u3059\u3044",
      "\u307F\u3059\u3048\u308B",
      "\u307F\u305B\u308B",
      "\u307F\u3063\u304B",
      "\u307F\u3064\u304B\u308B",
      "\u307F\u3064\u3051\u308B",
      "\u307F\u3066\u3044",
      "\u307F\u3068\u3081\u308B",
      "\u307F\u306A\u3068",
      "\u307F\u306A\u307F\u304B\u3055\u3044",
      "\u307F\u306D\u3089\u308B",
      "\u307F\u306E\u3046",
      "\u307F\u306E\u304B\u3099\u3059",
      "\u307F\u307B\u3093",
      "\u307F\u3082\u3068",
      "\u307F\u3084\u3051\u3099",
      "\u307F\u3089\u3044",
      "\u307F\u308A\u3087\u304F",
      "\u307F\u308F\u304F",
      "\u307F\u3093\u304B",
      "\u307F\u3093\u305D\u3099\u304F",
      "\u3080\u3044\u304B",
      "\u3080\u3048\u304D",
      "\u3080\u3048\u3093",
      "\u3080\u304B\u3044",
      "\u3080\u304B\u3046",
      "\u3080\u304B\u3048",
      "\u3080\u304B\u3057",
      "\u3080\u304D\u3099\u3061\u3083",
      "\u3080\u3051\u308B",
      "\u3080\u3051\u3099\u3093",
      "\u3080\u3055\u307B\u3099\u308B",
      "\u3080\u3057\u3042\u3064\u3044",
      "\u3080\u3057\u306F\u3099",
      "\u3080\u3057\u3099\u3085\u3093",
      "\u3080\u3057\u308D",
      "\u3080\u3059\u3046",
      "\u3080\u3059\u3053",
      "\u3080\u3059\u3075\u3099",
      "\u3080\u3059\u3081",
      "\u3080\u305B\u308B",
      "\u3080\u305B\u3093",
      "\u3080\u3061\u3085\u3046",
      "\u3080\u306A\u3057\u3044",
      "\u3080\u306E\u3046",
      "\u3080\u3084\u307F",
      "\u3080\u3088\u3046",
      "\u3080\u3089\u3055\u304D",
      "\u3080\u308A\u3087\u3046",
      "\u3080\u308D\u3093",
      "\u3081\u3044\u3042\u3093",
      "\u3081\u3044\u3046\u3093",
      "\u3081\u3044\u3048\u3093",
      "\u3081\u3044\u304B\u304F",
      "\u3081\u3044\u304D\u3087\u304F",
      "\u3081\u3044\u3055\u3044",
      "\u3081\u3044\u3057",
      "\u3081\u3044\u305D\u3046",
      "\u3081\u3044\u3075\u3099\u3064",
      "\u3081\u3044\u308C\u3044",
      "\u3081\u3044\u308F\u304F",
      "\u3081\u304F\u3099\u307E\u308C\u308B",
      "\u3081\u3055\u3099\u3059",
      "\u3081\u3057\u305F",
      "\u3081\u3059\u3099\u3089\u3057\u3044",
      "\u3081\u305F\u3099\u3064",
      "\u3081\u307E\u3044",
      "\u3081\u3084\u3059",
      "\u3081\u3093\u304D\u3087",
      "\u3081\u3093\u305B\u304D",
      "\u3081\u3093\u3068\u3099\u3046",
      "\u3082\u3046\u3057\u3042\u3051\u3099\u308B",
      "\u3082\u3046\u3068\u3099\u3046\u3051\u3093",
      "\u3082\u3048\u308B",
      "\u3082\u304F\u3057",
      "\u3082\u304F\u3066\u304D",
      "\u3082\u304F\u3088\u3046\u3072\u3099",
      "\u3082\u3061\u308D\u3093",
      "\u3082\u3068\u3099\u308B",
      "\u3082\u3089\u3046",
      "\u3082\u3093\u304F",
      "\u3082\u3093\u305F\u3099\u3044",
      "\u3084\u304A\u3084",
      "\u3084\u3051\u308B",
      "\u3084\u3055\u3044",
      "\u3084\u3055\u3057\u3044",
      "\u3084\u3059\u3044",
      "\u3084\u3059\u305F\u308D\u3046",
      "\u3084\u3059\u307F",
      "\u3084\u305B\u308B",
      "\u3084\u305D\u3046",
      "\u3084\u305F\u3044",
      "\u3084\u3061\u3093",
      "\u3084\u3063\u3068",
      "\u3084\u3063\u306F\u309A\u308A",
      "\u3084\u3075\u3099\u308B",
      "\u3084\u3081\u308B",
      "\u3084\u3084\u3053\u3057\u3044",
      "\u3084\u3088\u3044",
      "\u3084\u308F\u3089\u304B\u3044",
      "\u3086\u3046\u304D",
      "\u3086\u3046\u3072\u3099\u3093\u304D\u3087\u304F",
      "\u3086\u3046\u3078\u3099",
      "\u3086\u3046\u3081\u3044",
      "\u3086\u3051\u3064",
      "\u3086\u3057\u3085\u3064",
      "\u3086\u305B\u3093",
      "\u3086\u305D\u3046",
      "\u3086\u305F\u304B",
      "\u3086\u3061\u3083\u304F",
      "\u3086\u3066\u3099\u308B",
      "\u3086\u306B\u3085\u3046",
      "\u3086\u3072\u3099\u308F",
      "\u3086\u3089\u3044",
      "\u3086\u308C\u308B",
      "\u3088\u3046\u3044",
      "\u3088\u3046\u304B",
      "\u3088\u3046\u304D\u3085\u3046",
      "\u3088\u3046\u3057\u3099",
      "\u3088\u3046\u3059",
      "\u3088\u3046\u3061\u3048\u3093",
      "\u3088\u304B\u305B\u3099",
      "\u3088\u304B\u3093",
      "\u3088\u304D\u3093",
      "\u3088\u304F\u305B\u3044",
      "\u3088\u304F\u307B\u3099\u3046",
      "\u3088\u3051\u3044",
      "\u3088\u3053\u3099\u308C\u308B",
      "\u3088\u3055\u3093",
      "\u3088\u3057\u3085\u3046",
      "\u3088\u305D\u3046",
      "\u3088\u305D\u304F",
      "\u3088\u3063\u304B",
      "\u3088\u3066\u3044",
      "\u3088\u3068\u3099\u304B\u3099\u308F\u304F",
      "\u3088\u306D\u3064",
      "\u3088\u3084\u304F",
      "\u3088\u3086\u3046",
      "\u3088\u308D\u3053\u3075\u3099",
      "\u3088\u308D\u3057\u3044",
      "\u3089\u3044\u3046",
      "\u3089\u304F\u304B\u3099\u304D",
      "\u3089\u304F\u3053\u3099",
      "\u3089\u304F\u3055\u3064",
      "\u3089\u304F\u305F\u3099",
      "\u3089\u3057\u3093\u306F\u3099\u3093",
      "\u3089\u305B\u3093",
      "\u3089\u305D\u3099\u304F",
      "\u3089\u305F\u3044",
      "\u3089\u3063\u304B",
      "\u3089\u308C\u3064",
      "\u308A\u3048\u304D",
      "\u308A\u304B\u3044",
      "\u308A\u304D\u3055\u304F",
      "\u308A\u304D\u305B\u3064",
      "\u308A\u304F\u304F\u3099\u3093",
      "\u308A\u304F\u3064",
      "\u308A\u3051\u3093",
      "\u308A\u3053\u3046",
      "\u308A\u305B\u3044",
      "\u308A\u305D\u3046",
      "\u308A\u305D\u304F",
      "\u308A\u3066\u3093",
      "\u308A\u306D\u3093",
      "\u308A\u3086\u3046",
      "\u308A\u3085\u3046\u304B\u3099\u304F",
      "\u308A\u3088\u3046",
      "\u308A\u3087\u3046\u308A",
      "\u308A\u3087\u304B\u3093",
      "\u308A\u3087\u304F\u3061\u3083",
      "\u308A\u3087\u3053\u3046",
      "\u308A\u308A\u304F",
      "\u308A\u308C\u304D",
      "\u308A\u308D\u3093",
      "\u308A\u3093\u3053\u3099",
      "\u308B\u3044\u3051\u3044",
      "\u308B\u3044\u3055\u3044",
      "\u308B\u3044\u3057\u3099",
      "\u308B\u3044\u305B\u304D",
      "\u308B\u3059\u306F\u3099\u3093",
      "\u308B\u308A\u304B\u3099\u308F\u3089",
      "\u308C\u3044\u304B\u3093",
      "\u308C\u3044\u304D\u3099",
      "\u308C\u3044\u305B\u3044",
      "\u308C\u3044\u305D\u3099\u3046\u3053",
      "\u308C\u3044\u3068\u3046",
      "\u308C\u3044\u307B\u3099\u3046",
      "\u308C\u304D\u3057",
      "\u308C\u304D\u305F\u3099\u3044",
      "\u308C\u3093\u3042\u3044",
      "\u308C\u3093\u3051\u3044",
      "\u308C\u3093\u3053\u3093",
      "\u308C\u3093\u3055\u3044",
      "\u308C\u3093\u3057\u3085\u3046",
      "\u308C\u3093\u305D\u3099\u304F",
      "\u308C\u3093\u3089\u304F",
      "\u308D\u3046\u304B",
      "\u308D\u3046\u3053\u3099",
      "\u308D\u3046\u3057\u3099\u3093",
      "\u308D\u3046\u305D\u304F",
      "\u308D\u304F\u304B\u3099",
      "\u308D\u3053\u3064",
      "\u308D\u3057\u3099\u3046\u3089",
      "\u308D\u3057\u3085\u3064",
      "\u308D\u305B\u3093",
      "\u308D\u3066\u3093",
      "\u308D\u3081\u3093",
      "\u308D\u308C\u3064",
      "\u308D\u3093\u304D\u3099",
      "\u308D\u3093\u306F\u309A",
      "\u308D\u3093\u3075\u3099\u3093",
      "\u308D\u3093\u308A",
      "\u308F\u304B\u3059",
      "\u308F\u304B\u3081",
      "\u308F\u304B\u3084\u307E",
      "\u308F\u304B\u308C\u308B",
      "\u308F\u3057\u3064",
      "\u308F\u3057\u3099\u307E\u3057",
      "\u308F\u3059\u308C\u3082\u306E",
      "\u308F\u3089\u3046",
      "\u308F\u308C\u308B"
    ];
  }
});

// node_modules/bip39/src/wordlists/portuguese.json
var require_portuguese = __commonJS({
  "node_modules/bip39/src/wordlists/portuguese.json"(exports, module2) {
    module2.exports = [
      "abacate",
      "abaixo",
      "abalar",
      "abater",
      "abduzir",
      "abelha",
      "aberto",
      "abismo",
      "abotoar",
      "abranger",
      "abreviar",
      "abrigar",
      "abrupto",
      "absinto",
      "absoluto",
      "absurdo",
      "abutre",
      "acabado",
      "acalmar",
      "acampar",
      "acanhar",
      "acaso",
      "aceitar",
      "acelerar",
      "acenar",
      "acervo",
      "acessar",
      "acetona",
      "achatar",
      "acidez",
      "acima",
      "acionado",
      "acirrar",
      "aclamar",
      "aclive",
      "acolhida",
      "acomodar",
      "acoplar",
      "acordar",
      "acumular",
      "acusador",
      "adaptar",
      "adega",
      "adentro",
      "adepto",
      "adequar",
      "aderente",
      "adesivo",
      "adeus",
      "adiante",
      "aditivo",
      "adjetivo",
      "adjunto",
      "admirar",
      "adorar",
      "adquirir",
      "adubo",
      "adverso",
      "advogado",
      "aeronave",
      "afastar",
      "aferir",
      "afetivo",
      "afinador",
      "afivelar",
      "aflito",
      "afluente",
      "afrontar",
      "agachar",
      "agarrar",
      "agasalho",
      "agenciar",
      "agilizar",
      "agiota",
      "agitado",
      "agora",
      "agradar",
      "agreste",
      "agrupar",
      "aguardar",
      "agulha",
      "ajoelhar",
      "ajudar",
      "ajustar",
      "alameda",
      "alarme",
      "alastrar",
      "alavanca",
      "albergue",
      "albino",
      "alcatra",
      "aldeia",
      "alecrim",
      "alegria",
      "alertar",
      "alface",
      "alfinete",
      "algum",
      "alheio",
      "aliar",
      "alicate",
      "alienar",
      "alinhar",
      "aliviar",
      "almofada",
      "alocar",
      "alpiste",
      "alterar",
      "altitude",
      "alucinar",
      "alugar",
      "aluno",
      "alusivo",
      "alvo",
      "amaciar",
      "amador",
      "amarelo",
      "amassar",
      "ambas",
      "ambiente",
      "ameixa",
      "amenizar",
      "amido",
      "amistoso",
      "amizade",
      "amolador",
      "amontoar",
      "amoroso",
      "amostra",
      "amparar",
      "ampliar",
      "ampola",
      "anagrama",
      "analisar",
      "anarquia",
      "anatomia",
      "andaime",
      "anel",
      "anexo",
      "angular",
      "animar",
      "anjo",
      "anomalia",
      "anotado",
      "ansioso",
      "anterior",
      "anuidade",
      "anunciar",
      "anzol",
      "apagador",
      "apalpar",
      "apanhado",
      "apego",
      "apelido",
      "apertada",
      "apesar",
      "apetite",
      "apito",
      "aplauso",
      "aplicada",
      "apoio",
      "apontar",
      "aposta",
      "aprendiz",
      "aprovar",
      "aquecer",
      "arame",
      "aranha",
      "arara",
      "arcada",
      "ardente",
      "areia",
      "arejar",
      "arenito",
      "aresta",
      "argiloso",
      "argola",
      "arma",
      "arquivo",
      "arraial",
      "arrebate",
      "arriscar",
      "arroba",
      "arrumar",
      "arsenal",
      "arterial",
      "artigo",
      "arvoredo",
      "asfaltar",
      "asilado",
      "aspirar",
      "assador",
      "assinar",
      "assoalho",
      "assunto",
      "astral",
      "atacado",
      "atadura",
      "atalho",
      "atarefar",
      "atear",
      "atender",
      "aterro",
      "ateu",
      "atingir",
      "atirador",
      "ativo",
      "atoleiro",
      "atracar",
      "atrevido",
      "atriz",
      "atual",
      "atum",
      "auditor",
      "aumentar",
      "aura",
      "aurora",
      "autismo",
      "autoria",
      "autuar",
      "avaliar",
      "avante",
      "avaria",
      "avental",
      "avesso",
      "aviador",
      "avisar",
      "avulso",
      "axila",
      "azarar",
      "azedo",
      "azeite",
      "azulejo",
      "babar",
      "babosa",
      "bacalhau",
      "bacharel",
      "bacia",
      "bagagem",
      "baiano",
      "bailar",
      "baioneta",
      "bairro",
      "baixista",
      "bajular",
      "baleia",
      "baliza",
      "balsa",
      "banal",
      "bandeira",
      "banho",
      "banir",
      "banquete",
      "barato",
      "barbado",
      "baronesa",
      "barraca",
      "barulho",
      "baseado",
      "bastante",
      "batata",
      "batedor",
      "batida",
      "batom",
      "batucar",
      "baunilha",
      "beber",
      "beijo",
      "beirada",
      "beisebol",
      "beldade",
      "beleza",
      "belga",
      "beliscar",
      "bendito",
      "bengala",
      "benzer",
      "berimbau",
      "berlinda",
      "berro",
      "besouro",
      "bexiga",
      "bezerro",
      "bico",
      "bicudo",
      "bienal",
      "bifocal",
      "bifurcar",
      "bigorna",
      "bilhete",
      "bimestre",
      "bimotor",
      "biologia",
      "biombo",
      "biosfera",
      "bipolar",
      "birrento",
      "biscoito",
      "bisneto",
      "bispo",
      "bissexto",
      "bitola",
      "bizarro",
      "blindado",
      "bloco",
      "bloquear",
      "boato",
      "bobagem",
      "bocado",
      "bocejo",
      "bochecha",
      "boicotar",
      "bolada",
      "boletim",
      "bolha",
      "bolo",
      "bombeiro",
      "bonde",
      "boneco",
      "bonita",
      "borbulha",
      "borda",
      "boreal",
      "borracha",
      "bovino",
      "boxeador",
      "branco",
      "brasa",
      "braveza",
      "breu",
      "briga",
      "brilho",
      "brincar",
      "broa",
      "brochura",
      "bronzear",
      "broto",
      "bruxo",
      "bucha",
      "budismo",
      "bufar",
      "bule",
      "buraco",
      "busca",
      "busto",
      "buzina",
      "cabana",
      "cabelo",
      "cabide",
      "cabo",
      "cabrito",
      "cacau",
      "cacetada",
      "cachorro",
      "cacique",
      "cadastro",
      "cadeado",
      "cafezal",
      "caiaque",
      "caipira",
      "caixote",
      "cajado",
      "caju",
      "calafrio",
      "calcular",
      "caldeira",
      "calibrar",
      "calmante",
      "calota",
      "camada",
      "cambista",
      "camisa",
      "camomila",
      "campanha",
      "camuflar",
      "canavial",
      "cancelar",
      "caneta",
      "canguru",
      "canhoto",
      "canivete",
      "canoa",
      "cansado",
      "cantar",
      "canudo",
      "capacho",
      "capela",
      "capinar",
      "capotar",
      "capricho",
      "captador",
      "capuz",
      "caracol",
      "carbono",
      "cardeal",
      "careca",
      "carimbar",
      "carneiro",
      "carpete",
      "carreira",
      "cartaz",
      "carvalho",
      "casaco",
      "casca",
      "casebre",
      "castelo",
      "casulo",
      "catarata",
      "cativar",
      "caule",
      "causador",
      "cautelar",
      "cavalo",
      "caverna",
      "cebola",
      "cedilha",
      "cegonha",
      "celebrar",
      "celular",
      "cenoura",
      "censo",
      "centeio",
      "cercar",
      "cerrado",
      "certeiro",
      "cerveja",
      "cetim",
      "cevada",
      "chacota",
      "chaleira",
      "chamado",
      "chapada",
      "charme",
      "chatice",
      "chave",
      "chefe",
      "chegada",
      "cheiro",
      "cheque",
      "chicote",
      "chifre",
      "chinelo",
      "chocalho",
      "chover",
      "chumbo",
      "chutar",
      "chuva",
      "cicatriz",
      "ciclone",
      "cidade",
      "cidreira",
      "ciente",
      "cigana",
      "cimento",
      "cinto",
      "cinza",
      "ciranda",
      "circuito",
      "cirurgia",
      "citar",
      "clareza",
      "clero",
      "clicar",
      "clone",
      "clube",
      "coado",
      "coagir",
      "cobaia",
      "cobertor",
      "cobrar",
      "cocada",
      "coelho",
      "coentro",
      "coeso",
      "cogumelo",
      "coibir",
      "coifa",
      "coiote",
      "colar",
      "coleira",
      "colher",
      "colidir",
      "colmeia",
      "colono",
      "coluna",
      "comando",
      "combinar",
      "comentar",
      "comitiva",
      "comover",
      "complexo",
      "comum",
      "concha",
      "condor",
      "conectar",
      "confuso",
      "congelar",
      "conhecer",
      "conjugar",
      "consumir",
      "contrato",
      "convite",
      "cooperar",
      "copeiro",
      "copiador",
      "copo",
      "coquetel",
      "coragem",
      "cordial",
      "corneta",
      "coronha",
      "corporal",
      "correio",
      "cortejo",
      "coruja",
      "corvo",
      "cosseno",
      "costela",
      "cotonete",
      "couro",
      "couve",
      "covil",
      "cozinha",
      "cratera",
      "cravo",
      "creche",
      "credor",
      "creme",
      "crer",
      "crespo",
      "criada",
      "criminal",
      "crioulo",
      "crise",
      "criticar",
      "crosta",
      "crua",
      "cruzeiro",
      "cubano",
      "cueca",
      "cuidado",
      "cujo",
      "culatra",
      "culminar",
      "culpar",
      "cultura",
      "cumprir",
      "cunhado",
      "cupido",
      "curativo",
      "curral",
      "cursar",
      "curto",
      "cuspir",
      "custear",
      "cutelo",
      "damasco",
      "datar",
      "debater",
      "debitar",
      "deboche",
      "debulhar",
      "decalque",
      "decimal",
      "declive",
      "decote",
      "decretar",
      "dedal",
      "dedicado",
      "deduzir",
      "defesa",
      "defumar",
      "degelo",
      "degrau",
      "degustar",
      "deitado",
      "deixar",
      "delator",
      "delegado",
      "delinear",
      "delonga",
      "demanda",
      "demitir",
      "demolido",
      "dentista",
      "depenado",
      "depilar",
      "depois",
      "depressa",
      "depurar",
      "deriva",
      "derramar",
      "desafio",
      "desbotar",
      "descanso",
      "desenho",
      "desfiado",
      "desgaste",
      "desigual",
      "deslize",
      "desmamar",
      "desova",
      "despesa",
      "destaque",
      "desviar",
      "detalhar",
      "detentor",
      "detonar",
      "detrito",
      "deusa",
      "dever",
      "devido",
      "devotado",
      "dezena",
      "diagrama",
      "dialeto",
      "didata",
      "difuso",
      "digitar",
      "dilatado",
      "diluente",
      "diminuir",
      "dinastia",
      "dinheiro",
      "diocese",
      "direto",
      "discreta",
      "disfarce",
      "disparo",
      "disquete",
      "dissipar",
      "distante",
      "ditador",
      "diurno",
      "diverso",
      "divisor",
      "divulgar",
      "dizer",
      "dobrador",
      "dolorido",
      "domador",
      "dominado",
      "donativo",
      "donzela",
      "dormente",
      "dorsal",
      "dosagem",
      "dourado",
      "doutor",
      "drenagem",
      "drible",
      "drogaria",
      "duelar",
      "duende",
      "dueto",
      "duplo",
      "duquesa",
      "durante",
      "duvidoso",
      "eclodir",
      "ecoar",
      "ecologia",
      "edificar",
      "edital",
      "educado",
      "efeito",
      "efetivar",
      "ejetar",
      "elaborar",
      "eleger",
      "eleitor",
      "elenco",
      "elevador",
      "eliminar",
      "elogiar",
      "embargo",
      "embolado",
      "embrulho",
      "embutido",
      "emenda",
      "emergir",
      "emissor",
      "empatia",
      "empenho",
      "empinado",
      "empolgar",
      "emprego",
      "empurrar",
      "emulador",
      "encaixe",
      "encenado",
      "enchente",
      "encontro",
      "endeusar",
      "endossar",
      "enfaixar",
      "enfeite",
      "enfim",
      "engajado",
      "engenho",
      "englobar",
      "engomado",
      "engraxar",
      "enguia",
      "enjoar",
      "enlatar",
      "enquanto",
      "enraizar",
      "enrolado",
      "enrugar",
      "ensaio",
      "enseada",
      "ensino",
      "ensopado",
      "entanto",
      "enteado",
      "entidade",
      "entortar",
      "entrada",
      "entulho",
      "envergar",
      "enviado",
      "envolver",
      "enxame",
      "enxerto",
      "enxofre",
      "enxuto",
      "epiderme",
      "equipar",
      "ereto",
      "erguido",
      "errata",
      "erva",
      "ervilha",
      "esbanjar",
      "esbelto",
      "escama",
      "escola",
      "escrita",
      "escuta",
      "esfinge",
      "esfolar",
      "esfregar",
      "esfumado",
      "esgrima",
      "esmalte",
      "espanto",
      "espelho",
      "espiga",
      "esponja",
      "espreita",
      "espumar",
      "esquerda",
      "estaca",
      "esteira",
      "esticar",
      "estofado",
      "estrela",
      "estudo",
      "esvaziar",
      "etanol",
      "etiqueta",
      "euforia",
      "europeu",
      "evacuar",
      "evaporar",
      "evasivo",
      "eventual",
      "evidente",
      "evoluir",
      "exagero",
      "exalar",
      "examinar",
      "exato",
      "exausto",
      "excesso",
      "excitar",
      "exclamar",
      "executar",
      "exemplo",
      "exibir",
      "exigente",
      "exonerar",
      "expandir",
      "expelir",
      "expirar",
      "explanar",
      "exposto",
      "expresso",
      "expulsar",
      "externo",
      "extinto",
      "extrato",
      "fabricar",
      "fabuloso",
      "faceta",
      "facial",
      "fada",
      "fadiga",
      "faixa",
      "falar",
      "falta",
      "familiar",
      "fandango",
      "fanfarra",
      "fantoche",
      "fardado",
      "farelo",
      "farinha",
      "farofa",
      "farpa",
      "fartura",
      "fatia",
      "fator",
      "favorita",
      "faxina",
      "fazenda",
      "fechado",
      "feijoada",
      "feirante",
      "felino",
      "feminino",
      "fenda",
      "feno",
      "fera",
      "feriado",
      "ferrugem",
      "ferver",
      "festejar",
      "fetal",
      "feudal",
      "fiapo",
      "fibrose",
      "ficar",
      "ficheiro",
      "figurado",
      "fileira",
      "filho",
      "filme",
      "filtrar",
      "firmeza",
      "fisgada",
      "fissura",
      "fita",
      "fivela",
      "fixador",
      "fixo",
      "flacidez",
      "flamingo",
      "flanela",
      "flechada",
      "flora",
      "flutuar",
      "fluxo",
      "focal",
      "focinho",
      "fofocar",
      "fogo",
      "foguete",
      "foice",
      "folgado",
      "folheto",
      "forjar",
      "formiga",
      "forno",
      "forte",
      "fosco",
      "fossa",
      "fragata",
      "fralda",
      "frango",
      "frasco",
      "fraterno",
      "freira",
      "frente",
      "fretar",
      "frieza",
      "friso",
      "fritura",
      "fronha",
      "frustrar",
      "fruteira",
      "fugir",
      "fulano",
      "fuligem",
      "fundar",
      "fungo",
      "funil",
      "furador",
      "furioso",
      "futebol",
      "gabarito",
      "gabinete",
      "gado",
      "gaiato",
      "gaiola",
      "gaivota",
      "galega",
      "galho",
      "galinha",
      "galocha",
      "ganhar",
      "garagem",
      "garfo",
      "gargalo",
      "garimpo",
      "garoupa",
      "garrafa",
      "gasoduto",
      "gasto",
      "gata",
      "gatilho",
      "gaveta",
      "gazela",
      "gelado",
      "geleia",
      "gelo",
      "gemada",
      "gemer",
      "gemido",
      "generoso",
      "gengiva",
      "genial",
      "genoma",
      "genro",
      "geologia",
      "gerador",
      "germinar",
      "gesso",
      "gestor",
      "ginasta",
      "gincana",
      "gingado",
      "girafa",
      "girino",
      "glacial",
      "glicose",
      "global",
      "glorioso",
      "goela",
      "goiaba",
      "golfe",
      "golpear",
      "gordura",
      "gorjeta",
      "gorro",
      "gostoso",
      "goteira",
      "governar",
      "gracejo",
      "gradual",
      "grafite",
      "gralha",
      "grampo",
      "granada",
      "gratuito",
      "graveto",
      "graxa",
      "grego",
      "grelhar",
      "greve",
      "grilo",
      "grisalho",
      "gritaria",
      "grosso",
      "grotesco",
      "grudado",
      "grunhido",
      "gruta",
      "guache",
      "guarani",
      "guaxinim",
      "guerrear",
      "guiar",
      "guincho",
      "guisado",
      "gula",
      "guloso",
      "guru",
      "habitar",
      "harmonia",
      "haste",
      "haver",
      "hectare",
      "herdar",
      "heresia",
      "hesitar",
      "hiato",
      "hibernar",
      "hidratar",
      "hiena",
      "hino",
      "hipismo",
      "hipnose",
      "hipoteca",
      "hoje",
      "holofote",
      "homem",
      "honesto",
      "honrado",
      "hormonal",
      "hospedar",
      "humorado",
      "iate",
      "ideia",
      "idoso",
      "ignorado",
      "igreja",
      "iguana",
      "ileso",
      "ilha",
      "iludido",
      "iluminar",
      "ilustrar",
      "imagem",
      "imediato",
      "imenso",
      "imersivo",
      "iminente",
      "imitador",
      "imortal",
      "impacto",
      "impedir",
      "implante",
      "impor",
      "imprensa",
      "impune",
      "imunizar",
      "inalador",
      "inapto",
      "inativo",
      "incenso",
      "inchar",
      "incidir",
      "incluir",
      "incolor",
      "indeciso",
      "indireto",
      "indutor",
      "ineficaz",
      "inerente",
      "infantil",
      "infestar",
      "infinito",
      "inflamar",
      "informal",
      "infrator",
      "ingerir",
      "inibido",
      "inicial",
      "inimigo",
      "injetar",
      "inocente",
      "inodoro",
      "inovador",
      "inox",
      "inquieto",
      "inscrito",
      "inseto",
      "insistir",
      "inspetor",
      "instalar",
      "insulto",
      "intacto",
      "integral",
      "intimar",
      "intocado",
      "intriga",
      "invasor",
      "inverno",
      "invicto",
      "invocar",
      "iogurte",
      "iraniano",
      "ironizar",
      "irreal",
      "irritado",
      "isca",
      "isento",
      "isolado",
      "isqueiro",
      "italiano",
      "janeiro",
      "jangada",
      "janta",
      "jararaca",
      "jardim",
      "jarro",
      "jasmim",
      "jato",
      "javali",
      "jazida",
      "jejum",
      "joaninha",
      "joelhada",
      "jogador",
      "joia",
      "jornal",
      "jorrar",
      "jovem",
      "juba",
      "judeu",
      "judoca",
      "juiz",
      "julgador",
      "julho",
      "jurado",
      "jurista",
      "juro",
      "justa",
      "labareda",
      "laboral",
      "lacre",
      "lactante",
      "ladrilho",
      "lagarta",
      "lagoa",
      "laje",
      "lamber",
      "lamentar",
      "laminar",
      "lampejo",
      "lanche",
      "lapidar",
      "lapso",
      "laranja",
      "lareira",
      "largura",
      "lasanha",
      "lastro",
      "lateral",
      "latido",
      "lavanda",
      "lavoura",
      "lavrador",
      "laxante",
      "lazer",
      "lealdade",
      "lebre",
      "legado",
      "legendar",
      "legista",
      "leigo",
      "leiloar",
      "leitura",
      "lembrete",
      "leme",
      "lenhador",
      "lentilha",
      "leoa",
      "lesma",
      "leste",
      "letivo",
      "letreiro",
      "levar",
      "leveza",
      "levitar",
      "liberal",
      "libido",
      "liderar",
      "ligar",
      "ligeiro",
      "limitar",
      "limoeiro",
      "limpador",
      "linda",
      "linear",
      "linhagem",
      "liquidez",
      "listagem",
      "lisura",
      "litoral",
      "livro",
      "lixa",
      "lixeira",
      "locador",
      "locutor",
      "lojista",
      "lombo",
      "lona",
      "longe",
      "lontra",
      "lorde",
      "lotado",
      "loteria",
      "loucura",
      "lousa",
      "louvar",
      "luar",
      "lucidez",
      "lucro",
      "luneta",
      "lustre",
      "lutador",
      "luva",
      "macaco",
      "macete",
      "machado",
      "macio",
      "madeira",
      "madrinha",
      "magnata",
      "magreza",
      "maior",
      "mais",
      "malandro",
      "malha",
      "malote",
      "maluco",
      "mamilo",
      "mamoeiro",
      "mamute",
      "manada",
      "mancha",
      "mandato",
      "manequim",
      "manhoso",
      "manivela",
      "manobrar",
      "mansa",
      "manter",
      "manusear",
      "mapeado",
      "maquinar",
      "marcador",
      "maresia",
      "marfim",
      "margem",
      "marinho",
      "marmita",
      "maroto",
      "marquise",
      "marreco",
      "martelo",
      "marujo",
      "mascote",
      "masmorra",
      "massagem",
      "mastigar",
      "matagal",
      "materno",
      "matinal",
      "matutar",
      "maxilar",
      "medalha",
      "medida",
      "medusa",
      "megafone",
      "meiga",
      "melancia",
      "melhor",
      "membro",
      "memorial",
      "menino",
      "menos",
      "mensagem",
      "mental",
      "merecer",
      "mergulho",
      "mesada",
      "mesclar",
      "mesmo",
      "mesquita",
      "mestre",
      "metade",
      "meteoro",
      "metragem",
      "mexer",
      "mexicano",
      "micro",
      "migalha",
      "migrar",
      "milagre",
      "milenar",
      "milhar",
      "mimado",
      "minerar",
      "minhoca",
      "ministro",
      "minoria",
      "miolo",
      "mirante",
      "mirtilo",
      "misturar",
      "mocidade",
      "moderno",
      "modular",
      "moeda",
      "moer",
      "moinho",
      "moita",
      "moldura",
      "moleza",
      "molho",
      "molinete",
      "molusco",
      "montanha",
      "moqueca",
      "morango",
      "morcego",
      "mordomo",
      "morena",
      "mosaico",
      "mosquete",
      "mostarda",
      "motel",
      "motim",
      "moto",
      "motriz",
      "muda",
      "muito",
      "mulata",
      "mulher",
      "multar",
      "mundial",
      "munido",
      "muralha",
      "murcho",
      "muscular",
      "museu",
      "musical",
      "nacional",
      "nadador",
      "naja",
      "namoro",
      "narina",
      "narrado",
      "nascer",
      "nativa",
      "natureza",
      "navalha",
      "navegar",
      "navio",
      "neblina",
      "nebuloso",
      "negativa",
      "negociar",
      "negrito",
      "nervoso",
      "neta",
      "neural",
      "nevasca",
      "nevoeiro",
      "ninar",
      "ninho",
      "nitidez",
      "nivelar",
      "nobreza",
      "noite",
      "noiva",
      "nomear",
      "nominal",
      "nordeste",
      "nortear",
      "notar",
      "noticiar",
      "noturno",
      "novelo",
      "novilho",
      "novo",
      "nublado",
      "nudez",
      "numeral",
      "nupcial",
      "nutrir",
      "nuvem",
      "obcecado",
      "obedecer",
      "objetivo",
      "obrigado",
      "obscuro",
      "obstetra",
      "obter",
      "obturar",
      "ocidente",
      "ocioso",
      "ocorrer",
      "oculista",
      "ocupado",
      "ofegante",
      "ofensiva",
      "oferenda",
      "oficina",
      "ofuscado",
      "ogiva",
      "olaria",
      "oleoso",
      "olhar",
      "oliveira",
      "ombro",
      "omelete",
      "omisso",
      "omitir",
      "ondulado",
      "oneroso",
      "ontem",
      "opcional",
      "operador",
      "oponente",
      "oportuno",
      "oposto",
      "orar",
      "orbitar",
      "ordem",
      "ordinal",
      "orfanato",
      "orgasmo",
      "orgulho",
      "oriental",
      "origem",
      "oriundo",
      "orla",
      "ortodoxo",
      "orvalho",
      "oscilar",
      "ossada",
      "osso",
      "ostentar",
      "otimismo",
      "ousadia",
      "outono",
      "outubro",
      "ouvido",
      "ovelha",
      "ovular",
      "oxidar",
      "oxigenar",
      "pacato",
      "paciente",
      "pacote",
      "pactuar",
      "padaria",
      "padrinho",
      "pagar",
      "pagode",
      "painel",
      "pairar",
      "paisagem",
      "palavra",
      "palestra",
      "palheta",
      "palito",
      "palmada",
      "palpitar",
      "pancada",
      "panela",
      "panfleto",
      "panqueca",
      "pantanal",
      "papagaio",
      "papelada",
      "papiro",
      "parafina",
      "parcial",
      "pardal",
      "parede",
      "partida",
      "pasmo",
      "passado",
      "pastel",
      "patamar",
      "patente",
      "patinar",
      "patrono",
      "paulada",
      "pausar",
      "peculiar",
      "pedalar",
      "pedestre",
      "pediatra",
      "pedra",
      "pegada",
      "peitoral",
      "peixe",
      "pele",
      "pelicano",
      "penca",
      "pendurar",
      "peneira",
      "penhasco",
      "pensador",
      "pente",
      "perceber",
      "perfeito",
      "pergunta",
      "perito",
      "permitir",
      "perna",
      "perplexo",
      "persiana",
      "pertence",
      "peruca",
      "pescado",
      "pesquisa",
      "pessoa",
      "petiscar",
      "piada",
      "picado",
      "piedade",
      "pigmento",
      "pilastra",
      "pilhado",
      "pilotar",
      "pimenta",
      "pincel",
      "pinguim",
      "pinha",
      "pinote",
      "pintar",
      "pioneiro",
      "pipoca",
      "piquete",
      "piranha",
      "pires",
      "pirueta",
      "piscar",
      "pistola",
      "pitanga",
      "pivete",
      "planta",
      "plaqueta",
      "platina",
      "plebeu",
      "plumagem",
      "pluvial",
      "pneu",
      "poda",
      "poeira",
      "poetisa",
      "polegada",
      "policiar",
      "poluente",
      "polvilho",
      "pomar",
      "pomba",
      "ponderar",
      "pontaria",
      "populoso",
      "porta",
      "possuir",
      "postal",
      "pote",
      "poupar",
      "pouso",
      "povoar",
      "praia",
      "prancha",
      "prato",
      "praxe",
      "prece",
      "predador",
      "prefeito",
      "premiar",
      "prensar",
      "preparar",
      "presilha",
      "pretexto",
      "prevenir",
      "prezar",
      "primata",
      "princesa",
      "prisma",
      "privado",
      "processo",
      "produto",
      "profeta",
      "proibido",
      "projeto",
      "prometer",
      "propagar",
      "prosa",
      "protetor",
      "provador",
      "publicar",
      "pudim",
      "pular",
      "pulmonar",
      "pulseira",
      "punhal",
      "punir",
      "pupilo",
      "pureza",
      "puxador",
      "quadra",
      "quantia",
      "quarto",
      "quase",
      "quebrar",
      "queda",
      "queijo",
      "quente",
      "querido",
      "quimono",
      "quina",
      "quiosque",
      "rabanada",
      "rabisco",
      "rachar",
      "racionar",
      "radial",
      "raiar",
      "rainha",
      "raio",
      "raiva",
      "rajada",
      "ralado",
      "ramal",
      "ranger",
      "ranhura",
      "rapadura",
      "rapel",
      "rapidez",
      "raposa",
      "raquete",
      "raridade",
      "rasante",
      "rascunho",
      "rasgar",
      "raspador",
      "rasteira",
      "rasurar",
      "ratazana",
      "ratoeira",
      "realeza",
      "reanimar",
      "reaver",
      "rebaixar",
      "rebelde",
      "rebolar",
      "recado",
      "recente",
      "recheio",
      "recibo",
      "recordar",
      "recrutar",
      "recuar",
      "rede",
      "redimir",
      "redonda",
      "reduzida",
      "reenvio",
      "refinar",
      "refletir",
      "refogar",
      "refresco",
      "refugiar",
      "regalia",
      "regime",
      "regra",
      "reinado",
      "reitor",
      "rejeitar",
      "relativo",
      "remador",
      "remendo",
      "remorso",
      "renovado",
      "reparo",
      "repelir",
      "repleto",
      "repolho",
      "represa",
      "repudiar",
      "requerer",
      "resenha",
      "resfriar",
      "resgatar",
      "residir",
      "resolver",
      "respeito",
      "ressaca",
      "restante",
      "resumir",
      "retalho",
      "reter",
      "retirar",
      "retomada",
      "retratar",
      "revelar",
      "revisor",
      "revolta",
      "riacho",
      "rica",
      "rigidez",
      "rigoroso",
      "rimar",
      "ringue",
      "risada",
      "risco",
      "risonho",
      "robalo",
      "rochedo",
      "rodada",
      "rodeio",
      "rodovia",
      "roedor",
      "roleta",
      "romano",
      "roncar",
      "rosado",
      "roseira",
      "rosto",
      "rota",
      "roteiro",
      "rotina",
      "rotular",
      "rouco",
      "roupa",
      "roxo",
      "rubro",
      "rugido",
      "rugoso",
      "ruivo",
      "rumo",
      "rupestre",
      "russo",
      "sabor",
      "saciar",
      "sacola",
      "sacudir",
      "sadio",
      "safira",
      "saga",
      "sagrada",
      "saibro",
      "salada",
      "saleiro",
      "salgado",
      "saliva",
      "salpicar",
      "salsicha",
      "saltar",
      "salvador",
      "sambar",
      "samurai",
      "sanar",
      "sanfona",
      "sangue",
      "sanidade",
      "sapato",
      "sarda",
      "sargento",
      "sarjeta",
      "saturar",
      "saudade",
      "saxofone",
      "sazonal",
      "secar",
      "secular",
      "seda",
      "sedento",
      "sediado",
      "sedoso",
      "sedutor",
      "segmento",
      "segredo",
      "segundo",
      "seiva",
      "seleto",
      "selvagem",
      "semanal",
      "semente",
      "senador",
      "senhor",
      "sensual",
      "sentado",
      "separado",
      "sereia",
      "seringa",
      "serra",
      "servo",
      "setembro",
      "setor",
      "sigilo",
      "silhueta",
      "silicone",
      "simetria",
      "simpatia",
      "simular",
      "sinal",
      "sincero",
      "singular",
      "sinopse",
      "sintonia",
      "sirene",
      "siri",
      "situado",
      "soberano",
      "sobra",
      "socorro",
      "sogro",
      "soja",
      "solda",
      "soletrar",
      "solteiro",
      "sombrio",
      "sonata",
      "sondar",
      "sonegar",
      "sonhador",
      "sono",
      "soprano",
      "soquete",
      "sorrir",
      "sorteio",
      "sossego",
      "sotaque",
      "soterrar",
      "sovado",
      "sozinho",
      "suavizar",
      "subida",
      "submerso",
      "subsolo",
      "subtrair",
      "sucata",
      "sucesso",
      "suco",
      "sudeste",
      "sufixo",
      "sugador",
      "sugerir",
      "sujeito",
      "sulfato",
      "sumir",
      "suor",
      "superior",
      "suplicar",
      "suposto",
      "suprimir",
      "surdina",
      "surfista",
      "surpresa",
      "surreal",
      "surtir",
      "suspiro",
      "sustento",
      "tabela",
      "tablete",
      "tabuada",
      "tacho",
      "tagarela",
      "talher",
      "talo",
      "talvez",
      "tamanho",
      "tamborim",
      "tampa",
      "tangente",
      "tanto",
      "tapar",
      "tapioca",
      "tardio",
      "tarefa",
      "tarja",
      "tarraxa",
      "tatuagem",
      "taurino",
      "taxativo",
      "taxista",
      "teatral",
      "tecer",
      "tecido",
      "teclado",
      "tedioso",
      "teia",
      "teimar",
      "telefone",
      "telhado",
      "tempero",
      "tenente",
      "tensor",
      "tentar",
      "termal",
      "terno",
      "terreno",
      "tese",
      "tesoura",
      "testado",
      "teto",
      "textura",
      "texugo",
      "tiara",
      "tigela",
      "tijolo",
      "timbrar",
      "timidez",
      "tingido",
      "tinteiro",
      "tiragem",
      "titular",
      "toalha",
      "tocha",
      "tolerar",
      "tolice",
      "tomada",
      "tomilho",
      "tonel",
      "tontura",
      "topete",
      "tora",
      "torcido",
      "torneio",
      "torque",
      "torrada",
      "torto",
      "tostar",
      "touca",
      "toupeira",
      "toxina",
      "trabalho",
      "tracejar",
      "tradutor",
      "trafegar",
      "trajeto",
      "trama",
      "trancar",
      "trapo",
      "traseiro",
      "tratador",
      "travar",
      "treino",
      "tremer",
      "trepidar",
      "trevo",
      "triagem",
      "tribo",
      "triciclo",
      "tridente",
      "trilogia",
      "trindade",
      "triplo",
      "triturar",
      "triunfal",
      "trocar",
      "trombeta",
      "trova",
      "trunfo",
      "truque",
      "tubular",
      "tucano",
      "tudo",
      "tulipa",
      "tupi",
      "turbo",
      "turma",
      "turquesa",
      "tutelar",
      "tutorial",
      "uivar",
      "umbigo",
      "unha",
      "unidade",
      "uniforme",
      "urologia",
      "urso",
      "urtiga",
      "urubu",
      "usado",
      "usina",
      "usufruir",
      "vacina",
      "vadiar",
      "vagaroso",
      "vaidoso",
      "vala",
      "valente",
      "validade",
      "valores",
      "vantagem",
      "vaqueiro",
      "varanda",
      "vareta",
      "varrer",
      "vascular",
      "vasilha",
      "vassoura",
      "vazar",
      "vazio",
      "veado",
      "vedar",
      "vegetar",
      "veicular",
      "veleiro",
      "velhice",
      "veludo",
      "vencedor",
      "vendaval",
      "venerar",
      "ventre",
      "verbal",
      "verdade",
      "vereador",
      "vergonha",
      "vermelho",
      "verniz",
      "versar",
      "vertente",
      "vespa",
      "vestido",
      "vetorial",
      "viaduto",
      "viagem",
      "viajar",
      "viatura",
      "vibrador",
      "videira",
      "vidraria",
      "viela",
      "viga",
      "vigente",
      "vigiar",
      "vigorar",
      "vilarejo",
      "vinco",
      "vinheta",
      "vinil",
      "violeta",
      "virada",
      "virtude",
      "visitar",
      "visto",
      "vitral",
      "viveiro",
      "vizinho",
      "voador",
      "voar",
      "vogal",
      "volante",
      "voleibol",
      "voltagem",
      "volumoso",
      "vontade",
      "vulto",
      "vuvuzela",
      "xadrez",
      "xarope",
      "xeque",
      "xeretar",
      "xerife",
      "xingar",
      "zangado",
      "zarpar",
      "zebu",
      "zelador",
      "zombar",
      "zoologia",
      "zumbido"
    ];
  }
});

// node_modules/bip39/src/wordlists/english.json
var require_english = __commonJS({
  "node_modules/bip39/src/wordlists/english.json"(exports, module2) {
    module2.exports = [
      "abandon",
      "ability",
      "able",
      "about",
      "above",
      "absent",
      "absorb",
      "abstract",
      "absurd",
      "abuse",
      "access",
      "accident",
      "account",
      "accuse",
      "achieve",
      "acid",
      "acoustic",
      "acquire",
      "across",
      "act",
      "action",
      "actor",
      "actress",
      "actual",
      "adapt",
      "add",
      "addict",
      "address",
      "adjust",
      "admit",
      "adult",
      "advance",
      "advice",
      "aerobic",
      "affair",
      "afford",
      "afraid",
      "again",
      "age",
      "agent",
      "agree",
      "ahead",
      "aim",
      "air",
      "airport",
      "aisle",
      "alarm",
      "album",
      "alcohol",
      "alert",
      "alien",
      "all",
      "alley",
      "allow",
      "almost",
      "alone",
      "alpha",
      "already",
      "also",
      "alter",
      "always",
      "amateur",
      "amazing",
      "among",
      "amount",
      "amused",
      "analyst",
      "anchor",
      "ancient",
      "anger",
      "angle",
      "angry",
      "animal",
      "ankle",
      "announce",
      "annual",
      "another",
      "answer",
      "antenna",
      "antique",
      "anxiety",
      "any",
      "apart",
      "apology",
      "appear",
      "apple",
      "approve",
      "april",
      "arch",
      "arctic",
      "area",
      "arena",
      "argue",
      "arm",
      "armed",
      "armor",
      "army",
      "around",
      "arrange",
      "arrest",
      "arrive",
      "arrow",
      "art",
      "artefact",
      "artist",
      "artwork",
      "ask",
      "aspect",
      "assault",
      "asset",
      "assist",
      "assume",
      "asthma",
      "athlete",
      "atom",
      "attack",
      "attend",
      "attitude",
      "attract",
      "auction",
      "audit",
      "august",
      "aunt",
      "author",
      "auto",
      "autumn",
      "average",
      "avocado",
      "avoid",
      "awake",
      "aware",
      "away",
      "awesome",
      "awful",
      "awkward",
      "axis",
      "baby",
      "bachelor",
      "bacon",
      "badge",
      "bag",
      "balance",
      "balcony",
      "ball",
      "bamboo",
      "banana",
      "banner",
      "bar",
      "barely",
      "bargain",
      "barrel",
      "base",
      "basic",
      "basket",
      "battle",
      "beach",
      "bean",
      "beauty",
      "because",
      "become",
      "beef",
      "before",
      "begin",
      "behave",
      "behind",
      "believe",
      "below",
      "belt",
      "bench",
      "benefit",
      "best",
      "betray",
      "better",
      "between",
      "beyond",
      "bicycle",
      "bid",
      "bike",
      "bind",
      "biology",
      "bird",
      "birth",
      "bitter",
      "black",
      "blade",
      "blame",
      "blanket",
      "blast",
      "bleak",
      "bless",
      "blind",
      "blood",
      "blossom",
      "blouse",
      "blue",
      "blur",
      "blush",
      "board",
      "boat",
      "body",
      "boil",
      "bomb",
      "bone",
      "bonus",
      "book",
      "boost",
      "border",
      "boring",
      "borrow",
      "boss",
      "bottom",
      "bounce",
      "box",
      "boy",
      "bracket",
      "brain",
      "brand",
      "brass",
      "brave",
      "bread",
      "breeze",
      "brick",
      "bridge",
      "brief",
      "bright",
      "bring",
      "brisk",
      "broccoli",
      "broken",
      "bronze",
      "broom",
      "brother",
      "brown",
      "brush",
      "bubble",
      "buddy",
      "budget",
      "buffalo",
      "build",
      "bulb",
      "bulk",
      "bullet",
      "bundle",
      "bunker",
      "burden",
      "burger",
      "burst",
      "bus",
      "business",
      "busy",
      "butter",
      "buyer",
      "buzz",
      "cabbage",
      "cabin",
      "cable",
      "cactus",
      "cage",
      "cake",
      "call",
      "calm",
      "camera",
      "camp",
      "can",
      "canal",
      "cancel",
      "candy",
      "cannon",
      "canoe",
      "canvas",
      "canyon",
      "capable",
      "capital",
      "captain",
      "car",
      "carbon",
      "card",
      "cargo",
      "carpet",
      "carry",
      "cart",
      "case",
      "cash",
      "casino",
      "castle",
      "casual",
      "cat",
      "catalog",
      "catch",
      "category",
      "cattle",
      "caught",
      "cause",
      "caution",
      "cave",
      "ceiling",
      "celery",
      "cement",
      "census",
      "century",
      "cereal",
      "certain",
      "chair",
      "chalk",
      "champion",
      "change",
      "chaos",
      "chapter",
      "charge",
      "chase",
      "chat",
      "cheap",
      "check",
      "cheese",
      "chef",
      "cherry",
      "chest",
      "chicken",
      "chief",
      "child",
      "chimney",
      "choice",
      "choose",
      "chronic",
      "chuckle",
      "chunk",
      "churn",
      "cigar",
      "cinnamon",
      "circle",
      "citizen",
      "city",
      "civil",
      "claim",
      "clap",
      "clarify",
      "claw",
      "clay",
      "clean",
      "clerk",
      "clever",
      "click",
      "client",
      "cliff",
      "climb",
      "clinic",
      "clip",
      "clock",
      "clog",
      "close",
      "cloth",
      "cloud",
      "clown",
      "club",
      "clump",
      "cluster",
      "clutch",
      "coach",
      "coast",
      "coconut",
      "code",
      "coffee",
      "coil",
      "coin",
      "collect",
      "color",
      "column",
      "combine",
      "come",
      "comfort",
      "comic",
      "common",
      "company",
      "concert",
      "conduct",
      "confirm",
      "congress",
      "connect",
      "consider",
      "control",
      "convince",
      "cook",
      "cool",
      "copper",
      "copy",
      "coral",
      "core",
      "corn",
      "correct",
      "cost",
      "cotton",
      "couch",
      "country",
      "couple",
      "course",
      "cousin",
      "cover",
      "coyote",
      "crack",
      "cradle",
      "craft",
      "cram",
      "crane",
      "crash",
      "crater",
      "crawl",
      "crazy",
      "cream",
      "credit",
      "creek",
      "crew",
      "cricket",
      "crime",
      "crisp",
      "critic",
      "crop",
      "cross",
      "crouch",
      "crowd",
      "crucial",
      "cruel",
      "cruise",
      "crumble",
      "crunch",
      "crush",
      "cry",
      "crystal",
      "cube",
      "culture",
      "cup",
      "cupboard",
      "curious",
      "current",
      "curtain",
      "curve",
      "cushion",
      "custom",
      "cute",
      "cycle",
      "dad",
      "damage",
      "damp",
      "dance",
      "danger",
      "daring",
      "dash",
      "daughter",
      "dawn",
      "day",
      "deal",
      "debate",
      "debris",
      "decade",
      "december",
      "decide",
      "decline",
      "decorate",
      "decrease",
      "deer",
      "defense",
      "define",
      "defy",
      "degree",
      "delay",
      "deliver",
      "demand",
      "demise",
      "denial",
      "dentist",
      "deny",
      "depart",
      "depend",
      "deposit",
      "depth",
      "deputy",
      "derive",
      "describe",
      "desert",
      "design",
      "desk",
      "despair",
      "destroy",
      "detail",
      "detect",
      "develop",
      "device",
      "devote",
      "diagram",
      "dial",
      "diamond",
      "diary",
      "dice",
      "diesel",
      "diet",
      "differ",
      "digital",
      "dignity",
      "dilemma",
      "dinner",
      "dinosaur",
      "direct",
      "dirt",
      "disagree",
      "discover",
      "disease",
      "dish",
      "dismiss",
      "disorder",
      "display",
      "distance",
      "divert",
      "divide",
      "divorce",
      "dizzy",
      "doctor",
      "document",
      "dog",
      "doll",
      "dolphin",
      "domain",
      "donate",
      "donkey",
      "donor",
      "door",
      "dose",
      "double",
      "dove",
      "draft",
      "dragon",
      "drama",
      "drastic",
      "draw",
      "dream",
      "dress",
      "drift",
      "drill",
      "drink",
      "drip",
      "drive",
      "drop",
      "drum",
      "dry",
      "duck",
      "dumb",
      "dune",
      "during",
      "dust",
      "dutch",
      "duty",
      "dwarf",
      "dynamic",
      "eager",
      "eagle",
      "early",
      "earn",
      "earth",
      "easily",
      "east",
      "easy",
      "echo",
      "ecology",
      "economy",
      "edge",
      "edit",
      "educate",
      "effort",
      "egg",
      "eight",
      "either",
      "elbow",
      "elder",
      "electric",
      "elegant",
      "element",
      "elephant",
      "elevator",
      "elite",
      "else",
      "embark",
      "embody",
      "embrace",
      "emerge",
      "emotion",
      "employ",
      "empower",
      "empty",
      "enable",
      "enact",
      "end",
      "endless",
      "endorse",
      "enemy",
      "energy",
      "enforce",
      "engage",
      "engine",
      "enhance",
      "enjoy",
      "enlist",
      "enough",
      "enrich",
      "enroll",
      "ensure",
      "enter",
      "entire",
      "entry",
      "envelope",
      "episode",
      "equal",
      "equip",
      "era",
      "erase",
      "erode",
      "erosion",
      "error",
      "erupt",
      "escape",
      "essay",
      "essence",
      "estate",
      "eternal",
      "ethics",
      "evidence",
      "evil",
      "evoke",
      "evolve",
      "exact",
      "example",
      "excess",
      "exchange",
      "excite",
      "exclude",
      "excuse",
      "execute",
      "exercise",
      "exhaust",
      "exhibit",
      "exile",
      "exist",
      "exit",
      "exotic",
      "expand",
      "expect",
      "expire",
      "explain",
      "expose",
      "express",
      "extend",
      "extra",
      "eye",
      "eyebrow",
      "fabric",
      "face",
      "faculty",
      "fade",
      "faint",
      "faith",
      "fall",
      "false",
      "fame",
      "family",
      "famous",
      "fan",
      "fancy",
      "fantasy",
      "farm",
      "fashion",
      "fat",
      "fatal",
      "father",
      "fatigue",
      "fault",
      "favorite",
      "feature",
      "february",
      "federal",
      "fee",
      "feed",
      "feel",
      "female",
      "fence",
      "festival",
      "fetch",
      "fever",
      "few",
      "fiber",
      "fiction",
      "field",
      "figure",
      "file",
      "film",
      "filter",
      "final",
      "find",
      "fine",
      "finger",
      "finish",
      "fire",
      "firm",
      "first",
      "fiscal",
      "fish",
      "fit",
      "fitness",
      "fix",
      "flag",
      "flame",
      "flash",
      "flat",
      "flavor",
      "flee",
      "flight",
      "flip",
      "float",
      "flock",
      "floor",
      "flower",
      "fluid",
      "flush",
      "fly",
      "foam",
      "focus",
      "fog",
      "foil",
      "fold",
      "follow",
      "food",
      "foot",
      "force",
      "forest",
      "forget",
      "fork",
      "fortune",
      "forum",
      "forward",
      "fossil",
      "foster",
      "found",
      "fox",
      "fragile",
      "frame",
      "frequent",
      "fresh",
      "friend",
      "fringe",
      "frog",
      "front",
      "frost",
      "frown",
      "frozen",
      "fruit",
      "fuel",
      "fun",
      "funny",
      "furnace",
      "fury",
      "future",
      "gadget",
      "gain",
      "galaxy",
      "gallery",
      "game",
      "gap",
      "garage",
      "garbage",
      "garden",
      "garlic",
      "garment",
      "gas",
      "gasp",
      "gate",
      "gather",
      "gauge",
      "gaze",
      "general",
      "genius",
      "genre",
      "gentle",
      "genuine",
      "gesture",
      "ghost",
      "giant",
      "gift",
      "giggle",
      "ginger",
      "giraffe",
      "girl",
      "give",
      "glad",
      "glance",
      "glare",
      "glass",
      "glide",
      "glimpse",
      "globe",
      "gloom",
      "glory",
      "glove",
      "glow",
      "glue",
      "goat",
      "goddess",
      "gold",
      "good",
      "goose",
      "gorilla",
      "gospel",
      "gossip",
      "govern",
      "gown",
      "grab",
      "grace",
      "grain",
      "grant",
      "grape",
      "grass",
      "gravity",
      "great",
      "green",
      "grid",
      "grief",
      "grit",
      "grocery",
      "group",
      "grow",
      "grunt",
      "guard",
      "guess",
      "guide",
      "guilt",
      "guitar",
      "gun",
      "gym",
      "habit",
      "hair",
      "half",
      "hammer",
      "hamster",
      "hand",
      "happy",
      "harbor",
      "hard",
      "harsh",
      "harvest",
      "hat",
      "have",
      "hawk",
      "hazard",
      "head",
      "health",
      "heart",
      "heavy",
      "hedgehog",
      "height",
      "hello",
      "helmet",
      "help",
      "hen",
      "hero",
      "hidden",
      "high",
      "hill",
      "hint",
      "hip",
      "hire",
      "history",
      "hobby",
      "hockey",
      "hold",
      "hole",
      "holiday",
      "hollow",
      "home",
      "honey",
      "hood",
      "hope",
      "horn",
      "horror",
      "horse",
      "hospital",
      "host",
      "hotel",
      "hour",
      "hover",
      "hub",
      "huge",
      "human",
      "humble",
      "humor",
      "hundred",
      "hungry",
      "hunt",
      "hurdle",
      "hurry",
      "hurt",
      "husband",
      "hybrid",
      "ice",
      "icon",
      "idea",
      "identify",
      "idle",
      "ignore",
      "ill",
      "illegal",
      "illness",
      "image",
      "imitate",
      "immense",
      "immune",
      "impact",
      "impose",
      "improve",
      "impulse",
      "inch",
      "include",
      "income",
      "increase",
      "index",
      "indicate",
      "indoor",
      "industry",
      "infant",
      "inflict",
      "inform",
      "inhale",
      "inherit",
      "initial",
      "inject",
      "injury",
      "inmate",
      "inner",
      "innocent",
      "input",
      "inquiry",
      "insane",
      "insect",
      "inside",
      "inspire",
      "install",
      "intact",
      "interest",
      "into",
      "invest",
      "invite",
      "involve",
      "iron",
      "island",
      "isolate",
      "issue",
      "item",
      "ivory",
      "jacket",
      "jaguar",
      "jar",
      "jazz",
      "jealous",
      "jeans",
      "jelly",
      "jewel",
      "job",
      "join",
      "joke",
      "journey",
      "joy",
      "judge",
      "juice",
      "jump",
      "jungle",
      "junior",
      "junk",
      "just",
      "kangaroo",
      "keen",
      "keep",
      "ketchup",
      "key",
      "kick",
      "kid",
      "kidney",
      "kind",
      "kingdom",
      "kiss",
      "kit",
      "kitchen",
      "kite",
      "kitten",
      "kiwi",
      "knee",
      "knife",
      "knock",
      "know",
      "lab",
      "label",
      "labor",
      "ladder",
      "lady",
      "lake",
      "lamp",
      "language",
      "laptop",
      "large",
      "later",
      "latin",
      "laugh",
      "laundry",
      "lava",
      "law",
      "lawn",
      "lawsuit",
      "layer",
      "lazy",
      "leader",
      "leaf",
      "learn",
      "leave",
      "lecture",
      "left",
      "leg",
      "legal",
      "legend",
      "leisure",
      "lemon",
      "lend",
      "length",
      "lens",
      "leopard",
      "lesson",
      "letter",
      "level",
      "liar",
      "liberty",
      "library",
      "license",
      "life",
      "lift",
      "light",
      "like",
      "limb",
      "limit",
      "link",
      "lion",
      "liquid",
      "list",
      "little",
      "live",
      "lizard",
      "load",
      "loan",
      "lobster",
      "local",
      "lock",
      "logic",
      "lonely",
      "long",
      "loop",
      "lottery",
      "loud",
      "lounge",
      "love",
      "loyal",
      "lucky",
      "luggage",
      "lumber",
      "lunar",
      "lunch",
      "luxury",
      "lyrics",
      "machine",
      "mad",
      "magic",
      "magnet",
      "maid",
      "mail",
      "main",
      "major",
      "make",
      "mammal",
      "man",
      "manage",
      "mandate",
      "mango",
      "mansion",
      "manual",
      "maple",
      "marble",
      "march",
      "margin",
      "marine",
      "market",
      "marriage",
      "mask",
      "mass",
      "master",
      "match",
      "material",
      "math",
      "matrix",
      "matter",
      "maximum",
      "maze",
      "meadow",
      "mean",
      "measure",
      "meat",
      "mechanic",
      "medal",
      "media",
      "melody",
      "melt",
      "member",
      "memory",
      "mention",
      "menu",
      "mercy",
      "merge",
      "merit",
      "merry",
      "mesh",
      "message",
      "metal",
      "method",
      "middle",
      "midnight",
      "milk",
      "million",
      "mimic",
      "mind",
      "minimum",
      "minor",
      "minute",
      "miracle",
      "mirror",
      "misery",
      "miss",
      "mistake",
      "mix",
      "mixed",
      "mixture",
      "mobile",
      "model",
      "modify",
      "mom",
      "moment",
      "monitor",
      "monkey",
      "monster",
      "month",
      "moon",
      "moral",
      "more",
      "morning",
      "mosquito",
      "mother",
      "motion",
      "motor",
      "mountain",
      "mouse",
      "move",
      "movie",
      "much",
      "muffin",
      "mule",
      "multiply",
      "muscle",
      "museum",
      "mushroom",
      "music",
      "must",
      "mutual",
      "myself",
      "mystery",
      "myth",
      "naive",
      "name",
      "napkin",
      "narrow",
      "nasty",
      "nation",
      "nature",
      "near",
      "neck",
      "need",
      "negative",
      "neglect",
      "neither",
      "nephew",
      "nerve",
      "nest",
      "net",
      "network",
      "neutral",
      "never",
      "news",
      "next",
      "nice",
      "night",
      "noble",
      "noise",
      "nominee",
      "noodle",
      "normal",
      "north",
      "nose",
      "notable",
      "note",
      "nothing",
      "notice",
      "novel",
      "now",
      "nuclear",
      "number",
      "nurse",
      "nut",
      "oak",
      "obey",
      "object",
      "oblige",
      "obscure",
      "observe",
      "obtain",
      "obvious",
      "occur",
      "ocean",
      "october",
      "odor",
      "off",
      "offer",
      "office",
      "often",
      "oil",
      "okay",
      "old",
      "olive",
      "olympic",
      "omit",
      "once",
      "one",
      "onion",
      "online",
      "only",
      "open",
      "opera",
      "opinion",
      "oppose",
      "option",
      "orange",
      "orbit",
      "orchard",
      "order",
      "ordinary",
      "organ",
      "orient",
      "original",
      "orphan",
      "ostrich",
      "other",
      "outdoor",
      "outer",
      "output",
      "outside",
      "oval",
      "oven",
      "over",
      "own",
      "owner",
      "oxygen",
      "oyster",
      "ozone",
      "pact",
      "paddle",
      "page",
      "pair",
      "palace",
      "palm",
      "panda",
      "panel",
      "panic",
      "panther",
      "paper",
      "parade",
      "parent",
      "park",
      "parrot",
      "party",
      "pass",
      "patch",
      "path",
      "patient",
      "patrol",
      "pattern",
      "pause",
      "pave",
      "payment",
      "peace",
      "peanut",
      "pear",
      "peasant",
      "pelican",
      "pen",
      "penalty",
      "pencil",
      "people",
      "pepper",
      "perfect",
      "permit",
      "person",
      "pet",
      "phone",
      "photo",
      "phrase",
      "physical",
      "piano",
      "picnic",
      "picture",
      "piece",
      "pig",
      "pigeon",
      "pill",
      "pilot",
      "pink",
      "pioneer",
      "pipe",
      "pistol",
      "pitch",
      "pizza",
      "place",
      "planet",
      "plastic",
      "plate",
      "play",
      "please",
      "pledge",
      "pluck",
      "plug",
      "plunge",
      "poem",
      "poet",
      "point",
      "polar",
      "pole",
      "police",
      "pond",
      "pony",
      "pool",
      "popular",
      "portion",
      "position",
      "possible",
      "post",
      "potato",
      "pottery",
      "poverty",
      "powder",
      "power",
      "practice",
      "praise",
      "predict",
      "prefer",
      "prepare",
      "present",
      "pretty",
      "prevent",
      "price",
      "pride",
      "primary",
      "print",
      "priority",
      "prison",
      "private",
      "prize",
      "problem",
      "process",
      "produce",
      "profit",
      "program",
      "project",
      "promote",
      "proof",
      "property",
      "prosper",
      "protect",
      "proud",
      "provide",
      "public",
      "pudding",
      "pull",
      "pulp",
      "pulse",
      "pumpkin",
      "punch",
      "pupil",
      "puppy",
      "purchase",
      "purity",
      "purpose",
      "purse",
      "push",
      "put",
      "puzzle",
      "pyramid",
      "quality",
      "quantum",
      "quarter",
      "question",
      "quick",
      "quit",
      "quiz",
      "quote",
      "rabbit",
      "raccoon",
      "race",
      "rack",
      "radar",
      "radio",
      "rail",
      "rain",
      "raise",
      "rally",
      "ramp",
      "ranch",
      "random",
      "range",
      "rapid",
      "rare",
      "rate",
      "rather",
      "raven",
      "raw",
      "razor",
      "ready",
      "real",
      "reason",
      "rebel",
      "rebuild",
      "recall",
      "receive",
      "recipe",
      "record",
      "recycle",
      "reduce",
      "reflect",
      "reform",
      "refuse",
      "region",
      "regret",
      "regular",
      "reject",
      "relax",
      "release",
      "relief",
      "rely",
      "remain",
      "remember",
      "remind",
      "remove",
      "render",
      "renew",
      "rent",
      "reopen",
      "repair",
      "repeat",
      "replace",
      "report",
      "require",
      "rescue",
      "resemble",
      "resist",
      "resource",
      "response",
      "result",
      "retire",
      "retreat",
      "return",
      "reunion",
      "reveal",
      "review",
      "reward",
      "rhythm",
      "rib",
      "ribbon",
      "rice",
      "rich",
      "ride",
      "ridge",
      "rifle",
      "right",
      "rigid",
      "ring",
      "riot",
      "ripple",
      "risk",
      "ritual",
      "rival",
      "river",
      "road",
      "roast",
      "robot",
      "robust",
      "rocket",
      "romance",
      "roof",
      "rookie",
      "room",
      "rose",
      "rotate",
      "rough",
      "round",
      "route",
      "royal",
      "rubber",
      "rude",
      "rug",
      "rule",
      "run",
      "runway",
      "rural",
      "sad",
      "saddle",
      "sadness",
      "safe",
      "sail",
      "salad",
      "salmon",
      "salon",
      "salt",
      "salute",
      "same",
      "sample",
      "sand",
      "satisfy",
      "satoshi",
      "sauce",
      "sausage",
      "save",
      "say",
      "scale",
      "scan",
      "scare",
      "scatter",
      "scene",
      "scheme",
      "school",
      "science",
      "scissors",
      "scorpion",
      "scout",
      "scrap",
      "screen",
      "script",
      "scrub",
      "sea",
      "search",
      "season",
      "seat",
      "second",
      "secret",
      "section",
      "security",
      "seed",
      "seek",
      "segment",
      "select",
      "sell",
      "seminar",
      "senior",
      "sense",
      "sentence",
      "series",
      "service",
      "session",
      "settle",
      "setup",
      "seven",
      "shadow",
      "shaft",
      "shallow",
      "share",
      "shed",
      "shell",
      "sheriff",
      "shield",
      "shift",
      "shine",
      "ship",
      "shiver",
      "shock",
      "shoe",
      "shoot",
      "shop",
      "short",
      "shoulder",
      "shove",
      "shrimp",
      "shrug",
      "shuffle",
      "shy",
      "sibling",
      "sick",
      "side",
      "siege",
      "sight",
      "sign",
      "silent",
      "silk",
      "silly",
      "silver",
      "similar",
      "simple",
      "since",
      "sing",
      "siren",
      "sister",
      "situate",
      "six",
      "size",
      "skate",
      "sketch",
      "ski",
      "skill",
      "skin",
      "skirt",
      "skull",
      "slab",
      "slam",
      "sleep",
      "slender",
      "slice",
      "slide",
      "slight",
      "slim",
      "slogan",
      "slot",
      "slow",
      "slush",
      "small",
      "smart",
      "smile",
      "smoke",
      "smooth",
      "snack",
      "snake",
      "snap",
      "sniff",
      "snow",
      "soap",
      "soccer",
      "social",
      "sock",
      "soda",
      "soft",
      "solar",
      "soldier",
      "solid",
      "solution",
      "solve",
      "someone",
      "song",
      "soon",
      "sorry",
      "sort",
      "soul",
      "sound",
      "soup",
      "source",
      "south",
      "space",
      "spare",
      "spatial",
      "spawn",
      "speak",
      "special",
      "speed",
      "spell",
      "spend",
      "sphere",
      "spice",
      "spider",
      "spike",
      "spin",
      "spirit",
      "split",
      "spoil",
      "sponsor",
      "spoon",
      "sport",
      "spot",
      "spray",
      "spread",
      "spring",
      "spy",
      "square",
      "squeeze",
      "squirrel",
      "stable",
      "stadium",
      "staff",
      "stage",
      "stairs",
      "stamp",
      "stand",
      "start",
      "state",
      "stay",
      "steak",
      "steel",
      "stem",
      "step",
      "stereo",
      "stick",
      "still",
      "sting",
      "stock",
      "stomach",
      "stone",
      "stool",
      "story",
      "stove",
      "strategy",
      "street",
      "strike",
      "strong",
      "struggle",
      "student",
      "stuff",
      "stumble",
      "style",
      "subject",
      "submit",
      "subway",
      "success",
      "such",
      "sudden",
      "suffer",
      "sugar",
      "suggest",
      "suit",
      "summer",
      "sun",
      "sunny",
      "sunset",
      "super",
      "supply",
      "supreme",
      "sure",
      "surface",
      "surge",
      "surprise",
      "surround",
      "survey",
      "suspect",
      "sustain",
      "swallow",
      "swamp",
      "swap",
      "swarm",
      "swear",
      "sweet",
      "swift",
      "swim",
      "swing",
      "switch",
      "sword",
      "symbol",
      "symptom",
      "syrup",
      "system",
      "table",
      "tackle",
      "tag",
      "tail",
      "talent",
      "talk",
      "tank",
      "tape",
      "target",
      "task",
      "taste",
      "tattoo",
      "taxi",
      "teach",
      "team",
      "tell",
      "ten",
      "tenant",
      "tennis",
      "tent",
      "term",
      "test",
      "text",
      "thank",
      "that",
      "theme",
      "then",
      "theory",
      "there",
      "they",
      "thing",
      "this",
      "thought",
      "three",
      "thrive",
      "throw",
      "thumb",
      "thunder",
      "ticket",
      "tide",
      "tiger",
      "tilt",
      "timber",
      "time",
      "tiny",
      "tip",
      "tired",
      "tissue",
      "title",
      "toast",
      "tobacco",
      "today",
      "toddler",
      "toe",
      "together",
      "toilet",
      "token",
      "tomato",
      "tomorrow",
      "tone",
      "tongue",
      "tonight",
      "tool",
      "tooth",
      "top",
      "topic",
      "topple",
      "torch",
      "tornado",
      "tortoise",
      "toss",
      "total",
      "tourist",
      "toward",
      "tower",
      "town",
      "toy",
      "track",
      "trade",
      "traffic",
      "tragic",
      "train",
      "transfer",
      "trap",
      "trash",
      "travel",
      "tray",
      "treat",
      "tree",
      "trend",
      "trial",
      "tribe",
      "trick",
      "trigger",
      "trim",
      "trip",
      "trophy",
      "trouble",
      "truck",
      "true",
      "truly",
      "trumpet",
      "trust",
      "truth",
      "try",
      "tube",
      "tuition",
      "tumble",
      "tuna",
      "tunnel",
      "turkey",
      "turn",
      "turtle",
      "twelve",
      "twenty",
      "twice",
      "twin",
      "twist",
      "two",
      "type",
      "typical",
      "ugly",
      "umbrella",
      "unable",
      "unaware",
      "uncle",
      "uncover",
      "under",
      "undo",
      "unfair",
      "unfold",
      "unhappy",
      "uniform",
      "unique",
      "unit",
      "universe",
      "unknown",
      "unlock",
      "until",
      "unusual",
      "unveil",
      "update",
      "upgrade",
      "uphold",
      "upon",
      "upper",
      "upset",
      "urban",
      "urge",
      "usage",
      "use",
      "used",
      "useful",
      "useless",
      "usual",
      "utility",
      "vacant",
      "vacuum",
      "vague",
      "valid",
      "valley",
      "valve",
      "van",
      "vanish",
      "vapor",
      "various",
      "vast",
      "vault",
      "vehicle",
      "velvet",
      "vendor",
      "venture",
      "venue",
      "verb",
      "verify",
      "version",
      "very",
      "vessel",
      "veteran",
      "viable",
      "vibrant",
      "vicious",
      "victory",
      "video",
      "view",
      "village",
      "vintage",
      "violin",
      "virtual",
      "virus",
      "visa",
      "visit",
      "visual",
      "vital",
      "vivid",
      "vocal",
      "voice",
      "void",
      "volcano",
      "volume",
      "vote",
      "voyage",
      "wage",
      "wagon",
      "wait",
      "walk",
      "wall",
      "walnut",
      "want",
      "warfare",
      "warm",
      "warrior",
      "wash",
      "wasp",
      "waste",
      "water",
      "wave",
      "way",
      "wealth",
      "weapon",
      "wear",
      "weasel",
      "weather",
      "web",
      "wedding",
      "weekend",
      "weird",
      "welcome",
      "west",
      "wet",
      "whale",
      "what",
      "wheat",
      "wheel",
      "when",
      "where",
      "whip",
      "whisper",
      "wide",
      "width",
      "wife",
      "wild",
      "will",
      "win",
      "window",
      "wine",
      "wing",
      "wink",
      "winner",
      "winter",
      "wire",
      "wisdom",
      "wise",
      "wish",
      "witness",
      "wolf",
      "woman",
      "wonder",
      "wood",
      "wool",
      "word",
      "work",
      "world",
      "worry",
      "worth",
      "wrap",
      "wreck",
      "wrestle",
      "wrist",
      "write",
      "wrong",
      "yard",
      "year",
      "yellow",
      "you",
      "young",
      "youth",
      "zebra",
      "zero",
      "zone",
      "zoo"
    ];
  }
});

// node_modules/bip39/src/_wordlists.js
var require_wordlists = __commonJS({
  "node_modules/bip39/src/_wordlists.js"(exports) {
    "use strict";
    init_buffer_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var wordlists = {};
    exports.wordlists = wordlists;
    var _default;
    exports._default = _default;
    try {
      exports._default = _default = require_czech();
      wordlists.czech = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_chinese_simplified();
      wordlists.chinese_simplified = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_chinese_traditional();
      wordlists.chinese_traditional = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_korean();
      wordlists.korean = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_french();
      wordlists.french = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_italian();
      wordlists.italian = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_spanish();
      wordlists.spanish = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_japanese();
      wordlists.japanese = _default;
      wordlists.JA = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_portuguese();
      wordlists.portuguese = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_english();
      wordlists.english = _default;
      wordlists.EN = _default;
    } catch (err) {
    }
  }
});

// node_modules/bip39/src/index.js
var require_src = __commonJS({
  "node_modules/bip39/src/index.js"(exports) {
    "use strict";
    init_buffer_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var sha256_1 = require_sha256();
    var sha512_1 = require_sha512();
    var pbkdf2_1 = require_pbkdf2();
    var utils_1 = require_utils();
    var _wordlists_1 = require_wordlists();
    var DEFAULT_WORDLIST = _wordlists_1._default;
    var INVALID_MNEMONIC = "Invalid mnemonic";
    var INVALID_ENTROPY = "Invalid entropy";
    var INVALID_CHECKSUM = "Invalid mnemonic checksum";
    var WORDLIST_REQUIRED = "A wordlist is required but a default could not be found.\nPlease pass a 2048 word array explicitly.";
    function normalize(str) {
      return (str || "").normalize("NFKD");
    }
    function lpad(str, padString, length) {
      while (str.length < length) {
        str = padString + str;
      }
      return str;
    }
    function binaryToByte(bin) {
      return parseInt(bin, 2);
    }
    function bytesToBinary(bytes) {
      return bytes.map((x) => lpad(x.toString(2), "0", 8)).join("");
    }
    function deriveChecksumBits(entropyBuffer) {
      const ENT = entropyBuffer.length * 8;
      const CS = ENT / 32;
      const hash = sha256_1.sha256(Uint8Array.from(entropyBuffer));
      return bytesToBinary(Array.from(hash)).slice(0, CS);
    }
    function salt(password) {
      return "mnemonic" + (password || "");
    }
    function mnemonicToSeedSync2(mnemonic, password) {
      const mnemonicBuffer = Uint8Array.from(import_buffer.Buffer.from(normalize(mnemonic), "utf8"));
      const saltBuffer = Uint8Array.from(import_buffer.Buffer.from(salt(normalize(password)), "utf8"));
      const res = pbkdf2_1.pbkdf2(sha512_1.sha512, mnemonicBuffer, saltBuffer, {
        c: 2048,
        dkLen: 64
      });
      return import_buffer.Buffer.from(res);
    }
    exports.mnemonicToSeedSync = mnemonicToSeedSync2;
    function mnemonicToSeed(mnemonic, password) {
      const mnemonicBuffer = Uint8Array.from(import_buffer.Buffer.from(normalize(mnemonic), "utf8"));
      const saltBuffer = Uint8Array.from(import_buffer.Buffer.from(salt(normalize(password)), "utf8"));
      return pbkdf2_1.pbkdf2Async(sha512_1.sha512, mnemonicBuffer, saltBuffer, {
        c: 2048,
        dkLen: 64
      }).then((res) => import_buffer.Buffer.from(res));
    }
    exports.mnemonicToSeed = mnemonicToSeed;
    function mnemonicToEntropy(mnemonic, wordlist) {
      wordlist = wordlist || DEFAULT_WORDLIST;
      if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
      }
      const words = normalize(mnemonic).split(" ");
      if (words.length % 3 !== 0) {
        throw new Error(INVALID_MNEMONIC);
      }
      const bits = words.map((word) => {
        const index = wordlist.indexOf(word);
        if (index === -1) {
          throw new Error(INVALID_MNEMONIC);
        }
        return lpad(index.toString(2), "0", 11);
      }).join("");
      const dividerIndex = Math.floor(bits.length / 33) * 32;
      const entropyBits = bits.slice(0, dividerIndex);
      const checksumBits = bits.slice(dividerIndex);
      const entropyBytes = entropyBits.match(/(.{1,8})/g).map(binaryToByte);
      if (entropyBytes.length < 16) {
        throw new Error(INVALID_ENTROPY);
      }
      if (entropyBytes.length > 32) {
        throw new Error(INVALID_ENTROPY);
      }
      if (entropyBytes.length % 4 !== 0) {
        throw new Error(INVALID_ENTROPY);
      }
      const entropy = import_buffer.Buffer.from(entropyBytes);
      const newChecksum = deriveChecksumBits(entropy);
      if (newChecksum !== checksumBits) {
        throw new Error(INVALID_CHECKSUM);
      }
      return entropy.toString("hex");
    }
    exports.mnemonicToEntropy = mnemonicToEntropy;
    function entropyToMnemonic(entropy, wordlist) {
      if (!import_buffer.Buffer.isBuffer(entropy)) {
        entropy = import_buffer.Buffer.from(entropy, "hex");
      }
      wordlist = wordlist || DEFAULT_WORDLIST;
      if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
      }
      if (entropy.length < 16) {
        throw new TypeError(INVALID_ENTROPY);
      }
      if (entropy.length > 32) {
        throw new TypeError(INVALID_ENTROPY);
      }
      if (entropy.length % 4 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
      }
      const entropyBits = bytesToBinary(Array.from(entropy));
      const checksumBits = deriveChecksumBits(entropy);
      const bits = entropyBits + checksumBits;
      const chunks = bits.match(/(.{1,11})/g);
      const words = chunks.map((binary) => {
        const index = binaryToByte(binary);
        return wordlist[index];
      });
      return wordlist[0] === "\u3042\u3044\u3053\u304F\u3057\u3093" ? words.join("\u3000") : words.join(" ");
    }
    exports.entropyToMnemonic = entropyToMnemonic;
    function generateMnemonic2(strength, rng, wordlist) {
      strength = strength || 128;
      if (strength % 32 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
      }
      rng = rng || ((size) => import_buffer.Buffer.from(utils_1.randomBytes(size)));
      return entropyToMnemonic(rng(strength / 8), wordlist);
    }
    exports.generateMnemonic = generateMnemonic2;
    function validateMnemonic2(mnemonic, wordlist) {
      try {
        mnemonicToEntropy(mnemonic, wordlist);
      } catch (e) {
        return false;
      }
      return true;
    }
    exports.validateMnemonic = validateMnemonic2;
    function setDefaultWordlist(language) {
      const result = _wordlists_1.wordlists[language];
      if (result) {
        DEFAULT_WORDLIST = result;
      } else {
        throw new Error('Could not find wordlist for language "' + language + '"');
      }
    }
    exports.setDefaultWordlist = setDefaultWordlist;
    function getDefaultWordlist() {
      if (!DEFAULT_WORDLIST) {
        throw new Error("No Default Wordlist set");
      }
      return Object.keys(_wordlists_1.wordlists).filter((lang) => {
        if (lang === "JA" || lang === "EN") {
          return false;
        }
        return _wordlists_1.wordlists[lang].every((word, index) => word === DEFAULT_WORDLIST[index]);
      })[0];
    }
    exports.getDefaultWordlist = getDefaultWordlist;
    var _wordlists_2 = require_wordlists();
    exports.wordlists = _wordlists_2.wordlists;
  }
});

// node_modules/@utexo/rgb-lib-wasm/rgb_lib_wasm_bindings.js
var rgb_lib_wasm_bindings_exports = {};
__export(rgb_lib_wasm_bindings_exports, {
  WasmInvoice: () => WasmInvoice,
  WasmWallet: () => WasmWallet,
  checkProxyUrl: () => checkProxyUrl,
  default: () => __wbg_init,
  generateKeys: () => generateKeys,
  init: () => init,
  initSync: () => initSync,
  restoreKeys: () => restoreKeys,
  validateConsignmentOffchain: () => validateConsignmentOffchain
});
function checkProxyUrl(proxy_url) {
  const ptr0 = passStringToWasm0(proxy_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len0 = WASM_VECTOR_LEN;
  const ret = wasm.checkProxyUrl(ptr0, len0);
  return ret;
}
function generateKeys(network) {
  const ptr0 = passStringToWasm0(network, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len0 = WASM_VECTOR_LEN;
  const ret = wasm.generateKeys(ptr0, len0);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return takeFromExternrefTable0(ret[0]);
}
function init() {
  wasm.init();
}
function restoreKeys(network, mnemonic) {
  const ptr0 = passStringToWasm0(network, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len0 = WASM_VECTOR_LEN;
  const ptr1 = passStringToWasm0(mnemonic, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len1 = WASM_VECTOR_LEN;
  const ret = wasm.restoreKeys(ptr0, len0, ptr1, len1);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return takeFromExternrefTable0(ret[0]);
}
function validateConsignmentOffchain(consignment_bytes, txid, network) {
  const ptr0 = passArray8ToWasm0(consignment_bytes, wasm.__wbindgen_malloc);
  const len0 = WASM_VECTOR_LEN;
  const ptr1 = passStringToWasm0(txid, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len1 = WASM_VECTOR_LEN;
  const ptr2 = passStringToWasm0(network, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len2 = WASM_VECTOR_LEN;
  const ret = wasm.validateConsignmentOffchain(ptr0, len0, ptr1, len1, ptr2, len2);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return takeFromExternrefTable0(ret[0]);
}
function __wbg_get_imports() {
  const import0 = {
    __proto__: null,
    __wbg_Error_2e59b1b37a9a34c3: function(arg0, arg1) {
      const ret = Error(getStringFromWasm0(arg0, arg1));
      return ret;
    },
    __wbg_Number_e6ffdb596c888833: function(arg0) {
      const ret = Number(arg0);
      return ret;
    },
    __wbg_String_8564e559799eccda: function(arg0, arg1) {
      const ret = String(arg1);
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg___wbindgen_bigint_get_as_i64_2c5082002e4826e2: function(arg0, arg1) {
      const v = arg1;
      const ret = typeof v === "bigint" ? v : void 0;
      getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    },
    __wbg___wbindgen_boolean_get_a86c216575a75c30: function(arg0) {
      const v = arg0;
      const ret = typeof v === "boolean" ? v : void 0;
      return isLikeNone(ret) ? 16777215 : ret ? 1 : 0;
    },
    __wbg___wbindgen_debug_string_dd5d2d07ce9e6c57: function(arg0, arg1) {
      const ret = debugString(arg1);
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg___wbindgen_in_4bd7a57e54337366: function(arg0, arg1) {
      const ret = arg0 in arg1;
      return ret;
    },
    __wbg___wbindgen_is_bigint_6c98f7e945dacdde: function(arg0) {
      const ret = typeof arg0 === "bigint";
      return ret;
    },
    __wbg___wbindgen_is_function_49868bde5eb1e745: function(arg0) {
      const ret = typeof arg0 === "function";
      return ret;
    },
    __wbg___wbindgen_is_null_344c8750a8525473: function(arg0) {
      const ret = arg0 === null;
      return ret;
    },
    __wbg___wbindgen_is_object_40c5a80572e8f9d3: function(arg0) {
      const val = arg0;
      const ret = typeof val === "object" && val !== null;
      return ret;
    },
    __wbg___wbindgen_is_string_b29b5c5a8065ba1a: function(arg0) {
      const ret = typeof arg0 === "string";
      return ret;
    },
    __wbg___wbindgen_is_undefined_c0cca72b82b86f4d: function(arg0) {
      const ret = arg0 === void 0;
      return ret;
    },
    __wbg___wbindgen_jsval_eq_7d430e744a913d26: function(arg0, arg1) {
      const ret = arg0 === arg1;
      return ret;
    },
    __wbg___wbindgen_jsval_loose_eq_3a72ae764d46d944: function(arg0, arg1) {
      const ret = arg0 == arg1;
      return ret;
    },
    __wbg___wbindgen_number_get_7579aab02a8a620c: function(arg0, arg1) {
      const obj = arg1;
      const ret = typeof obj === "number" ? obj : void 0;
      getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    },
    __wbg___wbindgen_string_get_914df97fcfa788f2: function(arg0, arg1) {
      const obj = arg1;
      const ret = typeof obj === "string" ? obj : void 0;
      var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      var len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg___wbindgen_throw_81fc77679af83bc6: function(arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    },
    __wbg__wbg_cb_unref_3c3b4f651835fbcb: function(arg0) {
      arg0._wbg_cb_unref();
    },
    __wbg_abort_5ee4083ce26e0b01: function(arg0) {
      arg0.abort();
    },
    __wbg_abort_7a67cb8f9383baa1: function(arg0, arg1) {
      arg0.abort(arg1);
    },
    __wbg_append_4aa39f0c1ef8161e: function() {
      return handleError(function(arg0, arg1, arg2, arg3, arg4) {
        arg0.append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
      }, arguments);
    },
    __wbg_append_59da1e75d76c3126: function() {
      return handleError(function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.append(getStringFromWasm0(arg1, arg2), arg3, getStringFromWasm0(arg4, arg5));
      }, arguments);
    },
    __wbg_append_c015600138ae60bb: function() {
      return handleError(function(arg0, arg1, arg2, arg3, arg4) {
        arg0.append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
      }, arguments);
    },
    __wbg_arrayBuffer_dae084a298aa5fe0: function() {
      return handleError(function(arg0) {
        const ret = arg0.arrayBuffer();
        return ret;
      }, arguments);
    },
    __wbg_call_7f2987183bb62793: function() {
      return handleError(function(arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
      }, arguments);
    },
    __wbg_call_d578befcc3145dee: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
      }, arguments);
    },
    __wbg_clearTimeout_2256f1e7b94ef517: function(arg0) {
      const ret = clearTimeout(arg0);
      return ret;
    },
    __wbg_clearTimeout_6b8d9a38b9263d65: function(arg0) {
      const ret = clearTimeout(arg0);
      return ret;
    },
    __wbg_close_040c0e5be6c74f11: function(arg0) {
      arg0.close();
    },
    __wbg_createIndex_3b7d978a2177a0cf: function() {
      return handleError(function(arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.createIndex(getStringFromWasm0(arg1, arg2), arg3, arg4);
        return ret;
      }, arguments);
    },
    __wbg_createObjectStore_6e567b25160be2fa: function() {
      return handleError(function(arg0, arg1, arg2, arg3) {
        const ret = arg0.createObjectStore(getStringFromWasm0(arg1, arg2), arg3);
        return ret;
      }, arguments);
    },
    __wbg_crypto_38df2bab126b63dc: function(arg0) {
      const ret = arg0.crypto;
      return ret;
    },
    __wbg_deleteIndex_af52038711dd78b2: function() {
      return handleError(function(arg0, arg1, arg2) {
        arg0.deleteIndex(getStringFromWasm0(arg1, arg2));
      }, arguments);
    },
    __wbg_deleteObjectStore_42c1e82fe6d8a028: function() {
      return handleError(function(arg0, arg1, arg2) {
        arg0.deleteObjectStore(getStringFromWasm0(arg1, arg2));
      }, arguments);
    },
    __wbg_done_547d467e97529006: function(arg0) {
      const ret = arg0.done;
      return ret;
    },
    __wbg_entries_616b1a459b85be0b: function(arg0) {
      const ret = Object.entries(arg0);
      return ret;
    },
    __wbg_entries_69f235654ec4ccc6: function(arg0) {
      const ret = arg0.entries();
      return ret;
    },
    __wbg_error_38bec0a78dd8ded8: function(arg0) {
      console.error(arg0);
    },
    __wbg_error_58469b8474e13592: function() {
      return handleError(function(arg0) {
        const ret = arg0.error;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
      }, arguments);
    },
    __wbg_error_ad2c52bad651cd14: function(arg0, arg1) {
      console.error(getStringFromWasm0(arg0, arg1));
    },
    __wbg_error_c57846662bf0e748: function(arg0) {
      const ret = arg0.error;
      return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    },
    __wbg_fetch_1a731e18c5e21884: function(arg0, arg1) {
      const ret = arg0.fetch(arg1);
      return ret;
    },
    __wbg_fetch_43b2f110608a59ff: function(arg0) {
      const ret = fetch(arg0);
      return ret;
    },
    __wbg_fetch_8d9b732df7467c44: function(arg0) {
      const ret = fetch(arg0);
      return ret;
    },
    __wbg_fetch_9dad4fe911207b37: function(arg0) {
      const ret = fetch(arg0);
      return ret;
    },
    __wbg_getRandomValues_3f44b700395062e5: function() {
      return handleError(function(arg0, arg1) {
        globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
      }, arguments);
    },
    __wbg_getRandomValues_c44a50d8cfdaebeb: function() {
      return handleError(function(arg0, arg1) {
        arg0.getRandomValues(arg1);
      }, arguments);
    },
    __wbg_getTime_f6ac312467f7cf09: function(arg0) {
      const ret = arg0.getTime();
      return ret;
    },
    __wbg_get_4848e350b40afc16: function(arg0, arg1) {
      const ret = arg0[arg1 >>> 0];
      return ret;
    },
    __wbg_get_560cb483e5c0133e: function() {
      return handleError(function(arg0, arg1) {
        const ret = arg0.get(arg1);
        return ret;
      }, arguments);
    },
    __wbg_get_dba5fa38b6597b3f: function(arg0, arg1, arg2) {
      const ret = arg1[arg2 >>> 0];
      var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      var len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg_get_ed0642c4b9d31ddf: function() {
      return handleError(function(arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
      }, arguments);
    },
    __wbg_get_f96702c6245e4ef9: function() {
      return handleError(function(arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
      }, arguments);
    },
    __wbg_get_unchecked_7d7babe32e9e6a54: function(arg0, arg1) {
      const ret = arg0[arg1 >>> 0];
      return ret;
    },
    __wbg_get_with_ref_key_6412cf3094599694: function(arg0, arg1) {
      const ret = arg0[arg1];
      return ret;
    },
    __wbg_has_3ec5c22db2e5237a: function() {
      return handleError(function(arg0, arg1) {
        const ret = Reflect.has(arg0, arg1);
        return ret;
      }, arguments);
    },
    __wbg_headers_e08dcb5aa09b9a63: function(arg0) {
      const ret = arg0.headers;
      return ret;
    },
    __wbg_indexNames_82c4167bffa4c333: function(arg0) {
      const ret = arg0.indexNames;
      return ret;
    },
    __wbg_index_ce5a38731ba42f0d: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = arg0.index(getStringFromWasm0(arg1, arg2));
        return ret;
      }, arguments);
    },
    __wbg_instanceof_ArrayBuffer_ff7c1337a5e3b33a: function(arg0) {
      let result;
      try {
        result = arg0 instanceof ArrayBuffer;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_instanceof_Error_e3390d6805733dad: function(arg0) {
      let result;
      try {
        result = arg0 instanceof Error;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_instanceof_IdbDatabase_0af111edb4be95f4: function(arg0) {
      let result;
      try {
        result = arg0 instanceof IDBDatabase;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_instanceof_IdbFactory_7c303c3d8528cef3: function(arg0) {
      let result;
      try {
        result = arg0 instanceof IDBFactory;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_instanceof_IdbOpenDbRequest_92df356941adf31e: function(arg0) {
      let result;
      try {
        result = arg0 instanceof IDBOpenDBRequest;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_instanceof_IdbRequest_fc5918c726448f04: function(arg0) {
      let result;
      try {
        result = arg0 instanceof IDBRequest;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_instanceof_IdbTransaction_de69712ce07dde97: function(arg0) {
      let result;
      try {
        result = arg0 instanceof IDBTransaction;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_instanceof_Map_a10a2795ef4bfe97: function(arg0) {
      let result;
      try {
        result = arg0 instanceof Map;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_instanceof_Response_06795eab66cc4036: function(arg0) {
      let result;
      try {
        result = arg0 instanceof Response;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_instanceof_Uint8Array_4b8da683deb25d72: function(arg0) {
      let result;
      try {
        result = arg0 instanceof Uint8Array;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_isArray_db61795ad004c139: function(arg0) {
      const ret = Array.isArray(arg0);
      return ret;
    },
    __wbg_isSafeInteger_ea83862ba994770c: function(arg0) {
      const ret = Number.isSafeInteger(arg0);
      return ret;
    },
    __wbg_iterator_de403ef31815a3e6: function() {
      const ret = Symbol.iterator;
      return ret;
    },
    __wbg_keyPath_137bba25d08d22b9: function() {
      return handleError(function(arg0) {
        const ret = arg0.keyPath;
        return ret;
      }, arguments);
    },
    __wbg_length_0c32cb8543c8e4c8: function(arg0) {
      const ret = arg0.length;
      return ret;
    },
    __wbg_length_3804262ff442a7a3: function(arg0) {
      const ret = arg0.length;
      return ret;
    },
    __wbg_length_6e821edde497a532: function(arg0) {
      const ret = arg0.length;
      return ret;
    },
    __wbg_message_7367f8c7d0fa1589: function(arg0) {
      const ret = arg0.message;
      return ret;
    },
    __wbg_msCrypto_bd5a034af96bcba6: function(arg0) {
      const ret = arg0.msCrypto;
      return ret;
    },
    __wbg_multiEntry_9d4ec9fa9fa5a9d5: function(arg0) {
      const ret = arg0.multiEntry;
      return ret;
    },
    __wbg_name_cb583806cac84fe0: function(arg0) {
      const ret = arg0.name;
      return ret;
    },
    __wbg_new_0_bfa2ef4bc447daa2: function() {
      const ret = /* @__PURE__ */ new Date();
      return ret;
    },
    __wbg_new_0fec9fb02d03a383: function() {
      return handleError(function(arg0, arg1) {
        const ret = new URL(getStringFromWasm0(arg0, arg1));
        return ret;
      }, arguments);
    },
    __wbg_new_3a112826a89cb962: function() {
      return handleError(function() {
        const ret = new Headers();
        return ret;
      }, arguments);
    },
    __wbg_new_4f9fafbb3909af72: function() {
      const ret = new Object();
      return ret;
    },
    __wbg_new_56a7f7f78a9437aa: function() {
      return handleError(function() {
        const ret = new FormData();
        return ret;
      }, arguments);
    },
    __wbg_new_7681c4155808e30a: function() {
      return handleError(function() {
        const ret = new URLSearchParams();
        return ret;
      }, arguments);
    },
    __wbg_new_99cabae501c0a8a0: function() {
      const ret = /* @__PURE__ */ new Map();
      return ret;
    },
    __wbg_new_9abbf7148481485e: function() {
      return handleError(function() {
        const ret = new AbortController();
        return ret;
      }, arguments);
    },
    __wbg_new_a560378ea1240b14: function(arg0) {
      const ret = new Uint8Array(arg0);
      return ret;
    },
    __wbg_new_f3c9df4f38f3f798: function() {
      const ret = new Array();
      return ret;
    },
    __wbg_new_from_slice_2580ff33d0d10520: function(arg0, arg1) {
      const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
      return ret;
    },
    __wbg_new_typed_14d7cc391ce53d2c: function(arg0, arg1) {
      try {
        var state0 = { a: arg0, b: arg1 };
        var cb0 = (arg02, arg12) => {
          const a = state0.a;
          state0.a = 0;
          try {
            return wasm_bindgen__convert__closures_____invoke__ha2bf463ed4ed0af5(a, state0.b, arg02, arg12);
          } finally {
            state0.a = a;
          }
        };
        const ret = new Promise(cb0);
        return ret;
      } finally {
        state0.a = 0;
      }
    },
    __wbg_new_with_length_9cedd08484b73942: function(arg0) {
      const ret = new Uint8Array(arg0 >>> 0);
      return ret;
    },
    __wbg_new_with_str_9dca18ad543fe832: function() {
      return handleError(function(arg0, arg1) {
        const ret = new Request(getStringFromWasm0(arg0, arg1));
        return ret;
      }, arguments);
    },
    __wbg_new_with_str_and_init_f663b6d334baa878: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
      }, arguments);
    },
    __wbg_new_with_u8_array_sequence_2ae9f5628c4df63c: function() {
      return handleError(function(arg0) {
        const ret = new Blob(arg0);
        return ret;
      }, arguments);
    },
    __wbg_next_01132ed6134b8ef5: function(arg0) {
      const ret = arg0.next;
      return ret;
    },
    __wbg_next_b3713ec761a9dbfd: function() {
      return handleError(function(arg0) {
        const ret = arg0.next();
        return ret;
      }, arguments);
    },
    __wbg_node_84ea875411254db1: function(arg0) {
      const ret = arg0.node;
      return ret;
    },
    __wbg_now_2c44418ca0623664: function(arg0) {
      const ret = arg0.now();
      return ret;
    },
    __wbg_now_88621c9c9a4f3ffc: function() {
      const ret = Date.now();
      return ret;
    },
    __wbg_objectStoreNames_990d8e55c661828b: function(arg0) {
      const ret = arg0.objectStoreNames;
      return ret;
    },
    __wbg_objectStore_3d4cade4416cd432: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = arg0.objectStore(getStringFromWasm0(arg1, arg2));
        return ret;
      }, arguments);
    },
    __wbg_open_254d9b392262d9ef: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = arg0.open(getStringFromWasm0(arg1, arg2));
        return ret;
      }, arguments);
    },
    __wbg_open_ac04ec9d75d0eeaf: function() {
      return handleError(function(arg0, arg1, arg2, arg3) {
        const ret = arg0.open(getStringFromWasm0(arg1, arg2), arg3 >>> 0);
        return ret;
      }, arguments);
    },
    __wbg_process_44c7a14e11e9f69e: function(arg0) {
      const ret = arg0.process;
      return ret;
    },
    __wbg_prototypesetcall_3e05eb9545565046: function(arg0, arg1, arg2) {
      Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
    },
    __wbg_push_6bdbc990be5ac37b: function(arg0, arg1) {
      const ret = arg0.push(arg1);
      return ret;
    },
    __wbg_put_015a7e88e46a2502: function() {
      return handleError(function(arg0, arg1) {
        const ret = arg0.put(arg1);
        return ret;
      }, arguments);
    },
    __wbg_put_4485a4012273f7ef: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = arg0.put(arg1, arg2);
        return ret;
      }, arguments);
    },
    __wbg_queueMicrotask_abaf92f0bd4e80a4: function(arg0) {
      const ret = arg0.queueMicrotask;
      return ret;
    },
    __wbg_queueMicrotask_df5a6dac26d818f3: function(arg0) {
      queueMicrotask(arg0);
    },
    __wbg_randomFillSync_6c25eac9869eb53c: function() {
      return handleError(function(arg0, arg1) {
        arg0.randomFillSync(arg1);
      }, arguments);
    },
    __wbg_require_b4edbdcf3e2a1ef0: function() {
      return handleError(function() {
        const ret = module.require;
        return ret;
      }, arguments);
    },
    __wbg_resolve_0a79de24e9d2267b: function(arg0) {
      const ret = Promise.resolve(arg0);
      return ret;
    },
    __wbg_result_452c1006fc727317: function() {
      return handleError(function(arg0) {
        const ret = arg0.result;
        return ret;
      }, arguments);
    },
    __wbg_search_bd3fc2fcfcfc32a2: function(arg0, arg1) {
      const ret = arg1.search;
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg_setTimeout_b188b3bcc8977c7d: function(arg0, arg1) {
      const ret = setTimeout(arg0, arg1);
      return ret;
    },
    __wbg_setTimeout_f757f00851f76c42: function(arg0, arg1) {
      const ret = setTimeout(arg0, arg1);
      return ret;
    },
    __wbg_set_08463b1df38a7e29: function(arg0, arg1, arg2) {
      const ret = arg0.set(arg1, arg2);
      return ret;
    },
    __wbg_set_6be42768c690e380: function(arg0, arg1, arg2) {
      arg0[arg1] = arg2;
    },
    __wbg_set_6c60b2e8ad0e9383: function(arg0, arg1, arg2) {
      arg0[arg1 >>> 0] = arg2;
    },
    __wbg_set_auto_increment_37227907cc70bd30: function(arg0, arg1) {
      arg0.autoIncrement = arg1 !== 0;
    },
    __wbg_set_body_a304d09cb50cefbe: function(arg0, arg1) {
      arg0.body = arg1;
    },
    __wbg_set_cache_cc687e2b96e9608c: function(arg0, arg1) {
      arg0.cache = __wbindgen_enum_RequestCache[arg1];
    },
    __wbg_set_credentials_7693e63055f5e838: function(arg0, arg1) {
      arg0.credentials = __wbindgen_enum_RequestCredentials[arg1];
    },
    __wbg_set_headers_6ab1105e542834e2: function(arg0, arg1) {
      arg0.headers = arg1;
    },
    __wbg_set_key_path_6edd6ee0e8d75af3: function(arg0, arg1) {
      arg0.keyPath = arg1;
    },
    __wbg_set_method_1971272fe557e972: function(arg0, arg1, arg2) {
      arg0.method = getStringFromWasm0(arg1, arg2);
    },
    __wbg_set_mode_d1b643087602281a: function(arg0, arg1) {
      arg0.mode = __wbindgen_enum_RequestMode[arg1];
    },
    __wbg_set_multi_entry_791aace5b9c7b692: function(arg0, arg1) {
      arg0.multiEntry = arg1 !== 0;
    },
    __wbg_set_name_87619993a0cec565: function(arg0, arg1, arg2) {
      arg0.name = getStringFromWasm0(arg1, arg2);
    },
    __wbg_set_onabort_6b6df7a41aa97c23: function(arg0, arg1) {
      arg0.onabort = arg1;
    },
    __wbg_set_oncomplete_20fb27150b4ee0d4: function(arg0, arg1) {
      arg0.oncomplete = arg1;
    },
    __wbg_set_onerror_2b7dfa4e6dea4159: function(arg0, arg1) {
      arg0.onerror = arg1;
    },
    __wbg_set_onerror_3c4b5087146b11b6: function(arg0, arg1) {
      arg0.onerror = arg1;
    },
    __wbg_set_onsuccess_f7e5b5cbed5008b1: function(arg0, arg1) {
      arg0.onsuccess = arg1;
    },
    __wbg_set_onupgradeneeded_d7e8e03a1999bf5d: function(arg0, arg1) {
      arg0.onupgradeneeded = arg1;
    },
    __wbg_set_onversionchange_f7822a34e73e2769: function(arg0, arg1) {
      arg0.onversionchange = arg1;
    },
    __wbg_set_search_527da9642b10495d: function(arg0, arg1, arg2) {
      arg0.search = getStringFromWasm0(arg1, arg2);
    },
    __wbg_set_signal_8564a226c5c6853c: function(arg0, arg1) {
      arg0.signal = arg1;
    },
    __wbg_set_unique_e8b9acd5c7c23d7a: function(arg0, arg1) {
      arg0.unique = arg1 !== 0;
    },
    __wbg_signal_9172c3282bfba2f5: function(arg0) {
      const ret = arg0.signal;
      return ret;
    },
    __wbg_static_accessor_GLOBAL_THIS_a1248013d790bf5f: function() {
      const ret = typeof globalThis === "undefined" ? null : globalThis;
      return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    },
    __wbg_static_accessor_GLOBAL_f2e0f995a21329ff: function() {
      const ret = typeof global === "undefined" ? null : global;
      return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    },
    __wbg_static_accessor_SELF_24f78b6d23f286ea: function() {
      const ret = typeof self === "undefined" ? null : self;
      return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    },
    __wbg_static_accessor_WINDOW_59fd959c540fe405: function() {
      const ret = typeof window === "undefined" ? null : window;
      return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    },
    __wbg_status_44ecb0ac1da253f4: function(arg0) {
      const ret = arg0.status;
      return ret;
    },
    __wbg_stringify_a2c39d991e1bf91d: function() {
      return handleError(function(arg0) {
        const ret = JSON.stringify(arg0);
        return ret;
      }, arguments);
    },
    __wbg_subarray_0f98d3fb634508ad: function(arg0, arg1, arg2) {
      const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
      return ret;
    },
    __wbg_target_732d56b173b7e87c: function(arg0) {
      const ret = arg0.target;
      return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    },
    __wbg_text_43bdfba45e602cf9: function() {
      return handleError(function(arg0) {
        const ret = arg0.text();
        return ret;
      }, arguments);
    },
    __wbg_then_00eed3ac0b8e82cb: function(arg0, arg1, arg2) {
      const ret = arg0.then(arg1, arg2);
      return ret;
    },
    __wbg_then_a0c8db0381c8994c: function(arg0, arg1) {
      const ret = arg0.then(arg1);
      return ret;
    },
    __wbg_toString_6bb93e4c281b55a5: function(arg0) {
      const ret = arg0.toString();
      return ret;
    },
    __wbg_toString_891d991e862e1d44: function(arg0) {
      const ret = arg0.toString();
      return ret;
    },
    __wbg_transaction_904b9a3920efb0b5: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = arg0.transaction(arg1, __wbindgen_enum_IdbTransactionMode[arg2]);
        return ret;
      }, arguments);
    },
    __wbg_transaction_9c41d998bb80d12a: function(arg0) {
      const ret = arg0.transaction;
      return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    },
    __wbg_unique_ae0d9cc0f38a6784: function(arg0) {
      const ret = arg0.unique;
      return ret;
    },
    __wbg_url_95d8a83d33709572: function(arg0, arg1) {
      const ret = arg1.url;
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg_url_fa6a0c3c3dd41ac6: function(arg0, arg1) {
      const ret = arg1.url;
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg_value_7f6052747ccf940f: function(arg0) {
      const ret = arg0.value;
      return ret;
    },
    __wbg_versions_276b2795b1c6a219: function(arg0) {
      const ret = arg0.versions;
      return ret;
    },
    __wbg_wasmwallet_new: function(arg0) {
      const ret = WasmWallet.__wrap(arg0);
      return ret;
    },
    __wbindgen_cast_0000000000000001: function(arg0, arg1) {
      const ret = makeMutClosure(arg0, arg1, wasm_bindgen__convert__closures_____invoke__hf88681ae9b4e1a18);
      return ret;
    },
    __wbindgen_cast_0000000000000002: function(arg0, arg1) {
      const ret = makeMutClosure(arg0, arg1, wasm_bindgen__convert__closures_____invoke__h7223e63f08e0ef48);
      return ret;
    },
    __wbindgen_cast_0000000000000003: function(arg0, arg1) {
      const ret = makeMutClosure(arg0, arg1, wasm_bindgen__convert__closures_____invoke__h4a7386c88bbd181c);
      return ret;
    },
    __wbindgen_cast_0000000000000004: function(arg0, arg1) {
      const ret = makeMutClosure(arg0, arg1, wasm_bindgen__convert__closures_____invoke__h3e36e4d4648c49de);
      return ret;
    },
    __wbindgen_cast_0000000000000005: function(arg0, arg1) {
      const ret = makeMutClosure(arg0, arg1, wasm_bindgen__convert__closures_____invoke__hdcfa8eb8ea27aba6);
      return ret;
    },
    __wbindgen_cast_0000000000000006: function(arg0) {
      const ret = arg0;
      return ret;
    },
    __wbindgen_cast_0000000000000007: function(arg0) {
      const ret = arg0;
      return ret;
    },
    __wbindgen_cast_0000000000000008: function(arg0, arg1) {
      const ret = getArrayU8FromWasm0(arg0, arg1);
      return ret;
    },
    __wbindgen_cast_0000000000000009: function(arg0, arg1) {
      const ret = getStringFromWasm0(arg0, arg1);
      return ret;
    },
    __wbindgen_cast_000000000000000a: function(arg0) {
      const ret = BigInt.asUintN(64, arg0);
      return ret;
    },
    __wbindgen_init_externref_table: function() {
      const table = wasm.__wbindgen_externrefs;
      const offset = table.grow(4);
      table.set(0, void 0);
      table.set(offset + 0, void 0);
      table.set(offset + 1, null);
      table.set(offset + 2, true);
      table.set(offset + 3, false);
    }
  };
  return {
    __proto__: null,
    "./rgb_lib_wasm_bindings_bg.js": import0
  };
}
function wasm_bindgen__convert__closures_____invoke__h3e36e4d4648c49de(arg0, arg1) {
  wasm.wasm_bindgen__convert__closures_____invoke__h3e36e4d4648c49de(arg0, arg1);
}
function wasm_bindgen__convert__closures_____invoke__hdcfa8eb8ea27aba6(arg0, arg1) {
  wasm.wasm_bindgen__convert__closures_____invoke__hdcfa8eb8ea27aba6(arg0, arg1);
}
function wasm_bindgen__convert__closures_____invoke__h7223e63f08e0ef48(arg0, arg1, arg2) {
  wasm.wasm_bindgen__convert__closures_____invoke__h7223e63f08e0ef48(arg0, arg1, arg2);
}
function wasm_bindgen__convert__closures_____invoke__h4a7386c88bbd181c(arg0, arg1, arg2) {
  wasm.wasm_bindgen__convert__closures_____invoke__h4a7386c88bbd181c(arg0, arg1, arg2);
}
function wasm_bindgen__convert__closures_____invoke__hf88681ae9b4e1a18(arg0, arg1, arg2) {
  const ret = wasm.wasm_bindgen__convert__closures_____invoke__hf88681ae9b4e1a18(arg0, arg1, arg2);
  if (ret[1]) {
    throw takeFromExternrefTable0(ret[0]);
  }
}
function wasm_bindgen__convert__closures_____invoke__ha2bf463ed4ed0af5(arg0, arg1, arg2, arg3) {
  wasm.wasm_bindgen__convert__closures_____invoke__ha2bf463ed4ed0af5(arg0, arg1, arg2, arg3);
}
function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc();
  wasm.__wbindgen_externrefs.set(idx, obj);
  return idx;
}
function debugString(val) {
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches && builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    return toString.call(val);
  }
  if (className == "Object") {
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  if (val instanceof Error) {
    return `${val.name}: ${val.message}
${val.stack}`;
  }
  return className;
}
function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
function getDataViewMemory0() {
  if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return decodeText(ptr, len);
}
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    const idx = addToExternrefTable0(e);
    wasm.__wbindgen_exn_store(idx);
  }
}
function isLikeNone(x) {
  return x === void 0 || x === null;
}
function makeMutClosure(arg0, arg1, f) {
  const state = { a: arg0, b: arg1, cnt: 1 };
  const real = (...args) => {
    state.cnt++;
    const a = state.a;
    state.a = 0;
    try {
      return f(a, state.b, ...args);
    } finally {
      state.a = a;
      real._wbg_cb_unref();
    }
  };
  real._wbg_cb_unref = () => {
    if (--state.cnt === 0) {
      wasm.__wbindgen_destroy_closure(state.a, state.b);
      state.a = 0;
      CLOSURE_DTORS.unregister(state);
    }
  };
  CLOSURE_DTORS.register(real, state, state);
  return real;
}
function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8ArrayMemory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8ArrayMemory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127) break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = cachedTextEncoder.encodeInto(arg, view);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_externrefs.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}
function decodeText(ptr, len) {
  numBytesDecoded += len;
  if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
    cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
    cachedTextDecoder.decode();
    numBytesDecoded = len;
  }
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
function __wbg_finalize_init(instance, module2) {
  wasm = instance.exports;
  wasmModule = module2;
  cachedDataViewMemory0 = null;
  cachedUint8ArrayMemory0 = null;
  wasm.__wbindgen_start();
  return wasm;
}
async function __wbg_load(module2, imports) {
  if (typeof Response === "function" && module2 instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module2, imports);
      } catch (e) {
        const validResponse = module2.ok && expectedResponseType(module2.type);
        if (validResponse && module2.headers.get("Content-Type") !== "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module2.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module2, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module: module2 };
    } else {
      return instance;
    }
  }
  function expectedResponseType(type) {
    switch (type) {
      case "basic":
      case "cors":
      case "default":
        return true;
    }
    return false;
  }
}
function initSync(module2) {
  if (wasm !== void 0) return wasm;
  if (module2 !== void 0) {
    if (Object.getPrototypeOf(module2) === Object.prototype) {
      ({ module: module2 } = module2);
    } else {
      console.warn("using deprecated parameters for `initSync()`; pass a single object instead");
    }
  }
  const imports = __wbg_get_imports();
  if (!(module2 instanceof WebAssembly.Module)) {
    module2 = new WebAssembly.Module(module2);
  }
  const instance = new WebAssembly.Instance(module2, imports);
  return __wbg_finalize_init(instance, module2);
}
async function __wbg_init(module_or_path) {
  if (wasm !== void 0) return wasm;
  if (module_or_path !== void 0) {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ({ module_or_path } = module_or_path);
    } else {
      console.warn("using deprecated parameters for the initialization function; pass a single object instead");
    }
  }
  if (module_or_path === void 0) {
    module_or_path = new URL("rgb_lib_wasm_bindings_bg.wasm", import.meta.url);
  }
  const imports = __wbg_get_imports();
  if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) {
    module_or_path = fetch(module_or_path);
  }
  const { instance, module: module2 } = await __wbg_load(await module_or_path, imports);
  return __wbg_finalize_init(instance, module2);
}
var WasmInvoice, WasmWallet, __wbindgen_enum_IdbTransactionMode, __wbindgen_enum_RequestCache, __wbindgen_enum_RequestCredentials, __wbindgen_enum_RequestMode, WasmInvoiceFinalization, WasmWalletFinalization, CLOSURE_DTORS, cachedDataViewMemory0, cachedUint8ArrayMemory0, cachedTextDecoder, MAX_SAFARI_DECODE_BYTES, numBytesDecoded, cachedTextEncoder, WASM_VECTOR_LEN, wasmModule, wasm;
var init_rgb_lib_wasm_bindings = __esm({
  "node_modules/@utexo/rgb-lib-wasm/rgb_lib_wasm_bindings.js"() {
    init_buffer_shim();
    WasmInvoice = class {
      __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmInvoiceFinalization.unregister(this);
        return ptr;
      }
      free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasminvoice_free(ptr, 0);
      }
      /**
       * Return the parsed invoice data as a JS object.
       * @returns {any}
       */
      invoiceData() {
        const ret = wasm.wasminvoice_invoiceData(this.__wbg_ptr);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      /**
       * Return the original invoice string.
       * @returns {string}
       */
      invoiceString() {
        let deferred1_0;
        let deferred1_1;
        try {
          const ret = wasm.wasminvoice_invoiceString(this.__wbg_ptr);
          deferred1_0 = ret[0];
          deferred1_1 = ret[1];
          return getStringFromWasm0(ret[0], ret[1]);
        } finally {
          wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
      }
      /**
       * Parse an RGB invoice string. Throws if the string is not a valid RGB invoice.
       * @param {string} invoice_string
       */
      constructor(invoice_string) {
        const ptr0 = passStringToWasm0(invoice_string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasminvoice_new(ptr0, len0);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        WasmInvoiceFinalization.register(this, this.__wbg_ptr, this);
        return this;
      }
    };
    if (Symbol.dispose) WasmInvoice.prototype[Symbol.dispose] = WasmInvoice.prototype.free;
    WasmWallet = class _WasmWallet {
      static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(_WasmWallet.prototype);
        obj.__wbg_ptr = ptr;
        WasmWalletFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
      }
      __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmWalletFinalization.unregister(this);
        return ptr;
      }
      free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmwallet_free(ptr, 0);
      }
      /**
       * Create an encrypted backup of the wallet state. Returns backup bytes as Uint8Array.
       * @param {string} password
       * @returns {Uint8Array}
       */
      backup(password) {
        const ptr0 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_backup(this.__wbg_ptr, ptr0, len0);
        if (ret[3]) {
          throw takeFromExternrefTable0(ret[2]);
        }
        var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v2;
      }
      /**
       * Check if the wallet needs a backup. Returns true if modified since last backup.
       * @returns {boolean}
       */
      backupInfo() {
        const ret = wasm.wasmwallet_backupInfo(this.__wbg_ptr);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
      }
      /**
       * Blind an UTXO to receive RGB assets. Returns ReceiveData as a JS object.
       *
       * `assignment_js` is a JS object like `{ "Fungible": 100 }` or `"NonFungible"` or `"Any"`.
       * `transport_endpoints_js` is a JS array of endpoint strings.
       * @param {string | null | undefined} asset_id
       * @param {any} assignment_js
       * @param {number | null | undefined} duration_seconds
       * @param {any} transport_endpoints_js
       * @param {number} min_confirmations
       * @returns {any}
       */
      blindReceive(asset_id, assignment_js, duration_seconds, transport_endpoints_js, min_confirmations) {
        var ptr0 = isLikeNone(asset_id) ? 0 : passStringToWasm0(asset_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_blindReceive(this.__wbg_ptr, ptr0, len0, assignment_js, isLikeNone(duration_seconds) ? 4294967297 : duration_seconds >>> 0, transport_endpoints_js, min_confirmations);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      /**
       * Configure VSS (cloud) backup for this wallet.
       *
       * `signing_key_hex` is the 32-byte secret key as a hex string (64 hex chars).
       *
       * **Security note:** The signing key crosses the JS/WASM boundary as a string. It will
       * exist in V8's string pool and cannot be zeroed from Rust. Callers should avoid storing
       * the key in JS longer than necessary (e.g., don't keep it in a global variable).
       * @param {string} server_url
       * @param {string} store_id
       * @param {string} signing_key_hex
       */
      configureVssBackup(server_url, store_id, signing_key_hex) {
        const ptr0 = passStringToWasm0(server_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(store_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(signing_key_hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_configureVssBackup(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        if (ret[1]) {
          throw takeFromExternrefTable0(ret[0]);
        }
      }
      /**
       * Create a new RGB wallet with IndexedDB state restoration.
       *
       * Like `new()`, but asynchronously checks IndexedDB for a previously saved
       * snapshot and restores it, so wallet state survives page refreshes.
       * @param {string} wallet_data_json
       * @returns {Promise<WasmWallet>}
       */
      static create(wallet_data_json) {
        const ptr0 = passStringToWasm0(wallet_data_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_create(ptr0, len0);
        return ret;
      }
      /**
       * Create UTXOs (begin): prepare a PSBT to create new UTXOs for RGB allocations.
       * Returns the unsigned PSBT string.
       * @param {any} online_js
       * @param {boolean} up_to
       * @param {number | null | undefined} num
       * @param {number | null | undefined} size
       * @param {bigint} fee_rate
       * @param {boolean} skip_sync
       * @returns {Promise<string>}
       */
      createUtxosBegin(online_js, up_to, num, size, fee_rate, skip_sync) {
        const ret = wasm.wasmwallet_createUtxosBegin(this.__wbg_ptr, online_js, up_to, isLikeNone(num) ? 16777215 : num, isLikeNone(size) ? 4294967297 : size >>> 0, fee_rate, skip_sync);
        return ret;
      }
      /**
       * Create UTXOs (end): broadcast a signed PSBT to create new UTXOs.
       * Returns the number of created UTXOs.
       * @param {any} online_js
       * @param {string} signed_psbt
       * @param {boolean} skip_sync
       * @returns {Promise<number>}
       */
      createUtxosEnd(online_js, signed_psbt, skip_sync) {
        const ptr0 = passStringToWasm0(signed_psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_createUtxosEnd(this.__wbg_ptr, online_js, ptr0, len0, skip_sync);
        return ret;
      }
      /**
       * Delete failed transfers. Returns true if any were deleted.
       * @param {number | null | undefined} batch_transfer_idx
       * @param {boolean} no_asset_only
       * @returns {boolean}
       */
      deleteTransfers(batch_transfer_idx, no_asset_only) {
        const ret = wasm.wasmwallet_deleteTransfers(this.__wbg_ptr, isLikeNone(batch_transfer_idx) ? 4294967297 : batch_transfer_idx >> 0, no_asset_only);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
      }
      /**
       * Disable VSS (cloud) backup.
       */
      disableVssBackup() {
        wasm.wasmwallet_disableVssBackup(this.__wbg_ptr);
      }
      /**
       * Drain all wallet funds (begin): prepare a PSBT. Returns the unsigned PSBT string.
       * @param {any} online_js
       * @param {string} address
       * @param {boolean} destroy_assets
       * @param {bigint} fee_rate
       * @returns {Promise<string>}
       */
      drainToBegin(online_js, address, destroy_assets, fee_rate) {
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_drainToBegin(this.__wbg_ptr, online_js, ptr0, len0, destroy_assets, fee_rate);
        return ret;
      }
      /**
       * Drain all wallet funds (end): broadcast a signed PSBT. Returns the txid string.
       * @param {any} online_js
       * @param {string} signed_psbt
       * @returns {Promise<string>}
       */
      drainToEnd(online_js, signed_psbt) {
        const ptr0 = passStringToWasm0(signed_psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_drainToEnd(this.__wbg_ptr, online_js, ptr0, len0);
        return ret;
      }
      /**
       * Fail pending transfers. Returns true if any transfers were failed.
       * @param {any} online_js
       * @param {number | null | undefined} batch_transfer_idx
       * @param {boolean} no_asset_only
       * @param {boolean} skip_sync
       * @returns {Promise<boolean>}
       */
      failTransfers(online_js, batch_transfer_idx, no_asset_only, skip_sync) {
        const ret = wasm.wasmwallet_failTransfers(this.__wbg_ptr, online_js, isLikeNone(batch_transfer_idx) ? 4294967297 : batch_transfer_idx >> 0, no_asset_only, skip_sync);
        return ret;
      }
      /**
       * Finalize a signed PSBT (base64-encoded). Returns the finalized PSBT string.
       * @param {string} signed_psbt
       * @returns {string}
       */
      finalizePsbt(signed_psbt) {
        let deferred3_0;
        let deferred3_1;
        try {
          const ptr0 = passStringToWasm0(signed_psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len0 = WASM_VECTOR_LEN;
          const ret = wasm.wasmwallet_finalizePsbt(this.__wbg_ptr, ptr0, len0);
          var ptr2 = ret[0];
          var len2 = ret[1];
          if (ret[3]) {
            ptr2 = 0;
            len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
          }
          deferred3_0 = ptr2;
          deferred3_1 = len2;
          return getStringFromWasm0(ptr2, len2);
        } finally {
          wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
      }
      /**
       * Durably persist current wallet state to IndexedDB.
       * @returns {Promise<void>}
       */
      flush() {
        const ret = wasm.wasmwallet_flush(this.__wbg_ptr);
        return ret;
      }
      /**
       * Run a BIP44 stop-gap full scan against the indexer.
       *
       * Rebuilds a thin BDK state (no revealed SPKs) after a restore, recovering the BTC balance
       * when an incremental `sync` cannot.
       * @param {any} online_js
       * @returns {Promise<void>}
       */
      fullScan(online_js) {
        const ret = wasm.wasmwallet_fullScan(this.__wbg_ptr, online_js);
        return ret;
      }
      /**
       * Return a new Bitcoin address from the vanilla wallet.
       * @returns {string}
       */
      getAddress() {
        let deferred2_0;
        let deferred2_1;
        try {
          const ret = wasm.wasmwallet_getAddress(this.__wbg_ptr);
          var ptr1 = ret[0];
          var len1 = ret[1];
          if (ret[3]) {
            ptr1 = 0;
            len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
          }
          deferred2_0 = ptr1;
          deferred2_1 = len1;
          return getStringFromWasm0(ptr1, len1);
        } finally {
          wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
      }
      /**
       * Return the balance for a specific asset.
       * @param {string} asset_id
       * @returns {any}
       */
      getAssetBalance(asset_id) {
        const ptr0 = passStringToWasm0(asset_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_getAssetBalance(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      /**
       * Return metadata for a specific asset (name, ticker, precision, supply, etc.).
       * @param {string} asset_id
       * @returns {any}
       */
      getAssetMetadata(asset_id) {
        const ptr0 = passStringToWasm0(asset_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_getAssetMetadata(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      /**
       * Return the BTC balance. Always skips sync on wasm32.
       * @returns {any}
       */
      getBtcBalance() {
        const ret = wasm.wasmwallet_getBtcBalance(this.__wbg_ptr);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      /**
       * Get fee estimation for a target number of blocks.
       * @param {any} online_js
       * @param {number} blocks
       * @returns {Promise<number>}
       */
      getFeeEstimation(online_js, blocks) {
        const ret = wasm.wasmwallet_getFeeEstimation(this.__wbg_ptr, online_js, blocks);
        return ret;
      }
      /**
       * Return the WalletData as a JS object.
       * @returns {any}
       */
      getWalletData() {
        const ret = wasm.wasmwallet_getWalletData(this.__wbg_ptr);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      /**
       * Go online: connect to an indexer. Returns Online data as a JS object.
       * @param {boolean} skip_consistency_check
       * @param {string} indexer_url
       * @returns {Promise<any>}
       */
      goOnline(skip_consistency_check, indexer_url) {
        const ptr0 = passStringToWasm0(indexer_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_goOnline(this.__wbg_ptr, skip_consistency_check, ptr0, len0);
        return ret;
      }
      /**
       * Inflate an IFA asset (begin): prepare a PSBT. Returns the unsigned PSBT string.
       *
       * `inflation_amounts_js` is a JS array of u64 values.
       * @param {any} online_js
       * @param {string} asset_id
       * @param {any} inflation_amounts_js
       * @param {bigint} fee_rate
       * @param {number} min_confirmations
       * @returns {Promise<string>}
       */
      inflateBegin(online_js, asset_id, inflation_amounts_js, fee_rate, min_confirmations) {
        const ptr0 = passStringToWasm0(asset_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_inflateBegin(this.__wbg_ptr, online_js, ptr0, len0, inflation_amounts_js, fee_rate, min_confirmations);
        return ret;
      }
      /**
       * Inflate an IFA asset (end): broadcast a signed PSBT. Returns an OperationResult JS object.
       * @param {any} online_js
       * @param {string} signed_psbt
       * @returns {Promise<any>}
       */
      inflateEnd(online_js, signed_psbt) {
        const ptr0 = passStringToWasm0(signed_psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_inflateEnd(this.__wbg_ptr, online_js, ptr0, len0);
        return ret;
      }
      /**
       * Issue a new IFA (Inflatable Fungible Asset).
       *
       * `amounts_js` is a JS array of u64 values.
       * `inflation_amounts_js` is a JS array of u64 values for inflation allowances.
       * @param {string} ticker
       * @param {string} name
       * @param {number} precision
       * @param {any} amounts_js
       * @param {any} inflation_amounts_js
       * @param {string | null} [reject_list_url]
       * @returns {any}
       */
      issueAssetIfa(ticker, name, precision, amounts_js, inflation_amounts_js, reject_list_url) {
        const ptr0 = passStringToWasm0(ticker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(reject_list_url) ? 0 : passStringToWasm0(reject_list_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_issueAssetIfa(this.__wbg_ptr, ptr0, len0, ptr1, len1, precision, amounts_js, inflation_amounts_js, ptr2, len2);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      /**
       * Issue a new NIA (Non-Inflatable Asset).
       *
       * `amounts_js` is a JS array of u64 values.
       * @param {string} ticker
       * @param {string} name
       * @param {number} precision
       * @param {any} amounts_js
       * @returns {any}
       */
      issueAssetNia(ticker, name, precision, amounts_js) {
        const ptr0 = passStringToWasm0(ticker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_issueAssetNia(this.__wbg_ptr, ptr0, len0, ptr1, len1, precision, amounts_js);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      /**
       * List known RGB assets. Pass a JS array of schema strings to filter, or empty for all.
       * @param {any} filter_asset_schemas_js
       * @returns {any}
       */
      listAssets(filter_asset_schemas_js) {
        const ret = wasm.wasmwallet_listAssets(this.__wbg_ptr, filter_asset_schemas_js);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      /**
       * List Bitcoin transactions. Always skips sync on wasm32.
       * @returns {any}
       */
      listTransactions() {
        const ret = wasm.wasmwallet_listTransactions(this.__wbg_ptr);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      /**
       * List RGB transfers, optionally filtered by asset ID.
       * @param {string | null} [asset_id]
       * @returns {any}
       */
      listTransfers(asset_id) {
        var ptr0 = isLikeNone(asset_id) ? 0 : passStringToWasm0(asset_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_listTransfers(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      /**
       * List unspent outputs. Always skips sync on wasm32.
       * @param {boolean} settled_only
       * @returns {any}
       */
      listUnspents(settled_only) {
        const ret = wasm.wasmwallet_listUnspents(this.__wbg_ptr, settled_only);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      /**
       * List vanilla (non-colored) unspent outputs. Returns a JS array of LocalOutput objects.
       * @param {any} online_js
       * @param {number} min_confirmations
       * @param {boolean} skip_sync
       * @returns {Promise<any>}
       */
      listUnspentsVanilla(online_js, min_confirmations, skip_sync) {
        const ret = wasm.wasmwallet_listUnspentsVanilla(this.__wbg_ptr, online_js, min_confirmations, skip_sync);
        return ret;
      }
      /**
       * Create a new RGB wallet from a JSON-encoded WalletData.
       * @param {string} wallet_data_json
       */
      constructor(wallet_data_json) {
        const ptr0 = passStringToWasm0(wallet_data_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_new(ptr0, len0);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        WasmWalletFinalization.register(this, this.__wbg_ptr, this);
        return this;
      }
      /**
       * Refresh pending transfers. Returns a RefreshResult JS object.
       *
       * `filter_js` is a JS array of RefreshFilter objects (or empty array for all).
       * @param {any} online_js
       * @param {string | null | undefined} asset_id
       * @param {any} filter_js
       * @param {boolean} skip_sync
       * @returns {Promise<any>}
       */
      refresh(online_js, asset_id, filter_js, skip_sync) {
        var ptr0 = isLikeNone(asset_id) ? 0 : passStringToWasm0(asset_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_refresh(this.__wbg_ptr, online_js, ptr0, len0, filter_js, skip_sync);
        return ret;
      }
      /**
       * Restore wallet state from an encrypted backup.
       * @param {Uint8Array} backup_bytes
       * @param {string} password
       */
      restoreBackup(backup_bytes, password) {
        const ptr0 = passArray8ToWasm0(backup_bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_restoreBackup(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        if (ret[1]) {
          throw takeFromExternrefTable0(ret[0]);
        }
      }
      /**
       * Rotate the pinned address for the given keychain.
       * keychain: 0 = External (colored), 1 = Internal (vanilla)
       * @param {number} keychain
       * @returns {string}
       */
      rotateAddress(keychain) {
        let deferred2_0;
        let deferred2_1;
        try {
          const ret = wasm.wasmwallet_rotateAddress(this.__wbg_ptr, keychain);
          var ptr1 = ret[0];
          var len1 = ret[1];
          if (ret[3]) {
            ptr1 = 0;
            len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
          }
          deferred2_0 = ptr1;
          deferred2_1 = len1;
          return getStringFromWasm0(ptr1, len1);
        } finally {
          wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
      }
      /**
       * Send RGB assets (begin): prepare a PSBT. Returns the unsigned PSBT string.
       *
       * `recipient_map_js` is a JS object mapping asset IDs to arrays of Recipient objects.
       * @param {any} online_js
       * @param {any} recipient_map_js
       * @param {boolean} donation
       * @param {bigint} fee_rate
       * @param {number} min_confirmations
       * @param {number | null} [lock_time]
       * @returns {Promise<string>}
       */
      sendBegin(online_js, recipient_map_js, donation, fee_rate, min_confirmations, lock_time) {
        const ret = wasm.wasmwallet_sendBegin(this.__wbg_ptr, online_js, recipient_map_js, donation, fee_rate, min_confirmations, isLikeNone(lock_time) ? 4294967297 : lock_time >>> 0);
        return ret;
      }
      /**
       * Send BTC (begin): prepare a PSBT. Returns the unsigned PSBT string.
       * @param {any} online_js
       * @param {string} address
       * @param {bigint} amount
       * @param {bigint} fee_rate
       * @param {boolean} skip_sync
       * @returns {Promise<string>}
       */
      sendBtcBegin(online_js, address, amount, fee_rate, skip_sync) {
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_sendBtcBegin(this.__wbg_ptr, online_js, ptr0, len0, amount, fee_rate, skip_sync);
        return ret;
      }
      /**
       * Send BTC (end): broadcast a signed PSBT. Returns the txid string.
       * @param {any} online_js
       * @param {string} signed_psbt
       * @param {boolean} skip_sync
       * @returns {Promise<string>}
       */
      sendBtcEnd(online_js, signed_psbt, skip_sync) {
        const ptr0 = passStringToWasm0(signed_psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_sendBtcEnd(this.__wbg_ptr, online_js, ptr0, len0, skip_sync);
        return ret;
      }
      /**
       * Send RGB assets (end): broadcast a signed PSBT. Returns an OperationResult JS object.
       * @param {any} online_js
       * @param {string} signed_psbt
       * @param {boolean} skip_sync
       * @returns {Promise<any>}
       */
      sendEnd(online_js, signed_psbt, skip_sync) {
        const ptr0 = passStringToWasm0(signed_psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_sendEnd(this.__wbg_ptr, online_js, ptr0, len0, skip_sync);
        return ret;
      }
      /**
       * Sign a PSBT (base64-encoded). Returns the signed PSBT string.
       * @param {string} unsigned_psbt
       * @returns {string}
       */
      signPsbt(unsigned_psbt) {
        let deferred3_0;
        let deferred3_1;
        try {
          const ptr0 = passStringToWasm0(unsigned_psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len0 = WASM_VECTOR_LEN;
          const ret = wasm.wasmwallet_signPsbt(this.__wbg_ptr, ptr0, len0);
          var ptr2 = ret[0];
          var len2 = ret[1];
          if (ret[3]) {
            ptr2 = 0;
            len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
          }
          deferred3_0 = ptr2;
          deferred3_1 = len2;
          return getStringFromWasm0(ptr2, len2);
        } finally {
          wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
      }
      /**
       * Sync the wallet with the indexer.
       *
       * Incremental: re-queries only already-revealed SPKs. Use `fullScan` to recover a thin
       * restored state.
       * @param {any} online_js
       * @returns {Promise<void>}
       */
      sync(online_js) {
        const ret = wasm.wasmwallet_sync(this.__wbg_ptr, online_js);
        return ret;
      }
      /**
       * Upload an encrypted backup to the configured VSS server. Returns the server version.
       * @returns {Promise<any>}
       */
      vssBackup() {
        const ret = wasm.wasmwallet_vssBackup(this.__wbg_ptr);
        return ret;
      }
      /**
       * Query VSS backup status. Returns { backup_exists, server_version, backup_required }.
       * @returns {Promise<any>}
       */
      vssBackupInfo() {
        const ret = wasm.wasmwallet_vssBackupInfo(this.__wbg_ptr);
        return ret;
      }
      /**
       * Download and restore wallet state from VSS server.
       * @returns {Promise<void>}
       */
      vssRestoreBackup() {
        const ret = wasm.wasmwallet_vssRestoreBackup(this.__wbg_ptr);
        return ret;
      }
      /**
       * Create an address to receive RGB assets via witness TX. Returns ReceiveData as a JS object.
       * @param {string | null | undefined} asset_id
       * @param {any} assignment_js
       * @param {number | null | undefined} duration_seconds
       * @param {any} transport_endpoints_js
       * @param {number} min_confirmations
       * @returns {any}
       */
      witnessReceive(asset_id, assignment_js, duration_seconds, transport_endpoints_js, min_confirmations) {
        var ptr0 = isLikeNone(asset_id) ? 0 : passStringToWasm0(asset_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_witnessReceive(this.__wbg_ptr, ptr0, len0, assignment_js, isLikeNone(duration_seconds) ? 4294967297 : duration_seconds >>> 0, transport_endpoints_js, min_confirmations);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
    };
    if (Symbol.dispose) WasmWallet.prototype[Symbol.dispose] = WasmWallet.prototype.free;
    __wbindgen_enum_IdbTransactionMode = ["readonly", "readwrite", "versionchange", "readwriteflush", "cleanup"];
    __wbindgen_enum_RequestCache = ["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"];
    __wbindgen_enum_RequestCredentials = ["omit", "same-origin", "include"];
    __wbindgen_enum_RequestMode = ["same-origin", "no-cors", "cors", "navigate"];
    WasmInvoiceFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
    }, unregister: () => {
    } } : new FinalizationRegistry((ptr) => wasm.__wbg_wasminvoice_free(ptr >>> 0, 1));
    WasmWalletFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
    }, unregister: () => {
    } } : new FinalizationRegistry((ptr) => wasm.__wbg_wasmwallet_free(ptr >>> 0, 1));
    CLOSURE_DTORS = typeof FinalizationRegistry === "undefined" ? { register: () => {
    }, unregister: () => {
    } } : new FinalizationRegistry((state) => wasm.__wbindgen_destroy_closure(state.a, state.b));
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
    cachedTextDecoder.decode();
    MAX_SAFARI_DECODE_BYTES = 2146435072;
    numBytesDecoded = 0;
    cachedTextEncoder = new TextEncoder();
    if (!("encodeInto" in cachedTextEncoder)) {
      cachedTextEncoder.encodeInto = function(arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length
        };
      };
    }
    WASM_VECTOR_LEN = 0;
  }
});

// index.js
init_buffer_shim();

// src/wallet-manager-rgb.js
init_buffer_shim();

// node_modules/@tetherto/wdk-wallet/index.js
init_buffer_shim();

// node_modules/@tetherto/wdk-wallet/src/wallet-manager.js
init_buffer_shim();
var bip39 = __toESM(require_src(), 1);

// node_modules/@tetherto/wdk-wallet/src/errors.js
init_buffer_shim();
var WdkError = class extends Error {
  /**
   * Creates a new wallet development kit error.
   *
   * @param {string} message - The error's message.
   * @param {ErrorOptions} [options] - The error's options.
   */
  constructor(message, options) {
    super(message, options);
    this.name = "WdkError";
  }
};
var NotImplementedError = class extends WdkError {
  /**
   * Creates a new not implemented error.
   *
   * @param {string} methodName - The method's name.
   */
  constructor(methodName) {
    super(`Method '${methodName}' is not implemented.`);
    this.name = "NotImplementedError";
  }
};
var AssertionError = class extends WdkError {
  /**
   * Creates a new assertion error.
   *
   * @param {string} message - The error's message.
   */
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
};
var UnsupportedOperationError = class extends WdkError {
  /**
   * Creates a new unsupported operation error.
   *
   * @param {string} method - The method's name.
   */
  constructor(method) {
    super(`Method '${method}' is not supported.`);
    this.name = "UnsupportedOperationError";
  }
};
var ValueError = class extends WdkError {
  /**
   * Creates a new value error.
   *
   * @param {string} message - The error's message.
   * @param {ErrorOptions} [options] - The error's options.
   */
  constructor(message, options) {
    super(message, options);
    this.name = "ValueError";
  }
};
var NoSuchElementError = class extends WdkError {
  /**
   * Creates a new no such element error.
   *
   * @param {string} message - The error's message.
   * @param {ErrorOptions} [options] - The error's options.
   */
  constructor(message, options) {
    super(message, options);
    this.name = "NoSuchElementError";
  }
};
var ProviderError = class extends WdkError {
  /**
   * Creates a new provider error.
   *
   * @param {string} message - The error's message.
   * @param {ProviderErrorOptions & ErrorOptions} options - The error's options.
   */
  constructor(message, options) {
    super(message, options);
    this.name = "ProviderError";
    this.reason = options.reason;
  }
};
var TimeoutError = class extends WdkError {
  /**
   * Create a new timeout error.
   *
   * @param {string} message - The error's message.
   */
  constructor(message) {
    super(message);
    this.name = "TimeoutError";
  }
};

// node_modules/@tetherto/wdk-wallet/src/wallet-manager.js
var WalletManager = class _WalletManager {
  /**
   * Creates a new wallet manager from a seed.
   *
   * @overload
   * @param {string | Uint8Array} seed - A BIP-39 mnemonic seed phrase, or a raw BIP-32 master seed (16-64 bytes).
   * @param {WalletConfig} [config] - The wallet configuration.
   * @throws {ValueError} If the seed is not a valid seed or BIP-39 seed phrase.
   */
  /**
   * Creates a new wallet manager from a default signer.
   *
   * @overload
   * @param {ISigner} signer - The default signer.
   * @param {WalletConfig} [config] - The wallet configuration.
   * @throws {InvalidSignerError} If the given signer doesn't support account derivation.
   */
  constructor(seedOrSigner, config = {}) {
    if (typeof seedOrSigner === "string") {
      if (!_WalletManager.isValidSeedPhrase(seedOrSigner)) {
        throw new ValueError("Invalid seed phrase.");
      }
      seedOrSigner = bip39.mnemonicToSeedSync(seedOrSigner);
    }
    const isSeed = seedOrSigner instanceof Uint8Array;
    this._seed = isSeed ? seedOrSigner : void 0;
    this._defaultSigner = isSeed ? void 0 : seedOrSigner;
    this._signers = {};
    this._accounts = {};
    this._config = config;
  }
  /**
   * Returns a random [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) seed phrase.
   *
   * @param {12 | 24} [wordCount] - The number of words in the seed phrase (default: 12).
   * @returns {string} The seed phrase.
   */
  static getRandomSeedPhrase(wordCount = 12) {
    const strength = wordCount === 12 ? 128 : 256;
    return bip39.generateMnemonic(strength);
  }
  /**
   * Checks if a seed phrase is valid.
   *
   * @param {string} seedPhrase - The seed phrase.
   * @returns {boolean} True if the seed phrase is valid.
   */
  static isValidSeedPhrase(seedPhrase) {
    return bip39.validateMnemonic(seedPhrase);
  }
  /**
   * The seed of the wallet.
   *
   * @type {Uint8Array | undefined}
   */
  get seed() {
    return this._seed;
  }
  /**
   * Registers a signer with the given name.
   *
   * @param {string} signerName - The signer name.
   * @param {ISigner} signer - The signer.
   * @returns {WalletManager} The wallet manager.
   * @throws {ValueError} If the signer name is an empty or blank string.
   */
  addSigner(signerName, signer) {
    if (!signerName.trim()) {
      throw new ValueError("The signer name cannot be an empty or blank string.");
    }
    this._signers[signerName] = signer;
    return this;
  }
  /**
   * Returns the default signer, or the signer with the given name.
   *
   * @param {string} [signerName] - If set, returns the signer with the given name.
   * @returns {ISigner} The signer.
   * @throws {NoSuchElementError} If the default signer is not set, or no signers are found for the given name.
   */
  getSigner(signerName) {
    if (signerName === void 0) {
      if (this._defaultSigner === void 0) {
        throw new NoSuchElementError("No default signer set.");
      }
      return this._defaultSigner;
    }
    const signer = this._signers[signerName];
    if (signer === void 0) {
      throw new NoSuchElementError(`No signer found with name "${signerName}".`);
    }
    return signer;
  }
  /**
   * Returns a shallow copy of the map of signers registered via {@link addSigner}.
   * The default signer is not included; use {@link getSigner} with no arguments
   * to retrieve it.
   *
   * @returns {Record<string, ISigner>} A map of signer names to signers. Empty if no signers have been registered.
   */
  getSigners() {
    return { ...this._signers };
  }
  /**
   * Returns the wallet account at a specific index (see [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)).
   *
   * @overload
   * @param {number} [index] - The index of the account to get (default: 0).
   * @param {Object} [options] - Account options.
   * @param {string} [options.signerName] - The signer name.
   * @returns {Promise<IWalletAccount>} The account.
   * @throws {ValueError} If the index is not valid.
   * @throws {NoSuchElementError} If a signer name is given but no signer exists with that name.
   * @throws {InvalidSignerError} If the signer doesn't support account derivation.
   */
  /**
   * Returns the wallet account associated with a registered signer. For
   * non-derivable signers (e.g., private-key signers), returns the signer's
   * single account. For derivable signers, returns the wallet account at the
   * signer's root, with no further derivation.
   *
   * @overload
   * @param {string} signerName - The signer name registered via {@link addSigner}.
   * @returns {Promise<IWalletAccount>} The account.
   * @throws {NoSuchElementError} If no signer exists with the given name.
   */
  /** @abstract */
  async getAccount(indexOrSignerName = 0, options = {}) {
    throw new NotImplementedError("getAccount(indexOrSignerName, options?)");
  }
  /**
   * Returns the wallet account at a specific [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) derivation path.
   *
   * @abstract
   * @param {string} path - The derivation path (e.g. "0'/0/0").
   * @param {Object} [options] - Account options.
   * @param {string} [options.signerName] - The signer name. Omit to use the default signer.
   * @returns {Promise<IWalletAccount>} The account.
   * @throws {ValueError} If the path is not valid.
   * @throws {NoSuchElementError} If a signer name is given but no signer exists with that name.
   * @throws {InvalidSignerError} If the signer doesn't support account derivation.
   */
  async getAccountByPath(path, options = {}) {
    throw new NotImplementedError("getAccountByPath(path, options?)");
  }
  /**
   * Returns the current fee rates.
   *
   * @abstract
   * @returns {Promise<FeeRates>} The fee rates (in base unit).
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch fee rates.
   */
  async getFeeRates() {
    throw new NotImplementedError("getFeeRates()");
  }
  /**
   * Disposes all wallet accounts and signers, clearing secret material from memory.
   */
  dispose() {
    for (const account of Object.values(this._accounts)) {
      if (account.keyPair?.privateKey) {
        account.dispose();
      }
    }
    this._defaultSigner?.dispose();
    for (const signer of Object.values(this._signers)) {
      signer.dispose();
    }
    this._accounts = {};
    this._defaultSigner = void 0;
    this._signers = {};
  }
};

// node_modules/@tetherto/wdk-wallet/src/wallet-account-read-only.js
init_buffer_shim();

// node_modules/@tetherto/wdk-wallet/src/wallet-account-read-only-simple.js
init_buffer_shim();

// node_modules/@tetherto/wdk-wallet/src/wallet-account-read-only.js
var FINALITY = {
  pending: 0,
  dropped: 1,
  confirmed: 2,
  final: 3
};
async function sleep(amount) {
  await new Promise((resolve) => setTimeout(resolve, amount));
}
var WalletAccountReadOnly = class {
  /**
   * The default poll cadence for {@link waitForTransaction}, in milliseconds,
   * applied when the caller doesn't provide an `interval`. Subclasses override
   * it to match their chain's block time.
   *
   * @type {number}
   */
  get defaultWaitInterval() {
    return 4e3;
  }
  /**
   * The default time budget for {@link waitForTransaction}, in milliseconds,
   * applied when the caller doesn't provide a `timeout`. Subclasses override it
   * to match their chain's finality expectations.
   *
   * @type {number}
   */
  get defaultWaitTimeout() {
    return 6e4;
  }
  /**
   * Creates a new read-only wallet account.
   *
   * @param {string} [address] - The account's address.
   */
  constructor(address) {
    this.__address = address;
  }
  /**
   * The account's address.
   *
   * @protected
   * @type {string | undefined}
   */
  get _address() {
    return this.__address;
  }
  /**
   * Returns the account's address.
   *
   * @returns {Promise<string>} The account's address.
   */
  async getAddress() {
    if (!this._address) {
      throw new AssertionError("The account's address must be set to perform this operation.");
    }
    return this._address;
  }
  /**
   * Verifies a message's signature.
   *
   * @param {string} message - The original message.
   * @param {string} signature - The signature to verify.
   * @returns {Promise<boolean>} True if the signature is valid.
   * @throws {UnsupportedOperationError} If the read-only wallet account class is not able to provide an implementation for the method.
   */
  async verify(message, signature) {
    throw new UnsupportedOperationError("verify(message, signature)");
  }
  /**
   * Returns the account's native token balance.
   *
   * @abstract
   * @returns {Promise<bigint>} The native token balance.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the account's balance.
   */
  async getBalance() {
    throw new NotImplementedError("getBalance()");
  }
  /**
   * Returns the account balance for a specific token.
   *
   * @abstract
   * @param {string} tokenAddress - The smart contract address of the token.
   * @returns {Promise<bigint>} The token balance.
   * @throws {ValueError} If the token's address is not valid.
   * @throws {InvalidTokenError} If the token's address doesn't match an existing ERC 20 token.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the account's token balance.
   */
  async getTokenBalance(tokenAddress) {
    throw new NotImplementedError("getTokenBalance(tokenAddress)");
  }
  /**
   * Quotes the costs of a send transaction operation.
   *
   * @abstract
   * @param {Transaction} tx - The transaction.
   * @returns {Promise<Omit<TransactionResult, 'hash'>>} The transaction's quotes.
   * @throws {ValueError} If the transaction is not valid.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the transaction.
   * @throws {TransactionError} If the transaction fails with an error.
   */
  async quoteSendTransaction(tx) {
    throw new NotImplementedError("quoteSendTransaction(tx)");
  }
  /**
   * Quotes the costs of a transfer operation.
   *
   * @abstract
   * @param {TransferOptions} options - The transfer's options.
   * @returns {Promise<Omit<TransferResult, 'hash'>>} The transfer's quotes.
   * @throws {ValueError} If the transfer options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the transfer.
   * @throws {TransferError} If the transfer fails with an error.
   */
  async quoteTransfer(options) {
    throw new NotImplementedError("quoteTransfer(options)");
  }
  /**
   * Returns a transaction's receipt.
   *
   * @deprecated Use {@link getTransaction} instead, which returns a normalized, finality-based receipt. The native receipt fields remain available on each module's extended return type.
   * @abstract
   * @param {string} hash - The transaction's hash.
   * @returns {Promise<unknown | null>} The receipt, or null if the transaction has not been included in a block yet.
   * @throws {ValueError} If the hash is not valid.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the transaction's receipt.
   */
  async getTransactionReceipt(hash) {
    throw new NotImplementedError("getTransactionReceipt(hash)");
  }
  /**
   * Returns a normalized, finality-based receipt for a transaction.
   *
   * @abstract
   * @param {string} hash - The transaction's identifier (hash / signature / lt:hash).
   * @returns {Promise<TransactionReceipt>} The normalized receipt.
   * @throws {ValueError} If the hash is not a valid identifier.
   * @throws {NoSuchElementError} If no transaction has been found for the given hash.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the transaction.
   */
  async getTransaction(hash) {
    throw new NotImplementedError("getTransaction(hash)");
  }
  /**
   * Blocks until a transaction reaches a terminal state (the requested finality
   * target or `dropped`), or times out.
   *
   * The polling loop and target resolution are chain-agnostic: this method only
   * interprets the normalized receipt returned by {@link getTransaction}. A
   * {@link NoSuchElementError} is treated as a transient not-found, so the loop
   * keeps polling until the timeout.
   *
   * @param {string} hash - The transaction's identifier.
   * @param {WaitForTransactionOptions} [options] - The wait options.
   * @returns {Promise<TransactionReceipt>} The terminal receipt: the finality target reached (inspect `success` to tell success from revert), or `dropped`.
   * @throws {ValueError} If the hash is not a valid identifier.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the transaction.
   * @throws {TimeoutError} If the operation times out.
   */
  async waitForTransaction(hash, options = {}) {
    const {
      target = "confirmed",
      interval = this.defaultWaitInterval,
      timeout = this.defaultWaitTimeout,
      maxPollErrors = 3
    } = options;
    const deadline = Date.now() + timeout;
    let droppedStreak = 0;
    let errorStreak = 0;
    while (true) {
      let receipt = null;
      try {
        receipt = await this.getTransaction(hash);
        errorStreak = 0;
      } catch (error) {
        if (error instanceof NoSuchElementError) {
          errorStreak = 0;
        } else if (error instanceof ProviderError) {
          if (++errorStreak > maxPollErrors) {
            throw error;
          }
        } else {
          throw error;
        }
      }
      if (receipt) {
        if (receipt.finality === "dropped") {
          if (++droppedStreak >= 2) {
            return receipt;
          }
        } else {
          droppedStreak = 0;
          if (FINALITY[receipt.finality] >= FINALITY[target]) {
            return receipt;
          }
        }
      } else {
        droppedStreak = 0;
      }
      if (Date.now() >= deadline) {
        throw new TimeoutError(`Transaction '${hash}' did not reach '${target}' within the timeout.`);
      }
      await sleep(interval);
    }
  }
};

// node_modules/@tetherto/wdk-wallet/src/wallet-account.js
init_buffer_shim();

// node_modules/@tetherto/wdk-wallet/src/signer.js
init_buffer_shim();

// src/engine.js
init_buffer_shim();

// src/fee.js
init_buffer_shim();
var TEST_NETWORK_FEE = { safety: 3, min: 30, max: 500, blockVsize: 1e6 };
var MAINNET_FEE = { safety: 1.25, min: 2, max: 100, blockVsize: 1e6 };
var feeFor = (network) => network === "Mainnet" ? MAINNET_FEE : TEST_NETWORK_FEE;
function clearingRate(histogram, fee = TEST_NETWORK_FEE) {
  let vsize = 0;
  for (const [rate, size] of histogram || []) {
    vsize += size;
    if (vsize >= fee.blockVsize) return rate;
  }
  return 0;
}
function bid(rates, fee = TEST_NETWORK_FEE) {
  const usable = (rates || []).filter((n) => Number.isFinite(n) && n > 0);
  const top = Math.max(0, ...usable);
  return Math.min(fee.max, Math.max(fee.min, Math.ceil(top * fee.safety)));
}

// src/bip322.js
init_buffer_shim();
var enc = new TextEncoder();
var sha256 = async (bytes) => new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
var dsha256 = async (bytes) => sha256(await sha256(bytes));
var b64 = {
  to: (b) => btoa(String.fromCharCode(...b)),
  from: (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))
};
var cat = (...arrays) => {
  const out = new Uint8Array(arrays.reduce((n, a) => n + a.length, 0));
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
};
function varint(n) {
  if (n < 253) return new Uint8Array([n]);
  if (n <= 65535) return new Uint8Array([253, n & 255, n >> 8 & 255]);
  if (n <= 4294967295) {
    return new Uint8Array([254, n & 255, n >> 8 & 255, n >> 16 & 255, n >>> 24 & 255]);
  }
  throw new Error("varint too large");
}
var u32le = (n) => new Uint8Array([n & 255, n >> 8 & 255, n >> 16 & 255, n >>> 24 & 255]);
var u64le = (value) => {
  const out = new Uint8Array(8);
  let n = BigInt(value);
  for (let i = 0; i < 8; i++) {
    out[i] = Number(n & 0xffn);
    n >>= 8n;
  }
  return out;
};
var withLen = (b) => cat(varint(b.length), b);
var CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
var GEN = [996825010, 642813549, 513874426, 1027748829, 705979059];
function polymod(values) {
  let chk = 1;
  for (const v of values) {
    const top = chk >> 25;
    chk = (chk & 33554431) << 5 ^ v;
    for (let i = 0; i < 5; i++) if (top >> i & 1) chk ^= GEN[i];
  }
  return chk;
}
var hrpExpand = (hrp) => [
  ...[...hrp].map((c) => c.charCodeAt(0) >> 5),
  0,
  ...[...hrp].map((c) => c.charCodeAt(0) & 31)
];
function convertBits(data, from, to, pad) {
  let acc = 0;
  let bits = 0;
  const out = [];
  const maxv = (1 << to) - 1;
  for (const v of data) {
    if (v < 0 || v >> from) throw new Error("Invalid address data");
    acc = acc << from | v;
    bits += from;
    while (bits >= to) {
      bits -= to;
      out.push(acc >> bits & maxv);
    }
  }
  if (pad) {
    if (bits) out.push(acc << to - bits & maxv);
  } else if (bits >= from || acc << to - bits & maxv) {
    throw new Error("Invalid address padding");
  }
  return out;
}
function decodeAddress(address) {
  const addr = String(address).trim();
  const lower = addr.toLowerCase();
  if (addr !== lower && addr !== addr.toUpperCase()) throw new Error("Mixed-case address");
  const pos = lower.lastIndexOf("1");
  if (pos < 1 || pos + 7 > lower.length) throw new Error("Not a bech32 address");
  const hrp = lower.slice(0, pos);
  const data = [];
  for (const c of lower.slice(pos + 1)) {
    const i = CHARSET.indexOf(c);
    if (i < 0) throw new Error("Invalid character in address");
    data.push(i);
  }
  const chk = polymod([...hrpExpand(hrp), ...data]);
  const version = data[0];
  const want = version === 0 ? 1 : 734539939;
  if (chk !== want) throw new Error("Bad address checksum");
  const program = new Uint8Array(convertBits(data.slice(1, -6), 5, 8, false));
  if (version > 16) throw new Error("Unknown witness version");
  if (program.length < 2 || program.length > 40) throw new Error("Bad witness program length");
  if (version === 0 && program.length !== 20 && program.length !== 32) {
    throw new Error("Bad v0 program length");
  }
  return { hrp, version, program };
}
function scriptPubKeyOf(address) {
  const { version, program } = decodeAddress(address);
  const op = version === 0 ? 0 : 80 + version;
  return cat(new Uint8Array([op]), withLen(program));
}
var BIP322_TAG = "BIP0322-signed-message";
async function taggedHash(tag, msg) {
  const t = await sha256(enc.encode(tag));
  return sha256(cat(t, t, msg));
}
function serializeTx({ inputs, outputs }) {
  const parts = [u32le(0), varint(inputs.length)];
  for (const i of inputs) parts.push(i.hash, u32le(i.index), withLen(i.script), u32le(i.sequence));
  parts.push(varint(outputs.length));
  for (const o of outputs) parts.push(u64le(o.value), withLen(o.script));
  parts.push(u32le(0));
  return cat(...parts);
}
async function buildVirtualTxs(address, message) {
  const scriptPubKey = scriptPubKeyOf(address);
  const msgHash = await taggedHash(BIP322_TAG, enc.encode(message));
  const toSpend = serializeTx({
    inputs: [{
      hash: new Uint8Array(32),
      index: 4294967295,
      script: cat(new Uint8Array([0]), withLen(msgHash)),
      // OP_0 PUSH32 <hash>
      sequence: 0
    }],
    outputs: [{ value: 0n, script: scriptPubKey }]
  });
  const toSpendTxid = await dsha256(toSpend);
  const toSign = serializeTx({
    inputs: [{ hash: toSpendTxid, index: 0, script: new Uint8Array(0), sequence: 0 }],
    outputs: [{ value: 0n, script: new Uint8Array([106]) }]
    // OP_RETURN
  });
  return { toSpend, toSpendTxid, toSign, scriptPubKey };
}
var kv = (key, value) => cat(withLen(key), withLen(value));
async function buildToSignPsbt(address, message, extra = []) {
  const { toSign, scriptPubKey } = await buildVirtualTxs(address, message);
  const global2 = cat(kv(new Uint8Array([0]), toSign));
  const witnessUtxo = cat(u64le(0n), withLen(scriptPubKey));
  const input = cat(kv(new Uint8Array([1]), witnessUtxo), ...extra.map(([k, v]) => kv(k, v)));
  const psbt = cat(
    new Uint8Array([112, 115, 98, 116, 255]),
    // magic "psbt" + 0xff
    global2,
    new Uint8Array([0]),
    input,
    new Uint8Array([0]),
    new Uint8Array([0])
    // one output, no fields
  );
  return b64.to(psbt);
}
function extractWitness(psbtB64) {
  const p = b64.from(psbtB64);
  let o = 5;
  const readVarint = () => {
    const b = p[o++];
    if (b < 253) return b;
    if (b === 253) {
      const v = p[o] | p[o + 1] << 8;
      o += 2;
      return v;
    }
    if (b === 254) {
      const v = p[o] | p[o + 1] << 8 | p[o + 2] << 16 | p[o + 3] << 24;
      o += 4;
      return v >>> 0;
    }
    throw new Error("Oversized varint in PSBT");
  };
  const readMap = (onEntry) => {
    for (; ; ) {
      const klen = readVarint();
      if (klen === 0) return;
      const key = p.slice(o, o + klen);
      o += klen;
      const vlen = readVarint();
      const value = p.slice(o, o + vlen);
      o += vlen;
      onEntry(key, value);
    }
  };
  readMap(() => {
  });
  let witness = null;
  readMap((key, value) => {
    if (key[0] === 8) witness = value;
  });
  if (!witness) {
    throw new Error("No final witness in the signed PSBT: the wallet did not sign this input.");
  }
  return witness;
}
function signatureFromWitness(witnessBytes) {
  return b64.to(witnessBytes);
}

// src/slots.js
init_buffer_shim();
var SLOTS = {
  utxoNum: 3,
  utxoSizeSat: 2e4,
  minSatToPrepare: 2e4,
  prepareVsize: 350,
  maxAllocationsPerUtxo: 5,
  sendVsize: 154
};
function payableRate(slots = SLOTS) {
  return Math.max(1, Math.floor(slots.utxoSizeSat / slots.sendVsize));
}
function slotCost(rate, count = SLOTS.utxoNum, slots = SLOTS) {
  const need = BigInt(count) * BigInt(slots.utxoSizeSat) + BigInt(rate) * BigInt(slots.prepareVsize);
  const floor = BigInt(slots.minSatToPrepare);
  return need > floor ? need : floor;
}
function slotBlocker({ settled, spendable }, rate, count = SLOTS.utxoNum, slots = SLOTS) {
  const confirmed = BigInt(settled);
  const pending = BigInt(spendable) - confirmed;
  if (pending > 0n) {
    return `Waiting for ${pending} sats to confirm. Slots are built from every Bitcoin input at once, so one unconfirmed input would put all of them at risk.`;
  }
  const cost = slotCost(rate, count, slots);
  if (confirmed < cost) {
    return `Not enough Bitcoin to create slots: needs about ${cost} sats at ${rate} sat/vB, the wallet has ${confirmed}. Fund its Bitcoin address.`;
  }
  return null;
}
function usableEmptySlots(unspents, slots = SLOTS) {
  return (unspents || []).filter(
    (u) => u.utxo?.colorable && u.utxo.exists !== false && (u.rgbAllocations || []).length === 0 && Number(u.pendingBlinded || 0) === 0 && BigInt(String(u.utxo.btcAmount ?? 0)) >= BigInt(slots.utxoSizeSat)
  ).length;
}
function slotsToCreate(unspents, slots = SLOTS) {
  return Math.max(0, slots.utxoNum - usableEmptySlots(unspents, slots));
}
function freeSlots(unspents, slots = SLOTS) {
  return (unspents || []).filter((u) => u.utxo?.colorable).reduce((a, u) => a + Math.max(0, slots.maxAllocationsPerUtxo - u.rgbAllocations.length), 0);
}
function explainReceiveError(message) {
  const text = String(message ?? "");
  if (!/insufficient allocations/i.test(text)) return text;
  return "No slot is usable yet. A slot can hold an allocation only once the transaction that created it has a confirmation. Wait for one, or use an invoice that needs no slot.";
}
function explainSendError(message, rate) {
  const text = String(message ?? "");
  if (!/insufficient allocations/i.test(text)) return text;
  return `The UTXOs holding this asset cannot pay the fee at ${rate} sat/vB, and no empty slot is left to add. Create slots before sending, or lower the fee rate.`;
}

// src/serial-queue.js
init_buffer_shim();
function serialQueue() {
  let tail = Promise.resolve();
  return (task) => {
    const run = tail.then(task);
    tail = run.then(() => {
    }, () => {
    });
    return run;
  };
}

// src/engine.js
var initialising = /* @__PURE__ */ new WeakMap();
var NO_CACHE = { cache: "no-store" };
var WITNESS_ADDRESS_ATTEMPTS = 10;
var isWitnessRecipient = (recipientId) => /(?:^|:)wvout:/.test(String(recipientId || ""));
var Engine = class {
  /**
   * @param {Object} bindings - The rgb-lib WebAssembly bindings module.
   * @param {Object} config - The resolved wallet configuration.
   */
  constructor(bindings, config) {
    this._bindings = bindings;
    this._config = config;
    this._queue = serialQueue();
    this._wallet = null;
    this._online = null;
    this._onlineError = null;
    this._persisted = false;
    this._transferArgument = null;
  }
  /** @returns {Object} The rgb-lib wallet. */
  get wallet() {
    if (!this._wallet) throw new Error("The wallet is not open.");
    return this._wallet;
  }
  /** @returns {string} The derivation path this account reports. */
  get path() {
    return this._config.path;
  }
  /** @returns {string} The Bitcoin network. */
  get network() {
    return this._config.network;
  }
  /** @returns {boolean} Whether the indexer was reachable when the wallet opened. */
  get online() {
    return !!this._online;
  }
  /**
   * The indexer handle as rgb-lib wants it, or null when the wallet opened offline.
   *
   * @returns {Object | null} The handle.
   */
  get onlineHandle() {
    return this._online;
  }
  /** @returns {string | null} Why going online failed, when it did. */
  get onlineError() {
    return this._onlineError;
  }
  /**
   * Whether the browser granted persistent storage. Without it the snapshot — and with it
   * the consignments that are the assets — can be evicted under storage pressure, and the
   * recovery phrase alone cannot bring them back.
   *
   * @returns {boolean} True when storage is persistent.
   */
  get persisted() {
    return this._persisted;
  }
  /**
   * Runs one engine command, alone.
   *
   * @template T
   * @param {() => Promise<T> | T} task - The command.
   * @returns {Promise<T>} What it returned.
   */
  run(task) {
    return this._queue(task);
  }
  /**
   * Converts BigInt to string, so a result can cross a structured-clone boundary such as a
   * worker or an extension message channel.
   *
   * @param {unknown} value - The value.
   * @returns {unknown} The converted value.
   */
  plain(value) {
    return JSON.parse(JSON.stringify(value, (_k, v) => typeof v === "bigint" ? v.toString() : v));
  }
  /**
   * Opens the wallet: initialises the WebAssembly module, restores the keys, builds the
   * rgb-lib wallet on its IndexedDB snapshot and tries to reach the indexer.
   *
   * Going online is allowed to fail. Balances, the asset list and a backup all work from the
   * snapshot, and a wallet that refuses to open because someone else's server is down is
   * worse than one that opens read-only.
   *
   * @param {string} mnemonic - The BIP-39 recovery phrase.
   * @returns {Promise<void>} When the wallet is open.
   */
  async open(mnemonic) {
    const { default: initWasm, restoreKeys: restoreKeys2, WasmWallet: WasmWallet2 } = this._bindings;
    if (!initialising.has(this._bindings)) {
      initialising.set(this._bindings, initWasm());
    }
    await initialising.get(this._bindings);
    const keys = restoreKeys2(this._config.network, mnemonic);
    this._wallet = await WasmWallet2.create(JSON.stringify({
      // The IndexedDB key is `dataDir/<master fingerprint>`. It carries the network by
      // default, because a shared key loads the other chain's snapshot and BDK rejects it.
      dataDir: this._config.dataDir,
      bitcoinNetwork: this._config.network,
      databaseType: "Sqlite",
      maxAllocationsPerUtxo: this._config.slots.maxAllocationsPerUtxo,
      accountXpubVanilla: keys.accountXpubVanilla,
      accountXpubColored: keys.accountXpubColored,
      mnemonic,
      masterFingerprint: keys.masterFingerprint,
      vanillaKeychain: null,
      // rgb-lib refuses to open a mainnet wallet that lists IFA.
      supportedSchemas: this._config.network === "Mainnet" ? ["Nia"] : ["Nia", "Ifa"],
      // Pins the address index, so the wallet's address is stable across sessions.
      reuseAddresses: true
    }));
    await this._wallet.flush();
    this._persisted = await this._requestPersistence();
    try {
      this._online = await this._wallet.goOnline(true, this._config.esploraUrl);
      this._onlineError = null;
    } catch (error) {
      this._online = null;
      this._onlineError = String(error?.message || error);
    }
  }
  /**
   * The indexer handle, for the calls that need one.
   *
   * @returns {Object} The handle.
   * @throws {Error} If the indexer could not be reached.
   */
  needOnline() {
    if (!this._wallet) throw new Error("The wallet is not open.");
    if (!this._online) {
      throw new Error(`The indexer is unreachable${this._onlineError ? `: ${this._onlineError}` : ""}.`);
    }
    return this._online;
  }
  /**
   * The asset list, with the precision taken from contract metadata where the list itself
   * does not carry it.
   *
   * @returns {Promise<Array<Object>>} The assets.
   */
  async listAssets() {
    return this.run(() => {
      const list = this.plain(this.wallet.listAssets([]));
      const out = [];
      for (const asset of [...list.nia || [], ...list.ifa || []]) {
        let precision = asset.precision ?? null;
        try {
          precision = this.plain(this.wallet.getAssetMetadata(asset.assetId)).precision ?? precision;
        } catch {
        }
        out.push({
          assetId: asset.assetId,
          ticker: asset.ticker,
          name: asset.name,
          precision,
          balance: asset.balance
        });
      }
      return out;
    });
  }
  /**
   * The transfers, newest first, with a confirmation count on the ones still waiting.
   *
   * @param {string} [assetId] - Restrict to one asset.
   * @returns {Promise<Array<Object>>} The transfers.
   */
  async listTransfers(assetId) {
    const transfers = await this.run(() => this.plain(this._listTransfers(assetId)).slice().reverse());
    return this._withConfirmations(transfers);
  }
  /**
   * The wallet's own transactions, newest first: plain Bitcoin sends and receives, slot
   * housekeeping, and the transactions RGB sends anchored. Amounts in sats. Unconfirmed ones
   * carry a `confirmations` count; a confirmed one reports `Settled`, since one confirmation
   * is where this wallet settles.
   *
   * @returns {Promise<Array<Object>>} The transactions.
   */
  async listTransactions() {
    const txs = await this.run(() => this.plain(this.wallet.listTransactions()));
    const shaped = txs.map((tx) => ({
      ...tx,
      status: tx.confirmationTime ? "Settled" : "WaitingConfirmations"
    }));
    return (await this._withConfirmations(shaped)).sort((a, b) => (b.confirmationTime?.timestamp ?? Number.MAX_SAFE_INTEGER) - (a.confirmationTime?.timestamp ?? Number.MAX_SAFE_INTEGER));
  }
  /**
   * Free allocation slots. Receiving needs at least one.
   *
   * @returns {Promise<number>} How many allocations can still be received.
   */
  async freeSlots() {
    return this.run(() => freeSlots(this.wallet.listUnspents(false), this._config.slots));
  }
  /**
   * What to bid, in sat/vB, from the mempool's own queue and the indexer's estimate.
   *
   * @returns {Promise<bigint>} The rate.
   */
  async feeRate() {
    const fee = this._config.fee;
    const signals = [];
    try {
      signals.push(clearingRate(await this._mempoolHistogram(), fee));
    } catch {
    }
    try {
      signals.push(Number(await this.wallet.getFeeEstimation(this.needOnline(), 1)));
    } catch {
    }
    return BigInt(bid(signals, fee));
  }
  /**
   * Creates the empty colored UTXOs that receiving requires.
   *
   * @param {number | bigint} [feeRate] - The fee rate; estimated when omitted.
   * @returns {Promise<{ created: number, slots: number }>} What was created.
   */
  async createUtxos(feeRate) {
    const online = this.needOnline();
    const rate = feeRate ? BigInt(feeRate) : await this.feeRate();
    return this.run(async () => {
      await this.wallet.sync(online);
      const count = slotsToCreate(this.plain(this.wallet.listUnspents(false)), this._config.slots);
      if (count === 0) {
        return { created: 0, slots: freeSlots(this.wallet.listUnspents(false), this._config.slots) };
      }
      const blocked = slotBlocker(this.wallet.getBtcBalance().vanilla, rate, count, this._config.slots);
      if (blocked) throw new Error(blocked);
      const psbt = await this.wallet.createUtxosBegin(
        online,
        false,
        count,
        this._config.slots.utxoSizeSat,
        rate,
        false
      );
      const signed = this.wallet.signPsbt(psbt);
      const created = await this.wallet.createUtxosEnd(online, signed, false);
      await this.wallet.flush();
      return { created, slots: freeSlots(this.wallet.listUnspents(false), this._config.slots) };
    });
  }
  /**
   * Creates an invoice to receive an asset into a blinded UTXO.
   *
   * A proxy is required: the invoice has to name where the sender delivers the consignment,
   * and without one the sender has nowhere to put it.
   *
   * @param {Object} [options] - The invoice.
   * @param {string} [options.assetId] - Restrict to one asset; any asset when omitted.
   * @param {number} [options.minutes] - How long the invoice stays valid.
   * @returns {Promise<Object>} The invoice.
   */
  async blindReceive({ assetId, minutes } = {}) {
    this.needOnline();
    if (!this._config.proxyUrl) {
      throw new Error("No proxyUrl is configured. An invoice must name where the consignment goes.");
    }
    return this.run(async () => {
      if (freeSlots(this.wallet.listUnspents(false), this._config.slots) < 1) {
        throw new Error("No free allocation slot. Create slots before receiving.");
      }
      let invoice;
      try {
        invoice = this.wallet.blindReceive(
          assetId || void 0,
          "Any",
          (minutes || this._config.invoiceMinutes) * 60,
          [this._config.proxyUrl],
          this._config.minConfirmations
        );
      } catch (error) {
        throw new Error(explainReceiveError(error?.message || error));
      }
      await this.wallet.flush();
      return this.plain(invoice);
    });
  }
  /**
   * Creates an address to receive an asset through a witness transaction, which needs no
   * free allocation slot: the sender creates the output that carries the asset.
   *
   * The sender pays for that output, so a witness receive costs the sender more than a blind
   * one. It is what a wallet with no slots can still do.
   *
   * @param {Object} [options] - The invoice.
   * @param {string} [options.assetId] - Restrict to one asset; any asset when omitted.
   * @param {number} [options.minutes] - How long the invoice stays valid.
   * @returns {Promise<Object>} The invoice.
   */
  async witnessReceive({ assetId, minutes } = {}) {
    this.needOnline();
    if (!this._config.proxyUrl) {
      throw new Error("No proxyUrl is configured. An invoice must name where the consignment goes.");
    }
    return this.run(async () => {
      for (let attempt = 0; attempt < WITNESS_ADDRESS_ATTEMPTS; attempt++) {
        this.wallet.rotateAddress(0);
        const invoice = this.plain(this.wallet.witnessReceive(
          assetId || void 0,
          "Any",
          (minutes || this._config.invoiceMinutes) * 60,
          [this._config.proxyUrl],
          this._config.minConfirmations
        ));
        if (!await this._proxyHolds(invoice.recipientId ?? invoice.recipient_id)) {
          await this.wallet.flush();
          return invoice;
        }
      }
      throw new Error("Could not find an unused receiving address. Try again later.");
    });
  }
  /**
   * Whether the proxy already holds a consignment for this recipient id, which makes the id
   * unusable: it keeps one per id and refuses to replace it.
   *
   * @private
   * @param {string} recipientId - The recipient id.
   * @returns {Promise<boolean>} True when the id is taken.
   */
  async _proxyHolds(recipientId) {
    const url = String(this._config.proxyUrl).replace(/^rpcs:\/\//, "https://").replace(/^rpc:\/\//, "http://");
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "consignment.get",
        params: { recipient_id: recipientId }
      }),
      signal: AbortSignal.timeout(8e3)
    });
    if (!response.ok) throw new Error(`The RGB proxy answered ${response.status}.`);
    const body = await response.json();
    if (body.result?.consignment) return true;
    if (body.error?.code === -400) return false;
    throw new Error(`The RGB proxy said: ${body.error?.message || "something unexpected"}.`);
  }
  /**
   * Issues a new asset. The whole supply is allocated to this wallet, spread over the
   * amounts given, and each amount takes an allocation slot.
   *
   * @param {Object} options - The asset.
   * @param {string} options.ticker - The ticker.
   * @param {string} options.name - The name.
   * @param {number} options.precision - Decimal places.
   * @param {Array<number | bigint | string>} options.amounts - The issued amounts, one per allocation.
   * @param {'Nia' | 'Ifa'} [options.schema] - `Nia` is fixed supply, `Ifa` can be inflated later. Defaults to `Nia`.
   * @param {Array<number | bigint | string>} [options.inflationAmounts] - Inflation allowances, for `Ifa` only.
   * @param {string} [options.rejectListUrl] - Reject list, for `Ifa` only.
   * @returns {Promise<Object>} The issued asset.
   */
  async issueAsset(options) {
    const { ticker, name, precision, amounts, schema = "Nia" } = options;
    if (!ticker || !name) throw new Error("An asset needs a ticker and a name.");
    if (!Array.isArray(amounts) || !amounts.length) throw new Error("An asset needs an amount.");
    if (!Number.isInteger(precision)) throw new Error("Precision must be an integer.");
    if (schema === "Ifa" && this.network === "Mainnet") {
      throw new Error("rgb-lib does not open a mainnet wallet that supports IFA, so it cannot issue one.");
    }
    return this.run(async () => {
      if (freeSlots(this.wallet.listUnspents(false), this._config.slots) < amounts.length) {
        throw new Error(`Issuing ${amounts.length} allocations needs ${amounts.length} free slots. Create slots first.`);
      }
      const values = amounts.map((a) => BigInt(a));
      const asset = schema === "Ifa" ? this.wallet.issueAssetIfa(
        ticker,
        name,
        precision,
        values,
        (options.inflationAmounts || []).map((a) => BigInt(a)),
        options.rejectListUrl ?? void 0
      ) : this.wallet.issueAssetNia(ticker, name, precision, values);
      await this.wallet.flush();
      return this.plain(asset);
    });
  }
  /**
   * Signs a message with the wallet's own address, as a BIP-322 simple signature.
   *
   * rgb-lib exposes no message signing, so the message is wrapped in the pair of virtual
   * transactions BIP-322 defines and the wallet signs that PSBT. The signature is the
   * resulting witness stack.
   *
   * @param {string} message - The message, signed verbatim.
   * @returns {Promise<{ address: string, signature: string }>} The address and the signature.
   */
  async signMessage(message) {
    if (typeof message !== "string" || !message) throw new Error("A message is required.");
    return this.run(async () => {
      const address = this.wallet.getAddress();
      const psbt = await buildToSignPsbt(address, message);
      const signed = this.wallet.signPsbt(psbt);
      return { address, signature: signatureFromWitness(extractWitness(signed)) };
    });
  }
  /**
   * Brings the wallet's view of the chain up to date, without touching RGB state.
   *
   * This is the cheap half of {@link refresh}: balances and UTXOs become current, but nothing
   * fetches or validates a consignment. Reading a balance without it shows the last figures
   * the wallet happened to see.
   *
   * @returns {Promise<void>} When the wallet is in step with the chain.
   */
  async sync() {
    const online = this.needOnline();
    return this.run(async () => {
      await this.wallet.sync(online);
    });
  }
  /**
   * Picks up consignments and advances the transfer state machine. The cost grows with the
   * transfer history, because every consignment is validated on the device.
   *
   * @param {string} [assetId] - Restrict to one asset.
   * @returns {Promise<Object>} What changed.
   */
  async refresh(assetId) {
    const online = this.needOnline();
    return this.run(async () => {
      const started = Date.now();
      await this.wallet.sync(online);
      const changed = this.plain(await this.wallet.refresh(online, assetId ?? void 0, [], false));
      await this.wallet.flush();
      return { ms: Date.now() - started, changed };
    });
  }
  /**
   * Fails the expired invoices and deletes the ones that never received anything, which
   * releases the allocation slots they were holding.
   *
   * The sweep only reaches transfers that are waiting for the counterparty and have expired.
   * A dangling invoice holds its slot until then.
   *
   * @returns {Promise<Object>} What was released.
   */
  async cleanup() {
    const online = this.needOnline();
    return this.run(async () => {
      const failed = await this.wallet.failTransfers(online, void 0, false, false);
      let deleted = false;
      try {
        deleted = this.wallet.deleteTransfers(void 0, true);
      } catch {
      }
      await this.wallet.flush();
      return {
        failed,
        deleted,
        slots: freeSlots(this.wallet.listUnspents(false), this._config.slots)
      };
    });
  }
  /**
   * An encrypted backup of the whole wallet. The recovery phrase alone cannot restore RGB
   * assets: the consignments are held only here.
   *
   * @param {string} password - The password to encrypt with.
   * @returns {Promise<Uint8Array>} The backup.
   */
  async backup(password) {
    if (!password) throw new Error("A backup password is required.");
    return this.run(() => this.wallet.backup(password));
  }
  /**
   * Restores a backup over this wallet.
   *
   * @param {Uint8Array} bytes - The backup.
   * @param {string} password - The password it was encrypted with.
   * @returns {Promise<void>} When the backup is restored.
   */
  async restoreBackup(bytes, password) {
    if (!bytes?.length) throw new Error("The backup is empty.");
    return this.run(async () => {
      this.wallet.restoreBackup(new Uint8Array(bytes), password);
      await this.wallet.flush();
    });
  }
  /**
   * Sends an asset to an invoice.
   *
   * 🚨 This does not put anything on the chain. RGB posts the consignment to the proxy and
   * waits: the recipient fetches it, validates it and acknowledges, and only then does the
   * sender broadcast. Broadcasting earlier would risk an asset the recipient could not
   * validate. The returned `hash` is therefore the id of a transaction that is not yet on
   * the network, and {@link refresh} is what eventually puts it there. See
   * {@link pendingHandovers}.
   *
   * The invoice's own transport endpoints take precedence over the configured one: the
   * consignment has to land where the recipient looks for it.
   *
   * @param {Object} options - The send.
   * @param {string} options.invoice - The RGB invoice.
   * @param {string} [options.assetId] - The asset; taken from the invoice when omitted.
   * @param {bigint | number | string} options.amount - The amount, in the asset's own precision.
   * @param {number | bigint} [options.feeRate] - The fee rate; estimated when omitted.
   * @returns {Promise<Object>} The transfer rgb-lib recorded.
   */
  async sendAsset({ invoice, assetId, amount, feeRate }) {
    const online = this.needOnline();
    const data = this.plain(new this._bindings.WasmInvoice(String(invoice || "").trim()).invoiceData());
    if (data.network && String(data.network).toLowerCase() !== String(this.network).toLowerCase()) {
      throw new Error(`The invoice is for ${data.network}, the wallet is on ${this.network}.`);
    }
    if (data.assetId && assetId && data.assetId !== assetId) {
      throw new Error("The invoice names a different asset.");
    }
    const value = BigInt(amount);
    if (value <= 0n) throw new Error("The amount must be greater than 0.");
    const endpoints = data.transportEndpoints?.length ? data.transportEndpoints : this._config.proxyUrl ? [this._config.proxyUrl] : [];
    if (!endpoints[0]) {
      throw new Error("The invoice carries no consignment endpoint and no proxyUrl is configured.");
    }
    const rate = feeRate ? BigInt(feeRate) : await this.feeRate();
    return this.run(async () => {
      await this.wallet.sync(online);
      const witnessData = isWitnessRecipient(data.recipientId) ? { amountSat: String(this._config.witnessSats), blinding: null } : void 0;
      const recipient = (fungible) => ({
        [assetId || data.assetId]: [{
          recipientId: data.recipientId,
          witnessData,
          assignment: { Fungible: fungible },
          transportEndpoints: endpoints
        }]
      });
      let psbt;
      try {
        try {
          psbt = await this.wallet.sendBegin(
            online,
            recipient(value),
            false,
            rate,
            this._config.minConfirmations
          );
        } catch (error) {
          if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
            throw new Error(`The amount exceeds 2^53 and the bindings rejected BigInt: ${error?.message || error}`);
          }
          psbt = await this.wallet.sendBegin(
            online,
            recipient(Number(value)),
            false,
            rate,
            this._config.minConfirmations
          );
        }
      } catch (error) {
        throw new Error(explainSendError(error?.message || error, rate));
      }
      const signed = this.wallet.signPsbt(psbt);
      const result = this.plain(await this.wallet.sendEnd(online, signed, false));
      await this.wallet.flush();
      return result;
    });
  }
  /**
   * The transfers this wallet has sent that are still waiting on their recipient.
   *
   * A transfer is not on the chain when `sendAsset` returns. RGB posts the consignment first
   * and the recipient validates it; only then does the sender broadcast, because a
   * transaction broadcast before the recipient could validate can leave the asset
   * unrecoverable. {@link refresh} is what notices the acknowledgement and broadcasts.
   *
   * So a wallet that sends and never refreshes again has not sent anything. Anything driving
   * this to completion — a timer, an event on opening — asks here whether it still needs to.
   *
   * @returns {Promise<Array<Object>>} The outgoing transfers still waiting.
   */
  async pendingHandovers() {
    const transfers = await this.listTransfers();
    return transfers.filter((t) => t.kind === "Send" && t.status === "WaitingCounterparty");
  }
  /**
   * Sends plain Bitcoin. Spends the vanilla keychain only, never a UTXO carrying assets.
   *
   * @param {Object} options - The send.
   * @param {string} options.address - The destination address.
   * @param {bigint | number | string} options.amount - The amount in sats.
   * @param {number | bigint} [options.feeRate] - The fee rate; estimated when omitted.
   * @returns {Promise<{ txid: string }>} The transaction id.
   */
  async sendBtc({ address, amount, feeRate }) {
    const online = this.needOnline();
    const value = BigInt(amount);
    if (value <= 0n) throw new Error("The amount must be greater than 0.");
    const rate = feeRate ? BigInt(feeRate) : await this.feeRate();
    return this.run(async () => {
      await this.wallet.sync(online);
      const psbt = await this.wallet.sendBtcBegin(online, String(address).trim(), value, rate, false);
      const signed = this.wallet.signPsbt(psbt);
      const txid = await this.wallet.sendBtcEnd(online, signed, false);
      await this.wallet.flush();
      return { txid };
    });
  }
  /** Closes the wallet. */
  dispose() {
    try {
      this._wallet?.free?.();
    } catch {
    }
    this._wallet = null;
    this._online = null;
  }
  /**
   * rgb-lib changed what this argument is. The published WebAssembly bindings take an asset
   * id; builds from a later commit take an AssetFilter, whose variants are lowercase —
   * "any", "noAsset" or `{ id }`. Both are in circulation, and a consumer may inject either,
   * so the first call settles which one this build wants and the answer is kept.
   *
   * @private
   * @param {string} [assetId] - The asset to restrict to.
   * @returns {Array<Object>} The transfers, as rgb-lib returns them.
   */
  _listTransfers(assetId) {
    if (this._transferArgument === "assetId") return this._listTransfersByAsset(assetId);
    try {
      const transfers = this.wallet.listTransfers(assetId ? { id: assetId } : "any");
      this._transferArgument = "filter";
      return transfers;
    } catch (error) {
      if (this._transferArgument === "filter") throw error;
      this._transferArgument = "assetId";
      return this._listTransfersByAsset(assetId);
    }
  }
  /**
   * The asset-id form of `listTransfers`, including the case the argument cannot express.
   *
   * Passing no asset id does not mean "every transfer": it returns only the transfers that
   * belong to no asset, which on a wallet holding assets is an empty list. Asking for
   * everything therefore means asking once per asset and adding the assetless ones.
   *
   * @private
   * @param {string} [assetId] - The asset to restrict to.
   * @returns {Array<Object>} The transfers.
   */
  _listTransfersByAsset(assetId) {
    if (assetId) return this.wallet.listTransfers(assetId);
    const seen = /* @__PURE__ */ new Set();
    const all = [];
    const add = (transfers) => {
      for (const transfer of transfers || []) {
        const key = `${transfer.batchTransferIdx}/${transfer.idx ?? ""}/${transfer.txid ?? ""}`;
        if (seen.has(key)) continue;
        seen.add(key);
        all.push(transfer);
      }
    };
    const list = this.wallet.listAssets([]);
    for (const asset of [...list.nia || [], ...list.ifa || []]) {
      add(this.wallet.listTransfers(asset.assetId));
    }
    add(this.wallet.listTransfers(void 0));
    return all.sort((a, b) => Number(a.batchTransferIdx) - Number(b.batchTransferIdx));
  }
  /**
   * @private
   * @returns {Promise<boolean>} Whether storage is persistent.
   */
  async _requestPersistence() {
    try {
      return await navigator.storage.persisted() || await navigator.storage.persist();
    } catch {
      return false;
    }
  }
  /**
   * @private
   * @returns {Promise<Array<[number, number]>>} The mempool histogram.
   */
  async _mempoolHistogram() {
    const response = await fetch(`${this._config.esploraUrl.replace(/\/+$/, "")}/mempool`, NO_CACHE);
    if (!response.ok) throw new Error(`mempool ${response.status}`);
    return (await response.json()).fee_histogram || [];
  }
  /**
   * Adds a confirmation count to the transfers still waiting on the chain. rgb-lib's
   * transfer carries no such field, so it comes from the indexer: one tip lookup plus one
   * status lookup per pending txid. A lookup that fails leaves the count undefined, which
   * beats failing the whole list because the indexer hiccuped.
   *
   * @private
   * @param {Array<Object>} transfers - The transfers.
   * @returns {Promise<Array<Object>>} The transfers, some with `confirmations`.
   */
  async _withConfirmations(transfers) {
    const pending = transfers.filter(
      (t) => t.txid && t.status !== "Settled" && t.status !== "Failed"
    );
    if (!pending.length) return transfers;
    const base = this._config.esploraUrl.replace(/\/+$/, "");
    const get = (path) => fetch(`${base}${path}`, { ...NO_CACHE, signal: AbortSignal.timeout(8e3) });
    let tip;
    try {
      tip = Number(await (await get("/blocks/tip/height")).text());
    } catch {
      return transfers;
    }
    if (!Number.isFinite(tip)) return transfers;
    const depth = /* @__PURE__ */ new Map();
    for (const txid of new Set(pending.map((t) => t.txid))) {
      try {
        const status = await (await get(`/tx/${txid}/status`)).json();
        depth.set(txid, status.confirmed ? Math.max(0, tip - status.block_height + 1) : 0);
      } catch {
      }
    }
    return transfers.map((t) => depth.has(t.txid) ? { ...t, confirmations: depth.get(t.txid) } : t);
  }
};

// src/wallet-account-rgb.js
init_buffer_shim();

// src/wallet-account-read-only-rgb.js
init_buffer_shim();
var WalletAccountReadOnlyRgb = class extends WalletAccountReadOnly {
  /**
   * @param {import('./engine.js').default} engine - The engine to read through.
   */
  constructor(engine) {
    super();
    this._engine = engine;
  }
  /** @returns {Promise<string>} The wallet's Bitcoin address. */
  async getAddress() {
    return this._engine.run(() => this._engine.wallet.getAddress());
  }
  /**
   * The spendable Bitcoin balance, in sats.
   *
   * This is the vanilla balance: what a plain Bitcoin send may spend. The sats parked in the
   * UTXOs that carry assets are not here, because they are not free to spend — they pay the
   * fees of the transfers that move those assets. {@link getBtcBalance} returns both.
   *
   * @returns {Promise<bigint>} The balance in sats.
   */
  async getBalance() {
    const balance = await this.getBtcBalance();
    return BigInt(balance.vanilla.spendable);
  }
  /**
   * The full Bitcoin balance, vanilla and colored, settled and spendable.
   *
   * @returns {Promise<Object>} The balance.
   */
  async getBtcBalance() {
    return this._engine.run(() => this._engine.plain(this._engine.wallet.getBtcBalance()));
  }
  /**
   * The balance of one RGB asset.
   *
   * @param {string} tokenAddress - The RGB asset id.
   * @returns {Promise<bigint>} The settled balance, in the asset's own base units.
   */
  async getTokenBalance(tokenAddress) {
    const balance = await this.getAssetBalance(tokenAddress);
    return BigInt(balance.settled);
  }
  /**
   * The balance of one RGB asset, settled, future and spendable.
   *
   * @param {string} assetId - The RGB asset id.
   * @returns {Promise<Object>} The balance.
   */
  async getAssetBalance(assetId) {
    return this._engine.run(() => this._engine.plain(this._engine.wallet.getAssetBalance(assetId)));
  }
  /**
   * The RGB assets this wallet holds, with the precision taken from contract metadata where
   * the list itself does not carry it.
   *
   * @returns {Promise<Array<Object>>} The assets.
   */
  async listAssets() {
    return this._engine.listAssets();
  }
  /**
   * The transfers, newest first, with a confirmation count on the ones still waiting.
   *
   * @param {string} [assetId] - Restrict to one asset; every transfer when omitted.
   * @returns {Promise<Array<Object>>} The transfers.
   */
  async listTransfers(assetId) {
    return this._engine.listTransfers(assetId);
  }
  /**
   * The wallet's own transactions, newest first, with a confirmation count on the ones still
   * waiting. Plain Bitcoin sends and receives are here; {@link listTransfers} knows only RGB.
   *
   * @returns {Promise<Array<Object>>} The transactions.
   */
  async listTransactions() {
    return this._engine.listTransactions();
  }
  /**
   * The transfer a witness transaction produced.
   *
   * @param {string} hash - The txid.
   * @returns {Promise<Object | null>} The transfer, or null when this wallet has none.
   */
  async getTransactionReceipt(hash) {
    const transfers = await this._engine.listTransfers();
    return transfers.find((t) => t.txid === hash) ?? null;
  }
  /**
   * Not available: an RGB transfer anchors on-chain in a batch with others, so a witness
   * txid does not resolve into a per-transfer finality receipt. {@link getTransactionReceipt}
   * returns what this wallet knows about the transfer itself.
   *
   * @param {string} hash - The txid.
   * @returns {Promise<import('@tetherto/wdk-wallet').TransactionReceipt>} Never returns.
   * @throws {UnsupportedOperationError} Always.
   */
  async getTransaction(hash) {
    throw new UnsupportedOperationError(
      "getTransaction: RGB transfers anchor in batches, there is no per-transfer on-chain receipt."
    );
  }
  /**
   * What a Bitcoin send would cost. RGB has no gas: the cost is the miner fee, and the rate
   * is what this wallet would bid now.
   *
   * @returns {Promise<{ fee: bigint }>} The quote.
   */
  async quoteSendTransaction() {
    return { fee: await this._engine.feeRate() };
  }
  /**
   * What an asset transfer would cost, as a fee rate in sat/vB. The transaction's size is
   * not known before rgb-lib builds it, so this is the rate, not the total.
   *
   * @returns {Promise<{ fee: bigint }>} The quote.
   */
  async quoteTransfer() {
    return { fee: await this._engine.feeRate() };
  }
  /**
   * Free allocation slots. Receiving an asset needs at least one.
   *
   * @returns {Promise<number>} How many allocations can still be received.
   */
  async getFreeSlots() {
    return this._engine.freeSlots();
  }
  /**
   * What the wallet knows about its own situation: the network it is on, whether the
   * indexer was reachable when it opened and why not if it was not, and whether the browser
   * granted persistent storage.
   *
   * A wallet opens whether or not the indexer answers, so a consumer that does not check
   * this will show stale balances as though they were current.
   *
   * @returns {Promise<{ network: string, online: boolean, onlineError: string | null, persisted: boolean }>} The status.
   */
  async getStatus() {
    return {
      network: this._engine.network,
      online: this._engine.online,
      onlineError: this._engine.onlineError,
      persisted: this._engine.persisted
    };
  }
  /**
   * Whether the wallet has changed since its last backup. The recovery phrase alone cannot
   * restore RGB assets: the consignments live only on this device.
   *
   * @returns {Promise<boolean | null>} True when a backup is due, null when unknown.
   */
  async isBackupNeeded() {
    return this._engine.run(() => {
      try {
        return this._engine.wallet.backupInfo();
      } catch {
        return null;
      }
    });
  }
};

// src/wallet-account-rgb.js
var WalletAccountRgb = class extends WalletAccountReadOnlyRgb {
  /**
   * @param {import('./engine.js').default} engine - The open engine.
   * @param {number} index - The account index.
   */
  constructor(engine, index) {
    super(engine);
    this._engine = engine;
    this._index = index;
    this._readOnly = new WalletAccountReadOnlyRgb(engine);
  }
  /** @returns {number} The account index. */
  get index() {
    return this._index;
  }
  /** @returns {string} The derivation path. */
  get path() {
    return this._engine.path;
  }
  /**
   * Not available. The recovery phrase stays inside the WebAssembly engine, which signs
   * without handing the key back out; there is nothing to return that would not be a copy
   * of the secret in JavaScript memory.
   *
   * @returns {import('@tetherto/wdk-wallet').KeyPair} Never returns.
   * @throws {UnsupportedOperationError} Always.
   */
  get keyPair() {
    throw new UnsupportedOperationError("keyPair is not exposed by the RGB engine.");
  }
  /**
   * Not available in the WDK's sense: an RGB transfer is not a transaction the caller builds
   * and this wallet signs. The PSBT is built and signed inside {@link transfer} and
   * {@link sendTransaction}, because only rgb-lib knows which colored UTXOs go into it.
   *
   * @returns {Promise<unknown>} Never returns.
   * @throws {UnsupportedOperationError} Always.
   */
  async signTransaction() {
    throw new UnsupportedOperationError(
      "signTransaction: RGB signs the PSBT it builds itself, inside transfer."
    );
  }
  /**
   * Not available: message signing here is BIP-322 over a taproot key, and verifying it needs
   * a Schnorr check that the WebAssembly bindings do not expose. The base class would throw
   * the same error with a less specific reason.
   *
   * @returns {Promise<boolean>} Never returns.
   * @throws {UnsupportedOperationError} Always.
   */
  async verify() {
    throw new UnsupportedOperationError(
      "verify: the engine signs BIP-322 but exposes no Schnorr verification to check one."
    );
  }
  /** @returns {Promise<string>} The wallet's Bitcoin address. */
  async getAddress() {
    return this._readOnly.getAddress();
  }
  /** @returns {Promise<bigint>} The spendable Bitcoin balance, in sats. */
  async getBalance() {
    return this._readOnly.getBalance();
  }
  /** @returns {Promise<Object>} The full Bitcoin balance, vanilla and colored. */
  async getBtcBalance() {
    return this._readOnly.getBtcBalance();
  }
  /**
   * @param {string} tokenAddress - The RGB asset id.
   * @returns {Promise<bigint>} The settled balance.
   */
  async getTokenBalance(tokenAddress) {
    return this._readOnly.getTokenBalance(tokenAddress);
  }
  /**
   * @param {string} assetId - The RGB asset id.
   * @returns {Promise<Object>} The balance, settled, future and spendable.
   */
  async getAssetBalance(assetId) {
    return this._readOnly.getAssetBalance(assetId);
  }
  /** @returns {Promise<Array<Object>>} The RGB assets this wallet holds. */
  async listAssets() {
    return this._readOnly.listAssets();
  }
  /**
   * @param {string} [assetId] - Restrict to one asset.
   * @returns {Promise<Array<Object>>} The transfers, newest first.
   */
  async listTransfers(assetId) {
    return this._readOnly.listTransfers(assetId);
  }
  /**
   * The wallet's own transactions, newest first: plain Bitcoin sends and receives included.
   *
   * @returns {Promise<Array<Object>>} The transactions.
   */
  async listTransactions() {
    return this._readOnly.listTransactions();
  }
  /**
   * @param {string} hash - The txid.
   * @returns {Promise<Object | null>} The transfer that transaction produced.
   */
  async getTransactionReceipt(hash) {
    return this._readOnly.getTransactionReceipt(hash);
  }
  /** @returns {Promise<{ fee: bigint }>} The rate a Bitcoin send would bid, in sat/vB. */
  async quoteSendTransaction() {
    return this._readOnly.quoteSendTransaction();
  }
  /** @returns {Promise<{ fee: bigint }>} The rate an asset transfer would bid, in sat/vB. */
  async quoteTransfer() {
    return this._readOnly.quoteTransfer();
  }
  /** @returns {Promise<number>} Free allocation slots. */
  async getFreeSlots() {
    return this._readOnly.getFreeSlots();
  }
  /**
   * @returns {Promise<{ network: string, online: boolean, onlineError: string | null, persisted: boolean }>} What the wallet knows about its own situation.
   */
  async getStatus() {
    return this._readOnly.getStatus();
  }
  /** @returns {Promise<boolean | null>} Whether a backup is due. */
  async isBackupNeeded() {
    return this._readOnly.isBackupNeeded();
  }
  /**
   * Sends plain Bitcoin. Spends the vanilla keychain only, never a UTXO carrying an asset.
   *
   * @param {Object} tx - The transaction.
   * @param {string} tx.to - The destination address.
   * @param {number | bigint | string} tx.value - The amount in sats.
   * @param {number | bigint} [tx.feeRate] - The fee rate in sat/vB; estimated when omitted.
   * @returns {Promise<{ hash: string, fee: bigint }>} The transaction id and the rate it paid.
   */
  async sendTransaction(tx) {
    const feeRate = tx.feeRate ? BigInt(tx.feeRate) : await this._engine.feeRate();
    const { txid } = await this._engine.sendBtc({
      address: tx.to,
      amount: tx.value,
      feeRate
    });
    return { hash: txid, fee: feeRate };
  }
  /**
   * Transfers an RGB asset.
   *
   * 🚨 Nothing goes on the chain here. The consignment is posted for the recipient, who
   * validates it and acknowledges; the transaction is broadcast by a later {@link refresh},
   * once that acknowledgement has arrived. `hash` names a transaction that is not yet on the
   * network, and a wallet that sends and never refreshes again has not sent anything. See
   * {@link pendingHandovers}.
   *
   * `recipient` is an RGB invoice, not an address: the receiver decides which UTXO the asset
   * lands on, and the invoice is how they say so. It also names where the consignment is to
   * be delivered, and that endpoint takes precedence over the configured proxy.
   *
   * @param {Object} options - The transfer.
   * @param {string} options.token - The RGB asset id.
   * @param {string} options.recipient - The recipient's RGB invoice.
   * @param {number | bigint | string} options.amount - The amount, in the asset's base units.
   * @param {number | bigint} [options.feeRate] - The fee rate in sat/vB; estimated when omitted.
   * @returns {Promise<{ hash: string, fee: bigint, transfer: Object }>} The result.
   */
  async transfer(options) {
    const feeRate = options.feeRate ? BigInt(options.feeRate) : await this._engine.feeRate();
    const transfer = await this._engine.sendAsset({
      invoice: options.recipient,
      assetId: options.token,
      amount: options.amount,
      feeRate
    });
    return { hash: transfer.txid, fee: feeRate, transfer };
  }
  /**
   * The transfers this wallet has sent that are still waiting on their recipient.
   *
   * See {@link transfer}: a send is not on the chain until the recipient has acknowledged
   * the consignment and this wallet has refreshed. A consumer that wants sends to complete
   * without the user thinking about it refreshes while this is not empty.
   *
   * @returns {Promise<Array<Object>>} The outgoing transfers still waiting.
   */
  async pendingHandovers() {
    return this._engine.pendingHandovers();
  }
  /**
   * Creates an invoice to receive an asset into a blinded UTXO, which tells the sender
   * nothing about this wallet beyond the identifier itself.
   *
   * @param {Object} [options] - The invoice.
   * @param {string} [options.assetId] - Restrict the invoice to one asset; any asset when omitted.
   * @param {number} [options.minutes] - How long the invoice stays valid.
   * @returns {Promise<Object>} The invoice, its recipient id and its expiry.
   */
  async receiveAsset(options = {}) {
    return this._engine.blindReceive(options);
  }
  /**
   * Creates an address to receive an asset through a witness transaction, which needs no
   * free allocation slot: the sender creates the output the asset lands on, and pays for it.
   *
   * @param {Object} [options] - The invoice.
   * @param {string} [options.assetId] - Restrict the invoice to one asset; any asset when omitted.
   * @param {number} [options.minutes] - How long the invoice stays valid.
   * @returns {Promise<Object>} The invoice.
   */
  async receiveAssetToWitness(options = {}) {
    return this._engine.witnessReceive(options);
  }
  /**
   * Issues a new asset, with the whole supply allocated to this wallet.
   *
   * @param {Object} options - The asset. See the engine's `issueAsset` for the fields.
   * @returns {Promise<Object>} The issued asset.
   */
  async issueAsset(options) {
    return this._engine.issueAsset(options);
  }
  /**
   * Signs a message as a BIP-322 simple signature, with the wallet's own address.
   *
   * @param {string} message - The message, signed verbatim.
   * @returns {Promise<string>} The signature, base64 encoded.
   */
  async sign(message) {
    const { signature } = await this._engine.signMessage(message);
    return signature;
  }
  /**
   * The address a signature from {@link sign} is checked against, and the signature itself.
   *
   * @param {string} message - The message.
   * @returns {Promise<{ address: string, signature: string }>} Both halves.
   */
  async signMessage(message) {
    return this._engine.signMessage(message);
  }
  /**
   * Creates the empty colored UTXOs that receiving requires. Receiving with no free slot
   * fails, and slots take a confirmed on-chain transaction to make.
   *
   * @param {number | bigint} [feeRate] - The fee rate in sat/vB; estimated when omitted.
   * @returns {Promise<{ created: number, slots: number }>} What was created.
   */
  async createUtxos(feeRate) {
    return this._engine.createUtxos(feeRate);
  }
  /**
   * Brings the wallet's view of the chain up to date without touching RGB state. Cheap, and
   * what a balance reads after if it is to be current.
   *
   * @returns {Promise<void>} When the wallet is in step with the chain.
   */
  async sync() {
    return this._engine.sync();
  }
  /**
   * Picks up consignments and advances the transfers waiting on them. This is the step that
   * turns a transfer someone sent into an asset this wallet holds.
   *
   * @returns {Promise<Object>} What changed.
   */
  async refresh(assetId) {
    return this._engine.refresh(assetId);
  }
  /**
   * Fails the expired invoices and deletes the ones that never received anything, which
   * releases the allocation slots they were holding.
   *
   * @returns {Promise<Object>} What was released.
   */
  async cleanup() {
    return this._engine.cleanup();
  }
  /**
   * An encrypted backup of the whole wallet, including the consignments. The recovery phrase
   * alone cannot restore RGB assets.
   *
   * @param {string} password - The password to encrypt with.
   * @returns {Promise<Uint8Array>} The backup.
   */
  async createBackup(password) {
    return this._engine.backup(password);
  }
  /**
   * Restores a backup over this wallet. The recovery phrase must be the same one.
   *
   * @param {Uint8Array} bytes - The backup.
   * @param {string} password - The password it was encrypted with.
   * @returns {Promise<void>} When the backup is restored.
   */
  async restoreBackup(bytes, password) {
    return this._engine.restoreBackup(bytes, password);
  }
  /**
   * Runs a task against the rgb-lib wallet directly, in the same queue everything else uses.
   *
   * This is the escape hatch for capabilities this module does not wrap: a consumer that
   * ships its own build of the bindings, with methods upstream does not have, reaches them
   * here. The queue is the part that matters — every binding takes a mutable borrow for the
   * whole call, so a task that runs outside it can panic the engine mid-sync and leave it
   * unusable.
   *
   * The `online` handle is null when the wallet opened with no indexer; a task that needs
   * the chain must say so itself.
   *
   * @template T
   * @param {(wallet: Object, online: Object | null) => Promise<T> | T} task - The task.
   * @returns {Promise<T>} What it returned.
   */
  async runExclusive(task) {
    return this._engine.run(() => task(this._engine.wallet, this._engine.onlineHandle));
  }
  /**
   * The rgb-lib wallet this account is built on.
   *
   * Prefer {@link runExclusive}: a call made on this object directly does not go through the
   * queue, and two of those at once panic the engine.
   *
   * @returns {Object} The wallet.
   */
  getRgbWallet() {
    return this._engine.wallet;
  }
  /** @returns {Promise<WalletAccountReadOnlyRgb>} A read-only view of this account. */
  async toReadOnlyAccount() {
    return this._readOnly;
  }
  /** Closes the wallet and drops the engine's handle on the recovery phrase. */
  dispose() {
    this._engine.dispose();
  }
};

// src/snapshots.js
init_buffer_shim();
var SNAPSHOT_DB = "rgb_lib_wallet";
var SNAPSHOT_STORE = "snapshots";
var dataDirOf = (network) => `:memory:/${network}`;
var snapshotPrefix = (network) => `${dataDirOf(network)}/`;
var isChainMismatch = (message) => /cannot connect with the original chain/i.test(String(message ?? ""));
function deleteSnapshots(prefix) {
  return new Promise((resolve, reject) => {
    let fresh = false;
    const open = indexedDB.open(SNAPSHOT_DB);
    open.onupgradeneeded = () => {
      fresh = true;
      open.transaction.abort();
    };
    open.onerror = () => fresh ? resolve(0) : reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      if (!db.objectStoreNames.contains(SNAPSHOT_STORE)) {
        db.close();
        resolve(0);
        return;
      }
      const tx = db.transaction(SNAPSHOT_STORE, "readwrite");
      const store = tx.objectStore(SNAPSHOT_STORE);
      const range = IDBKeyRange.bound(prefix, prefix + "\uFFFF");
      let n = 0;
      const count = store.count(range);
      count.onsuccess = () => {
        n = count.result;
        store.delete(range);
      };
      tx.oncomplete = () => {
        db.close();
        resolve(n);
      };
      tx.onerror = tx.onabort = () => {
        db.close();
        reject(tx.error || new Error("Could not delete the local chain data"));
      };
    };
  });
}

// src/wallet-manager-rgb.js
var ESPLORA = {
  Mainnet: "https://mempool.space/api",
  Signet: "https://mempool.space/signet/api",
  Testnet4: "https://mempool.space/testnet4/api"
};
var COIN_TYPE = { Mainnet: 0 };
var WalletManagerRgb = class extends WalletManager {
  /**
   * @param {string} seedPhrase - The BIP-39 recovery phrase. Raw seed bytes are not enough: rgb-lib derives from the phrase.
   * @param {RgbWalletConfig} [config] - The configuration.
   */
  constructor(seedPhrase, config = {}) {
    super(seedPhrase, config);
    if (typeof seedPhrase !== "string") {
      throw new TypeError("An RGB wallet needs the recovery phrase itself, not raw seed bytes.");
    }
    const network = config.network || "Signet";
    const esploraUrl = config.esploraUrl || ESPLORA[network];
    if (!esploraUrl) {
      throw new Error(`No public indexer is known for ${network}; pass esploraUrl.`);
    }
    this._mnemonic = seedPhrase;
    const slots = { ...SLOTS, ...config.slots || {} };
    const fee = { ...feeFor(network), ...config.fee || {} };
    fee.max = Math.min(fee.max, payableRate(slots));
    const dataDir = config.dataDir || dataDirOf(network);
    this._cfg = {
      network,
      dataDir,
      esploraUrl,
      proxyUrl: config.proxyUrl || null,
      minConfirmations: config.minConfirmations ?? 1,
      invoiceMinutes: config.invoiceMinutes ?? 60,
      // rgb-lib's own seal size. The sender pays it, which is the trade a witness invoice
      // makes: the recipient needs no slot of their own.
      witnessSats: config.witnessSats ?? 1e3,
      fee,
      slots,
      path: `m/86'/${COIN_TYPE[network] ?? 1}'/0'`
    };
    this._bindings = config.bindings || null;
    this._engine = null;
    this._opening = null;
  }
  /**
   * The account this wallet holds.
   *
   * @param {number} [index] - The account index. Only 0 exists.
   * @returns {Promise<WalletAccountRgb>} The account.
   * @throws {Error} If an index other than 0 is asked for.
   */
  async getAccount(index = 0) {
    if (typeof index === "string") {
      throw new UnsupportedOperationError(
        "getAccount(signerName): an RGB wallet has no signers; the engine holds the keys."
      );
    }
    if (index !== 0) {
      throw new Error(`An RGB wallet has one account; index ${index} does not exist.`);
    }
    if (!this._accounts[this._cfg.path]) {
      this._accounts[this._cfg.path] = new WalletAccountRgb(await this._open(), 0);
    }
    return this._accounts[this._cfg.path];
  }
  /**
   * @param {string} path - The derivation path.
   * @returns {Promise<WalletAccountRgb>} The account at that path.
   * @throws {Error} If the path is not this wallet's.
   */
  async getAccountByPath(path) {
    if (path !== this._cfg.path) {
      throw new Error(`An RGB wallet has one account, at ${this._cfg.path}.`);
    }
    return this.getAccount(0);
  }
  /**
   * What to bid now, in sat/vB. `fast` is the same reading with more headroom, capped by the
   * configured maximum; rgb-lib builds the transaction, so neither is a total.
   *
   * @returns {Promise<{ normal: bigint, fast: bigint }>} The fee rates.
   */
  async getFeeRates() {
    const engine = await this._open();
    const normal = await engine.feeRate();
    const fast = BigInt(Math.min(this._cfg.fee.max, Math.ceil(Number(normal) * 1.5)));
    return { normal, fast: fast > normal ? fast : normal };
  }
  /** Closes the wallet and forgets the recovery phrase held for it. */
  dispose() {
    this._engine?.dispose();
    this._engine = null;
    this._opening = null;
    this._accounts = {};
    this._mnemonic = null;
  }
  /**
   * Opens the engine once, however many callers ask at the same time.
   *
   * @private
   * @returns {Promise<Engine>} The open engine.
   */
  async _open() {
    if (this._engine) return this._engine;
    if (!this._opening) {
      this._opening = (async () => {
        if (!this._mnemonic) throw new Error("The wallet manager has been disposed.");
        const bindings = this._bindings || await Promise.resolve().then(() => (init_rgb_lib_wasm_bindings(), rgb_lib_wasm_bindings_exports));
        const engine = new Engine(bindings, this._cfg);
        await engine.open(this._mnemonic);
        this._engine = engine;
        return engine;
      })();
    }
    return this._opening;
  }
};
export {
  BIP322_TAG,
  MAINNET_FEE,
  SLOTS,
  SNAPSHOT_DB,
  SNAPSHOT_STORE,
  TEST_NETWORK_FEE,
  WalletAccountReadOnlyRgb,
  WalletAccountRgb,
  bid,
  buildToSignPsbt,
  buildVirtualTxs,
  clearingRate,
  dataDirOf,
  decodeAddress,
  WalletManagerRgb as default,
  deleteSnapshots,
  explainReceiveError,
  explainSendError,
  extractWitness,
  feeFor,
  freeSlots,
  isChainMismatch,
  scriptPubKeyOf,
  signatureFromWitness,
  slotBlocker,
  slotCost,
  slotsToCreate,
  snapshotPrefix,
  taggedHash,
  usableEmptySlots
};
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

@noble/hashes/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
