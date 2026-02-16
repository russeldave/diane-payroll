<template>
  <button
    @click.prevent="(isAddModalOpen = true), resetForm()"
    type="button"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded text-md md:text-lg py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-tag"></i>
    Add Category
  </button>
  <!-- Add Item Modal -->
  <Modal :show="isAddModalOpen" :maxWidth="'md'">
    <div class="flex justify-between p-3">
      <h2 class="text-lg font-semibold text-gray-800">New Category</h2>
      <button
        class="flex float-end bg-gray-100 p-3"
        @click.prevent="isAddModalOpen = false"
      >
        <i class="fa fa-times text-black-600"></i>
      </button>
    </div>
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="addCategory()">
        <div class="grid grid-cols-1 gap-6">
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Category Name</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="categoryForm.category_name"
              placeholder="Input Category Name"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Remarks</label
            >
            <textarea
              v-model="categoryForm.remarks"
              placeholder="Input Brand Remarks"
              class="mt-1 p-2 border rounded-md w-full"
            ></textarea>
          </div>
        </div>
        <div class="flex items-center justify-end">
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
import {
  VUE_APP_API_URL,
  PERMISSION,
  BUILDING,
  WAREHOUSE,
  CATEGORIES,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";
import { getCategories } from "@/views/Utility/PreProcess";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const isAddModalOpen = ref(false);
const warehouse = ref([]);
const categories = ref([]);
const categoryForm = ref({
  category_id: 0,
  category_name: "",
  remarks: "",
});
const resetForm = () => {
  categoryForm.value.category_id = 0;
  categoryForm.value.category_name = "";
  categoryForm.value.remarks = "";
};

const addCategory = async () => {
  try {
    const formData = FormDx(categoryForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}categories/add`,
      formData,
      BearToken(token)
    );

    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    getCategories(token);
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);
  }
};
</script>
