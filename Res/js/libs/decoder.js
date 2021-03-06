var toUTF8Array = function(str) {
  str = unescape(encodeURIComponent(str));
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
};

var fromUTF8Array = function(buf) {
  var str = String.fromCharCode.apply(null, buf);
  return decodeURIComponent(escape(str));
};

function encodeArrayOfStrings(strings, encoding) {
  var encoder, encoded, len, i, bytes, view, offset;

  encoder = TextEncoder(encoding);
  encoded = [];

  len = Uint32Array.BYTES_PER_ELEMENT;
  for (i = 0; i < strings.length; i += 1) {
    len += Uint32Array.BYTES_PER_ELEMENT;
    encoded[i] = TextEncoder(encoding).encode(strings[i]);
    len += encoded[i].byteLength;
  }

  bytes = new Uint8Array(len);
  view = new DataView(bytes.buffer);
  offset = 0;

  view.setUint32(offset, strings.length);
  offset += Uint32Array.BYTES_PER_ELEMENT;
  for (i = 0; i < encoded.length; i += 1) {
    len = encoded[i].byteLength;
    view.setUint32(offset, len);
    offset += Uint32Array.BYTES_PER_ELEMENT;
    bytes.set(encoded[i], offset);
    offset += len;
  }
  return bytes.buffer;
}

function decodeArrayOfStrings(buffer, encoding) {
  var decoder, view, offset, num_strings, strings, i, len;

  decoder = TextDecoder(encoding);
  view = new DataView(buffer);
  offset = 0;
  strings = [];

  num_strings = view.getUint32(offset);
  offset += Uint32Array.BYTES_PER_ELEMENT;
  for (i = 0; i < num_strings; i += 1) {
    len = view.getUint32(offset);
    offset += Uint32Array.BYTES_PER_ELEMENT;
    strings[i] = decoder.decode(
      new DataView(view.buffer, offset, len));
    offset += len;
  }
  return strings;
}