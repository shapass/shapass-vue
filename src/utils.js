const Utils = {
  shapass (input, algo, length=32) {
    if (algo === 'sha256-str') {
      return btoa(sha256(input)).substr(0, length);
    } else if (algo === 'sha256-bin') {
      return base64js.fromByteArray(sha256.digest(input)).substr(0, length);
    } else {
      return '';
    }
  }
}

export default Utils;
