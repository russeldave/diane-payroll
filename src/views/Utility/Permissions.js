import { ROLE, PERMISSION } from "./Global";

export const hasPermission = (permission) => {
  return checkPermissionFromStorage(permission);
};

export const filterPermissionPerId = (permission, id) => {
  return permissionPerId(permission, id);
};

const permissionPerId = (permission, id) => {
  const permissionsMapPerId = {
    remove_charge: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    edit_charge: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    remove_payment_method: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    edit_payment_method: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  };

  if (!permissionsMapPerId.hasOwnProperty(permission)) {
    console.error(`Permission "${permission}" is not defined.`);
    return false;
  }

  return permissionsMapPerId[permission].includes(id);
};

const checkPermissionFromStorage = (permission) => {
  try {
    const storedPermissions = JSON.parse(localStorage.getItem("pe-001")) || [];

    if (!Array.isArray(storedPermissions)) {
      console.warn("Invalid permission format in localStorage:", storedPermissions);
      return false;
    }

    const found = storedPermissions.find(
      (item) => item.permission === permission
    );

    return !!found?.hasPermission;
  } catch (error) {
    console.error("Permission check failed:", error);
    return false;
  }
};


