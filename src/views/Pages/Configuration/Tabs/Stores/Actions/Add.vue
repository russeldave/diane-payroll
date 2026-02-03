<template>
  <button
    @click="isaddStoreModalOpen = true"
    class="bg-blue-500 text-white hover:opacity-70 w-full focus:bg-blue-300 font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-store"></i>
    Add Store
  </button>
  <!-- Add Role Modal -->
  <Modal
    :show="isaddStoreModalOpen"
    :maxWidth="'lg'"
    title="Add Store"
    @close="isaddStoreModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="addStore()" autocomplete="off">
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Name</label
          >
          <input
            type="text"
            id="storeName"
            v-model="storeForm.store_name"
            placeholder="Input Store Name"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Description</label
          >
          <textarea
            id="description"
            v-model="storeForm.description"
            maxlength="5"
            placeholder="Input Description"
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
const isaddStoreModalOpen = ref(false);
const data = ref({});

const storeForm = ref({
  store_name: "",
  description: "",
});

const addStore = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we add the store.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(storeForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}stores/add`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    isaddStoreModalOpen.value = false;
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
