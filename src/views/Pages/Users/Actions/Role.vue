<template>
  <button
    @click="assignButtonBehavior()"
    class="bg-green-500 hover:opacity-70 focus:bg-green-300 text-white font-bold text-sm md:text-md py-2 px-4 rounded-l mb-4 text-nowrap"
  >
    <i class="fas fa-user-shield"></i>
    Role
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'xl'"
    title="Assign Role"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="assignRole()">
        <div class="grid grid-cols-1 gap-6">
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >User</label
            >
            <input
              type="text"
              placeholder="User Name"
              v-model="usersForm.user_name"
              disabled
              required
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Zoho User Id</label
            >
            <input
              type="text"
              placeholder="Zoho User Id"
              v-model="usersForm.zoho_user_id"
              required
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Role</label
            >
            {{ console.log(roles) }}

            <select class="mt-1 p-2 border rounded-md w-full" v-model="usersForm.role_id">
              <option value="0">--Select Role--</option>
              <option v-for="r in roles" :key="r.value" :value="r.value">
                {{ r.label }}
              </option>
            </select>
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
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
import { VUE_APP_API_URL, PERMISSION, ROLE } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});
const token = localStorage.getItem("token");
const isAddModalOpen = ref(false);
const roles = ref([]);
const usersForm = ref({
  user_id: 0,
  user_name: "",
  role_id: 0,
  zoho_user_id: "",
});

const assignButtonBehavior = () => {
  isAddModalOpen.value = true;
  resetForm();
  fillForm();
  roleDropdown();
};

const resetForm = () => {
  usersForm.value = {
    user_id: 0,
    user_name: "",
    role_id: 0,
    zoho_user_id: "",
  };
};
const fillForm = () => {
  const data = props.data;
  console.log(data);
  usersForm.value.user_id = data.id;
  usersForm.value.user_name = data.name;
  usersForm.value.role_id = data.roleId;
  usersForm.value.zoho_user_id = data.zohoUserId;
};
const assignRole = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we assign the role.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(usersForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}/users/assign-role`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

const roleDropdown = () => {
  roles.value = JSON.parse(localStorage.getItem("ro-001"));
};
</script>
