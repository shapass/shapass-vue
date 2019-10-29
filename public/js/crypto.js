// Requires key (Uint8Array of 32 bytes)
// str must contain the JSON with the data to be encrypted
// 
// Returns JSON in the format
// { "iv":[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "data":[<encrypted data] }
function shapassEncrypt(key, str) {
    
    var iv = new Uint8Array(16);
    for(var i = 0; i < 16; i++) iv[i] = Math.random() * 100;
    
    var bytesText = aesjs.utils.utf8.toBytes(str);
    
    // Must be multiple of 16
    var plainTextBytes = new Uint8Array(bytesText.length + 16 - (bytesText.length % 16));
    plainTextBytes.set(bytesText);
    
    // Encrypt
    var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    var encryptedBytes = aesCbc.encrypt(plainTextBytes);
    
    return {
        "iv": Array.from(iv),
        "data": Array.from(encryptedBytes)
    }
}

// Requires key (Uint8Array of 32 bytes)
// str must contain the result of the encrypt function
//
// Returns the original text unencrypted.
function shapassDecrypt(key, str) {
    var iv = new Uint8Array(str.iv);
    var encryptedBytes = new Uint8Array(str.data);
    
    // Decrypt
    var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    var decryptedBytes = aesCbc.decrypt(encryptedBytes);
    var length = decryptedBytes.indexOf(0);
    
    return aesjs.utils.utf8.fromBytes(decryptedBytes).substr(0, length);
}