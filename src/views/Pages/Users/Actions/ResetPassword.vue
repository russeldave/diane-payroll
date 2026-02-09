<template>
  <button
    @click="assignButtonBehavior()"
    class="bg-red-500 hover:opacity-70 focus:bg-red-300 text-white font-bold text-sm rounded-r md:text-md py-2 px-4 mb-4 text-nowrap"
  >
    <i class="fas fa-lock"></i>
    Reset
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'xl'"
    title="Reset Password"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="resetPassword()" autocomplete="off">
        <div class="grid grid-cols-1 gap-6">
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >User</label
            >
            <input
              type="text"
              placeholder="User Name"
              v-model="resetForm.user_name"
              disabled
              required
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >New Password</label
            >
            <input
              type="password"
              placeholder="New Password"
              v-model="resetForm.new_password"
              minlength="8"
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
import { VUE_APP_API_URL, PERMISSION } from "@/views/Utility/Global";
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
const resetForm = ref({
  user_id: 0,
  user_name: "",
  new_password: "",
});

const assignButtonBehavior = () => {
  isAddModalOpen.value = true;
  fillForm();
  roleDropdown();
};
const fillForm = () => {
  const data = props.data;

  resetForm.value.user_id = data.id;
  resetForm.value.user_name = data.name;
};
const resetPassword = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we reset the password.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(resetForm.value);
    const response = await axios.post(`api/users/change-password`, formData);

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
