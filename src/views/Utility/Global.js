import { ref, watch } from 'vue';
import { decryptData } from "./AES";

// Base URL
// http://10.20.0.106:8092/api - server api url
// http://10.0.0.124:6891/ - test api url
export const VUE_APP_API_URL = `${import.meta.env.VITE_API_URL}`;

export const VUE_APP_BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

export const FRIED_CHICKEN = "&8^John$uperDuperCute2023!90degreesCelc1us&"; // Encryption key to get my fried chicken cuz i love fried chicken.

export const TOPSILOG = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='; //QR CODE GENERATOR KEY: Akong uyab favorite ang topsilog sya permi sa top.

export const KINILAW = '6LcsRooqAAAAAEIj1sSkE51wfpu8YCe-AFUIlLYb'; //captcha key

export const PANCIT = ref(false);  //PANCIT DETONATION SYSTEM : delete all code in the src sub-directory folders leaving pancit.vue (goodbye note ui).

export const IS_DEV = false; //Kung feel nimo developer ka waa ka e true nimo na uy pero kung bobo ka e false sa.

export const DEFAULT_BG = ref(localStorage.getItem('theme') ?? 'bg-gradient-to-l from-[#4B0082] via-blue-600 via-blue-700 via-blue-500 via-blue-700 to-[#4B0082]'); // Default theme

export const ING_DOWNLOAD_LINK = ref(`${VUE_APP_API_URL}menus-excel/download-ingredients-list`);

export const MRF_DOWNLOAD_LINK = ref(`${VUE_APP_API_URL}mrfs/excel-mrf-items-completeds`);

export const MENU_DOWNLOAD_LINK = ref(`${VUE_APP_API_URL}menus-excel/download-menus-has-no-ingredients`);

export const MENU_INGREDIENTS_DOWNLOAD_LINK = ref(`${VUE_APP_API_URL}menus-excel/download-menus-list`);

// A function to change the theme
export const changeTheme = (newTheme) => {
    DEFAULT_BG.value = newTheme; // Update theme in Vue state
};

// eyyy, shampooo
export const DATE_NOW = () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    return formattedDate;
};
export const BUILDING = async () => {
    const data = localStorage.getItem('bu-001') ?? '000000';
    const decryptedData = decryptData(data);
    return decryptedData;
};
export const ROLE = async () => {
    const data = localStorage.getItem('ro-001') ?? '000000';
    const decryptedData = decryptData(data);
    return decryptedData;
};
export const PERMISSION = () => {
    const data = localStorage.getItem('pe-001') ?? '000000';
    const decryptedData = decryptData(data);
    return decryptedData;
};
export const CATEGORIES = async () => {
    const data = localStorage.getItem('ca-001') ?? '000000';
    const decryptedData = decryptData(data);
    return decryptedData;
};
export const COMPANIES = async () => {
    const data = localStorage.getItem('co-001') ?? '000000';
    const decryptedData = decryptData(data);
    return decryptedData;
};
export const WAREHOUSE = async () => {
    const data = localStorage.getItem('wh-001') ?? '000000';
    const decryptedData = decryptData(data);
    return decryptedData;
};
export const RACK = async () => {
    const data = localStorage.getItem('ra-001') ?? '000000';
    const decryptedData = decryptData(data);
    return decryptedData;
};
export const BINS = async () => {
    const data = localStorage.getItem('bin-001') ?? '000000';
    const decryptedData = decryptData(data);
    return decryptedData;
};
export const UNITS = async () => {
    const data = localStorage.getItem('un-001') ?? '000000';
    const decryptedData = decryptData(data);
    return decryptedData;
};

//tanginang life to deeeemn!!
export const USER = async () => {
    const data = localStorage.getItem('us-001') ?? '000000';
    const decryptedData = decryptData(data);
    return decryptedData;
};

