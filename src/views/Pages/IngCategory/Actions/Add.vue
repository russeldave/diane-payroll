<template>
  <button
    @click.prevent="addBehavior()"
    type="button"
    :class="[
      'bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fas fa-plus"></i>
    Add Category
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'md'"
    title="New Category"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="addCategory()" autocomplete="off">
        <div class="grid grid-cols-1 gap-6">
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Name</label
            >
            <input
              type="text"
              id="ProductName"
              required
              v-model="categoryForm.ingredient_category"
              placeholder="Input Name"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Abbreviation</label
            >
            <input
              type="text"
              id="ProductName"
              required
              v-model="categoryForm.ingredient_category_abbre"
              placeholder="Input Abbreviation"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <!-- <div class="mb-4 md:col-span-2">
            <label
              for="TrimmingDestination"
              class="block text-sm font-medium text-gray-700"
              >Sub Category</label
            >
            <SearchDropdown
              apiEndpoint="ingredient-sub-categories/dropdown"
              :searchModel="searchSubCategory"
              :key="categoryForm.ingredient_sub_category_id"
              placeholder="Search Sub Category"
              itemLabel="name"
              itemId="id"
              :defaultValue="categoryForm.ingredient_sub_category_id"
              inputId="ingredientName"
              formatLabel="parenthesis"
              className="focus-visible:bg-yellow-100 p-2 w-full border"
              @item-selected="(data) => fillSubCategory(data)"
              dataKey="subCategories"
              returnName="['name']"
            />
          </div> -->
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
import { VUE_APP_API_URL, UNITS } from "@/views/Utility/Global";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
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
  className: String,
});

const isAddModalOpen = ref(false);
const units = ref([]);
const imageFiles = ref([]);
const searchSubCategory = ref({ search: "", page_num: 1, itemsperpage: 10 });

const categoryForm = ref({
  ingredient_category: "",
  ingredient_category_abbre: "",
  sub_category_name: "",
  sub_category_id: 0,
});
const addBehavior = () => {
  resetForm();
  // unitsDropdown();
  isAddModalOpen.value = true;
};
const resetForm = () => {
  categoryForm.value.ingredient_category = "";
  categoryForm.value.ingredient_category_abbre = "";
  categoryForm.value.sub_category_name = "";
  categoryForm.value.sub_category_id = 0;
};

const fillSubCategory = (item) => {
  categoryForm.value.sub_category_name = item.name ?? "-";
  categoryForm.value.sub_category_id = item.id ?? 0;

  searchSubCategory.value.search = "";
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};
const unitsDropdown = async () => {
  units.value = await UNITS();
};
const addCategory = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we create the ingredient category.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(categoryForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredient-categories/add`,
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
