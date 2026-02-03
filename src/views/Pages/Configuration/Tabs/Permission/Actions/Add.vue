<template>
  <button
    @click="isAddPermissionModalOpen = true"
    class="bg-blue-500 text-white w-full hover:opacity-70 focus:bg-blue-300 font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-shield-alt"></i>
    Add Permission
  </button>
  <!-- Add Role Modal -->
  <Modal
    :show="isAddPermissionModalOpen"
    :maxWidth="'lg'"
    title="Add Permission"
    @close="isAddPermissionModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="addPermission()" autocomplete="off">
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Name</label
          >
          <input
            type="text"
            id="ProductName"
            v-model="permissionForm.permission_name"
            placeholder="Input Permission Name"
            class="mt-1 p-2 border rounded-md w-full"
          />
          <small class="text-xs text-red-500"
            >Update: Don't add underscore the system will now auto-replace space with
            underscore.</small
          >
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Type</label
          >
          <input
            type="text"
            id="ProductName"
            v-model="permissionForm.permission_type"
            placeholder="Input Type"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Remarks</label
          >
          <input
            type="text"
            id="ProductName"
            v-model="permissionForm.remarks"
            placeholder="Input Remarks..."
            class="mt-1 p-2 border rounded-md w-full"
          />
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
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { VUE_APP_API_URL, PERMISSION } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  replaceSpaceWithUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const isAddPermissionModalOpen = ref(false);
const data = ref({});

const permissionForm = ref({
  permission_name: "",
  permission_type: "",
  remarks: "",
});

const addPermission = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we add the permission.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    permissionForm.value.permission_name = replaceSpaceWithUnderScore(
      permissionForm.value.permission_name
    );

    const formData = FormDx(permissionForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}permissions/add`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    isAddPermissionModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

onMounted(() => {});
</script>
