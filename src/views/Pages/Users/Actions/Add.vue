<template>
  <button
    @click="isAddModalOpen = true"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-user"></i>
    Add User
  </button>
  <!-- Add Product Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'2xl'"
    title="New User"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="register()" autocomplete="off">
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Name</label
          >
          <input
            type="text"
            id="ProductName"
            v-model="form.name"
            placeholder="Input User Name"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            type="email"
            id="ProductName"
            v-model="form.email"
            placeholder="Input User Email"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Zoho User ID</label
          >
          <input
            type="text"
            id="ProductName"
            v-model="form.zoho_user_id"
            placeholder="Input Zoho User Id"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            type="password"
            id="ProductName"
            v-model="form.password"
            placeholder="Input User Password"
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
// import Paginator from "@/views/Component/Pagination.vue";
// import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { VUE_APP_API_URL, PERMISSION, ROLE } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";
const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const isAddModalOpen = ref(false);
const role = ref([]);
const form = ref({
  id: 0,
  name: "",
  email: "",
  password: "",
  role_id: 1,
  zoho_user_id: "",
});
const resetForm = () => {
  form.value.name = "";
  form.value.email = "";
  form.value.password = "";
  form.value.zoho_user_id = "";
};
const register = async () => {
  try {
    // Show processing st ate
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we create the user account.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(form.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}/users/register`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    if (!response.data.error) {
      const { token, userInfo } = response.data;
      isAddModalOpen.value = false;
      Alert("success", "Success", response.data.message);
      resetForm();
      emits("transaction_id", Math.random());
    } else {
      Alert("warning", "Warning", response.data.message);
    }
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    console.log("REGISTER ERROR:", error.response);
    handleApiError(error);
  }
};
</script>
