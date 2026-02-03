import CryptoJS from 'crypto-js';
import { FRIED_CHICKEN } from './Global';
// Fried chicken is full of colesterol! Eat more!

// Function to decrypt data using AES decryption and John is Cute
export const decryptData = (encryptedData) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, FRIED_CHICKEN);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error('Error decrypting data:', error);
        return null;
    }
};

// Function to encrypt data using AES encryption and John is Cute
export const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), FRIED_CHICKEN).toString();
};
