import axios from "axios";
import { encryptData } from "./AES";
import { VUE_APP_API_URL } from "./Global";
import { FormDx, BearToken } from "./Helper";

// require token
export const getPermissions = async (token = "") => {
  try {
    const formData = FormDx({ id: 0 });
    const response = await axios.post(
      `${VUE_APP_API_URL}users/get-user-permissions`,
      formData,
      BearToken(token)
    );
    if (response) {
      const encryptedData = encryptData(response.data.permissions);
      localStorage.setItem("pe-001", encryptedData);
    }
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return []; // You may want to handle errors more gracefully based on your use case
  }
};
export const getRoles = async (token = "") => {
  try {
    const formData = FormDx({ id: 0 });
    const response = await axios.post(
      `${VUE_APP_API_URL}roles/all-roles-dropdown`,
      formData,
      BearToken(token)
    );
    if (response) {
      const encryptedData = encryptData(response.data.roles);
      localStorage.setItem("ro-001", encryptedData);
    }
  } catch (error) {
    // Handle the error (log, throw, etc.)
    console.error("Error fetching list roles:", error);
    return []; // You may want to handle errors more gracefully based on your use case
  }
};
export const getUnits = async (token = "") => {
  try {
    const formData = FormDx({ id: 0 });
    const response = await axios.post(
      `${VUE_APP_API_URL}units/dropdown`,
      formData,
      BearToken(token)
    );
    if (response) {
      const encryptedData = encryptData(response.data.units);
      localStorage.setItem("un-001", encryptedData);
    }
  } catch (error) {
    // Handle the error (log, throw, etc.)
    console.error("Error fetching units:", error);
    return []; // You may want to handle errors more gracefully based on your use case
  }
};
