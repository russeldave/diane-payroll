<template>
  <button
    @click="(isEditModalOpen = true), itemBehavior()"
    class="bg-yellow-500 hover:opacity-70 focus:bg-yellow-300 text-white font-bold rounded-l text-md md:text-lg py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-edit"></i>
    Edit
  </button>
  <!-- Add Item Modal -->
  <Modal :show="isEditModalOpen" :maxWidth="'6xl'">
    <button
      class="flex float-end bg-gray-100 p-3"
      @click.prevent="isEditModalOpen = false"
    >
      <i class="fa fa-times text-black-600"></i>
    </button>
    <div class="grid grid-cols-1 gap-6 p-6">
      <h2 class="text-lg font-semibold text-gray-800">Edit Brand</h2>
      <form class="mt-4" @submit.prevent="editBrand()">
        <div class="grid grid-cols-1 gap-6">
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Brand Name</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="brandForm.item_brand_name"
              placeholder="Input Product Name"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Remarks</label
            >
            <textarea
              v-model="brandForm.remarks"
              placeholder="Input Product Remarks"
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
  CATEGORIES,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Array,
});
const categories = ref([]);
const isEditModalOpen = ref(false);
const brandForm = ref({
  brand_id: 0,
  item_brand_name: "",
  remarks: "",
});
const itemBehavior = () => {
  const data = props.data;

  brandForm.value.brand_id = data.id;
  brandForm.value.item_brand_name = data.name;
  brandForm.value.remarks = data.remarks;
};
const resetForm = () => {
  brandForm.value.brand_id = 0;
  brandForm.value.item_brand_name = "";
  brandForm.value.remarks = "";
};
const editBrand = async () => {
  try {
    const formData = FormDx(brandForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}items/edit`,
      formData,
      BearToken(token)
    );

    isEditModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);
  }
};
const categoryDropdown = async () => {
  categories.value = await CATEGORIES();
};
// Call listItems when component is mounted
onMounted(() => {
  categoryDropdown();
});
</script>