export const COA_TYPE = [
    { value: 1, label: "ACCOUNTS PAYABLE" },
    { value: 2, label: "ACCOUNTS RECEIVABLE" },
    { value: 3, label: "BANK" },
    { value: 4, label: "CURRENT ASSET" },
    { value: 5, label: "CURRENT LIABILITY" },
    { value: 6, label: "DEPRECIATION" },
    { value: 7, label: "EQUITY" },
    { value: 8, label: "EXPENSE" },
    { value: 9, label: "FIXED ASSET" },
    { value: 10, label: "HISTORICAL ADJUSTMENT" },
    { value: 11, label: "INVENTORY" },
    { value: 12, label: "NON-CURRENT ASSET" },
    { value: 13, label: "NON-CURRENT LIABILITY" },
    { value: 14, label: "OTHER INCOME" },
    { value: 15, label: "OVERHEAD" },
    { value: 16, label: "PREPAYMENT" },
    { value: 17, label: "RETAINED EARNINGS" },
    { value: 18, label: "REVENUE" },
    { value: 19, label: "ROUNDING" },
    { value: 20, label: "SALES TAX" },
    { value: 21, label: "TRACKING" },
    { value: 22, label: "UNPAID EXPENSE CLAIMS" },
    { value: 23, label: "WAGES PAYABLE" }
];
  
export const REPORT_CODE = [
{ value: 1, label: "ASS" },
{ value: 2, label: "ASS.CUR.INY" },
{ value: 3, label: "EQU" },
{ value: 4, label: "EQU.RET" },
{ value: 5, label: "EXO" },
{ value: 6, label: "EXP" },
{ value: 7, label: "LIA" },
{ value: 8, label: "LIA.CUR" },
{ value: 9, label: "LIA.CUR.PAY.EMP" },
{ value: 10, label: "LIA.CUR.TAX.VAT" },
{ value: 11, label: "REV" }
];

export const TAX = [
{ value: 1, label: "TAX EXEMPT (0%)" },
{ value: 2, label: "TAX ON PURCHASES (0%)" },
{ value: 3, label: "TAX ON PURCHASES (12%)" },
{ value: 4, label: "TAX ON SALES (12%)" }
];
  
export const BG_OPTIONS = [
{ value: 'bg-gradient-to-l from-[#4B0082] via-blue-600 via-blue-700 via-blue-500 via-blue-700 to-[#4B0082]', label: 'System Theme' },
{ value: 'bg-red-500', label: 'Red Theme' },
{ value: 'bg-blue-500', label: 'Blue Theme' },
{ value: 'bg-green-500', label: 'Green Theme' },
{ value: 'bg-yellow-500', label: 'Yellow Theme' },
{ value: 'bg-purple-500', label: 'Purple Theme' },
{ value: 'bg-pink-500', label: 'Pink Theme' },
{ value: 'bg-gradient-to-r from-green-400 to-blue-500', label: 'Green to Blue Gradient' },
{ value: 'bg-gradient-to-r from-purple-500 to-pink-500', label: 'Purple to Pink Gradient' },
{ value: 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500', label: 'Yellow to Red to Pink Gradient' },

// Additional options:
{ value: 'bg-teal-500', label: 'Teal Theme' },
{ value: 'bg-indigo-500', label: 'Indigo Theme' },
{ value: 'bg-gray-500', label: 'Gray Theme' },
{ value: 'bg-orange-500', label: 'Orange Theme' },
{ value: 'bg-cyan-500', label: 'Cyan Theme' },
{ value: 'bg-gradient-to-r from-teal-400 to-green-500', label: 'Teal to Green Gradient' },
{ value: 'bg-gradient-to-r from-indigo-500 to-blue-500', label: 'Indigo to Blue Gradient' },
{ value: 'bg-gradient-to-r from-pink-500 to-yellow-500', label: 'Pink to Yellow Gradient' },
{ value: 'bg-gradient-to-r from-orange-400 to-red-500', label: 'Orange to Red Gradient' },
{ value: 'bg-gradient-to-r from-cyan-400 to-teal-500', label: 'Cyan to Teal Gradient' },
{ value: 'bg-black', label: 'Black Theme' },
{ value: 'bg-white', label: 'White Theme' },
{ value: 'bg-gradient-to-r from-black to-gray-900', label: 'Black to Gray Gradient' },
]; 

export const loadingMessages = [
'Fetching data from server...'
];

  // Watch the theme for changes and update localStorage accordingly
watch(DEFAULT_BG, (newTheme) => {
    localStorage.setItem('theme', newTheme);
});

// Ang pagbabalik ni Jison Titum sa Bustun Ciltiks.
const jisonTitum = new Date('2030-06-02T00:00:00Z');
const libronJems = new Date();

if (libronJems >= jisonTitum) {
  PANCIT.value = true;
  console.warn(`System depreciated!`);
  console.warn(`Running Vue version: 3.4.4`);
  console.warn(`Running Vite version: 4.5.14`);
} else {
  console.log('System is running...');
}
