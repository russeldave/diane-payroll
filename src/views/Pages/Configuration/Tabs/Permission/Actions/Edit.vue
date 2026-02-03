<template>
  <button
    @click="editRoleBehavior()"
    class="bg-yellow-500 text-white hover:opacity-70 focus:bg-yellow-300 font-bold rounded text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-edit"></i>
    Edit
  </button>
  <Modal
    :show="isEditPermissionOpen"
    :maxWidth="'2xl'"
    title="Edit Permissions"
    @close="isEditPermissionOpen = false"
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
            v-model="permissionForm.permission_name"
            placeholder="Input Role Name"
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4">
          <label for="ProductName" class="block text-sm font-medium text-gray-700"
            >Remarks</label
          >
          <input
            type="text"
            id="ProductName"
            v-model="permissionForm.remarks"
            placeholder="Input Role Name"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-yellow-500 text-white font-bold py-2 px-4 rounded"
            >
            Update
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
const isEditPermissionOpen = ref(false);
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});
const permissionForm = ref({
  permission_id: 0,
  permission_name: "",
  remarks: "",
});

const editRoleBehavior = () => {
  const data = props.data;

  isEditPermissionOpen.value = true;
  permissionForm.value.permission_id = data.id;
  permissionForm.value.permission_name = data.name;
  permissionForm.value.remarks = data.remarks;
};

const editRole = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we update permission remarks.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(permissionForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}permissions/edit-remarks`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    isEditPermissionOpen.value = false;
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
  permissionForm.value.permission_id = 0;
  permissionForm.value.permission_name = "";
  permissionForm.value.remarks = "";
};

</script>
