import Swal from "sweetalert2";
import JsBarcode from 'jsbarcode';
import axios from "axios";
import { IS_DEV } from "./Global";
import { ref } from 'vue';

export const FormDx = (obj, formData = new FormData(), namespace = '') => {
  for (const [key, value] of Object.entries(obj)) {
    const formKey = namespace ? `${namespace}[${key}]` : key;

    if (value instanceof Date) {
      formData.append(formKey, value.toISOString());
    } else if (value instanceof File) {
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      // Handle arrays, including empty arrays
      value.forEach((element, index) => {
        const tempKey = `${formKey}[${index}]`;
        if (typeof element === 'object' && element !== null) {
          FormDx(element, formData, tempKey); // Recursively handle nested objects in arrays
        } else {
          formData.append(tempKey, element);
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      // Handle nested objects
      FormDx(value, formData, formKey);
    } else {
      // Handle primitive values
      formData.append(formKey, value);
    }
  }
  return formData;
};


export const BearToken = (passedToken) => {
  return {
    headers: {
      Authorization: `Bearer ${passedToken}`,
      'Content-Type': 'multipart/form-data', // Ensure this header for file uploads
    },
  };
};

export const handleApiError = (error) => {

  // Check if the error is an Axios error with a response object
  if (error.response) {
    // Handle unauthorized access (401)
    // Handle other response errors (any error not captured above)
    
    if (error.response && error.response.status === 401) {
      Toast('error', 'Invalid Token!', 'Token unauthenticated! Please try logout if error persists.');
      // Optionally, you can redirect the user to the login page or perform other actions
      // handleLogout();
    }
    // Handle request timeouts (ECONNABORTED)
    else if (error.code === 'ECONNABORTED') {
      Toast('error', 'Request Timeout', 'The request took too long and was aborted. Please try again.');
    }
    // Handle network errors (ERR_NETWORK)
    else if (error.code === 'ERR_NETWORK') {
      Toast('error', 'Network Error', 'There was a problem reaching the server. Please check your internet connection and try again.');
    }
    // Handle forbidden access (403)
    else if (error.response && error.response.status === 403) {
      Toast('error', 'Error!', error.response.data.message);
    }
    // Handle not found errors (404)
    else if (error.response && error.response.status === 404) {
      Toast('error', 'Error!', error.response.data.message);
    }
    // Handle server errors (500)
    else if (error.response && error.response.status >= 500 && error.response.status < 600) {
      Toast('error', 'Server Error', 'There was a problem on the server. Please try again later.');
    }

    // Handle network errors (no response from server)
    else if (!error.response) {
      Toast('error', 'Network Error', 'There was a problem reaching the server. Please check your internet connection and try again.');
    }
    // Handle other unexpected errors
    else {
      const errorMessage = IS_DEV ? error.message : 'Something went wrong. Please try again.';
      Toast('warning', 'Warning!', error.response.data.message);
    }
  } else {
    // Handle unexpected errors that are not Axios-related (e.g., unexpected code execution errors)
    const errorMessage = IS_DEV ? error.message : 'Something went wrong. Please try again.';
    Toast('error', 'Error', errorMessage);
  }
};

const handleLogout = () => {
  // Clear all related authentication data
  localStorage.removeItem('token');
  // Redirect to login page or handle other logout actions
  window.location.href = '/'; // Redirect to login page (adjust path as needed)
};

export const Hydra = () => {
  return {
      headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Credentials': true,
          'Sec-Fetch-Mode': no-cors,
          'Sec-Fetch-Site': cross-site,
      },
  };
}

//ALERT(icon,title,message);
export const AlertV1 = (icon,title,message) => {
  return Swal.fire({
      icon: icon,
      title: title,
      text: message,
  });
}

export const Alert = (icon, title, message) => {
  return Swal.fire({
    icon: icon,
    title: title,
    text: message,
    toast: true,               // Enable toast mode
    position: 'top-end',       // Position the toast in the top-right corner
    showConfirmButton: false,  // Remove the confirm button
    timer: 3000,               // Auto-close after 3 seconds (adjustable)
    timerProgressBar: true,    // Show a progress bar
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
}
export const AlertHtml = (icon, title, message) => {
  return Swal.fire({
    icon: icon,
    title: title,
    html: message,
    toast: true,               // Enable toast mode
    position: 'top-end',       // Position the toast in the top-right corner
    showConfirmButton: false,  // Remove the confirm button
    timer: 3000,               // Auto-close after 3 seconds (adjustable)
    timerProgressBar: true,    // Show a progress bar
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
}

export const Toast = (icon, title, message) => {
  return Swal.fire({
    icon: icon,
    title: title,
    text: message,
    toast: true,               // Enable toast mode
    position: 'top-end',       // Position the toast in the top-right corner
    showConfirmButton: false,  // Remove the confirm button
    timer: 3000,               // Auto-close after 3 seconds (adjustable)
    timerProgressBar: true,    // Show a progress bar
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
}

export const showProcessing = (message = "Processing your request") => {
  return Swal.fire({
    title: "Processing...",
    text: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeProcessing = () => {
  Swal.close();
};

export const replaceUnderScore = (text) => {
  // Split the text by underscores
  const words = text.split('_');

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

  // Join the words back together with spaces
  const result = capitalizedWords.join(' ');

  return result;
};
export const replaceSpaceWithUnderScore = (text) => {
  // Split the text by spaces
  return text.replace(/\s/g, '_');
} 
export const barcodeConverter = async (id, text) => {
  try {
    if (!text) {
      console.error('Text for barcode is empty');
      return false;
    }
    // Generate new barcode
    JsBarcode(id, text,{
      displayValue: true,
    });

    return true; // Success
  } catch (error) {
    console.error('Error generating barcode:', error);
    return false; // Error
  }
};

export const barcodeConverter2 = async (id, text, options = {}) => {
  try {
    if (!text || text.trim() === '') {
      console.error('Text for barcode is empty');
      return false;
    }

    // Remove # if present
    const elementId = id.replace('#', '');
    
    // Find the element
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error(`Element with id "${elementId}" not found in DOM`);
      console.log('Available elements:', 
        Array.from(document.querySelectorAll('[id]')).map(el => ({ 
          id: el.id, 
          tag: el.tagName,
          visible: el.offsetParent !== null 
        }))
      );
      throw new Error(`Element #${elementId} not found`);
    }

    // Check if element is visible/in DOM
    if (!element.offsetParent && element.style.display === 'none') {
      console.warn(`Element #${elementId} exists but is not visible`);
    }

    // Default options
    const defaultOptions = {
      format: "CODE128",
      displayValue: true,
      fontSize: 12,
      background: "#ffffff",
      lineColor: "#000000",
      margin: 10,
      width: 2,
      height: 80,
      textMargin: 0,
      ...options
    };

    // Clear any existing content
    element.innerHTML = '';

    // Generate barcode
    JsBarcode(`#${elementId}`, text.trim(), defaultOptions);
    
    console.log(`Successfully generated barcode for #${elementId}`);
    return true;
    
  } catch (error) {
    console.error('Error generating barcode:', error);
    console.error('Error details:', {
      id,
      text: text?.substring(0, 20) + (text?.length > 20 ? '...' : ''),
      textLength: text?.length,
      errorMessage: error.message,
      errorName: error.name,
      timestamp: new Date().toISOString()
    });
    return false;
  }
};

export const useDebounce = (func, delay) => {
  //use delay if you want a custom delay debounce
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, 800);
  };
};

//although function name is formatter, this function is a helper type of function
export const moneyFormatter = (number) => {
  // Ensure the input is a number
  if (isNaN(number)) {
      return 'Invalid input'; // Return a meaningful message or handle the error as needed
  }

  // Create a new NumberFormat object for PHP Peso
  const formatter = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  });

  // Format the number
  return formatter.format(number);
};

export const formatNumberWithCommas = (number) => {
  return parseFloat(number ?? 0).toLocaleString();
};


export const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};

export const convertStringToArray = (str) => {
  try {
    // Replace single quotes with double quotes for valid JSON
    const sanitizedStr = str.replace(/'/g, '"');
    
    // Parse the sanitized string to get the array
    return JSON.parse(sanitizedStr);
  } catch (error) {
    console.error('Error parsing string to array:', error);
    return [];
  }
};
//convert date to timestamp Y-m-d H:i:s Format
export const dateToTimeStamp = (timestamp) => {
  const dateObject = new Date(timestamp);

  const year = dateObject.getFullYear();
  const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  const day = ("0" + dateObject.getDate()).slice(-2);
  const hours = ("0" + dateObject.getHours()).slice(-2);
  const minutes = ("0" + dateObject.getMinutes()).slice(-2);
  const seconds = ("0" + dateObject.getSeconds()).slice(-2);

  // Combine components to form "Y-m-d H:i:s" format
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
};


export const convertWordToDate = (word) => {
  const date = new Date(word);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; 
}

export const formatDateTo24Hour = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const generateRandomHex = () => {
  let color;
  do {
    color = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
  } while (isColorTooLight(color));
  return color;
};

// Optional: Generate an array of random hex colors
export const generateRandomHexArray = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(generateRandomHex());
  }
  return colors;
};


export const formatQuantityColor = (qty) => {
  const qtyClass = (qty ?? 0) >= 0 ? "text-black-500 font-bold" : "text-red-500 font-bold";
  return qtyClass;
};


const isColorTooLight = (hex) => {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Calculate brightness (perceived luminance)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 200; // tweak this threshold as needed
};

export const mrfStatusFormatter = (status_id) => {
    switch (status_id) {
      case 1:
        return 'Pending';
        break;
      case 2:
        return 'Completed';
        break;
      case 7:
        return 'Cancelled';
        break;
      default:
        return 'No Data';
        break;
    }
}
export const mrfStatusClassFormatter = (status_id) => {
  switch (status_id) {
    case 1:
      return 'bg-blue-500 text-blue-200 text-xs';
      break;
    case 2:
      return 'bg-green-500 text-green-200 text-xs';
      break;
    case 7:
      return 'bg-red-500 text-red-200 text-xs';
      break;
    default:
      return 'No Data';
      break;
  }
}
export const typeFormatter = (type) => {
  //switch cause for future new type of item
  switch (type) {
    case 1:
      return 'Fixed Asset/Movable';
      break;
    case 0:
      return 'Consumable';
      break; 
    default:
      return 'Consumable';
      break;
  }
}