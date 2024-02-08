var CryptoJS = require("crypto-js");

// Encrypt
export function encryptLink(url) {
  const ciphertext = CryptoJS.AES.encrypt(url, "secret key 123").toString();
  return ciphertext;
}

// Decrypt
export function decryptLink(url) {
  const bytes = CryptoJS.AES.decrypt(url, "secret key 123");
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}
