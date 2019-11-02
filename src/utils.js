const Utils = {
  shapass (input, algo, length=32) {
    if (algo === 'sha256-str') {
      return btoa(sha256(input)).substr(0, length);
    } else if (algo === 'sha256-bin') {
      return base64js.fromByteArray(sha256.digest(input)).substr(0, length);
    } else {
      return '';
    }
  },

  // Requires key (Uint8Array of 32 bytes)
  // str must contain the JSON with the data to be encrypted
  //
  // Returns JSON in the format
  // { "iv":[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "data":[<encrypted data] }
  shapassEncrypt (key, decrypted) {
    var ikey = (key instanceof Uint8Array) ? key : new TextEncoder("utf-8").encode(key);
    ikey = ikey.slice(0, 32);
    var iv = new Uint8Array(16);
    for(var i = 0; i < 16; i++) iv[i] = Math.random() * 100;

    if (typeof decrypted === 'string') {
      var str = decrypted;
    } else {
      var str = JSON.stringify(decrypted);
    }

    var bytesText = aesjs.utils.utf8.toBytes(str);

    // Must be multiple of 16
    var plainTextBytes = new Uint8Array(bytesText.length + 16 - (bytesText.length % 16));
    plainTextBytes.set(bytesText);

    // Encrypt
    var aesCbc = new aesjs.ModeOfOperation.cbc(ikey, iv);
    var encryptedBytes = aesCbc.encrypt(plainTextBytes);

    return JSON.stringify({
      "iv": Array.from(iv),
      "data": Array.from(encryptedBytes)
    });
  },

  // Requires key (Uint8Array of 32 bytes)
  // str must contain the result of the encrypt function
  //
  // Returns the original text unencrypted.
  shapassDecrypt (key, encrypted) {
    var obj = (typeof encrypted == 'string') ? JSON.parse(encrypted) : encrypted;
    var iv = new Uint8Array(obj.iv);
    var encryptedBytes = new Uint8Array(obj.data);
    var ikey = (key instanceof Uint8Array) ? key : new TextEncoder("utf-8").encode(key);
    ikey = ikey.slice(0, 32);

    // Decrypt
    var aesCbc = new aesjs.ModeOfOperation.cbc(ikey, iv);
    var decryptedBytes = aesCbc.decrypt(encryptedBytes);
    var length = decryptedBytes.indexOf(0);

    return aesjs.utils.utf8.fromBytes(decryptedBytes).substr(0, length);
  },
};

export default Utils;
