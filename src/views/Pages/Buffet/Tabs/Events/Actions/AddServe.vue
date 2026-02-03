<template>
  <a
    title="Click to update serve quantity"
    class="flex justify-center items-center text-md text-blue-500 underline hover:text-blue-700 cursor-pointer"
    @click="serveBehavior()"
  >
    {{ props.dateData.yield ?? 0 }}
    <sub>{{ props.data.unitAbbre ?? "-" }}</sub>
  </a>
  <!-- Add Product Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'2xl'"
    title="Update Serving Quantity"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="updateServe()" autocomplete="off">
        <div class="mb-4">
          <label for="BuffetName" class="block text-sm font-medium text-gray-700"
            >Name</label
          >
          <input
            type="text"
            id="BuffetName"
            v-model="form.dishes_name"
            placeholder="Input User Name"
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200 text-red-500"
          />
        </div>
        <div class="mb-4">
          <label for="BuffetName" class="block text-sm font-medium text-gray-700"
            >Buffet</label
          >
          <input
            type="text"
            id="BuffetName"
            v-model="form.buffet_name"
            placeholder="Input User Name"
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4">
          <label for="BuffetName" class="block text-sm font-medium text-gray-700"
            >Buffet Date</label
          >
          <input
            type="text"
            id="BuffetName"
            v-model="form.buffet_date"
            placeholder="Input User Name"
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4">
          <label for="leftOver" class="block text-sm font-medium text-gray-700"
            >Serve Quantity</label
          >
          <input
            type="number"
            id="leftOver"
            v-model="form.serve_quantity"
            step="any"
            required
            placeholder="Input Serve Quantity"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="loading"
            :class="loading ? 'bg-gray-400' : 'bg-blue-500'"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            {{ loading ? "Loading..." : "Update" }}
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
const props = defineProps({
  data: Object,
  dateData: Object,
});
const isAddModalOpen = ref(false);
const loading = ref(false);
const role = ref([]);
const form = ref({
  buffet_dishes_id: 0,
  buffet_date: "",
  buffet_date_id: 0,
  serve_quantity: 0,
});
const serveBehavior = () => {
  resetForm();
  fillForm();

  isAddModalOpen.value = true;
};
const resetForm = () => {
  form.value.buffet_dishes_id = 0;
  form.value.buffet_date = "";
  form.value.buffet_date_id = 0;
  form.value.serve_quantity = 0;
};
const fillForm = () => {
  const data = props.data;
  const dateData = props.dateData;

  console.log(data);
  form.value.buffet_dishes_id = data.id;
  form.value.buffet_date = data.buffetDate;
  form.value.buffet_name = data.buffetName ?? "";
  form.value.dishes_name = data.dishesName ?? "";
  form.value.buffet_date_id = dateData.buffetDateId;
  form.value.serve_quantity = dateData.yield;
};
const updateServe = async () => {
  try {
    // Show processing alert
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we update the serving quantity.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(form.value);
    loading.value = true;
    const response = await axios.post(
      `${VUE_APP_API_URL}buffets/menu-create-serve`,
      formData,
      BearToken(token)
    );

    if (!response.data.error) {
      const { token, userInfo } = response.data;

      // Close processing alert and show success
      Swal.close();
      isAddModalOpen.value = false;
      Alert("success", "Success", response.data.message);
      resetForm();
      emits("transaction_id", Math.random());
    } else {
      // Close processing alert and show warning
      Swal.close();
      Alert("warning", "Warning", response.data.message);
    }
    loading.value = false;
  } catch (error) {
    // Close processing alert and show error
    Swal.close();
    loading.value = false;
    handleApiError(error);
  }
};
</script>
