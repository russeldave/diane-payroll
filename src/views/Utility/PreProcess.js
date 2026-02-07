import { FormDx } from "./Helper";

// require token
export const getPermissions = async () => {
  console.log('getpermmissions')
  try {
    const response = await axios.post(
      `api/users/get-user-permissions`
    );
    if (response) {
      const encryptedData = response.data.permissions;
      localStorage.setItem("pe-001", JSON.stringify(encryptedData));
    }
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return []; // You may want to handle errors more gracefully based on your use case
  }
};
export const getRoles = async () => {
  try {
    const formData = FormDx({ id: 0 });
    const response = await axios.post(
      `api/roles/all-roles-dropdown`,
      formData
    );
    if (response) {
      const encryptedData = response.data.roles;
      localStorage.setItem("ro-001", JSON.stringify(encryptedData));
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
      `api/units/dropdown`,
      formData
    );
    if (response) {
      const encryptedData = response.data.units;
      localStorage.setItem("un-001", JSON.stringify(encryptedData));
    }
  } catch (error) {
    // Handle the error (log, throw, etc.)
    console.error("Error fetching units:", error);
    return []; // You may want to handle errors more gracefully based on your use case
  }
};
