<template>
  <button
    @click="assignButtonBehavior()"
    class="bg-yellow-500 hover:opacity-70 focus:bg-yellow-300 text-white font-bold text-sm md:text-md py-2 px-4 mb-4 text-nowrap"
  >
    <i class="fas fa-edit"></i>
    Edit
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'xl'"
    title="Edit User"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="editUser()">
        <div class="grid grid-cols-1 gap-6">
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >User</label
            >
            <input
              type="text"
              placeholder="User Name"
              v-model="editForm.user_name"
              disabled
              required
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>

          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Email</label
            >
            <input
              type="email"
              placeholder="User email"
              v-model="editForm.email"
              required
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Zoho User ID</label
            >
            <input
              type="text"
              placeholder="User Zoho User ID"
              v-model="editForm.zoho_user_id"
              required
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
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});
const token = localStorage.getItem("token");
const isAddModalOpen = ref(false);
const users = ref([]);
const editForm = ref({
  user_id: 0,
  user_name: "",
  employee_id: 0,
  employee_name: "",
});

const assignButtonBehavior = () => {
  isAddModalOpen.value = true;
  resetForm();
  fillForm();
};
const fillForm = () => {
  const data = props.data;
  console.log(data);
  editForm.value.user_id = data.id;
  editForm.value.user_name = data.name;
  editForm.value.email = data.email;
  editForm.value.zoho_user_id = data.zohoUserId ?? "";
};

const resetForm = () => {
  editForm.value.user_id = 0;
  editForm.value.user_name = "";
  editForm.value.email = 0;
  editForm.value.zoho_user_id = "";
};

const editUser = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we update user info.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(editForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}users/edit`,
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
</script>
