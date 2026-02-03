<template>
  <button
    @click.prevent="editBehavior()"
    type="button"
    :class="[
      'bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-md md:text-lg py-2 rounded-l px-4 float-end text-nowrap border-2 border-black',
      className,
    ]"
  >
    <i class="fas fa-eye"></i>
    <!-- View -->
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'2xl'"
    title="View Ingredient"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" autocomplete="off">
        <div class="grid grid-cols-1 gap-6">
          <div class="mb-4">
            <div class="h-32 w-32">
              <IngImageViewer
                v-if="ingredientForm.ingredient_id"
                :key="ingredientForm.ingredient_id"
                :ingredient_id="ingredientForm.ingredient_id"
                :thumbnail="ingredientForm.thumb_nail"
                :canDeleteImage="true"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Name</label
            >
            <input
              type="text"
              id="ProductName"
              required
              v-model="ingredientForm.ingredient_name"
              placeholder="Input Name"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4" v-if="ingredientForm.sub_ingredient_id != 0">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Trimming Destination</label
            >
            <input
              type="text"
              id="ProductName"
              required
              v-model="ingredientForm.sub_ingredient_name"
              placeholder="Input Cost Price"
              step="any"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Category</label
            >
            <select
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              v-model="ingredientForm.ingredient_category_id"
            >
              <option value="0">--Select Category--</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.value"
              >
                {{ category.label }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Unit</label
            >
            <select
              v-model="ingredientForm.unit_id"
              placeholder="Select Unit"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            >
              <option value="0">--Select Unit--</option>
              <option v-for="unit in units" :key="unit.value" :value="unit.value">
                {{ unit.label }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Cost Price</label
            >
            <input
              type="number"
              id="ProductName"
              required
              v-model="ingredientForm.cost_price"
              placeholder="Input Cost Price"
              step="any"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Stock Limit</label
            >
            <input
              type="number"
              id="ProductName"
              required
              v-model="ingredientForm.stock_limit"
              placeholder="Input Cost Price"
              step="any"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label for="remarks" class="block text-sm font-medium text-gray-700"
              >Description</label
            >
            <textarea
              v-model="ingredientForm.description"
              placeholder="Input Description"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            ></textarea>
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
import { VUE_APP_API_URL, UNITS } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";

import IngImageViewer from "../Actions/IngImageViewer.vue";
const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
  data: Object,
});
const isAddModalOpen = ref(false);
const units = ref([]);
const imageFiles = ref([]);
const categories = ref([]);
const ingredientForm = ref({
  ingredient_name: "",
  description: "",
  unit_id: 0,
  cost_price: 0,
  ingredient_id: 0,
  ingredient_category_id: 0,
  unit_id: 0,
  stock_limit: 0,
  ingredient_images: [],
});
const editBehavior = () => {
  resetForm();
  fillForm();
  unitsDropdown();
  ingredientsCategoryDropdown();
  isAddModalOpen.value = true;
};
const fillForm = () => {
  const data = props.data;

  console.log(data);
  (ingredientForm.value.ingredient_id = data.id),
    (ingredientForm.value.ingredient_name = data.name);
  ingredientForm.value.description = data.description;
  ingredientForm.value.ingredient_category_id = data.categoryId;
  ingredientForm.value.unit_id = data.unitId;
  ingredientForm.value.cost_price = data.costPrice;
  ingredientForm.value.thumb_nail = data.thumbNail;
  ingredientForm.value.is_trimming = data.isTrimming;
  ingredientForm.value.stock_limit = data.stockLimit;
  ingredientForm.value.sub_ingredient_id = data.subIngredientId ?? 0;
  ingredientForm.value.sub_ingredient_name = data.subIngredientName ?? "-";
  ingredientForm.value.ingredient_images = [];
};

const resetForm = () => {
  ingredientForm.value.ingredient_id = 0;
  ingredientForm.value.ingredient_name = "";
  ingredientForm.value.description = "";
  ingredientForm.value.ingredient_category_id = 0;
  ingredientForm.value.unit_id = 0;
  ingredientForm.value.cost_price = 0;
  ingredientForm.value.thumb_nail = [];
  ingredientForm.value.is_trimming = false;
  ingredientForm.value.stock_limit = 0;
  ingredientForm.value.sub_ingredient_name = "";
  ingredientForm.value.ingredient_images = [];
};

const unitsDropdown = async () => {
  units.value = await UNITS();
};
const ingredientsCategoryDropdown = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}ingredient-categories/dropdown`,
      BearToken(token)
    );
    categories.value = response.data.ingredientCategories;
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
};
</script>
