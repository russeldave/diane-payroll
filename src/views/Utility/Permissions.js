import { ROLE,PERMISSION } from './Global';
import { decryptData } from './AES';

export const hasPermission = (permission) => {
    return checkRoleForPermission(permission);
};
export const filterPermissionPerId = (permission, id) => {
    return permissionPerId(permission, id);
};
const permissionPerId = (permission,id) => {

    const permissionsMapPerId = {
        "remove_charge": [1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17],
        "edit_charge": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        "remove_payment_method": [1, 2, 3, 4, 5, 6,7,8,9],
        "edit_payment_method": [1, 2, 3, 4, 5, 6,7,8,9],
    };
    if (!permissionsMapPerId.hasOwnProperty(permission)) {
        console.error(`Permission "${permission}" is not defined.`);
        return false;
    }
    return permissionsMapPerId[permission].includes(id);
}
const checkRoleForPermission = (permission) => {
    const permissionMap = PERMISSION();

    if(permissionMap){
         // Find the object with the matching permission key
        const foundPermission = permissionMap.find(item => item.permission === permission);
        // Check if the permission is found
        if (!foundPermission) {
            console.log(`Permission "${permission}" not found.`);
            return false; // or handle it accordingly based on your requirements
        }
       
        // Return the value of hasPermission if the permission is found
        return foundPermission.hasPermission;
    }
    return false;
}
