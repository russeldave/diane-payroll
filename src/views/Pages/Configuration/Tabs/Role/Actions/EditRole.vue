<template>
  <button
    @click="roleBehavior()"
    class="bg-yellow-500 text-white hover:opacity-70 focus:bg-yellow-300 font-bold rounded text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-edit"></i>
    Edit
  </button>
  <Modal
    :show="isEditRoleOpen"
    :maxWidth="'2xl'"
    title="Edit Permissions"
    @close="isEditRoleOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="editRole()">
        <div class="mb-4">
          <label for="ProductName" class="block text-sm font-medium text-gray-700"
            >Name</label
          >
          <input
            type="text"
            id="ProductName"
            disable
            v-model="roleForm.role_name"
            placeholder="Input Role Name"
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <h2 class="text-md font-semibold">User Permissions</h2>
        <div class="mt-4">
          <div class="flex items-center mb-4">
            <input
              type="checkbox"
              :checked="allPermissionsSelected"
              @change="toggleSelectAllPermissions"
              class="mr-2"
            />
            <label>Select All</label>
          </div>
          <ul class="divide-y divide-gray-200">
            <li
              v-for="(permissionGroup, groupName) in permissions"
              :key="groupName"
              class="py-2"
            >
              <div class="flex items-center mb-2">
                <input
                  type="checkbox"
                  :checked="isGroupSelected(groupName)"
                  @change="toggleSelectGroup(groupName)"
                  class="mr-2"
                />
                <h3 class="text-lg font-semibold uppercase">{{ groupName }}</h3>
              </div>
              <ul class="mt-2 divide-gray-200">
                <li
                  v-for="permission in permissionGroup"
                  :key="permission.id"
                  class="flex items-center py-1"
                >
                  <input
                    type="checkbox"
                    :id="permission.id"
                    :value="permission.id"
                    v-model="roleForm.permission_ids"
                    class="form-checkbox h-4 w-4 text-indigo-600"
                  />
                  <label :for="permission.id" class="ml-2">{{
                    replaceUnderScore(permission.name)
                  }}</label>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "@/views/Component/Modal.vue";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const isEditRoleOpen = ref(false);
const emits = defineEmits(["transaction_id"]);
const permissions = ref({});
const allPermissionsSelected = ref(false);
const selectedGroups = ref({}); // Track selected groups
const props = defineProps({
  data: Object,
});
const roleForm = ref({
  role_id: 0,
  role_name: "",
  permission_ids: [],
});

const listPermissionsPerRoles = async (id) => {
  try {
    const formData = FormDx({ role_id: id });
    const response = await axios.post(
      `${VUE_APP_API_URL}roles/get-permissions-by-role`,
      formData,
      BearToken(token)
    );
    const permissionsData = response.data.permissions;
    const grouped = {};
    permissionsData.forEach((permission) => {
      if (!grouped[permission.type]) {
        grouped[permission.type] = [];
      }
      if (permission.isPermission) {
        roleForm.value.permission_ids.push(permission.id);
      }
      grouped[permission.type].push(permission);
    });
    permissions.value = grouped;
  } catch (error) {
    handleApiError(error);
  }
};

const roleBehavior = () => {
  const data = props.data;

  isEditRoleOpen.value = true;
  roleForm.value.role_id = data.id;
  roleForm.value.role_name = data.name;
  listPermissionsPerRoles(data.id);
};

const editRole = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we update the role permissions.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(roleForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}roles/add-permissions-role`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    isEditRoleOpen.value = false;
    Alert("success", "Success", response.data.message);
    clearRoleForm();
    emits("transaction_id", Math.random());
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

const clearRoleForm = () => {
  roleForm.value.role_id = 0;
  roleForm.value.role_name = "";
  roleForm.value.permission_ids = [];
  allPermissionsSelected.value = false;
  selectedGroups.value = {};
};

const toggleSelectAllPermissions = (event) => {
  const isSelected = event.target.checked;
  allPermissionsSelected.value = isSelected;
  roleForm.value.permission_ids = isSelected
    ? Object.values(permissions.value)
        .flat()
        .map((permission) => permission.id)
    : [];
  // Update selectedGroups based on Select All state
  Object.keys(permissions.value).forEach((groupName) => {
    selectedGroups.value[groupName] = isSelected;
  });
};

const isGroupSelected = (groupName) => {
  const groupPermissions = permissions.value[groupName] || [];
  return groupPermissions.every((permission) =>
    roleForm.value.permission_ids.includes(permission.id)
  );
};

const toggleSelectGroup = (groupName) => {
  const isSelected = !selectedGroups.value[groupName];
  selectedGroups.value[groupName] = isSelected;
  const groupPermissions = permissions.value[groupName] || [];
  if (isSelected) {
    // Add all permissions in the group
    roleForm.value.permission_ids.push(
      ...groupPermissions.map((permission) => permission.id)
    );
  } else {
    // Remove all permissions in the group
    roleForm.value.permission_ids = roleForm.value.permission_ids.filter(
      (id) => !groupPermissions.map((permission) => permission.id).includes(id)
    );
  }
};

// Watch for permissions changes to update roleForm.permission_ids if Select All is active
watch(
  () => permissions.value,
  (newPermissions) => {
    if (allPermissionsSelected.value) {
      roleForm.value.permission_ids = Object.values(newPermissions)
        .flat()
        .map((permission) => permission.id);
    }
  }
);
</script>
