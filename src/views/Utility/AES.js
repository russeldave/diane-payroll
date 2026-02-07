import CryptoJS from 'crypto-js';
import { FRIED_CHICKEN } from './Global';

// Function to decrypt data using AES decryption and John is Cute 🍗
export const decryptData = (encryptedData) => {
  try {
    if (
      !encryptedData ||
      encryptedData === 'null' ||
      encryptedData === 'undefined' ||
      encryptedData === '000000'
    ) {
      return '';
    }

    const bytes = CryptoJS.AES.decrypt(encryptedData, FRIED_CHICKEN);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) return '';

    return JSON.parse(decrypted);
  } catch (error) {
    console.warn("Invalid encrypted payload. Clearing storage.", encryptedData);
    return '';
  }
};
// Function to encrypt data using AES encryption and John is Cute 🍗
export const encryptData = (data) => {
  try {
    if (data === null || data === undefined) return null;

    return CryptoJS.AES.encrypt(JSON.stringify(data), FRIED_CHICKEN).toString();
  } catch (error) {
    console.error('Error encrypting data:', error, data);
    return null;
  }
};
