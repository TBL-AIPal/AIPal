const crypto = require('crypto');

/**
 * Encrypts a string using AES-256-CBC.
 *
 * @param {string} text - The plaintext to encrypt.
 * @param {string} encryptionKey - The encryption key (32 bytes in hex).
 * @returns {string} - The encrypted text in the format "iv:encryptedText".
 */
const encrypt = (text, encryptionKey) => {
  console.log('Encryption Key:', encryptionKey);
console.log('Key Length:', encryptionKey.length);
console.log('Is Valid Hex:', /^[0-9A-Fa-f]+$/.test(encryptionKey)); // Should return true

  const iv = crypto.randomBytes(16); // Generate a random initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`; // Combine IV and encrypted text
};

/**
 * Decrypts a string encrypted with AES-256-CBC.
 *
 * @param {string} encryptedText - The encrypted text in the format "iv:encryptedText".
 * @param {string} encryptionKey - The encryption key (32 bytes in hex).
 * @returns {string} - The decrypted plaintext.
 */
const decrypt = (encryptedText, encryptionKey) => {
  const [ivHex, encryptedHex] = encryptedText.split(':'); // Split IV and encrypted text
  if (!ivHex || !encryptedHex) {
    throw new Error('Invalid encrypted text format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = { encrypt, decrypt };
